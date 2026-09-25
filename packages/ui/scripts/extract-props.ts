/**
 * Generates `docs/props.generated.json` — the machine-readable props of every
 * exported component, used by both `docs/references/components.md` and the docs
 * site's `PropsTable`.
 *
 * Single source of truth:
 *   src/**\/*.tsx (the types themselves) ──(this)──► docs/props.generated.json
 *
 * Props are resolved through the TypeScript checker rather than by matching the
 * shape of the declaration: components here declare props as a named `Props`,
 * as an inline `FC<{...}>`, as controlled/uncontrolled unions, and as compound
 * objects, and the checker flattens all of those the same way.
 *
 *   node scripts/extract-props.ts            # write docs/props.generated.json
 *   node scripts/extract-props.ts --check    # fail if the file is stale
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  isArrowFunction,
  isFunctionDeclaration,
  isIntersectionTypeNode,
  isLiteralTypeNode,
  isObjectBindingPattern,
  isParenthesizedTypeNode,
  isPropertyAssignment,
  isPropertySignatureDeclaration,
  isShorthandPropertyAssignment,
  isStringLiteral,
  isTypeAliasDeclaration,
  isTypeReferenceNode,
  isUnionTypeNode,
  isVariableDeclaration,
} from 'typescript/unstable/ast';
import type {
  Node,
  PropertySignatureDeclaration,
  TypeAliasDeclaration,
  TypeNode,
} from 'typescript/unstable/ast';
import {
  API,
  isUnionType,
  NodeBuilderFlags,
  SignatureKind,
  SymbolFlags,
  TypeFlags,
} from 'typescript/unstable/sync';
import type { Symbol as TsSymbol, Type } from 'typescript/unstable/sync';

const PACKAGE_DIR = fileURLToPath(new URL('..', import.meta.url));
const TSCONFIG = fileURLToPath(new URL('../tsconfig.json', import.meta.url));
// Every subpath entry that exports components. The `./ai` surfaces and
// `./code-block` live outside `src/index.ts`, so walking the root entry alone
// would miss them.
const ENTRIES = [
  '../src/index.ts',
  '../src/components/ai/index.ts',
  '../src/components/ai/response/index.ts',
  '../src/components/data-display/code-block/index.ts',
].map((path) => fileURLToPath(new URL(path, import.meta.url)));
const OUT_PATH = fileURLToPath(
  new URL('../docs/props.generated.json', import.meta.url),
);
const SRC_DIR = fileURLToPath(new URL('../src/', import.meta.url));

type Prop = {
  name: string;
  types: string[];
  defaultValue: string | null;
  required: boolean;
};

type Component = {
  name: string;
  props: Prop[];
  /** Base type the remaining props are forwarded to, e.g. `HTMLAttributes<HTMLElement>`. */
  inherits: string | null;
  /** Keys of `inherits` the component leaves out and does not declare itself. */
  omitted: string[];
};

const api = new API({ cwd: PACKAGE_DIR });
const snapshot = api.updateSnapshot({ openProjects: [TSCONFIG] });
const project = snapshot.getProject(TSCONFIG);
if (!project) throw new Error(`Cannot open project: ${TSCONFIG}`);
const { program, checker } = project;

/** The checker hands declarations back as handles; follow one to its AST node. */
const declarationOf = (symbol: TsSymbol): Node | undefined =>
  (symbol.valueDeclaration ?? symbol.declarations[0])?.resolve(project);

const isUnderSrc = (node: Node): boolean => {
  const file = node.getSourceFile().fileName;
  return file.startsWith(SRC_DIR) && !file.includes('node_modules');
};

/**
 * The declarations of a prop written under `src/`. A prop typed through a
 * controlled/uncontrolled union has one per branch, and the `?: never` of the
 * branch that forbids it usually comes first.
 */
const ownDeclarationsOf = (symbol: TsSymbol): Node[] =>
  symbol.declarations
    .map((handle) => handle.resolve(project))
    .filter((node): node is Node => node !== undefined && isUnderSrc(node));

/**
 * A prop is ours when it is declared under `src/`; anything else is forwarded
 * from the base type. `children` is the exception — it reaches components
 * through React's types but is part of the documented surface.
 */
const isOwnProp = (symbol: TsSymbol): boolean =>
  symbol.name === 'children' || ownDeclarationsOf(symbol).length > 0;

/** Every type exported from an entry, which a reader can look up by name. */
const publicTypeIds = new Set<number>();
for (const entry of ENTRIES) {
  const entrySource = program.getSourceFile(entry);
  const moduleSymbol = entrySource && checker.getSymbolAtLocation(entrySource);
  for (const exported of moduleSymbol
    ? checker.getExportsOfModule(moduleSymbol)
    : []) {
    const target =
      exported.flags & SymbolFlags.Alias
        ? checker.getAliasedSymbol(exported)
        : exported;
    publicTypeIds.add(target.id);
  }
}

/** Unwraps a union into its members, dropping the `undefined` that `?` adds. */
const typeStrings = (type: Type): string[] => {
  const members = isUnionType(type) ? type.getTypes() : [type];
  const rendered = members
    .filter((member) => !(member.flags & TypeFlags.Undefined))
    .map((member) =>
      checker.typeToString(
        member,
        undefined,
        NodeBuilderFlags.NoTruncation |
          NodeBuilderFlags.UseSingleQuotesForStringLiteralType,
      ),
    );
  // A boolean prop surfaces as `false | true`; collapse it back.
  if (rendered.includes('false') && rendered.includes('true')) {
    return [
      'boolean',
      ...rendered.filter((r) => r !== 'false' && r !== 'true'),
    ];
  }
  return rendered.length > 0 ? rendered : ['unknown'];
};

/** The alias declared under `src/` that a type reference names, if any. */
const localAliasOf = (
  node: TypeNode,
): { alias: TypeAliasDeclaration; isPublic: boolean } | undefined => {
  if (!isTypeReferenceNode(node)) return undefined;
  const symbol = checker.getSymbolAtLocation(node.typeName);
  const target =
    symbol && symbol.flags & SymbolFlags.Alias
      ? checker.getAliasedSymbol(symbol)
      : symbol;
  const alias = target?.declarations
    .map((handle) => handle.resolve(project))
    .find(
      (declaration): declaration is TypeAliasDeclaration =>
        declaration !== undefined &&
        isTypeAliasDeclaration(declaration) &&
        isUnderSrc(declaration),
    );
  return alias && target
    ? { alias, isPublic: publicTypeIds.has(target.id) }
    : undefined;
};

// Multi-line signatures are wrapped for the editor, not for a docs table:
// unwrap them, then close the gaps the wrapping left inside the parens.
const textOf = (node: Node): string =>
  node
    .getText()
    .replaceAll(/\s+/gu, ' ')
    .replaceAll(/\(\s+/gu, '(')
    .replaceAll(/\s+\)/gu, ')')
    .replaceAll(/,\s*\)/gu, ')')
    .trim();

/**
 * The top-level members of a union as written. An alias the package does not
 * export is opened up — `size?: Size` would otherwise name a type the reader
 * cannot look up anywhere.
 */
const unionMembersOf = (node: TypeNode): string[] => {
  if (isUnionTypeNode(node)) return node.types.flatMap(unionMembersOf);
  const local = localAliasOf(node);
  if (
    !local ||
    local.isPublic ||
    local.alias.typeParameters ||
    !isTypeReferenceNode(node) ||
    node.typeArguments
  ) {
    return [textOf(node)];
  }
  if (isUnionTypeNode(local.alias.type) || localAliasOf(local.alias.type)) {
    return unionMembersOf(local.alias.type);
  }
  // A computed alias (`Extract<…>`) has no members to read off the source.
  const type = checker.getTypeAtLocation(local.alias.type);
  return type ? typeStrings(type) : [textOf(node)];
};

/**
 * Renders the prop's type as the author wrote it. The checker is only a
 * fallback: it expands `ReactNode` into a dozen members and erases the alias
 * names that make the docs readable.
 *
 * Every branch's declaration counts, so a prop that one branch of a
 * controlled/uncontrolled union forbids (`?: never`) shows the type the other
 * branch takes.
 */
const declaredTypeStrings = (symbol: TsSymbol): string[] | null => {
  const own = ownDeclarationsOf(symbol);
  const first = symbol.declarations[0]?.resolve(project);
  const declarations = (own.length > 0 ? own : first ? [first] : []).filter(
    (node): node is PropertySignatureDeclaration =>
      isPropertySignatureDeclaration(node),
  );
  if (declarations.length === 0) return null;

  const members = [
    ...new Set(
      declarations.flatMap((declaration) => unionMembersOf(declaration.type)),
    ),
  ].filter((member) => member !== 'undefined');
  const allowed = members.filter((member) => member !== 'never');
  const types = allowed.length > 0 ? allowed : members;
  // A discriminant (`interactive: true` / `interactive?: false`) reads as the
  // boolean it is.
  if (types.includes('true') && types.includes('false')) {
    return [
      'boolean',
      ...types.filter((type) => type !== 'true' && type !== 'false'),
    ];
  }
  return types;
};

/** Reads `({ size = 'md' })` style defaults off the component's parameter. */
const defaultsOf = (declaration: Node): Map<string, string> => {
  const defaults = new Map<string, string>();
  const fn =
    isVariableDeclaration(declaration) && declaration.initializer
      ? declaration.initializer
      : declaration;
  if (!isArrowFunction(fn) && !isFunctionDeclaration(fn)) return defaults;

  const [param] = fn.parameters;
  if (!param || !isObjectBindingPattern(param.name)) return defaults;

  for (const element of param.name.elements) {
    if (!element.initializer || !element.name) continue;
    const key = (element.propertyName ?? element.name).getText();
    defaults.set(key, element.initializer.getText());
  }
  return defaults;
};

/** The string literals of a key union such as `'className' | 'style'`. */
const literalKeysOf = (node: TypeNode): string[] => {
  if (isUnionTypeNode(node)) return node.types.flatMap(literalKeysOf);
  if (isLiteralTypeNode(node) && isStringLiteral(node.literal)) {
    return [node.literal.text];
  }
  return [];
};

type Forwarded = { base: string; omitted: string[] };

/**
 * The base types an annotation forwards to, and the keys it leaves out of
 * them, following the aliases it is built from through intersections and
 * unions (`BaseProps & (A | B)`).
 */
const forwardedOf = (node: TypeNode): Forwarded[] => {
  if (isUnionTypeNode(node) || isIntersectionTypeNode(node)) {
    return node.types.flatMap(forwardedOf);
  }
  if (isParenthesizedTypeNode(node)) return forwardedOf(node.type);
  if (!isTypeReferenceNode(node)) return [];

  const name = node.typeName.getText();
  const [base, keys] = node.typeArguments ?? [];
  if ((name === 'Omit' || name === 'Pick') && base) {
    const inner = localAliasOf(base)
      ? forwardedOf(base)
      : [{ base: textOf(base), omitted: [] }];
    const omitted = name === 'Omit' && keys ? literalKeysOf(keys) : [];
    return inner.map((forwarded) => ({
      base: forwarded.base,
      omitted: [...forwarded.omitted, ...omitted],
    }));
  }
  if (/HTMLAttributes$|^ComponentProps/u.test(name)) {
    return [{ base: textOf(node), omitted: [] }];
  }
  const local = localAliasOf(node);
  if (local) return forwardedOf(local.alias.type);
  // `PropsWithChildren<…>` and the like wrap the props they are given.
  return (node.typeArguments ?? []).flatMap((argument) =>
    forwardedOf(argument),
  );
};

/**
 * Recovers the forwarded base type from what the author actually wrote. The
 * checker flattens `A & Omit<HTMLAttributes<E>, …>` into one object type, so
 * the intersection only survives in the annotation. A component whose union
 * branches forward to different elements lists each base, joined by `|`, and
 * every key any branch leaves out.
 */
const inheritsOf = (
  declaration: Node,
): { inherits: string | null; omitted: string[] } => {
  // Props are annotated either on the const (`const X: FC<Props>`) or on the
  // parameter (`const X = ({ … }: Props)`); both spellings are in use here.
  let propsNode: TypeNode | undefined;

  if (isVariableDeclaration(declaration)) {
    if (declaration.type && isTypeReferenceNode(declaration.type)) {
      propsNode = declaration.type.typeArguments?.[0];
    }
    const { initializer } = declaration;
    if (!propsNode && initializer && isArrowFunction(initializer)) {
      propsNode = initializer.parameters[0]?.type;
    }
  }
  const forwarded = propsNode ? forwardedOf(propsNode) : [];
  if (forwarded.length === 0) return { inherits: null, omitted: [] };
  return {
    inherits: [...new Set(forwarded.map(({ base }) => base))].join(' | '),
    omitted: [...new Set(forwarded.flatMap(({ omitted }) => omitted))],
  };
};

/** Resolves a compound member (`Dialog.Root`) back to the `const Root` it aliases. */
const resolveDeclaration = (symbol: TsSymbol): Node | undefined => {
  const declaration = declarationOf(symbol);
  if (!declaration) return undefined;
  if (
    isShorthandPropertyAssignment(declaration) ||
    isPropertyAssignment(declaration)
  ) {
    const target = isShorthandPropertyAssignment(declaration)
      ? checker.getShorthandAssignmentValueSymbol(declaration)
      : checker.getSymbolAtLocation(declaration.initializer);
    const aliased =
      target && target.flags & SymbolFlags.Alias
        ? checker.getAliasedSymbol(target)
        : target;
    return aliased?.valueDeclaration?.resolve(project) ?? declaration;
  }
  return declaration;
};

/** A Context exported to be rendered as its own provider. */
const isContext = (type: Type): boolean =>
  checker.typeToString(type).startsWith('Context<');

const byRequiredThenName = (a: Prop, b: Prop): number =>
  Number(b.required) - Number(a.required) || a.name.localeCompare(b.name);

const componentFrom = (name: string, symbol: TsSymbol): Component | null => {
  const declaration = resolveDeclaration(symbol);
  if (!declaration) return null;

  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const [signature] = checker.getSignaturesOfType(type, SignatureKind.Call);
  if (!signature) return null;

  // A Context is callable through React's `Provider`, so it is a component
  // here — but its props are declared in @types/react, which the own-prop
  // filter below would drop, leaving `<PortalRootProvider value>` documented
  // with no `value`. Read them as they are: the value, and the children.
  if (isContext(type)) {
    const [providerProps] = signature.getParameters();
    if (!providerProps) return null;
    const propsType = checker.getTypeOfSymbolAtLocation(
      providerProps,
      declaration,
    );
    const props = checker
      .getPropertiesOfType(propsType)
      .map((prop): Prop => {
        const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
        return {
          name: prop.name,
          // `value` is declared as the type parameter, `T`; only the checker
          // has the Context's argument in its place. `children` is
          // `ReactNode` as written, which the checker would expand.
          types:
            prop.name === 'value'
              ? typeStrings(propType)
              : (declaredTypeStrings(prop) ?? typeStrings(propType)),
          defaultValue: null,
          required: !(prop.flags & SymbolFlags.Optional),
        };
      })
      .toSorted(byRequiredThenName);
    return { name, props, inherits: null, omitted: [] };
  }

  const [paramSymbol] = signature.getParameters();
  if (!paramSymbol) return { name, props: [], inherits: null, omitted: [] };

  const propsType = checker.getTypeOfSymbolAtLocation(paramSymbol, declaration);
  const defaults = defaultsOf(declaration);

  const props = checker
    .getPropertiesOfType(propsType)
    .filter((prop) => isOwnProp(prop))
    .map((prop): Prop => {
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
      return {
        name: prop.name,
        types: declaredTypeStrings(prop) ?? typeStrings(propType),
        defaultValue: defaults.get(prop.name) ?? null,
        required: !(prop.flags & SymbolFlags.Optional),
      };
    })
    // Required props first — that is the order a reader needs them in.
    .toSorted(byRequiredThenName);

  const { inherits, omitted } = inheritsOf(declaration);
  // A key left out of the base only to be declared again is listed above.
  const declared = new Set(props.map((prop) => prop.name));
  return {
    name,
    props,
    inherits,
    omitted: omitted.filter((key) => !declared.has(key)),
  };
};

const components: Component[] = [];
const skipped: string[] = [];
const seen = new Set<string>();

for (const entry of ENTRIES) {
  const entrySource = program.getSourceFile(entry);
  if (!entrySource) throw new Error(`Cannot read entry: ${entry}`);
  const moduleSymbol = checker.getSymbolAtLocation(entrySource);
  if (!moduleSymbol) throw new Error(`Entry has no module symbol: ${entry}`);

  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const { name } = exported;
    // Hooks (`useToast`, `usePortalRoot`) also have call signatures.
    if (!/^[A-Z]/u.test(name)) continue;
    if (seen.has(name)) continue;
    seen.add(name);

    const symbol =
      exported.flags & SymbolFlags.Alias
        ? checker.getAliasedSymbol(exported)
        : exported;

    const direct = componentFrom(name, symbol);
    if (direct) components.push(direct);

    // Parts hang off the export either as a plain object (`{ Root, Header }`) or
    // attached to the component itself (`Object.assign(Group, { Item })`), so
    // look for them even when the export is already a component on its own.
    const declaration = declarationOf(symbol);
    if (!declaration) continue;
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    // A Context's `Provider` and `Consumer` are not parts of a compound.
    if (isContext(type)) continue;
    const parts = checker
      .getPropertiesOfType(type)
      .filter((part) => /^[A-Z]/u.test(part.name))
      .map((part) => componentFrom(`${name}.${part.name}`, part))
      .filter((part): part is Component => part !== null);

    if (parts.length > 0) components.push(...parts);
    else if (!direct) skipped.push(name);
  }
}

api.close();

components.sort((a, b) => a.name.localeCompare(b.name));

const output = `${JSON.stringify({ components }, null, 2)}\n`;

if (process.argv.includes('--check')) {
  // Compared as data, not as text: the committed file goes through the
  // formatter after this script writes it, so the bytes legitimately differ.
  const current = await readFile(OUT_PATH, 'utf8').catch(() => 'null');
  const same =
    JSON.stringify(JSON.parse(current)) === JSON.stringify({ components });
  if (!same) {
    console.error(
      'docs/props.generated.json is stale. Run `pnpm generate:props`.',
    );
    process.exit(1);
  }
  console.warn('docs/props.generated.json is in sync.');
} else {
  await writeFile(OUT_PATH, output);
  console.warn(
    `Wrote ${components.length} components to docs/props.generated.json`,
  );
  if (skipped.length > 0) {
    console.warn(`Not components (skipped): ${skipped.join(', ')}`);
  }
}

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
  isObjectBindingPattern,
  isPropertyAssignment,
  isPropertySignatureDeclaration,
  isShorthandPropertyAssignment,
  isTypeAliasDeclaration,
  isTypeReferenceNode,
  isVariableDeclaration,
} from 'typescript/unstable/ast';
import type { Node, TypeNode } from 'typescript/unstable/ast';
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
// Every subpath entry that exports components. The `./ai` surfaces live
// outside `src/index.ts`, so walking the root entry alone would miss them.
const ENTRIES = [
  '../src/index.ts',
  '../src/components/ai/index.ts',
  '../src/components/ai/response/index.ts',
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
};

const api = new API({ cwd: PACKAGE_DIR });
const snapshot = api.updateSnapshot({ openProjects: [TSCONFIG] });
const project = snapshot.getProject(TSCONFIG);
if (!project) throw new Error(`Cannot open project: ${TSCONFIG}`);
const { program, checker } = project;

/** The checker hands declarations back as handles; follow one to its AST node. */
const declarationOf = (symbol: TsSymbol): Node | undefined =>
  (symbol.valueDeclaration ?? symbol.declarations[0])?.resolve(project);

/**
 * A prop is ours when it is declared under `src/`; anything else is forwarded
 * from the base type. `children` is the exception — it reaches components
 * through React's types but is part of the documented surface.
 */
const isOwnProp = (symbol: TsSymbol): boolean => {
  if (symbol.name === 'children') return true;
  const declaration = symbol.declarations[0]?.resolve(project);
  if (!declaration) return false;
  const file = declaration.getSourceFile().fileName;
  return file.startsWith(SRC_DIR) && !file.includes('node_modules');
};

/**
 * Splits a union at the top level only, so `Foo<A | B>` stays intact.
 *
 * Two things make this more than bracket counting. The `>` of `=>` closes
 * nothing, so counting it would drop below the real nesting and split inside
 * `((…) => A | B) | C`. And a bare top-level arrow swallows the rest of the
 * string as its return type — `() => A | B` is one function type, not a union,
 * because TypeScript requires parentheses to put a function type in a union.
 */
const splitUnion = (text: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let afterTopLevelArrow = false;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '<' || char === '(' || char === '{' || char === '[') depth++;
    const isArrowHead = char === '>' && text[i - 1] === '=';
    if (isArrowHead && depth === 0) afterTopLevelArrow = true;
    if (
      (char === '>' && !isArrowHead) ||
      char === ')' ||
      char === '}' ||
      char === ']'
    ) {
      depth--;
    }
    if (char === '|' && depth === 0 && !afterTopLevelArrow) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  parts.push(current.trim());
  return parts.filter((part) => part !== '' && part !== 'undefined');
};

/**
 * Renders the prop's type as the author wrote it. The checker is only a
 * fallback: it expands `ReactNode` into a dozen members and erases the alias
 * names that make the docs readable.
 */
const declaredTypeStrings = (symbol: TsSymbol): string[] | null => {
  const declaration = symbol.declarations[0]?.resolve(project);
  if (!declaration) return null;
  if (!isPropertySignatureDeclaration(declaration)) return null;
  // Multi-line signatures are wrapped for the editor, not for a docs table:
  // unwrap them, then close the gaps the wrapping left inside the parens.
  const text = declaration.type
    .getText()
    .replaceAll(/\s+/gu, ' ')
    .replaceAll(/\(\s+/gu, '(')
    .replaceAll(/\s+\)/gu, ')')
    .replaceAll(/,\s*\)/gu, ')')
    .trim();
  return splitUnion(text);
};

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

/**
 * Recovers the forwarded base type from what the author actually wrote. The
 * checker flattens `A & Omit<HTMLAttributes<E>, …>` into one object type, so
 * the intersection only survives in the annotation: `FC<Props>` is followed
 * back to the `Props` alias, while `FC<{…} & …>` is read in place.
 */
const inheritsOf = (declaration: Node): string | null => {
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
  if (!propsNode) return null;

  let text = propsNode.getText();
  // `FC<Props>` — resolve the alias and read its right-hand side instead.
  if (isTypeReferenceNode(propsNode)) {
    const aliasDeclaration = checker
      .getSymbolAtLocation(propsNode.typeName)
      ?.declarations.map((handle) => handle.resolve(project))
      .find((node) => node !== undefined && isTypeAliasDeclaration(node));
    if (aliasDeclaration && isTypeAliasDeclaration(aliasDeclaration)) {
      text = aliasDeclaration.type.getText();
    }
  }
  text = text.replaceAll(/\s+/gu, ' ');

  const match =
    /(?:Omit|Pick)<\s*((?:\w+)(?:<[^<>]*>)?)\s*,/u.exec(text) ??
    /&\s*((?:\w*HTMLAttributes|ComponentProps\w*)(?:<[^<>]*>)?)/u.exec(text);
  return match?.[1] ?? null;
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

const componentFrom = (name: string, symbol: TsSymbol): Component | null => {
  const declaration = resolveDeclaration(symbol);
  if (!declaration) return null;

  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const [signature] = checker.getSignaturesOfType(type, SignatureKind.Call);
  if (!signature) return null;

  const [paramSymbol] = signature.getParameters();
  if (!paramSymbol) return { name, props: [], inherits: null };

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
    .toSorted(
      (a, b) =>
        Number(b.required) - Number(a.required) || a.name.localeCompare(b.name),
    );

  return { name, props, inherits: inheritsOf(declaration) };
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
    // Hooks and helpers (`useToast`, `cn`, `chain`) also have call signatures.
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

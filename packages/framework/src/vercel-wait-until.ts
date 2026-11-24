import path from 'node:path';

import { build, parseSync } from 'vite';

/** The entry `waitUntil` is imported from. */
const SERVER_ENTRY = '@k8ordo/framework/server';

/** The package Vercel keeps a function running through. */
const VERCEL_FUNCTIONS = '@vercel/functions';

const BUNDLE = 'virtual:k8ordo/vercel-wait-until';

/** The file in the function that is `@vercel/functions`' `waitUntil`. */
export const WAIT_UNTIL_FILE = 'wait-until.mjs';

/**
 * Whether a compiled module takes `waitUntil` from `@k8ordo/framework/server`:
 * imported or re-exported by name, or possibly, through `import * as` or
 * `export *`, which name nothing — counted, since the other mistake is a
 * function Vercel stops with the work unfinished. A type-only import is gone
 * by the time a module is compiled.
 */
export const importsWaitUntil = (code: string): boolean => {
  if (!code.includes(SERVER_ENTRY)) return false;
  const { errors, module } = parseSync('module.js', code, {
    sourceType: 'module',
  });
  if (errors.length > 0) return false;
  return (
    module.staticImports.some(
      ({ moduleRequest, entries }) =>
        moduleRequest.value === SERVER_ENTRY &&
        entries.some(
          ({ importName }) =>
            importName.kind === 'NamespaceObject' ||
            importName.name === 'waitUntil',
        ),
    ) ||
    module.staticExports.some(({ entries }) =>
      entries.some(
        ({ moduleRequest, importName }) =>
          moduleRequest?.value === SERVER_ENTRY &&
          (importName.kind === 'All' ||
            importName.kind === 'AllButDefault' ||
            importName.name === 'waitUntil'),
      ),
    )
  );
};

const missingFunctions = (users: readonly string[]): string =>
  `the build for Vercel cannot keep the function running after its answer — on Vercel waitUntil() goes through ${VERCEL_FUNCTIONS}, which is not installed here, and ${users.length === 1 ? 'this imports' : 'these import'} waitUntil from ${SERVER_ENTRY}:\n${users
    .map((file) => `  ${file}`)
    .join('\n')}\ninstall ${VERCEL_FUNCTIONS} in this application`;

/**
 * `@vercel/functions`' `waitUntil`, as the application at `root` resolves
 * the package, bundled into `WAIT_UNTIL_FILE` of the function at `func`: a
 * function holds nothing but its own directory. A build of its own, as
 * `dist/server.js` is, because what it bundles is not the application's code
 * and takes none of its config. Without the package it stops, naming
 * `users`, the modules that import `waitUntil`.
 */
export const bundleWaitUntil = async (
  root: string,
  func: string,
  users: readonly string[],
): Promise<void> => {
  await build({
    root,
    configFile: false,
    logLevel: 'warn',
    publicDir: false,
    plugins: [
      {
        name: 'k8ordo:vercel-wait-until',
        async resolveId(id) {
          if (id === BUNDLE) return `\0${BUNDLE}`;
          if (id !== VERCEL_FUNCTIONS) return null;
          // 仮想モジュールには場所が無いので、アプリの root から探す
          const found = await this.resolve(
            id,
            path.join(root, 'package.json'),
            { skipSelf: true },
          );
          if (found === null) throw new Error(missingFunctions(users));
          return found;
        },
        load: (id) =>
          id === `\0${BUNDLE}`
            ? `export { waitUntil } from ${JSON.stringify(VERCEL_FUNCTIONS)};\n`
            : null,
      },
    ],
    environments: { ssr: { resolve: { noExternal: true } } },
    build: {
      // ssr に文字列で渡すと root からのパスとして解かれ、仮想モジュールに届かない
      ssr: true,
      outDir: func,
      emptyOutDir: false,
      rolldownOptions: {
        input: BUNDLE,
        output: { entryFileNames: WAIT_UNTIL_FILE },
      },
    },
  });
};

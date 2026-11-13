import { transformRscCssExport } from '@vitejs/plugin-rsc/plugin';
import { isCSSRequest, parseSync } from 'vite';
import type { Plugin } from 'vite';

const MDX = /\.mdx?$/u;

/**
 * The RSC plugin gives a Server Component the stylesheets its module imports
 * by wrapping the module's exported components, and it wraps only modules
 * whose file is `.js`, `.jsx`, `.ts` or `.tsx`: an `.mdx` compiled by the
 * application's own plugin is JavaScript by then and passed over for its
 * name, so the CSS an MDX file imports never reached the page — unless every
 * import of it carried `?vite-rsc-css-export=default`, the plugin's query for
 * naming the exports to wrap, and one forgotten was a page without its styles
 * and no word of it.
 *
 * This applies the plugin's own transform to such a module, under its rule
 * for a default export: a component, by its capitalised name (`MDXContent`,
 * which every MDX compiler emits). It has to run before the RSC plugin's
 * transforms — the wrapper it writes calls `import.meta.viteRsc.loadCss()`,
 * which one of those replaces — and after the application's MDX plugin, which
 * is `enforce: 'pre'` where the framework documents it.
 */
export const mdxCss = (): Plugin => ({
  name: 'k8ordo:mdx-css',
  async transform(code, id) {
    if (this.environment.name !== 'rsc') return null;
    const [filename = '', query = ''] = id.split('?');
    // 包む export を名指したクエリは RSC のプラグインが読む
    if (!MDX.test(filename) || query.includes('vite-rsc-css-export')) {
      return null;
    }
    const { program: ast, errors } = parseSync(filename, code, {
      sourceType: 'module',
      // コンパイルされたあとの JavaScript。名前の .mdx では構文が決まらない
      lang: 'js',
    });
    if (errors.length > 0) return null;
    const importsCss = ast.body.some(
      (node) =>
        node.type === 'ImportDeclaration' &&
        typeof node.source.value === 'string' &&
        isCSSRequest(node.source.value),
    );
    if (!importsCss) return null;
    const result = await transformRscCssExport({
      ast,
      code,
      // RSC のプラグインが .tsx に使う条件と同じ: 大文字で始まる名前の関数
      filter: (_name, meta) =>
        [
          meta.isFunction === true ? meta.declName : undefined,
          meta.defaultExportIdentifierName,
        ].some((name) => name !== undefined && /^[A-Z]/u.test(name)),
    });
    if (result === undefined) return null;
    return {
      code: result.output.toString(),
      map: result.output.generateMap({ hires: 'boundary' }),
    };
  },
});

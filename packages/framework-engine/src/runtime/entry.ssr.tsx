import {
  createFromReadableStream,
  getClientEntryUrl,
} from '@vitejs/plugin-rsc/ssr';
import { use } from 'react';
import type { ReactNode } from 'react';
import { preinit, preloadModule } from 'react-dom';
import { renderToReadableStream } from 'react-dom/server.edge';
import { injectRSCPayload } from 'rsc-html-stream/server';
import assetsManifest from 'virtual:vite-rsc/assets-manifest';

import { AppRouter } from './app-router';
import { noticeCancel } from './cancel';
import { whenClientReady } from './client-ready';
import { PageShownContext } from './page-shown';
import { SERVER_STYLESHEETS, STYLESHEET_ORDER_HREF } from './payload';
import type { ClientDeps, Payload } from './payload';

type SsrOptions = NonNullable<Parameters<typeof renderToReadableStream>[1]>;

/**
 * The script every page's HTML loads, and so the client every payload is
 * rendered for. Exported for the RSC entry, which renders the payloads:
 * the RSC plugin names the client entry to this environment only.
 */
export const clientEntry = getClientEntryUrl();

const entryScripts = new Set(assetsManifest.clientEntryDeps?.js);

/**
 * Asks React to link what each client component needs as the RSC plugin
 * asks when the HTML render reads one — its scripts preloaded as modules,
 * the client entry's own at the default priority and the rest low, its
 * stylesheets under the plugin's precedence — so a file is written the same
 * whichever of the two asked first: React writes it as first asked for.
 */
const linkClientDeps = (named: readonly ClientDeps[]): void => {
  // プラグインは頼み方（preloadDeps）を export しないので、同じ形を写す
  for (const { js, css } of named) {
    for (const href of js) {
      // react-dom は fetchPriority を渡すが、型には無い
      const options = {
        as: 'script',
        crossOrigin: '',
        ...(entryScripts.has(href) ? {} : { fetchPriority: 'low' }),
      } as const;
      preloadModule(href, options);
    }
    for (const href of css) {
      preinit(href, {
        as: 'style',
        crossOrigin: 'anonymous',
        precedence: 'vite-rsc/client-reference',
      });
    }
  }
};

/**
 * The payload turned into HTML, with the payload itself written into that
 * HTML. Hydration then reads what this render read, rather than asking the
 * server to render the page a second time: one render, one source of truth,
 * one round trip. It is also what lets a prerendered `404.html` come alive —
 * there is no payload file at a URL the application does not have.
 */
export async function renderHtml(
  rscStream: ReadableStream<Uint8Array>,
  // The request's: every script written here carries it. What else does, the
  // application signed, and the policy that names it is the application's.
  nonce: string,
  // Whether the payload holds the page, followed by `PageShown`.
  showsPage: boolean,
  // Whether the payload carries a `formState`: a form was posted without
  // JavaScript, and `useActionState` finds its result in the HTML it comes
  // back to.
  carriesFormState: boolean,
  // Under mode: 'static', every client component the payload names, read to
  // its end: the HTML links each, rendered or not. None under a server.
  named: readonly ClientDeps[],
): Promise<ReadableStream> {
  const [forRender, forHydration] = rscStream.tee();
  let forHtml = forRender;
  let formState: unknown;
  if (carriesFormState) {
    // Fizz は formState を描き始めるときに受け取るので、描画の中では読めない。
    // RSC の環境の値をそのまま渡すと、結果の中の client コンポーネントが
    // 参照のプロキシのままで、SSR で描けない。このときだけ別の枝を先に読む
    const [forState, rest] = forRender.tee();
    forHtml = rest;
    ({ formState } = await createFromReadableStream<Payload>(forState, {
      nonce,
    }));
  }
  let payload: Promise<Payload> | undefined;
  let ready: Promise<void> | undefined;
  // 描く前に読むと、client 参照の preinit と preloadModule が Fizz の要求の外で
  // 出て捨てられる。描画の中で読み始めれば、その続きが要求の
  // AsyncLocalStorage を引き継ぐ。読んだ木を描く前に歩くのは、props で渡す
  // だけで描かない要素の参照を、モジュールを読み終えたあとのページでも誰かが
  // 読むようにするため。ブラウザの最初の mount はその JS も待つ。server では
  // 届いていない行を待たない。歩きには client コンポーネントが描く Suspense が
  // 見えないので、待つと殻がその中身を待ってしまう。届いたときに続きで歩く。
  // static では、RSC の描画が名指した部品をすべて、読み始める前に自分で link
  // する。歩きは props の Map・Set・Promise・iterator・async iterable・stream
  // の中を見ないので、その中にしかない要素は、モジュールを初めて読むページで
  // しか link されない。歩きを広げないのは、iterator と stream は一度しか
  // 読めず、歩けば部品より先に使い切るため。RSC プラグインより先に頼めば、
  // モジュールを読んでいたかで head が変わらない
  function Root(): ReactNode {
    linkClientDeps(named);
    payload ??= createFromReadableStream<Payload>(forHtml, { nonce });
    const { notFound, pathname, search, tree } = use(payload);
    ready ??= whenClientReady([tree, notFound], {
      rows: import.meta.env.K8ORDO_MODE === 'static' ? 'wait' : 'follow',
    });
    use(ready);
    return (
      <AppRouter
        notFound={notFound}
        pathname={pathname}
        search={search}
        tree={tree}
      />
    );
  }
  const shown = Promise.withResolvers<undefined>();
  let readerLeft = false;
  // React は style の nonce を渡されると、同じ nonce を持たない
  // <style precedence> を書かない。アプリは static では nonce を持てないので、
  // static では渡さず、ビルドがハッシュで名指す
  const styleNonce =
    import.meta.env.K8ORDO_MODE === 'static' ? undefined : nonce;
  const htmlStream = await renderToReadableStream(
    <PageShownContext value={() => shown.resolve(undefined)}>
      {/* React は precedence の組を最初に頼まれた順に並べ、static は描く前に
          client 参照の CSS を頼む。遷移で読む client の CSS は head の末尾に、
          Server Component の CSS は同じ組の最後の後ろに入るので、その組を
          ここで先に頼めば、どの開き方でも Server Component の CSS が先になる */}
      <style
        href={STYLESHEET_ORDER_HREF}
        precedence={SERVER_STYLESHEETS}
        nonce={styleNonce}
      />
      <Root />
    </PageShownContext>,
    {
      bootstrapModules: [clientEntry],
      nonce:
        styleNonce === undefined ? nonce : { script: nonce, style: styleNonce },
      formState: formState as SsrOptions['formState'],
      // React outlines a large boundary even once it is complete — a hidden
      // copy plus a script that moves it in, so a stream can paint what came
      // before it. Without JavaScript nothing moves it in, and with it the
      // move is deferred to an animation frame, which hydration can beat: a
      // context that changes as it hydrates then renders the boundary again
      // beside the hidden copy, with a second `<title>`. A boundary complete
      // when the HTML is first read is written in place.
      progressiveChunkSize: Number.POSITIVE_INFINITY,
      // A visitor who left cancels the render, which then reports whatever it
      // was still rendering as failed. That is not a failure.
      onError: (error: unknown) => {
        if (!readerLeft) console.error(error);
      },
    },
  );
  // Reading only once a boundary has completed writes it in place; one still
  // pending when the shell is read is outlined, and shows its fallback to a
  // visitor without JavaScript. A file waits for every boundary. A document
  // waits for the page's own content — a `loading.tsx` above it is a
  // boundary, and the handler already waited for the page's data — but not
  // for what the page put under a `<Suspense>` of its own, which streams.
  if (import.meta.env.K8ORDO_MODE === 'static') await htmlStream.allReady;
  else if (showsPage) {
    // A page that threw never shows; its error.tsx is in place once all is.
    await Promise.race([
      shown.promise,
      htmlStream.allReady.catch(() => undefined),
    ]);
  }
  return noticeCancel(
    htmlStream.pipeThrough(injectRSCPayload(forHydration, { nonce })),
    () => {
      readerLeft = true;
    },
  );
}

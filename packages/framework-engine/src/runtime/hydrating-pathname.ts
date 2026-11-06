// @k8ordo/i18n の文言は描くたびに URL を読み、フックではないので文脈も読めない。
// engine は i18n に依存しないので、i18n と同じ名前で globalThis の同じ値を指す
const KEY = Symbol.for('@k8ordo/i18n/hydrating-pathname');

type Global = { [KEY]?: string | undefined };

let hydrated: PromiseWithResolvers<undefined> | undefined;

/**
 * Has `@k8ordo/i18n` read `pathname` as the URL while HTML rendered for it
 * is hydrated somewhere else. `usePathname` reads it from `PathnameProvider`
 * then; a message is no hook, and reads it from here.
 */
export const hydrateAs = (pathname: string): void => {
  (globalThis as Global)[KEY] = pathname;
  hydrated = Promise.withResolvers<undefined>();
};

/** Hands the URL back to `@k8ordo/i18n`: the HTML on screen is hydrated. */
export const doneHydrating = (): void => {
  (globalThis as Global)[KEY] = undefined;
  hydrated?.resolve(undefined);
};

/**
 * Settles once the HTML `hydrateAs` named a pathname for is hydrated —
 * `undefined` when there is none — and a tree is applied only then. Applied
 * before, it renders at the pathname the HTML was rendered for; and were the
 * URL handed back before, a boundary whose hydration the applying update
 * interrupted would be hydrated again at the URL, against that HTML.
 */
export const whenHydrated = (): Promise<undefined> | undefined =>
  hydrated?.promise;

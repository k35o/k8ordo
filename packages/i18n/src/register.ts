/**
 * Merged by the application once, so `message()` knows which locales every
 * message must carry — without each message naming the set:
 *
 * ```ts
 * declare module '@k8ordo/i18n' {
 *   interface Register {
 *     locale: LocaleOf<typeof locales>;
 *   }
 * }
 * ```
 *
 * The one `interface` in this package, kept so because it exists to be
 * merged (see the repository's conventions).
 */
// oxlint-disable-next-line typescript/consistent-type-definitions, typescript/no-empty-object-type -- augmentation needs a merge-open interface
export interface Register {}

/** The application's locale union once `Register` is merged; `string` before. */
export type RegisteredLocale = Register extends {
  locale: infer L extends string;
}
  ? L
  : string;

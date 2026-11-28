import type { StaticOptions } from './static';
import type { ServerOptions } from './vite';

export const STATIC_ONLY = ['site', 'csp'] as const;

export const TAKEN = {
  static: ['mode', 'reactCompiler', 'headers', ...STATIC_ONLY],
  server: ['mode', 'reactCompiler', 'headers'],
} as const satisfies {
  readonly static: ReadonlyArray<keyof StaticOptions>;
  readonly server: ReadonlyArray<keyof ServerOptions>;
};

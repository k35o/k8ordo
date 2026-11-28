const EVALUATIONS = Symbol.for('k8ordo-fixture/locales-first/evaluations');
const SEEN = Symbol.for('k8ordo-fixture/locales-first/seen');

type Global = {
  [EVALUATIONS]?: number;
  [SEEN]?: Readonly<Record<string, number>>;
};

const global = globalThis as Global;

export const evaluated = (): void => {
  global[EVALUATIONS] = (global[EVALUATIONS] ?? 0) + 1;
};

export const sawAtLoad = (module: string): void => {
  global[SEEN] = { ...global[SEEN], [module]: global[EVALUATIONS] ?? 0 };
};

export const seen = (): Readonly<Record<string, number>> | undefined =>
  global[SEEN];

export const forget = (): void => {
  global[EVALUATIONS] = undefined;
  global[SEEN] = undefined;
};

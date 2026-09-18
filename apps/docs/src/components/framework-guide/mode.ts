/** The two framework packages. A guide topic shared by both takes the one it is rendered for. */
export type Mode = 'static' | 'server';

export const packageOf = (mode: Mode): `@k8ordo/${Mode}` => `@k8ordo/${mode}`;

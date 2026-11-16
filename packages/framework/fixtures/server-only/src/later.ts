import { waitUntil } from '@k8ordo/framework/server';

// action.ts と同じく、どのページからも import しない
export const countLater = (): void => {
  waitUntil(Promise.resolve('counted'));
};

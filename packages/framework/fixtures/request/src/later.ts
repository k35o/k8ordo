import { waitUntil } from '@k8ordo/framework/server';

export const countLater = (): void => {
  waitUntil(Promise.resolve('counted'));
};

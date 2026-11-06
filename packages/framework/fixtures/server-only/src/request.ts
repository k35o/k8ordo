import { cookies } from '@k8ordo/framework/server';

// action.ts と同じく、どのページからも import しない
export const visits = (): string | undefined => cookies().get('visits');

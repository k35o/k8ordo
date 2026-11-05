import { cookies } from '@k8ordo/framework/server';

export const visits = (): string | undefined => cookies().get('visits');

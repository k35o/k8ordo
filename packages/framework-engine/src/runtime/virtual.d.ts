/// <reference types="vite/client" />
/// <reference types="@vitejs/plugin-rsc/types" />

declare module 'virtual:k8ordo/routes' {
  import type { Routes } from '@k8ordo/router';

  export const routes: Routes;
}

import { notFound } from '@k8ordo/router';

// 殻は値を持たないので、サーバーで notFound() と言えるものは何も無い
export default function GoneShell() {
  notFound();
}

import { notFound } from '@k8ordo/router';

export default function guard(): never {
  return notFound();
}

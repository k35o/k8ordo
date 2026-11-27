import { cookies, redirect } from '../../../../../src/runtime/server';

export default function guard(): undefined {
  if (cookies().has('session')) return undefined;
  cookies().set('next', '/account');
  return redirect('/login');
}

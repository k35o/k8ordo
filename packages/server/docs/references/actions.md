# Server Actions

A function the client may call, run on the server — what a form posts to.

```ts
// src/routes/_parts/actions.ts
'use server';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  return null;
}
```

```tsx
// src/routes/_parts/talk-form.tsx
'use client';

import { useActionState } from 'react';

import { createTalk } from './actions';

export function TalkForm() {
  const [state, formAction] = useActionState(createTalk, {});
  return <form action={formAction}>…</form>;
}
```

**`'use server'` and `server-only` say different things**, and an actions
module wants the first only. `'use server'` marks a function the client may
_call_, which runs on the server; `server-only` marks a module the client may
never _reach_. The client only ever receives a reference to an action, so the
two do not collide — but the mark belongs on what the action reads: keep
secrets and database clients in a `*.server.ts` module and import that.

A `POST` whose `Origin` header does not name the host it was sent to is
answered with a `403` before any action runs, so another site's form cannot
call your functions with your visitor's cookies. What that asks of a host
behind a proxy is in [The request handler](deploy.md#the-request-handler).

An action answers the request as much as a [guard](guards.md) does, so it
has the same API: `cookies()` to read and write the cookies,
`responseHeaders()` to add to the answer, and `requestHeaders()` for the
headers the request arrived with — an action is handed its arguments, not the
request.

```ts
'use server';

import { href } from '@k8ordo/router';
import { cookies, redirect } from '@k8ordo/server/runtime';

export async function signIn(_previous: FormState, formData: FormData) {
  const session = await startSession(formData);
  if (session === null) return { error: 'wrong password' };
  cookies().set('session', session.token, { maxAge: 60 * 60 * 24 * 30 });
  redirect(href('/account'));
}
```

What an action writes goes on its answer: the page it re-rendered, the `303`
to where it redirected, or the payload the client runtime applies. The page
re-rendered after it sees the cookies the request carried in `request`, not
what the action wrote.

**An action runs in the context of the page it was posted to.** A call
posts to the URL of the page on screen, whose params schemas run for that
request as they do for its render, and the action runs in what they wrote —
posted from `/ja/talks/new`, it runs in `ja` under `@k8ordo/i18n`, so the
zod messages `parseForm` produces are the page's language with nothing bound
to the action or wrapped around it.

Calling the action re-renders the page and sends both answers back together,
so the screen is up to date by the time the caller has its value — one round
trip, not two.

A form also works **before JavaScript loads**. React renders the fields that
identify the action into the HTML; posting them is an ordinary form
submission, and the server runs the action and answers with the same page,
re-rendered — or a `303` when the action ended with `redirect()`.
`useActionState`'s result survives that trip, so the same component handles
both worlds without knowing which one it is in.

## Ending with a redirect

A Server Action ends with `redirect()` from `@k8ordo/server/runtime`:

```ts
'use server';

import { href } from '@k8ordo/router';
import { redirect } from '@k8ordo/server/runtime';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  redirect(href('/talks')); // thrown: the lines after it never run
}
```

A form posted without JavaScript is answered with a `303` to the target; one
posted by the client runtime is answered with a payload that tells the
router to navigate there. The target is a URL, sent as given — build it with
`href()`, which carries Vite's `base` when the application is served under
one, where a `redirect.ts` target is a pattern in the table's terms and gets
the base put in front. `redirect()` is for actions: a page that should
send the visitor elsewhere is a `redirect.ts`, where the build can see it.

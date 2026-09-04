import { AtomIcon, FormIcon, LocationIcon, SendIcon } from '@k8ordo/ui';

import { PackageExample } from '../components/package-example';
import { PackageLanding } from '../components/package-landing';
import type { PackageFeature } from '../components/package-landing';

const FEATURES: PackageFeature[] = [
  {
    title: 'server.featureRequest',
    description: 'server.featureRequestDescription',
    icon: <SendIcon />,
  },
  {
    title: 'server.featureRoutes',
    description: 'server.featureRoutesDescription',
    icon: <LocationIcon />,
  },
  {
    title: 'server.featureActions',
    description: 'server.featureActionsDescription',
    icon: <FormIcon />,
  },
  {
    title: 'server.featureSameHandler',
    description: 'server.featureSameHandlerDescription',
    icon: <AtomIcon />,
  },
];

const EXAMPLE = `// src/routes/_parts/actions.ts
'use server';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  return null;
}

// src/routes/_parts/talk-form.tsx
'use client';

export function TalkForm() {
  const [state, formAction] = useActionState(createTalk, {});
  return <form action={formAction}>…</form>;
}`;

export function ServerPage() {
  return (
    <PackageLanding
      description="server.description"
      directory="server"
      docsDescription="server.docsDescription"
      docsTitle="server.docsTitle"
      features={FEATURES}
      featuresTitle="server.featuresTitle"
      name="@k8ordo/server"
    >
      <PackageExample
        code={EXAMPLE}
        description="server.exampleDescription"
        title="server.exampleTitle"
      />
    </PackageLanding>
  );
}

import {
  AtomIcon,
  FormIcon,
  LocationIcon,
  PrepareIcon,
  SendIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from '@k8ordo/ui';

import { PackageExample } from '../../../components/package-example';
import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';
import * as m from '../../../messages';

const FEATURES: PackageFeature[] = [
  {
    title: m.server.featureRequest,
    description: m.server.featureRequestDescription,
    icon: <SendIcon />,
  },
  {
    title: m.server.featureRoutes,
    description: m.server.featureRoutesDescription,
    icon: <LocationIcon />,
  },
  {
    title: m.server.featureActions,
    description: m.server.featureActionsDescription,
    icon: <FormIcon />,
  },
  {
    title: m.server.featureSameHandler,
    description: m.server.featureSameHandlerDescription,
    icon: <AtomIcon />,
  },
  {
    title: m.server.featureRouteFiles,
    description: m.server.featureRouteFilesDescription,
    icon: <RefreshIcon />,
  },
  {
    title: m.server.featureParams,
    description: m.server.featureParamsDescription,
    icon: <ShieldCheckIcon />,
  },
  {
    title: m.server.featureGuards,
    description: m.server.featureGuardsDescription,
    icon: <PrepareIcon />,
  },
];

const EXAMPLE = `// src/routes/_parts/actions.ts
'use server';

export async function createTalk(_previous: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data);
  redirect(href('/talks')); // throw されるので、この後の行は走らない
}

// src/routes/_parts/talk-form.tsx
'use client';

export function TalkForm() {
  const [state, formAction] = useActionState(createTalk, {});
  return <form action={formAction}>…</form>;
}`;

export default function ServerPage() {
  return (
    <PackageLanding
      description={m.server.description}
      directory="server"
      docsDescription={m.server.docsDescription}
      docsTitle={m.server.docsTitle}
      features={FEATURES}
      featuresTitle={m.server.featuresTitle}
      name="@k8ordo/server"
    >
      <PackageExample
        code={EXAMPLE}
        description={m.server.exampleDescription}
        title={m.server.exampleTitle}
      />
    </PackageLanding>
  );
}

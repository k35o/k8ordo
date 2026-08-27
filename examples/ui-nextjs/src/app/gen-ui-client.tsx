'use client';

import type { ArteSpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUiClient({ spec }: { spec: ArteSpec }) {
  return <JsonRenderUI spec={spec} />;
}

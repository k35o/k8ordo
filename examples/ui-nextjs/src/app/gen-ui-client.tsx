'use client';

import type { UISpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUiClient({ spec }: { spec: UISpec }) {
  return <JsonRenderUI spec={spec} />;
}

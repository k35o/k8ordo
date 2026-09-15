import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const aiCategories: NavCategory[] = [
  {
    title: m.nav.ai,
    items: [
      {
        name: 'AI Chat',
        path: '/:locale/ui/ai/chat',
        description: m.ai.chatSummary,
      },
      {
        name: 'Generative UI',
        path: '/:locale/ui/ai/generative-ui',
        description: m.ai.generativeUiSummary,
      },
      {
        name: 'AI Agents',
        path: '/:locale/ui/ai/agents',
        description: m.ai.agentsSummary,
      },
    ],
  },
];

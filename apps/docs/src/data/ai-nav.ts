import * as m from '../messages';
import type { NavCategory } from './nav-types';

export const aiCategories: NavCategory[] = [
  {
    title: m.nav.ai,
    items: [
      {
        name: 'AI Chat',
        path: '/ui/ai/chat',
        description: m.ai.chatSummary,
      },
      {
        name: 'Generative UI',
        path: '/ui/ai/generative-ui',
        description: m.ai.generativeUiSummary,
      },
      {
        name: 'AI Agents',
        path: '/ui/ai/agents',
        description: m.ai.agentsSummary,
      },
    ],
  },
];

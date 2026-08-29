import type { NavCategory } from './nav-types';

export const aiCategories: NavCategory[] = [
  {
    titleKey: 'nav.ai',
    items: [
      {
        name: 'AI Chat',
        path: '/ui/ai/chat',
        descKey: 'ai.chatSummary',
      },
      {
        name: 'Generative UI',
        path: '/ui/ai/generative-ui',
        descKey: 'ai.generativeUiSummary',
      },
      {
        name: 'AI Agents',
        path: '/ui/ai/agents',
        descKey: 'ai.agentsSummary',
      },
    ],
  },
];

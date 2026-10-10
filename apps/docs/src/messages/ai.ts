import { message } from '@k8ordo/i18n';

export const description = message({
  ja: '`@k8ordo/ui`には、AIを使うプロダクト向けのものが3つあります。チャット画面のコンポーネントと生成UIのアダプタ、AIのコーディングエージェント向けのドキュメントです。',
  en: '`@k8ordo/ui` provides three things for products built on AI: components for a chat screen, adapters for generative UI, and documentation for AI coding agents.',
});

export const chatSummary = message({
  ja: '`Conversation`と`Message`、`PromptInput`でチャット画面を組み立てるコンポーネントです。',
  en: 'Components that build a chat screen: `Conversation`, `Message` and `PromptInput`.',
});

export const generativeUiSummary = message({
  ja: 'LLMにこのライブラリのコンポーネントだけでUIを作らせる、json-renderとOpenUIのアダプタです。',
  en: 'Adapters for json-render and OpenUI that have an LLM build UI from these components only.',
});

export const agentsSummary = message({
  ja: 'AIのコーディングエージェントが読む、設計の指針とリファレンス、propsのドキュメントです。',
  en: 'Documentation for AI coding agents to read: the design guide, the references and the props.',
});

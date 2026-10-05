import { message } from '@k8ordo/i18n';

export const description = message({
  ja: 'AIを使うプロダクトのために、`@k8ordo/ui`は3つのものを用意しています。チャット画面を組み立てる部品と、LLMにこのライブラリの部品だけでUIを作らせるアダプタ、そしてAIのコーディングエージェントが読むためのドキュメントです。',
  en: 'For products built on AI, `@k8ordo/ui` offers three things: parts for building a chat screen, adapters that let a model build UI out of this library’s components only, and documentation for coding agents to read.',
});

export const chatSummary = message({
  ja: 'Conversation、Message、PromptInputで、チャット画面を組み立てる部品です。',
  en: 'Conversation, Message and PromptInput: parts for building a chat screen.',
});

export const generativeUiSummary = message({
  ja: 'LLMがこのライブラリの部品だけでUIを作るための、json-renderとOpenUIのアダプタです。',
  en: 'Adapters for json-render and OpenUI that let a model build UI out of these components only.',
});

export const agentsSummary = message({
  ja: '設計の指針とリファレンス、propsを、AIのコーディングエージェントに読ませるためのドキュメントです。',
  en: 'Documentation that hands the design guide, the references and the props to coding agents.',
});

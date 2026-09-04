import type { MessageKey } from '../types';

export const ja = {
  'nav.home': 'Home',
  'nav.getStarted': 'Get Started',
  'nav.components': 'Components',
  'nav.theming': 'Theming',
  'nav.i18n': 'i18n',
  'nav.hooks': 'Hooks',
  'nav.helpers': 'Helpers',
  'nav.generativeUi': 'Generative UI',
  'nav.aiChat': 'AIチャット',
  'home.description': 'Baselineに入った機能を、制限なく使うReactのライブラリ群',
  'home.exploreUi': 'UIを見る',
  'home.membersTitle': 'パッケージ',
  'home.memberUiDescription':
    'セマンティックなデザイントークン・i18n・生成UIアダプタを備えたReactコンポーネント。',
  'home.memberFormDescription':
    'スキーマ1つから HTML の制約属性・メッセージ・サーバー検証を導く。値は DOM が持つので、JavaScript が無くても動く。',
  'home.memberStateDescription':
    '状態を置き場所で宣言する。URL・履歴エントリ・localStorage・メモリを、それぞれスキーマ1つで型付けし、Navigation API に載せる。',
  'home.disciplineTitle': '共通の前提',
  'home.disciplinePlatform': 'Baselineだけ',
  'home.disciplinePlatformDescription':
    'コア4ブラウザに載った時点（Baseline newly available）で使う。その30か月後のwidely availableは待たない。ポリフィルもフォールバックも持たないので、最新のブラウザでしか動かない。古いブラウザを切ったのではなく、最初からそこでは動かない。',
  'home.disciplineReact': 'Reactの最新に追従する',
  'home.disciplineReactDescription':
    'React 19とServer Componentsを前提にし、新しい記法が出れば追う。互換のための古いパスを残さないので、書き方が一つに保たれる。',
  'home.disciplineTypes': 'TypeScript Safe',
  'home.disciplineTypesDescription':
    '型は書いたものを後から確かめるためではなく、間違いを書けなくするために使う。ドキュメントも生成物も型から作られるので、実装からずれない。',
  'home.disciplineAgents': 'エージェントが読める',
  'home.disciplineAgentsDescription':
    'どのパッケージも自分のドキュメントをnpmパッケージに同梱する。AIはインストールした版そのものを読むので、写して同期させる手間も、版がずれる事故も起きない。',
  'ui.description':
    '穏やかだけど退屈じゃないUIを作るためのReactコンポーネントライブラリ',
  'ui.getStarted': 'はじめる',
  'ui.viewComponents': 'コンポーネントを見る',
  'common.github': 'GitHub',
  'ui.featuresTitle': '特徴',
  'ui.featureReact': 'React 19',
  'ui.featureReactDescription':
    'Server Componentsからそのまま使える。クライアントに送る必要のないものは、サーバーで描いたまま置いておける。',
  'ui.featureTokens': 'デザイントークン',
  'ui.featureTokensDescription':
    'ビルド済みCSSのインポート1行で動き、Tailwind CSSのセットアップは不要。色や余白はセマンティックトークンで統一され、ライトモードとダークモードもシームレスに切り替わります。',
  'ui.featureTypeScript': 'TypeScript',
  'ui.featureTypeScriptDescription':
    'propsのリファレンスは型から生成されるので、ドキュメントが実装からずれない。存在しないpropsを書けば、動かす前にエディタが教えてくれる。',
  'ui.featureAgents': 'エージェント向けの面',
  'ui.featureAgentsDescription':
    '設計ガイドとリファレンスがnpmパッケージに同梱される。AIは`node_modules/@k8ordo/ui/docs/`からインストールした版そのものを読む。StorybookのMCPエンドポイントから実物のpropsも引ける。',
  'ui.featureAccessible': 'アクセシビリティ',
  'ui.featureAccessibleDescription':
    'WAI-ARIAパターンに基づき、キーボード操作やスクリーンリーダーに配慮したコンポーネントを目指しています。',
  'ui.featureMinimal': '柔と端のデザイン',
  'ui.featureMinimalDescription':
    '触れるものは柔らかく、読むものは端正に。余白と形の柔らかさで魅せるUIを提供します。',
  'ui.featureVerticalWriting': '縦書き対応',
  'ui.featureVerticalWritingDescription':
    '`writing-v`ユーティリティでwriting-modeを切り替えると、コンポーネントは縦書きの紙面でも崩れずに追従します。日本語ドキュメントを縦書きで体験できます。',
  'common.language': '言語',
  'footer.docs': 'ドキュメント',
  'footer.packages': 'パッケージ',
  'footer.resources': 'リソース',
  'form.description':
    'zodスキーマ1つから、HTMLの制約属性・エラーメッセージ・サーバー検証を導きます。値はDOMが持つので、JavaScriptが落ちていても読み込み前でもフォームは動きます。',
  'form.featuresTitle': '特徴',
  'form.featureSchema': '出所はスキーマ1つ',
  'form.featureSchemaDescription':
    'required も maxLength も type も、書いたスキーマから降ってきます。JSXとサーバーに同じ制約を二重に書く必要がありません。',
  'form.featureNoJs': 'JavaScriptが無くても動く',
  'form.featureNoJsDescription':
    '送信は Server Action が受けます。エラーはフィールド単位で返り、入力値も戻るので、やり直しで打ち直しになりません。',
  'form.featureDom': '値はDOMが持つ',
  'form.featureDomDescription':
    '入力のたびに再描画が起きません。値がReactのstateに載ることはなく、載るのは表示中のエラーや行の識別子といった、DOMが表現できないものだけです。',
  'form.featureTypes': 'パスが型で守られる',
  'form.featureTypesDescription':
    "`field('titel')` のような打ち間違いは、動かす前にコンパイルが止めます。ネストしたパスも配列との取り違えも同じように落ちます。",
  'form.featureLoud': '黙って壊れない',
  'form.featureLoudDescription':
    'スキーマにある欄が送信されていなければ、検証の失敗ではなく結線の誤りとして知らせます。制約属性に落ちなかった検証も一覧で報告します。',
  'form.featureSecrets': '秘密は返さない',
  'form.featureSecretsDescription':
    'やり直しのために入力値を返しますが、パスワード欄は自動で除きます。属性を生成したのがform自身なので、指定を書き忘れる事故が起きません。',
  'form.docsTitle': 'ドキュメント',
  'form.docsDescription':
    '設計ガイドとリファレンスは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/form/docs/` からインストールした版そのものを読みます。',
  'state.description':
    '状態を「どこに住むか」で宣言します。URLのsearchParams・履歴エントリ・localStorage・メモリの4つの置き場所を、それぞれzodスキーマ1つで型付けし、サーバーの読み取り・リンク生成・購読までそこから導きます。',
  'state.demoTitle': 'このページで動いています',
  'state.demoDescription':
    '下の操作は本物のURLを書き換えます。`definePageState` の update がこのサイトのルーター（Navigation API を intercept する @funstack/router）を通って流れます。ヘッダーのテーマ切り替えの保存先も `defineLocalState` で、その現在値が theme の行です。',
  'state.demoUrlEmpty': 'クエリなし（すべて default）',
  'state.demoThemeSystem': 'システムに追従',
  'state.demoHint':
    'page の増減は push なので、ブラウザの戻るで1つずつ巻き戻ります。tab は replace で、現在のエントリを書き換えます。URL をコピーすれば、この状態ごと共有できます。URL に `?page=0` と手で書いても、スキーマが default に落とします。',
  'state.featuresTitle': '特徴',
  'state.featurePlaces': '置き場所で宣言する',
  'state.featurePlacesDescription':
    'URL・履歴エントリ・localStorage・メモリ。状態の寿命と共有範囲を決めるのはコードの書き方ではなく、定義した場所です。',
  'state.featureSchema': '出所はスキーマ1つ',
  'state.featureSchemaDescription':
    'parseUrl・リンク生成・古いデータのサルベージまで、書いたスキーマから導かれます。検索フォームの制約（@k8ordo/form）と同じスキーマを共有できます。',
  'state.featureNavigation': 'Navigation APIに載る',
  'state.featureNavigationDescription':
    'URLと隠れたエントリ状態は、同じ履歴エントリの2つの面です。1回の navigate で原子的に更新され、戻るで両方が一緒に戻ります。',
  'state.featureKeys': 'キー単位の購読',
  'state.featureKeysDescription':
    '購読するキーを列挙すれば、それ以外のフィールドの更新では再レンダーされません。スキーマがキー集合を固定しているので、判定は正確です。',
  'state.featureCanonical': '不正な値は表示されない',
  'state.featureCanonicalDescription':
    'update はその場でスキーマを通り、URL に手で書かれた不正値はフィールド単位で default に落ちます。default の値はクエリから省かれるので、同じ状態は常に同じ URL になります。',
  'state.featureServer': 'サーバーが読める',
  'state.featureServerDescription':
    'URL 状態は RSC が parseUrl で型付きに読めます。リンクと GET フォームはどのルーターでも、JavaScript なしでも動きます。',
  'state.docsTitle': 'ドキュメント',
  'state.docsDescription':
    '設計ガイドとリファレンスは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/state/docs/` からインストールした版そのものを読みます。',
  'router.description':
    'URL の pathname 軸を所有します。ルート表がアプリの pathname スキーマそのもので、そこから型・マッチング・リンク・ナビゲーションのすべてが導かれます。search params と履歴エントリの状態は @k8ordo/state の担当で、この境界は URL の "?" と一致します。',
  'router.featuresTitle': '特徴',
  'router.featureTable': '表が pathname スキーマ',
  'router.featureTableDescription':
    'leaf・branch・`[param]`・ワイルドカード・URL に出ないグループを 1 つの表で書きます。照合は宣言順で先勝ち。特異度ランキングのような、あとから逆算しないと分からない規則を持ちません。',
  'router.featureTypes': 'パターンから型が生える',
  'router.featureTypesDescription':
    'params はパターン文字列から推論され、`Register` を宣言すれば表に無いパターンもコンパイルで落ちます。コード生成はありません。',
  'router.featureNavigation': 'finished は「画面に出た」',
  'router.featureNavigationDescription':
    'intercept のハンドラは React が新しい木を commit した後に解決します。search だけが変わったときはルート木に触れず、スクロールもフォーカスも動かしません。',
  'router.featureNoLink': 'Link を作らない',
  'router.featureNoLinkDescription':
    'Navigation API の下では素の `<a>` がすでにクライアント遷移です。包んでも 2 つ目の書き方が増えるだけなので、型は `href` が守ります。',
  'router.exampleTitle': '表とリンク',
  'router.exampleDescription':
    '表は 1 か所。ページは表を import せず、パターン文字列だけで型付きのリンクを書きます。',
  'router.docsTitle': 'ドキュメント',
  'router.docsDescription':
    '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/router/docs/` からインストールした版そのものを読みます。',
  'static.description':
    'アプリをファイルに焼きます。すべてのルートを事前に描画し、出力は静的ホスティングに置けるディレクトリだけ。実行時にサーバーはいりません。',
  'static.featuresTitle': '特徴',
  'static.featureRoutes': 'routes/ が URL 空間',
  'static.featureRoutesDescription':
    'ディレクトリ木がそのまま pathname 空間です。page/layout/not-found・`[param]`・`(group)`・`_` の私物だけを認め、規約から外れたものはビルドを落とします。',
  'static.featureGenerated': '配線は書かない',
  'static.featureGeneratedDescription':
    'ルート表と、router / state への型の配線は生成されます。生成物はルーターの公開 API を使ったただのソースで、diff で読めます。',
  'static.featureBoundary': '境界は検査される',
  'static.featureBoundaryDescription':
    "実行環境は React 自身の `'use client'` で宣言します。`server-only` を import したモジュールがクライアントに届いた時点でビルドが落ちるので、秘密は間に何段挟まっても渡りません。",
  'static.featureFiles': 'モードは依存で決まる',
  'static.featureFilesDescription':
    'このパッケージを入れることが「静的である」ことです。Server Actions もリクエスト依存も、守るべき規則ではなく存在しない API になります。パラメータ付きルートは列挙必須で、欠けたままビルドは通りません。',
  'static.exampleTitle': 'ディレクトリが URL',
  'static.exampleDescription':
    'routes/ の木がそのまま pathname 空間になり、表と型の配線は生成されます。',
  'static.docsTitle': 'ドキュメント',
  'static.docsDescription':
    '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/static/docs/` からインストールした版そのものを読みます。',
  'server.description':
    'アプリを動かします。リクエストのたびに描画するので、パラメータの値を事前に列挙する必要がなく、知らない URL には本物の 404 を返し、フォームは Server Action に届きます。',
  'server.featuresTitle': '特徴',
  'server.featureRequest': '値はリクエストと来る',
  'server.featureRequestDescription':
    'パラメータの値はリクエストと一緒に来るので、事前に列挙する必要がありません。知らない URL には、ホスティングのエラーページではなく自分の not-found を本物の 404 で返します。',
  'server.featureRoutes': 'routes/ が URL 空間',
  'server.featureRoutesDescription':
    'ディレクトリ木がそのまま pathname 空間です。page/layout/not-found・`[param]`・`(group)`・`_` の私物だけを認め、規約から外れたものはビルドを落とします。',
  'server.featureActions': 'フォームが届く',
  'server.featureActionsDescription':
    'Server Actions の宛先があります。@k8ordo/form と組み合わせれば、検証もメッセージも同じ 1 つのスキーマから出ます。',
  'server.featureSameHandler': 'static と同じハンドラ',
  'server.featureSameHandlerDescription':
    'リクエストをページに変える関数は static と同一で、違いは呼ぶ時期だけです。両モードで描画が食い違うなら、それは何かが漏れています。',
  'server.exampleTitle': 'Server Action',
  'server.exampleDescription':
    '`use server` を付けた関数はクライアントから呼べて、実行はサーバーで起きます。JavaScript が無くても、同じフォームがそのまま動きます。',
  'server.docsTitle': 'ドキュメント',
  'server.docsDescription':
    '設計ガイドは npm パッケージに同梱されています。AIコーディングエージェントは `node_modules/@k8ordo/server/docs/` からインストールした版そのものを読みます。',
  'footer.tagline': 'Baselineに入った機能を、制限なく使うReactのライブラリ群。',
  'footer.typesetting': '組版 — Noto Sans JP / M PLUS 2',
  'nav.openMenu': 'メニューを開く',
  'nav.ai': 'AI',
  'nav.aiAgents': 'AIエージェント',
  'ai.description':
    'k8ordo UIはAIプロダクトのための面を揃えています。チャット画面を組み立てるUI部品、LLMにk8ordo UIのUIを生成させるアダプタ、そしてAIコーディングエージェントに読ませるドキュメントの3つです。',
  'ai.chatSummary':
    'Conversation・Message・PromptInputでチャット画面を組み立てるpresentationalな部品集。',
  'ai.generativeUiSummary':
    'LLMがk8ordo UIコンポーネントだけでUIを生成するためのjson-render / OpenUIアダプタ。',
  'ai.agentsSummary':
    '設計指針・リファレンス・propsをAIコーディングエージェントに読ませるためのドキュメント面。',
  'aiAgents.introduction':
    'k8ordo UIは、AIコーディングエージェントが読むための面を用意しています。設計指針・コンポーネントのリファレンス・トークン・propsを、いずれも実装から生成した形で配っています。',
  'aiAgents.setupTitle': 'エージェントに読ませる',
  'aiAgents.setupDescription':
    'ドキュメントはnpmパッケージに同梱されているので、参照先はインストール済みのバージョンに固定されます。プロジェクトのCLAUDE.md / AGENTS.mdに次を貼るだけで設定は終わりです。',
  'aiAgents.surfacesTitle': '公開している面',
  'aiAgents.surfacesDescription':
    'いずれもパッケージ内（node_modules）と、このサイトの両方から取得できます。',
  'aiAgents.surfaceGuide': '設計ガイド。まずここから読む',
  'aiAgents.surfaceReference': 'コンポーネント・hooks・helpersのリファレンス',
  'aiAgents.surfaceIndex': 'LLM向けのドキュメント索引',
  'aiAgents.surfaceTokens': 'デザイントークンの仕様（CSSから生成）',
  'aiAgents.surfaceProps': '全コンポーネントのprops（型から生成）',
  'aiAgents.surfaceMcp': '公開StorybookのMCPエンドポイント',
  'aiAgents.mcpTitle': 'MCPでStorybookを引く',
  'aiAgents.mcpDescription':
    '記憶でpropsを書かせず、実際のストーリーと描画結果を引かせるための口です。MCPクライアントの設定に追加します。',
  'aiAgents.generatedTitle': '生成されているもの',
  'aiAgents.generatedDescription':
    'propsはコンポーネントの型から、トークンはCSSから抽出しています。CIが実装との差分を検出するため、ドキュメントだけが古くなることはありません。',
  'generativeUi.introduction':
    'k8ordo UIは、LLMがk8ordo UIコンポーネントだけでUIを生成できる公式アダプタ（json-render / OpenUI）を同梱しています。プロンプトはサーバーで生成し、出力を検証してからクライアントで描画します。',
  'generativeUi.promptTitle': 'プロンプトを生成（サーバー）',
  'generativeUi.promptDescription':
    'catalogはサーバー安全です。Server Componentでシステムプロンプトを生成し、`uiRules`で横断ルールを注入します。',
  'generativeUi.renderTitle': '描画（クライアント）',
  'generativeUi.renderDescription':
    '`JsonRenderUI`がプロバイダー・レンダラー・registryを内部結線済みなので、specを渡すだけで描画できます。',
  'generativeUi.validateTitle': 'LLM出力の検証と修復',
  'generativeUi.validateDescription':
    '`validateGeneratedSpec`が機械修正・構造検証・コンポーネントごとのprops検証を行い、失敗時はそのまま投げ返せる修復プロンプトを返します。',
  'generativeUi.typedTitle': '型付きspec',
  'generativeUi.typedDescription':
    '`satisfies UISpec`で書くと、component名・propsのtypoがコンパイル時に検出されます。',
  'generativeUi.openuiTitle': 'OpenUI',
  'generativeUi.openuiDescription':
    'OpenUIはDSL文字列を`library`で描画します。プロンプトは専用の`openui/prompt`エントリでサーバー生成できます。',
  'aiChat.introduction':
    'AIチャットUIのためのpresentationalな部品です。通信やメッセージの状態は持たず、データを渡して`messages.map()`で組み立てるだけ。AI SDKでも自前のバックエンドでも接続できます。`@k8ordo/ui/ai`からimportします。',
  'aiChat.demoTitle': 'デモ',
  'aiChat.demoDescription':
    '実際のチャット画面です。サジェスチョンを選ぶか、メッセージを入力して送信すると、吹き出しが会話に積まれていきます。思考過程やツール呼び出しは折りたたみで確認できます。',
  'aiChat.suggestionTitle': 'サジェスチョン',
  'aiChat.suggestionDescription':
    '`Suggestion`は定型の質問をチップで並べ、選択された値をそのまま送信ハンドラに渡します。',
  'aiChat.overviewTitle': '会話を組み立てる',
  'aiChat.overviewDescription':
    '`Conversation`はstick-to-bottomと「最新へ」ボタン付きのスクロール領域、`Message`はroleごとの吹き出し、`PromptInput`は入力欄です。メッセージ配列は利用側が持ちます。',
  'aiChat.inputTitle': '入力欄（IME対応）',
  'aiChat.inputDescription':
    'Enterで送信、Shift+Enterで改行、そしてIME変換を確定するEnterでは送信しません。`status`に応じて送信 / 停止ボタンが切り替わります。',
  'aiChat.responseTitle': 'ストリーミングMarkdown',
  'aiChat.responseDescription':
    '`Response`はストリーミング中のMarkdownを描画し、未クローズのブロックにも耐えます。別サブパスに分かれており、optional peerの`streamdown`とそのスタイルシートが必要です。',
  'aiChat.toolTitle': 'ツール呼び出しと思考',
  'aiChat.toolDescription':
    '`ToolInvocation`と`Reasoning`はツールの実行や思考過程を折りたたみで表示します。`state`の語彙はAI SDKのツールパートの状態に揃えています。',
  'aiChat.aiSdkTitle': 'AI SDK連携',
  'aiChat.aiSdkDescription':
    '`mapMessageParts`（`@k8ordo/ui/ai-sdk`）はAI SDKの`UIMessage.parts`を、自分で描画しやすい素朴な配列に変換します。optional peerの`ai`が必要です。',
  'aiChat.jsonRenderTitle': '吹き出しの中にGenerative UI',
  'aiChat.jsonRenderDescription':
    'Message.Contentは任意のchildrenを取れるので、json-renderのregistryを使ってLLMが生成したUI specを吹き出しの中に描画できます。会話の中へそのままGenerative UIを届けられます。',
  'aiChat.propsDescription':
    'コンポーネントの型から生成したpropsの一覧です。開閉を持つコンポーネント（Reasoning / ToolInvocation）はisOpen / defaultOpen / onChangeのcontrolled / uncontrolled両対応です。',
  'aiChat.demo.greeting':
    'こんにちは。k8ordo UIのAIチャットについて、何でも聞いてください。',
  'aiChat.demo.seedQuestion':
    'ReactでAIチャットを作るとき、何から始めればいい？',
  'aiChat.demo.seedReasoning':
    'まず会話の器・吹き出し・入力欄の3つが土台。Markdownやツール表示は後段で足せる。',
  'aiChat.demo.seedToolOutput':
    'Conversation / Message / PromptInputの3つから始めるのが推奨です。',
  'aiChat.demo.seedAnswer':
    'まずはConversation・Message・PromptInputの3つで会話の骨組みを作り、そのあとResponse（Markdown）やToolInvocationを足していくのがおすすめです。',
  'aiChat.demo.reply': 'なるほど。ドキュメントの該当箇所をまとめますね。',
  'aiChat.demo.suggestionIme': 'IME対応について教えて',
  'aiChat.demo.suggestionStreaming': 'ストリーミング表示は？',
  'aiChat.demo.suggestionTool': 'ツール呼び出しの表示例',
  'aiChat.demo.placeholder': 'メッセージを入力…',
  'getStarted.introduction':
    'k8ordo UIは、React 19で構築されたUIコンポーネントライブラリです。フォームやカードなどユーザーが操作する要素は丸みと余白で親しみやすく、情報を伝える要素はシャープさを保って明確に。穏やかだけど退屈じゃないUIを実現します。',
  'getStarted.installationTitle': 'インストール',
  'getStarted.installationDescription':
    'お好みのパッケージマネージャーでインストールしてください。',
  'getStarted.setupTitle': 'セットアップ',
  'getStarted.setupDescription':
    'インストール後、以下の2つの設定を行ってください。',
  'getStarted.setupCssDescription':
    'ビルド済みCSSをアプリケーションのエントリーポイントでインポートしてください。Tailwind CSSのセットアップは不要です。',
  'getStarted.setupCssTailwindDescription':
    'Tailwind CSS 4を使うプロジェクトは、代わりにソース版をインポートすると、デザイントークンを自分のマークアップのTailwindクラスとしても使えます。',
  'getStarted.setupProviderDescription':
    'UIProviderでアプリケーションをラップしてください。',
  'getStarted.usageTitle': '使い方',
  'getStarted.usageDescription':
    'セットアップが完了したら、コンポーネントをインポートして使用できます。',
  'getStarted.requirementsTitle': '動作要件',
  'getStarted.requirementsDescription':
    'k8ordo UIを使用するには、以下のピア依存関係が必要です。',
  'getStarted.nextStepsTitle': '次のステップ',
  'getStarted.nextStepsComponents':
    'コンポーネント一覧を確認して、使用できるUIパーツを探す',
  'getStarted.nextStepsTheming': 'テーマのカスタマイズ方法を学ぶ',
  'getStarted.nextStepsI18n': '組み込み文言を英語にする・差し替える',
  'getStarted.nextStepsStorybook':
    'Storybookで各コンポーネントの詳細なドキュメントを確認する',
  'getStarted.packageManagerLabel': 'パッケージマネージャー',
  'catalog.searchPlaceholder': '名前や説明で絞り込む',
  'catalog.noResults': '一致する項目はありませんでした。',
  'components.description': 'k8ordo UIが提供するUIコンポーネントの一覧です。',
  'components.categoryButtons': 'Buttons',
  'components.categoryNavigation': 'Navigation',
  'components.categoryForms': 'Forms',
  'components.categoryDataDisplay': 'Data Display',
  'components.categoryFeedback': 'Feedback',
  'components.categoryOverlays': 'Overlays',
  'components.categoryLayout': 'Layout',
  'components.categoryMedia': 'Media',
  'components.common.storybookLink': 'Storybookで確認',
  'components.common.importTitle': 'インポート',
  'components.common.usageTitle': '使い方',
  'components.common.propsTitle': 'Props',
  'components.common.inheritsLabel':
    '型ベース（内部で固定する一部attrsは除外）:',
  'components.common.messagesNote':
    'Defaultがmessages.* のpropsは、未指定のとき文言辞書から解決されます。差し替え方は次を参照してください:',
  'components.button.description': 'ユーザー操作を受け付けるボタン',
  'components.button.variantsTitle': 'バリアント',
  'components.button.colorsTitle': 'カラー',
  'components.button.sizesTitle': 'サイズ',
  'components.button.iconsTitle': 'アイコン付き',
  'components.button.fullWidthTitle': 'Full Width',
  'components.button.disabledTitle': '無効',
  'components.button.renderItemTitle': 'リンクとしてレンダリング',
  'components.iconButton.description': 'アイコンのみのボタン',
  'components.iconButton.sizesTitle': 'サイズ',
  'components.iconButton.backgroundsTitle': '背景',
  'components.iconButton.disabledTitle': '無効',
  'components.iconButton.renderItemTitle': 'リンクとしてレンダリング',
  'components.anchor.description': 'テキストリンク',
  'components.anchor.openInNewTabTitle': '新しいタブで開く',
  'components.anchor.renderAnchorTitle': 'render propで要素差し替え',
  'components.anchor.renderAnchorDescription':
    'Next.jsのLinkやreact-routerのLinkなど、フレームワーク固有のanchorコンポーネントに差し替えるにはrenderAnchorを渡してください。受け取ったpropsはすべて差し替え後の要素にスプレッドしてください。',
  'components.textField.description': 'テキスト入力フィールド',
  'components.textField.placeholderTitle': 'プレースホルダー',
  'components.textField.disabledTitle': '無効',
  'components.textField.invalidTitle': 'エラー',
  'components.textarea.description': '複数行のテキスト入力フィールド',
  'components.textarea.rowsTitle': '行数',
  'components.textarea.autoResizeTitle': '自動リサイズ',
  'components.textarea.disabledTitle': '無効',
  'components.textarea.invalidTitle': 'エラー',
  'components.numberField.description': '数値入力フィールド',
  'components.numberField.stepPrecisionTitle': 'ステップと有効数字',
  'components.numberField.minMaxTitle': '最小値 / 最大値',
  'components.numberField.disabledTitle': '無効',
  'components.numberField.invalidTitle': 'エラー',
  'components.select.description': '選択肢から値を選ぶセレクトボックス',
  'components.select.disabledTitle': '無効',
  'components.select.invalidTitle': 'エラー',
  'components.select.requiredTitle': '必須',
  'components.select.defaultValueTitle': 'デフォルト値',
  'components.checkbox.description': 'チェックボックス',
  'components.checkbox.defaultCheckedTitle': 'デフォルトチェック',
  'components.checkbox.disabledTitle': '無効',
  'components.checkbox.controlledTitle': '制御モード',
  'components.checkboxCard.description': '選択肢をカードで見せる複数選択',
  'components.checkboxCard.defaultValueTitle': 'デフォルト値',
  'components.checkboxGroup.description':
    '複数のチェックボックスをひとつの値として扱うグループ',
  'components.checkboxGroup.defaultValueTitle': 'デフォルト値',
  'components.checkboxGroup.disabledTitle': '無効',
  'components.switch.description': 'オン・オフを切り替えるスイッチ',
  'components.switch.defaultCheckedTitle': 'デフォルトチェック',
  'components.switch.disabledTitle': '無効',
  'components.switch.controlledTitle': '制御モード',
  'components.passwordInput.description':
    '表示切り替え付きのパスワード入力フィールド',
  'components.passwordInput.controlledTitle': '制御モード',
  'components.passwordInput.disabledTitle': '無効',
  'components.radio.description': 'ラジオボタングループ',
  'components.radio.disabledTitle': '無効',
  'components.radio.defaultValueTitle': 'デフォルト値',
  'components.radioCard.description': '選択肢をカードで見せる単一選択',
  'components.radioCard.defaultValueTitle': 'デフォルト値',
  'components.radioCard.formTitle': 'フォーム連携',
  'components.radioCard.formDescription':
    '中身は本物のinput[type=radio] なので、nameを渡せばブラウザが同じ名前のラジオをグループにまとめ、選択値はFormDataからそのまま取り出せます。',
  'components.autocomplete.description': '入力補完付きの選択フィールド',
  'components.autocomplete.disabledTitle': '無効',
  'components.autocomplete.invalidTitle': 'エラー',
  'components.autocomplete.requiredTitle': '必須',
  'components.autocomplete.multipleSelectionTitle': '複数選択',
  'components.slider.description': '単一ノブのスライダー入力',
  'components.slider.minMaxStepTitle': '最小値 / 最大値 / ステップ',
  'components.slider.disabledTitle': '無効',
  'components.fileField.description': 'ファイルアップロードフィールド',
  'components.fileField.acceptTypesTitle': '受け入れタイプ',
  'components.fileField.multipleFilesTitle': '複数ファイル',
  'components.fileField.disabledTitle': '無効',
  'components.fileField.invalidTitle': 'エラー',
  'components.formControl.description':
    'ラベルやエラー表示を付けるフォームラッパー',
  'components.formControl.helpTextTitle': 'ヘルプテキスト',
  'components.formControl.errorTextTitle': 'エラーテキスト',
  'components.formControl.requiredTitle': '必須',
  'components.formControl.disabledTitle': '無効',
  'components.form.description':
    'form actionパターンで送信を扱うフォームラッパー',
  'components.form.actionStateTitle': 'useActionStateと組み合わせる',
  'components.accordion.description': '折りたたみできるコンテンツパネル',
  'components.accordion.defaultOpenTitle': 'デフォルトで開く',
  'components.avatar.description': 'フォールバック付きのプロフィール画像',
  'components.avatar.withImageTitle': '画像付き',
  'components.avatar.sizesTitle': 'サイズ',
  'components.badge.description':
    'ステータスやカテゴリを示すコンパクトなラベル',
  'components.badge.tonesTitle': 'トーン',
  'components.badge.variantsTitle': 'バリアント',
  'components.badge.interactiveTitle': 'インタラクティブ',
  'components.card.description': 'コンテンツをまとめるカード',
  'components.card.widthTitle': 'Width',
  'components.card.interactiveDescription':
    'interactiveを付けるとホバー・アクティブ時にスケールする。カード全体をリンクやボタンにする際に使う。',
  'components.code.description': 'インラインのコード表示',
  'components.code.colorDetectionTitle': 'カラー検出',
  'components.table.description':
    '意味論を保ちつつ横スクロールにも対応するテーブル',
  'components.table.emptyStateTitle': '空状態',
  'components.listBox.description': 'ドロップダウン形式のリスト選択',
  'components.progress.description': '進捗バー',
  'components.progress.differentValuesTitle': '異なる値',
  'components.progress.withLabelTitle': 'ラベル付き',
  'components.heading.description': '見出し',
  'components.heading.typesTitle': 'タイプ',
  'components.heading.lineClampTitle': '行数制限',
  'components.alert.description': 'ステータスに応じたメッセージを示すアラート',
  'components.alert.statusesTitle': 'ステータス',
  'components.alert.dismissibleTitle': '閉じられるアラート',
  'components.alert.actionTitle': 'アクション（テキストリンク）',
  'components.skeleton.description': '読み込み前のプレースホルダー',
  'components.skeleton.shapesTitle': '形状',
  'components.skeleton.sizesTitle': 'サイズ',
  'components.skeleton.animationTitle': 'アニメーション',
  'components.spinner.description': 'ローディングスピナー',
  'components.spinner.sizesTitle': 'サイズ',
  'components.toast.description': '一時的な通知メッセージのトースト',
  'components.tooltip.description': 'ホバーで補足情報を出すツールチップ',
  'components.dialog.description': 'ダイアログ',
  'components.drawer.description': '画面端からスライドインするドロワー',
  'components.modal.description': 'モーダルダイアログ',
  'components.popover.description': '要素に紐づくフローティングコンテンツ',
  'components.dropdownMenu.description': 'ドロップダウンメニュー',
  'components.dropdownMenu.iconTriggerTitle': 'アイコントリガー',
  'components.separator.description': '区切り線',
  'components.separator.orientationsTitle': '方向',
  'components.separator.colorsTitle': 'カラー',
  'components.stack.description':
    '子要素を縦または横に等間隔で並べるレイアウトプリミティブ',
  'components.stack.directionTitle': '方向',
  'components.stack.gapTitle': '間隔',
  'components.stack.alignTitle': '整列と分配',
  'components.grid.description':
    'CSSグリッドで子要素を並べるレイアウトプリミティブ。列数固定、auto-fill / auto-fitに対応',
  'components.grid.colsTitle': '列数指定',
  'components.grid.autoFillTitle': 'Auto-fill',
  'components.grid.autoFillDescription':
    'cols="auto-fill" / "auto-fit" のとき、minItemSizeで各セルの最小幅を指定するとグリッドがレスポンシブにリフローする。',
  'components.tabs.description': 'タブ切り替え',
  'components.tabs.defaultSelectedTitle': 'デフォルト選択',
  'components.breadcrumb.description': 'ナビゲーションのパンくずリスト',
  'components.breadcrumb.sizesTitle': 'サイズ',
  'components.pagination.description':
    '前後移動と現在位置を示すページネーション',
  'components.pagination.disabledTitle': '無効',
  'components.scrollLinked.description':
    'スクロール位置に連動するプログレスバー',
  'components.icons.description': 'k8ordo UIが提供するアイコン一覧',
  'components.icons.sizesTitle': 'サイズ',
  'components.icons.propsDescription':
    'すべてのアイコンは共通で`size`を受け取ります。向きを持つ`ChevronIcon`と、ステータスを表す`AlertIcon`だけは追加のpropsがあります。',
  'components.common.basicUsageTitle': '基本的な使い方',
  'components.modal.sideTitle': '配置',
  'components.toast.useToastTitle': 'useToastフック',
  'components.popover.placementTitle': '配置',
  'components.tooltip.placementTitle': '配置',
  'components.listBox.sizesTitle': 'サイズ',
  'components.listBox.iconTriggerTitle': 'アイコントリガー',
  'components.modal.defaultOpenTitle': 'デフォルトで開く',
  'components.modal.portalRootTitle': 'トップレイヤーとPortal',
  'components.modal.portalRootDescription':
    'Modalはブラウザのトップレイヤー（`dialog`要素）に表示されるため、`document.body`へポータルした要素はModalの背面に隠れます。Modalは自身の`dialog`要素をPortalのルートとしてコンテキストで提供しており、`usePortalRoot`で取得してポータル先にすれば、Modalの中でも浮遊UIが正しく前面に表示されます。Modal内の`useToast`は自動的にこの仕組みで表示されるので、対応が必要なのは自前でポータルを使う場合だけです。',
  'components.dropdownMenu.sizesTitle': 'サイズ',
  'components.dropdownMenu.placementTitle': '配置',
  'components.drawer.customContentTitle': 'カスタムコンテンツ',
  'components.dialog.alertDialogTitle': 'アラートダイアログ',
  'components.alert.multipleMessagesTitle': '複数メッセージ',
  'components.accordion.multipleDefaultOpenTitle': '複数デフォルトで開く',
  'components.breadcrumb.currentPageTitle': '現在のページ',
  'components.toast.closeAllTitle': 'すべて閉じる',
  'components.scrollLinked.windowScrollTitle': 'ウィンドウスクロール',
  'hooks.description': 'k8ordo UIが提供するカスタムフックの一覧です。',
  'hooks.categoryDomInteraction': 'DOM操作',
  'hooks.categoryStateStorage': '状態・ストレージ',
  'hooks.categoryTiming': 'タイミング',
  'hooks.categoryUtility': 'ユーティリティ',
  'hooks.categoryObserver': 'オブザーバー',
  'hooks.common.importTitle': 'インポート',
  'hooks.common.usageTitle': '使い方',
  'hooks.common.basicUsageTitle': '基本的な使い方',
  'hooks.common.parametersTitle': 'パラメーター',
  'hooks.common.returnValueTitle': '戻り値',
  'hooks.useClickAway.description': '指定要素の外側のクリックを検出するフック',
  'hooks.useClient.description': 'クライアントで実行中かどうかを返すフック',
  'hooks.useClipboard.description': 'クリップボードの読み書きを提供するフック',
  'hooks.useHash.description': 'URLハッシュを追跡し変更に反応するフック',
  'hooks.useInterval.description': '一定間隔でコールバックを実行するフック',
  'hooks.useLocalStorage.description':
    'localStorageに状態を永続化しタブ間で同期するフック',
  'hooks.useLocalStorage.removeTitle': '値の削除',
  'hooks.useSessionStorage.description':
    'sessionStorageに状態を永続化するフック',
  'hooks.useSessionStorage.removeTitle': '値の削除',
  'hooks.useResize.description':
    'ResizeObserverで要素のサイズ変更を監視するフック',
  'hooks.useScrollDirection.description':
    '現在のスクロール方向を検出するフック',
  'hooks.useScrollDirection.targetTitle': '要素を指定する',
  'hooks.useScrollDirection.bodyNotScrollableNote':
    'このページのbodyはスクロールしないため、ここでは動作を試せません。実際のスクロール可能なページでご確認ください。',
  'hooks.useStep.description': 'キーボード対応のステップナビゲーションフック',
  'hooks.useTimeout.description': '指定遅延後にコールバックを実行するフック',
  'hooks.useWindowResize.description':
    'ウィンドウのリサイズイベントを監視するフック',
  'hooks.useBreakpoint.description':
    'ビューポートが指定ブレイクポイントに一致するか判定するフック',
  'hooks.useDebouncedTransition.description':
    'delay経過後にstartTransitionでアクションを実行するフック',
  'hooks.useDeferredDebounce.description':
    'useDeferredValueをラップし値とペンディング状態を返すフック',
  'hooks.useDisclosure.description':
    'open・close・toggleで開閉状態を管理するフック',
  'hooks.useIntersectionObserver.description':
    'IntersectionObserverで要素の可視状態を監視するフック',
  'hooks.useInView.description':
    '要素がビューポート内に表示されているかを返すフック',
  'hooks.useWindowSize.description': '現在のウィンドウサイズを返すフック',
  'hooks.useScrollLock.description':
    'bodyや指定要素のスクロールをロック・解除するフック',
  'hooks.useScrollLock.targetTitle': '要素を指定する',
  'hooks.useScrollLock.bodyNotScrollableNote':
    'このページのbodyはスクロールしないため、ここでは動作を試せません。実際のスクロール可能なページでご確認ください。',
  'hooks.useHover.description': '要素のホバー状態を検出するフック',
  'hooks.useControllableState.description':
    'controlled/uncontrolledの状態を管理するフック',
  'hooks.useWritingMode.description':
    '要素のwriting-modeを監視しhorizontal/verticalを返すフック',
  'helpers.description': 'k8ordo UIが提供するヘルパー関数の一覧です。',
  'helpers.categoryStyling': 'スタイリング',
  'helpers.categoryReact': 'React',
  'helpers.common.importTitle': 'インポート',
  'helpers.common.usageTitle': '使い方',
  'helpers.common.basicUsageTitle': '基本的な使い方',
  'helpers.common.parametersTitle': 'パラメーター',
  'helpers.common.returnValueTitle': '戻り値',
  'helpers.cn.description':
    'clsxとtailwind-mergeを組み合わせたクラス名ユーティリティ',
  'helpers.mergeRefs.description':
    '複数のrefを1つの要素に結合するユーティリティ',
  'helpers.mergeProps.description':
    'classNameやイベントハンドラを適切にマージして複数のpropsを合成するユーティリティ',
  'helpers.chain.description':
    '複数の関数を順番に呼び出す関数を作るユーティリティ',
  'helpers.createSafeContext.description':
    'Provider外アクセス時に明確にthrowするContextを作るユーティリティ',
  'theming.introduction':
    'k8ordo UIは、CSS変数ベースのデザイントークンシステムを使用しています。ライトモードとダークモードの両方に対応し、カスタマイズが容易です。',
  'theming.colorPaletteTitle': 'カラーパレット',
  'theming.colorPaletteDescription':
    '10色のベースカラーファミリーがあり、各色に50〜950の11段階のシェードが用意されています。',
  'theming.semanticColorsTitle': 'セマンティックカラー',
  'theming.semanticColorsDescription':
    'ベースカラーをもとにした用途別のカラートークンです。テーマ切り替え時に自動的に適切な値に変わります。',
  'theming.foregroundTitle': '前景色（Foreground）',
  'theming.backgroundTitle': '背景色（Background）',
  'theming.borderTitle': 'ボーダー（Border）',
  'theming.brandColorsTitle': 'ブランドカラー',
  'theming.brandColorsDescription':
    'PrimaryはTeal、SecondaryはCyanをベースとしたブランドカラーです。',
  'theming.token.fg-base': '基本のテキスト',
  'theming.token.fg-subtle': 'プレースホルダーなど最も弱いテキスト',
  'theming.token.fg-mute': '説明文やキャプションなどの補足テキスト',
  'theming.token.fg-inverse': '反転背景（bg-inverse）の上に置くテキスト',
  'theming.token.fg-info': '情報メッセージのテキスト',
  'theming.token.fg-success': '成功メッセージのテキスト',
  'theming.token.fg-warning': '警告メッセージのテキスト',
  'theming.token.fg-error': 'エラーメッセージのテキスト',
  'theming.token.bg-base': 'カードなど主要な面の背景',
  'theming.token.bg-raised': 'メニューやポップオーバーなど浮き上がる面',
  'theming.token.bg-surface': 'ページ全体の背景',
  'theming.token.bg-subtle': 'セクションの地など一段沈んだ背景',
  'theming.token.bg-mute': 'ホバー状態の背景',
  'theming.token.bg-emphasize': 'アクティブ状態の背景',
  'theming.token.bg-inverse': '反転背景。fg-inverseと組み合わせる',
  'theming.token.bg-info': '情報メッセージの背景',
  'theming.token.bg-success': '成功メッセージの背景',
  'theming.token.bg-warning': '警告メッセージの背景',
  'theming.token.bg-error': 'エラーメッセージの背景',
  'theming.token.border-base': '入力欄など標準のボーダー',
  'theming.token.border-subtle': 'ごく薄い罫線',
  'theming.token.border-mute': '区切り線などの控えめな罫線',
  'theming.token.border-emphasize': 'ホバー時などの強調ボーダー',
  'theming.token.border-inverse': '反転面の上に引くボーダー',
  'theming.token.border-info': '情報ボーダー。フォーカスリングにも使用',
  'theming.token.border-success': '成功状態のボーダー',
  'theming.token.border-warning': '警告状態のボーダー',
  'theming.token.border-error': 'エラー状態のボーダー',
  'theming.token.primary-fg': 'Primaryのテキストとアイコン',
  'theming.token.primary-bg': 'Primaryの塗り。ソリッドボタンなどに',
  'theming.token.primary-bg-subtle': '最も薄いPrimary背景。選択状態の地に',
  'theming.token.primary-bg-mute': '控えめなPrimary背景',
  'theming.token.primary-bg-emphasize': 'ホバー時などの強いPrimary背景',
  'theming.token.primary-border': 'Primaryのボーダーとアクセント線',
  'theming.token.secondary-fg': 'Secondaryのテキストとアイコン',
  'theming.token.secondary-bg': 'Secondaryの塗り',
  'theming.token.secondary-bg-subtle': '最も薄いSecondary背景',
  'theming.token.secondary-bg-mute': '控えめなSecondary背景',
  'theming.token.secondary-bg-emphasize': 'ホバー時などの強いSecondary背景',
  'theming.token.secondary-border': 'Secondaryのボーダー',
  'theming.token.group-primary': 'データ可視化の系列色1',
  'theming.token.group-secondary': 'データ可視化の系列色2',
  'theming.token.group-tertiary': 'データ可視化の系列色3',
  'theming.token.group-quaternary': 'データ可視化の系列色4',
  'theming.typographyTitle': 'タイポグラフィ',
  'theming.typographyDescription':
    'テキストサイズ、フォントウェイト、レタースペーシング、行の高さのデザイントークンです。',
  'theming.textSizesTitle': 'テキストサイズ',
  'theming.fontWeightsTitle': 'フォントウェイト',
  'theming.letterSpacingTitle': 'レタースペーシング',
  'theming.lineHeightTitle': '行の高さ',
  'theming.shadowTitle': 'シャドウ',
  'theming.shadowDescription': 'ボックスシャドウのデザイントークンです。',
  'theming.borderRadiusTitle': 'ボーダーラディウス',
  'theming.borderRadiusDescription': '角丸のデザイントークンです。',
  'theming.darkModeTitle': 'ダークモード',
  'theming.darkModeDescription':
    'ルート要素にdarkクラスを追加することで、ダークモードが有効になります。セマンティックカラートークンは自動的にダークモード用の値に切り替わります。',
  'theming.customizeTitle': 'トークンを上書きする',
  'theming.customizeDescription':
    'すべてのトークンはCSS変数なので、k8ordo UIのスタイルシートより後に読み込むCSSで同名の変数を再定義すれば上書きできます。ベースカラーの変数（`--purple-200`など）も定義済みなので、参照を差し替えるだけでブランドカラーを丸ごと切り替えられます。ダークモードの値は`.dark`側で再定義します。',
  'theming.customizeValueDescription':
    'シェードの参照ではなく、値そのものを直接指定することもできます。',
  'theming.spacingTitle': 'スペーシング',
  'theming.spacingDescription':
    'スペーシングスケールです。基本単位は0.25rem（4px）で、p-{n}やgap-{n}はn × 0.25remに計算されます。',
  'theming.breakpointsTitle': 'ブレイクポイント',
  'theming.breakpointsDescription': 'レスポンシブブレイクポイントです。',
  'theming.zIndexTitle': 'Z-Indexレイヤ',
  'theming.zIndexDescription':
    'オーバーレイ系コンポーネントの重なり順を定義する3層スケールです。triggerに紐付く浮遊UI（Popover / DropdownMenu / ListBox / Tooltip）はoverlay、Modal / Drawerはmodal、Toastはtoastに配置されます。',
  'i18n.introduction':
    'コンポーネントが自前で描画する文言（閉じるボタンのラベル、必須バッジ、読み込み中の読み上げなど）は文言辞書から引かれます。辞書を差し替えれば、アプリのコードを変えずに言語や語彙を切り替えられます。',
  'i18n.defaultTitle': '既定は日本語',
  'i18n.defaultDescription':
    '設定は不要です。UIProviderを置くだけで日本語の辞書が使われ、Providerを置いていない場合も同じ日本語にフォールバックします。',
  'i18n.englishTitle': '英語に切り替える',
  'i18n.englishDescription':
    '@k8ordo/ui/i18nからenを読み込み、messagesに渡します。jaも同じ場所から読み込めます。',
  'i18n.overrideTitle': '一部だけ差し替える',
  'i18n.overrideDescription':
    'messagesはPartial<Messages> です。渡したキーだけが上書きされ、残りは日本語の既定辞書で埋まります。英語をベースに一部だけ変えたいときはenを展開してから重ねます。',
  'i18n.priorityTitle': '優先順位',
  'i18n.priorityDescription':
    '同じ文言を決める経路は3つあり、prop > 辞書 > 既定 の順に強くなります。個別のprops（Spinnerのlabelなど）は常に辞書より優先されるので、1箇所だけ違う文言にしたいときはそちらを使ってください。',
  'i18n.customTitle': '独自の辞書を作る',
  'i18n.customDescription':
    'Messages型を注釈すれば、キーの過不足はコンパイル時に検出されます。ライブラリにキーが増えたときも型エラーで気付けます。',
  'i18n.keysTitle': 'キー一覧',
  'i18n.keysDescription':
    'Messagesが持つキーの全てです。値はライブラリの辞書そのものを読み込んで表示しています。',
  'i18n.keyColumn': 'キー',
  'i18n.usedByColumn': '使うコンポーネント',
  'i18n.jaColumn': 'ja（既定）',
  'i18n.enColumn': 'en',
  'sideNav.openNavigation': 'ナビゲーションを開く',
  'common.switchToDarkMode': 'ダークモードに切り替え',
  'common.switchToLightMode': 'ライトモードに切り替え',
  'common.switchToVerticalWriting': '縦書きプレビューに切り替え',
  'common.switchToHorizontalWriting': '横書きプレビューに切り替え',
  'notFound.title': 'ページが見つかりません',
  'notFound.description': 'URLが変わったか、削除された可能性があります。',
  'error.title': '問題が発生しました',
  'error.description': '予期しないエラーが発生しました。',
  'error.retry': '再読み込み',
} as const satisfies Record<MessageKey, string>;

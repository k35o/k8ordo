---
'@k8ordo/ui': major
---

アイコンを自作の線画に替え、入口を`@k8ordo/ui/icons`に分けました。`lucide-react`への依存は無くなります。アイコンは1つずつ別のモジュールになり、どれもServer Componentのまま描けます（lucideのアイコンはcontextを読むClient Componentでした）。

- rootの入口（`@k8ordo/ui`）はアイコンをexportしなくなりました。`import { XIcon } from '@k8ordo/ui/icons'`と書きます。
- 名前を用途から形に改めました。`CloseIcon`→`XIcon`、`ViewIcon`→`EyeIcon`、`ViewOffIcon`→`EyeClosedIcon`、`DarkModeIcon`→`MoonIcon`、`LightModeIcon`→`SunIcon`、`PublishDateIcon`→`CalendarIcon`、`UpdateDateIcon`→`ClockIcon`、`SubscribeIcon`→`BookmarkIcon`、`NewsIcon`→`BellIcon`、`PrepareIcon`→`RocketIcon`、`BlogIcon`→`BookTextIcon`、`SlideIcon`→`PresentationIcon`、`LocationIcon`→`MapPinIcon`、`CodeXmlIcon`→`CodeIcon`、`RSSIcon`→`RssIcon`、`HorizontalWritingIcon`→`TextHorizontalIcon`、`VerticalWritingIcon`→`TextVerticalIcon`、`GoodIcon`→`ThumbsUpIcon`、`BadIcon`→`ThumbsDownIcon`、`InterestingIcon`→`SmileIcon`、`InformativeIcon`→`LightbulbIcon`、`MixedColorIcon`→`BlendIcon`、`ColorInfoIcon`→`PaintBucketIcon`、`ColorContrastIcon`→`ContrastIcon`、`AIIcon`→`BotIcon`、`AssistantIcon`→`BotMessageIcon`、`NavigationMenuIcon`→`MenuIcon`、`ForkIcon`→`GitForkIcon`、`FullscreenIcon`→`MaximizeIcon`。意味から絵を選ぶのは`AlertIcon`（`status`）と`ChevronIcon`（`direction`）だけです。
- `FormIcon`、`AccessibilityIcon`、`AtomIcon`、`BoringIcon`、`EasyIcon`、`DifficultIcon`、`ShallowIcon`を消しました。
- ロゴ（`Logo`、`LogoIcon`、`GitHubIcon`、`TwitterIcon`、`QiitaIcon`、`ChromeIcon`、`EdgeIcon`、`FirefoxIcon`、`SafariIcon`）を外しました。ロゴは使う側で持ちます。`BaseIcon`を`@k8ordo/ui/icons`から出したので、自分の`<svg>`にほかのアイコンと同じ`size`の刻みを付けられます。
- 検索、設定、人、家、鉛筆、ごみ箱、矢印、ダウンロードなど、どのアプリケーションでも使う形を足しました。全部で102個と、`AlertIcon`、`ChevronIcon`です。
- 生成UIのカタログでは、`Icon`の`name`が`size`だけで描けるアイコンの全部になりました。名前はアイコンの名前をケバブケースにしたもので、`close`は`x`、`publish-date`は`calendar`、`view-off`は`eye-closed`です。`logo`、`github`、`twitter`、`qiita`と、消したアイコンの名前は使えません。

import { library } from '@k8ordo/ui/openui';
import { Renderer } from '@openuidev/react-lang';

/**
 * 注: OpenUI は型付き子要素。Card は Stack を内包できる（root を Card にして全体を包む）。
 * Stack 自身の入れ子は非対応。引数は位置引数（props 定義順）なので、途中の
 * 省略したい引数は詰めずに null で埋める（詰めると以降が 1 つずつずれる）。
 */
export const openUiResponse = `root = Card("full", "outline", null, null, [main])
main = Stack("column", "lg", null, null, null, [crumbs, heading, alert, save, cancel, help, badge, prog, table, accordion, sep, plan, size, vol, detail, nickname, bio, pw, qty, agree, notify, pager])
crumbs = Breadcrumb(null, [{label: "Home", href: "/"}, {label: "Profile", current: true}])
heading = Heading("プロフィール設定", "h3")
alert = Alert("info", "この画面は OpenUI Lang から描画されています")
save = Button("保存")
cancel = Button("キャンセル", "outline", "secondary")
help = Button("ヘルプ", "outline", "base", null, null, "https://example.com")
badge = Badge("有効", "success")
prog = Progress(70, 100, null, "完了度")
table = Table("プラン比較", [{label: "プラン"}, {label: "料金", align: "right"}], [["Free", "¥0"], ["Pro", "¥1,000"]])
accordion = Accordion([{title: "よくある質問", content: "回答テキスト。", defaultOpen: true}])
sep = Separator()
plan = Select("plan", [{value: "free", label: "Free"}, {value: "pro", label: "Pro"}, {value: "team", label: "Team"}], "pro")
size = Radio("size", "サイズ", [{value: "s", label: "S"}, {value: "m", label: "M"}, {value: "l", label: "L"}], "m")
vol = Slider("vol", 50, 0, 100)
detail = Tabs("詳細", [{label: "概要", content: "OpenUI Lang から Tabs を描画しています。"}, {label: "料金", content: "Pro プランは月額 1,000 円です。"}])
nickname = TextField("nickname", "ニックネーム")
bio = Textarea("bio", "自己紹介", null, null, null, null, 3)
pw = PasswordInput("pw", "パスワード")
qty = NumberField("qty", 3, 0, 10)
agree = Checkbox("agree", "規約に同意する")
notify = Switch("notify", "通知を受け取る", true)
pager = Pagination("page", 5)`;

export function OpenUiDemo() {
  return <Renderer library={library} response={openUiResponse} />;
}

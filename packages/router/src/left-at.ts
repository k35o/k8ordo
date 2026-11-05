// 戻る・進むの位置はブラウザに戻させず、離れたときの位置を覚えて自分で置く。
// Chromium は intercept した traverse の URL を handler より先に確定させ、
// handler が解けるまでに位置が変わると、それを行き先の entry の保存した位置に
// 書いてから戻す。新しいページの描画で layout が走ると、前のページの位置が
// 新しいページで下げられる量に切り詰められ、その下端に戻ってしまう

export type Position = { readonly left: number; readonly top: number };

const positions = new Map<string, Position>();

// 読み直しのあとも、それより前に作った entry へは同じ文書のまま戻る。entry の
// key は読み直しをまたいで変わらないので、タブの sessionStorage にも写す
const STORAGE_KEY = '@k8ordo/router:left-at';

// 間引くのは上限を超えたときだけ。entries() はその文書から続く同じ origin の
// entry しか並べないので、そのたびに間引くと、別のサイトから入り直した文書で
// 別のサイトより前の entry の位置まで消える。捨てられた entry の key がほかの
// entry に付くことはなく、間引くのは大きさのためだけ。どのエンジンも 1 つの
// タブの履歴に 100 件より多くは持たない
const LIMIT = 100;

export const restoreLeftAt = (): void => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === null) return;
    for (const [entry, position] of JSON.parse(saved) as Array<
      [string, Position]
    >) {
      positions.set(entry, position);
    }
  } catch {
    // 読めなければ、覚えていないのと同じ
  }
};

export const leftAt = (entry: string): Position | undefined =>
  positions.get(entry);

export const rememberLeftAt = (entry: string): void => {
  // Map は入れた順に並ぶ。離れ直した entry を後ろへ移し、古いものを前から捨てる
  positions.delete(entry);
  positions.set(entry, { left: window.scrollX, top: window.scrollY });
  if (positions.size > LIMIT) {
    // 移っては戻ると、切り捨てられた entry の key が戻れる entry の間に積もる。
    // 古さだけで捨てると、一度離れたきりの戻れる entry が先に押し出される
    const listed = new Set(navigation.entries().map(({ key }) => key));
    const keys = [...positions.keys()];
    for (const key of [...keys.filter((k) => !listed.has(k)), ...keys]) {
      if (positions.size <= LIMIT) break;
      positions.delete(key);
    }
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...positions]));
  } catch {
    // 書けなくても、この文書のあいだは覚えている
  }
};

import { wait } from '../../../lib/wait';

// 画面に出ている loading.tsx の下へ遷移して、データを待つページ。待ち時間は
// slow と同じ考えで取る
export default async function TardyPage() {
  await wait(5000);
  return <h1>tardy</h1>;
}

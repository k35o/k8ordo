'use server';

// 静的化が受け取れない Server Action。どのページからも import しないので
// ビルドには入らず、dev サーバが名指しで変換したときだけ拒否が出る
export const leaveMessage = async (message: string): Promise<string> => {
  // RSC 側は async な関数しか Server Action にしない
  await Promise.resolve();
  return message;
};

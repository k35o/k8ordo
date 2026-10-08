// データベースの往復の代わり。ページはこれを待ってから答える
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// products の下のページを Suspense で包む。ページのデータが来るまでの間、
// クライアント遷移でここに入ったときにこれが出る
export default function ProductsLoading() {
  return <p data-testid="loading">loading products…</p>;
}

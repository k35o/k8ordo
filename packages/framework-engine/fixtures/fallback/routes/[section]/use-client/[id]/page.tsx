export default function ClientPage({ params }: { params: { id: string } }) {
  return <p>client {params.id}</p>;
}

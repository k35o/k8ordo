export default function GonePage({ params }: { params: { id: string } }) {
  return <p>gone {params.id}</p>;
}

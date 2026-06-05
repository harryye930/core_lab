import Poster from '@/Components/Publications/Poster';

export default async function PosterPage({ params }) {
  const { doi } = await params;
  return <Poster doi={doi} />;
}

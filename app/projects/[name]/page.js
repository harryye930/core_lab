import Project from '@/Components/All_Projects/Project';

export default async function ProjectPage({ params }) {
  const { name } = await params;
  return <Project name={name} />;
}

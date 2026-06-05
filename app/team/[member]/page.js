import Member from '@/Components/All_Team/Member';

export default async function MemberPage({ params }) {
  const { member } = await params;
  return (
    <div>
      <div className='min-w-0'>
        <Member member={member} />
      </div>
    </div>
  )
}

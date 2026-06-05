import Members from '@/Components/All_Team/Team';
import Sidebar from '@/Components/All_Team/Sidebar';

export default function Team() {
  return (
    <div className='mx-auto flex w-full max-w-7xl'>
      <Sidebar/>
      <div className='min-w-0 flex-1'>
        <Members/>
      </div>
    </div>
  );
}

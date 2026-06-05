import Papers from '@/Components/Publications/Papers';
import Posters from '@/Components/Publications/Posters';
import Sidebar from '@/Components/Publications/Sidebar';

export default function Publications() {
  return (
    <div className="mx-auto flex w-full max-w-7xl">
      <Sidebar/>
      <div className="min-w-0 flex-1">
        <Posters/>
        <Papers/>
      </div>
    </div>
  );
}

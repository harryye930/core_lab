import Image from 'next/image';
import Link from 'next/link'
import { memberGroups } from '@/data/members';

const MemberCard = ({ person }) => (
  <Link href={person.link} className="group block">
    <article className="rounded-lg border border-slate-200 px-5 py-5 transition duration-200 hover:border-[#7b94b6] hover:bg-slate-50 hover:shadow-sm">
      <div className="flex items-center">
        <div className="h-[96px] w-[96px] flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
          <Image
            src={person.image}
            alt={person.name}
            className="h-full w-full object-cover object-center"
            sizes="96px"
          />
        </div>
        <div className="ml-5 min-w-0">
          <h3 className="m-0 font-semibold text-[#002a5c] group-hover:underline">{person.name}</h3>
          <p className="m-0 text-sm leading-6 text-slate-600">{person.position}</p>
        </div>
      </div>
    </article>
  </Link>
)

const Members = () => {
  return (
    <div className='w-full px-5 pb-10 sm:px-8 lg:pr-12'>
      {memberGroups.map((group) => (
        <section className="scroll-mt-24" id={group.id} key={group.id}>
          <h2 className='pt-8 text-3xl font-bold text-[#0a1588]'>{group.title}</h2>
          {group.people.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2">
              {group.people.map((person) => (
                <MemberCard person={person} key={person.link || person.name} />
              ))}
            </div>
          ) : (
            <p className="pt-4 text-slate-600">This archive is being updated.</p>
          )}
        </section>
      ))}
    </div>
  )
}

export default Members

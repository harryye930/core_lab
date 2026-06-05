const Sidebar = () => {
  return (
    <aside className='hidden w-56 shrink-0 py-5 pl-5 pr-5 lg:block lg:pl-12'>
        <nav className='sticky top-24 z-10 flex flex-col space-y-4 bg-white/80 backdrop-blur'>
            <a href="#posters" className='cursor-pointer border-b border-b-slate-200 pb-2 text-[#06264c] hover:text-[#0a1588]'>
                Posters
            </a>
            <a href="#papers" className='cursor-pointer border-b border-b-slate-200 pb-2 text-[#06264c] hover:text-[#0a1588]'>
                Papers
            </a>
        </nav>
    </aside>
  )
}

export default Sidebar

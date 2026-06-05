const SearchBar = ({ query, setQuery, placeholder = 'Search' }) => {
  return (
    <div className="mb-6 mt-5">
      <label htmlFor="publication-search" className="sr-only">
        Search publications
      </label>
      <input
        id="publication-search"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-[#0a1588] focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

export default SearchBar

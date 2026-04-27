import { useState } from 'react'

export function SearchBar({ placeholder = 'Search', className = '', onSearch, defaultValue = '' }) {
  const [q, setQ] = useState(defaultValue)
  return (
    <form
      className={className}
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch?.(q)
      }}
    >
      <label className="sr-only" htmlFor="global-search">
        {placeholder}
      </label>
      <input
        id="global-search"
        className="searchbar"
        value={q}
        placeholder={placeholder}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
    </form>
  )
}

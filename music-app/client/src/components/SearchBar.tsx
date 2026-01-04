type Props = {
  query: string;
  setQuery: (q: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  query,
  setQuery,
  placeholder = "Search songs, albums, artists…",
}: Props) {
  return (
    <div className="mt-6">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="
            w-full rounded-xl border border-zinc-800
            bg-zinc-900/70 px-4 py-3 pl-11
            text-sm text-zinc-200
            placeholder-zinc-500
            outline-none
            focus:border-violet-500/60
            focus:ring-1 focus:ring-violet-500/40
          "
        />

        {/* search icon */}
        <svg
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
    </div>
  );
}

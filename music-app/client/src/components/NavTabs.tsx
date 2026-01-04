type Page = "songs" | "albums" | "artists";

type Props = {
  page: Page;
  setPage: (p: Page) => void;
};

export default function NavTabs({ page, setPage }: Props) {
  const base =
    "rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:border-zinc-700";
  const active = "border-zinc-600";

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button className={`${base} ${page === "songs" ? active : ""}`} onClick={() => setPage("songs")}>
        Songs
      </button>
      <button className={`${base} ${page === "albums" ? active : ""}`} onClick={() => setPage("albums")}>
        Albums
      </button>
      <button className={`${base} ${page === "artists" ? active : ""}`} onClick={() => setPage("artists")}>
        Artists
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";

type Me = {
  id: number;
  username: string;
  role: "admin" | "listener" | "artist";
} | null;

type Props = {
  me: Me;
  page: Page;
  setPage: (p: Page) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenFavorites: () => void;
  onOpenCreate: () => void;
  onLogout: () => void;
};

export default function TopBar({
  me,
  page,
  setPage,
  onOpenLogin,
  onOpenRegister,
  onOpenFavorites,
  onOpenCreate,
  onLogout,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const canCreate = me?.role === "admin" || me?.role === "artist";
  const isContextPage = page === "favorites" || page === "create";

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const navItem = (p: Page, label: string) => (
    <button
      onClick={() => setPage(p)}
      className={`text-sm transition ${
        page === p
          ? "text-violet-400"
          : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setPage("songs")}
            className="text-lg font-semibold tracking-tight text-white"
          >
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Music App
            </span>
          </button>

          {!isContextPage && (
            <nav className="flex gap-6">
              {navItem("songs", "Songs")}
              {navItem("albums", "Albums")}
              {navItem("artists", "Artists")}
            </nav>
          )}

          {isContextPage && (
            <button
              onClick={() => setPage("songs")}
              className="text-sm text-zinc-400 hover:text-zinc-200"
            >
              ← Back
            </button>
          )}
        </div>

        {/* RIGHT */}
        {!me ? (
          <div className="flex gap-2">
            <button
              onClick={onOpenLogin}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-violet-500/60"
            >
              Sign in
            </button>
            <button
              onClick={onOpenRegister}
              className="rounded-md bg-violet-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-400"
            >
              Create account
            </button>
          </div>
        ) : (
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 hover:border-violet-500/60"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-xs font-medium text-white">
                {me.username.slice(0, 2).toUpperCase()}
              </span>
              <span className="hidden sm:block text-sm text-zinc-200">
                {me.username}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl">
                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenFavorites();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-violet-500/10"
                >
                  Favorites
                </button>

                {canCreate && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      onOpenCreate();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-violet-500/10"
                  >
                    Studio
                  </button>
                )}

                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

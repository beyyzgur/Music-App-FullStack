import { useEffect, useMemo, useState } from "react";
import TopBar from "./components/TopBar";
import AuthModal from "./components/AuthModal";
import AlbumFilter from "./components/AlbumFilter";
import SongsList from "./components/SongsList";

import { profile } from "./features/auth/auth.api";
import { getAlbums, type Album } from "./features/albums/albums.api";
import { getSongs, getSongsByAlbum, type Song } from "./features/songs/songs.api";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  type Favorite,
} from "./features/favorites/favorites.api";

import AlbumsPage from "./components/AlbumsPage";
import ArtistsPage from "./components/ArtistsPage";
import FavoritesPage from "./components/FavoritesPage";
import CreatePage from "./components/CreatePage";
import SearchBar from "./components/SearchBar";
import SongEditModal from "./components/SongEditModal";
import AlbumEditModal from "./components/AlbumEditModal";

/* ================= TYPES ================= */

export type Page =
  | "songs"
  | "albums"
  | "artists"
  | "favorites"
  | "create";

type Me = {
  id: number;
  username: string;
  role: "admin" | "listener" | "artist";
} | null;

/* ================= APP ================= */

export default function App() {
  const [me, setMe] = useState<Me>(null);

  const [songs, setSongs] = useState<Song[]>([]);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const favoriteIds = useMemo(
    () => new Set(favorites.map((f) => f.songId)),
    [favorites]
  );

  const [page, setPage] = useState<Page>("songs");
  const [error, setError] = useState<string | null>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  /* ================= DATA ================= */

  async function refreshProfile() {
  try {
    setMe(await profile());
  } catch {
    localStorage.removeItem("token");
    setMe(null);
  }
 }

 async function refreshAllAfterArtistUpdate() {
  const updatedMe = await profile(); // TEK KAYNAK
  setMe(updatedMe);

  await refreshAlbums();
  await refreshSongs();
}


  async function refreshSongs() {
    setError(null);
    try {
      setSongs(await getSongs());
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Songs fetch failed");
    }
  }

  async function refreshAlbums() {
    setError(null);
    try {
      setAlbums(await getAlbums());
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Albums fetch failed");
    }
  }

  async function filterSelectedAlbum() {
    setError(null);

    if (selectedAlbumId === "all") {
      await refreshSongs();
      return;
    }

    const id = Number(selectedAlbumId);
    if (!Number.isFinite(id)) return;

    try {
      setSongs(await getSongsByAlbum(id));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Album filter failed");
    }
  }

  async function refreshFavorites() {
    if (!me) return;
    try {
      setFavorites(await getFavorites());
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Favorites fetch failed");
    }
  }

  async function toggleFavorite(songId: number) {
    if (!me) return;

    try {
      if (favoriteIds.has(songId)) {
        await removeFavorite(songId);
      } else {
        await addFavorite(songId);
      }
      await refreshFavorites();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Favorite toggle failed");
    }
  }

  async function loadProfileIfToken() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setMe(await profile());
    } catch {
      localStorage.removeItem("token");
      setMe(null);
    }
  }

  /* ================= AUTH ================= */

  function openLogin() {
    setAuthMode("login");
    setAuthOpen(true);
  }

  function openRegister() {
    setAuthMode("register");
    setAuthOpen(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setMe(null);
    setFavorites([]);
    setPage("songs");
  }

  /* ================= EFFECTS ================= */

  useEffect(() => {
    refreshSongs();
    refreshAlbums();
    loadProfileIfToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!me) {
      setFavorites([]);
      return;
    }
    refreshFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <TopBar
          me={me}
          page={page}
          setPage={setPage}
          onOpenLogin={openLogin}
          onOpenRegister={openRegister}
          onLogout={logout}
          onOpenFavorites={() => setPage("favorites")}
          onOpenCreate={() => setPage("create")}
        />


        {page === "songs" && (
          <>
            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
            />

            <AlbumFilter
              albums={albums}
              selectedAlbumId={selectedAlbumId}
              setSelectedAlbumId={setSelectedAlbumId}
              onAllSongs={refreshSongs}
              onApply={filterSelectedAlbum}
              error={error}
            />

            <SongsList
              songs={songs}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              me={me}
              onEditSong={(song) => setEditingSong(song)}
            />
          </>
        )}

        {page === "albums" && (
          <AlbumsPage
            albums={albums}
            me={me}
            onSelectAlbum={(albumId) => {
              setSelectedAlbumId(String(albumId));
              getSongsByAlbum(albumId).then(setSongs);
              setPage("songs");
            }}
            onEditAlbum={(album) => setEditingAlbum(album)}
          />
        )}

        {page === "artists" && (
          <ArtistsPage
            me={me}
            onArtistUpdated={refreshAllAfterArtistUpdate}
          />
        )}

        {page === "favorites" &&
          (me ? (
            <FavoritesPage
              favorites={favorites}
              onRemove={async (songId) => {
                await removeFavorite(songId);
                await refreshFavorites();
              }}
            />
          ) : (
            <div className="mt-8 text-sm text-zinc-400">
              Please sign in to view your favorites.
            </div>
          ))}

          {page === "create" && me && (
            <CreatePage
              me={me}
              onAlbumCreated={async () => {
                await refreshAlbums();
                setPage("albums");
              }}
              onSongCreated={async () => {
                await refreshSongs();
                setPage("songs");
              }}
            />
          )}


        <AuthModal
          open={authOpen}
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onAuthed={(m) => setMe(m)}
        />

        {editingSong && (
          <SongEditModal
            song={editingSong}
            onClose={() => setEditingSong(null)}
            onUpdated={refreshSongs}
          />
      )}

      {editingAlbum && (
        <AlbumEditModal
          album={editingAlbum}
          onClose={() => setEditingAlbum(null)}
          onUpdated={refreshAlbums}
        />
      )}
      
      </div>
    </div>
  );
}

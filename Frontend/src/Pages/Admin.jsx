import { useEffect, useMemo, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { RiArrowRightLongLine } from "@remixicon/react";

const emptyDraft = { title: "", file: null };

const Admin = () => {

const [file, setfile] = useState("Select the image");
  const inputref = useRef();

  function formhandle(e) {
    e.preventDefault();
    const formdata = new FormData(e.target);
    axios.post("http://localhost:3000/upload", formdata).then((res) => {
      navigate("/feed");
    });
  }


  const navigate = useNavigate();
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    const fetchMyMusic = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          "http://localhost:3000/api/music/mine",
          {
            withCredentials: true,
          },
        );

        const tracks = response.data?.musics ?? [];
        setMusicList(tracks);

        const nextDrafts = {};
        tracks.forEach((track) => {
          nextDrafts[track._id] = { title: track.title, file: null };
        });
        setDrafts(nextDrafts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your music");
      } finally {
        setLoading(false);
      }
    };

    fetchMyMusic();
  }, []);

  const totalTracks = musicList.length;
  const totalAccentSpread = useMemo(
    () =>
      musicList.length
        ? new Set(musicList.map((music) => music.accentColor)).size
        : 0,
    [musicList],
  );

  const updateDraft = (id, field, value) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] || emptyDraft),
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (music) => {
    const draft = drafts[music._id] || emptyDraft;
    const formData = new FormData();

    if (draft.title.trim()) {
      formData.append("title", draft.title.trim());
    }

    if (draft.file) {
      formData.append("music", draft.file);
    }

    if (!draft.title.trim() && !draft.file) {
      return;
    }

    setSavingId(music._id);
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:3000/api/music/${music._id}`,
        formData,
        { withCredentials: true },
      );

      setMusicList((current) =>
        current.map((track) =>
          track._id === music._id ? response.data.music : track,
        ),
      );
      setDrafts((current) => ({
        ...current,
        [music._id]: { title: response.data.music.title, file: null },
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update the track");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (musicId) => {
    setDeletingId(musicId);
    setError("");

    try {
      await axios.delete(`http://localhost:3000/api/music/${musicId}`, {
        withCredentials: true,
      });

      setMusicList((current) =>
        current.filter((track) => track._id !== musicId),
      );
      setDrafts((current) => {
        const next = { ...current };
        delete next[musicId];
        return next;
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete the track");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,185,84,0.16),_transparent_28%),linear-gradient(180deg,_#061017_0%,_#04070b_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div className="flex flex-col justify-between gap-6">
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1db954] text-sm font-bold text-[#06110a]">
                  A
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/75">
                  Artist Studio
                </span>
              </div>

              <div className="max-w-2xl">
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#8cf0ad]">
                  Your releases
                </p>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Manage every track you&apos;ve published.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                  Update titles, replace audio, or remove songs you no longer
                  want live.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/feed")}
                  className="rounded-full bg-[#1db954] px-5 py-3 text-sm font-semibold text-[#06110a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#3ddf79]"
                >
                  Go to Feed
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Refresh List
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                  Tracks
                </p>
                <p className="mt-2 text-3xl font-semibold">{totalTracks}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                  Accent spread
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {totalAccentSpread}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                  Actions
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Edit titles, swap audio files, or delete posted tracks.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 flex-1 pb-2">
          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white/70">
              Loading your uploads...
            </div>
          ) : musicList.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white/70">
              No uploaded tracks yet. Upload a song to see it here.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {musicList.map((music) => {
                const draft = drafts[music._id] || emptyDraft;
                const accentColor = music.accentColor || "#1db954";
                const artistName =
                  music.artist?.username || music.artist?.email || "You";

                return (
                  <article
                    key={music._id}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl shadow-black/20"
                  >
                    <div
                      className="h-2"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="grid gap-5 p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.5rem] text-lg font-bold text-white uppercase shadow-lg shadow-black/30"
                          style={{ backgroundColor: accentColor }}
                        >
                          {music.title?.slice(0, 1) || "S"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-[0.3em] text-[#8cf0ad]">
                            Posted by {artistName}
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                            {music.title}
                          </h2>
                          <p className="mt-1 break-all text-sm text-white/65">
                            {music.uri}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <label className="block">
                          <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/50">
                            Edit title
                          </span>
                          <input
                            value={draft.title}
                            onChange={(event) =>
                              updateDraft(
                                music._id,
                                "title",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#1db954] focus:bg-black/30 focus:ring-2 focus:ring-[#1db954]/20"
                            placeholder="Song title"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/50">
                            Replace audio file
                          </span>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(event) =>
                              updateDraft(
                                music._id,
                                "file",
                                event.target.files?.[0] || null,
                              )
                            }
                            className="w-full rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-white/25"
                          />
                        </label>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleUpdate(music)}
                          disabled={savingId === music._id}
                          className="rounded-full bg-[#1db954] px-4 py-2.5 text-sm font-semibold text-[#06110a] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingId === music._id
                            ? "Saving..."
                            : "Save changes"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(music._id)}
                          disabled={deletingId === music._id}
                          className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === music._id
                            ? "Deleting..."
                            : "Delete track"}
                        </button>
                      </div>

                      <audio
                        controls
                        className="w-full rounded-2xl bg-black/30"
                      >
                        <source src={music.uri} type="audio/mpeg" />
                      </audio>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

    
        <Link to="/post">
          <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-zinc-700 bg-[#0C1014]/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-zinc-800">
            Create
            <RiArrowRightLongLine />
          </div>
        </Link>

        
    
    </main>
  );
};

export default Admin;

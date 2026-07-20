import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const loadPreferenceMap = (key) => {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : {};
  } catch {
    return {};
  }
};

const formatTime = (timeInSeconds) => {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const Feed = () => {
  const [musics, setmusics] = useState([]);
  const [albums, setalbums] = useState([])
  const audioRefs = useRef({});
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.82);

  useEffect(() => {
    axios.get("https://spotify-project-la1t.onrender.com/api/music/getmusic").then((res) => {
      setmusics(res.data.musics);
    });
  },[]);
  useEffect(()=>{
    axios.get("https://spotify-project-la1t.onrender.com/api/music/getalbums").then((res)=>{
      setalbums(res.data.albums)
      console.log(res.data.albums)
    });
  })

  const [liked, setLiked] = useState(() =>
    loadPreferenceMap("streamify-liked"),
  );
  const [disliked, setDisliked] = useState(() =>
    loadPreferenceMap("streamify-disliked"),
  );
  const [saved, setSaved] = useState(() =>
    loadPreferenceMap("streamify-saved"),
  );

  useEffect(() => {
    localStorage.setItem("streamify-liked", JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem("streamify-disliked", JSON.stringify(disliked));
  }, [disliked]);

  useEffect(() => {
    localStorage.setItem("streamify-saved", JSON.stringify(saved));
  }, [saved]);

  const totalSaved = useMemo(
    () => Object.values(saved).filter(Boolean).length,
    [saved],
  );

  const pauseOtherTracks = (currentId) => {
    Object.entries(audioRefs.current).forEach(([trackId, audioElement]) => {
      if (trackId !== currentId && audioElement && !audioElement.paused) {
        audioElement.pause();
      }
    });
  };

  const toggleLike = (id) => {
    setLiked((current) => ({ ...current, [id]: !current[id] }));
    setDisliked((current) => ({ ...current, [id]: false }));
  };

  const toggleDislike = (id) => {
    setDisliked((current) => ({ ...current, [id]: !current[id] }));
    setLiked((current) => ({ ...current, [id]: false }));
  };

  const toggleSave = (id) => {
    setSaved((current) => ({ ...current, [id]: !current[id] }));
  };

  const handlePlayPause = (id) => {
    const audioElement = audioRefs.current[id];

    if (!audioElement) {
      return;
    }

    if (activeTrackId === id && !audioElement.paused) {
      audioElement.pause();
      return;
    }

    pauseOtherTracks(id);
    audioElement.play();
    setActiveTrackId(id);
  };

  const handleTimeUpdate = (id) => {
    const audioElement = audioRefs.current[id];

    if (!audioElement) {
      return;
    }

    if (activeTrackId === id) {
      setCurrentTime(audioElement.currentTime);
      setDuration(audioElement.duration || 0);
    }
  };

  const handleSeek = (event) => {
    const audioElement = audioRefs.current[activeTrackId];

    if (!audioElement) {
      return;
    }

    const nextTime = Number(event.target.value);
    audioElement.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);

    Object.values(audioRefs.current).forEach((audioElement) => {
      if (audioElement) {
        audioElement.volume = nextVolume;
      }
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(29,185,84,0.18),_transparent_30%),linear-gradient(180deg,_#071015_0%,_#05080c_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <section className="mb-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div className="flex flex-col justify-between gap-6">
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1db954] text-sm font-bold text-[#06110a]">
                  S
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-white/75">
                  Streamify Feed
                </span>
              </div>

              <div className="max-w-2xl">
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#8cf0ad]">
                  Today&apos;s listening
                </p>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Browse every track in the feed.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                  Like the songs you want to replay, dislike the ones you want
                  to skip, and save tracks for later.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                    Songs
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{musics.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                    Saved
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{totalSaved}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                    Actions
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    Like / Dislike / Save
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0f1720] p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(29,185,84,0.2),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_30%)]" />
              <div className="relative flex h-full flex-col justify-between gap-4">
                <div className="overflow-hidden rounded-[1.4rem] border border-white/10">
                  <div className="aspect-[4/3] bg-[linear-gradient(135deg,_rgba(29,185,84,0.9),_rgba(9,15,20,0.95))] p-5">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/75">
                          Now playing
                        </span>
                        <span className="text-xs text-white/70">Live feed</span>
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-white/65">
                          Featured mood
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold">
                          Neon night sessions
                        </h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/75">
                          A feed built for long listens, quick likes, and tracks
                          you want to keep around.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#8cf0ad]">
                      Unlimited skips.
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      Higher quality audio. Offline listening. Upgrade your
                      experience.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#8cf0ad]">
                      Made for music lovers.
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      Where every note finds its listener.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <h1 className="text-4xl text-white/40  font-bold text-center p-4">
          Musics <br />
          "Discover the soundtrack to your day"
        </h1>
        <section className="grid flex-1 gap-4 overflow-auto pb-2 lg:grid-cols-2">
          {musics.map((music) => {
            const trackId = music._id;
            const isLiked = Boolean(liked[trackId]);
            const isDisliked = Boolean(disliked[trackId]);
            const isSaved = Boolean(saved[trackId]);
            const isPlaying = activeTrackId === trackId;
            const progress =
              duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

            return (
              <article
                key={trackId}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/7"
              >
                <div
                  className="h-2"
                  style={{ background: music.accentColor || "#1db954" }}
                />
                <div className="grid gap-5 p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.5rem] text-lg font-bold uppercase text-white shadow-lg shadow-black/30 transition duration-300 group-hover:scale-[1.03]"
                      style={{ background: music.accentColor || "#1db954" }}
                    >
                      {music.title.slice(0, 1)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#8cf0ad]">
                        Song {musics.indexOf(music) + 1}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        {music.title}
                      </h2>
                      <p></p>
                      <p className="mt-3 text-sm leading-6 text-white/65">
                        Handpicked tracks for every mood.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-black/30 p-4 shadow-inner shadow-black/20">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handlePlayPause(trackId)}
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white shadow-lg transition duration-200 hover:scale-105"
                        style={{ background: music.accentColor || "#1db954" }}
                        aria-label={isPlaying ? "Pause track" : "Play track"}
                      >
                        <span className="text-lg font-black">
                          {isPlaying && !audioRefs.current[trackId]?.paused
                            ? "❚❚"
                            : "▶"}
                        </span>
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] text-white/55">
                          <span className="truncate">{music.title}</span>
                          <span>
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          step="0.01"
                          value={isPlaying ? currentTime : 0}
                          onChange={handleSeek}
                          className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#1db954]"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
                      <span className="text-xs uppercase tracking-[0.25em] text-white/50">
                        Volume
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#1db954]"
                      />
                    </div>

                    <audio
                      ref={(node) => {
                        if (node) {
                          audioRefs.current[trackId] = node;
                          node.volume = volume;
                        }
                      }}
                      src={music.uri}
                      preload="metadata"
                      onPlay={() => {
                        pauseOtherTracks(trackId);
                        setActiveTrackId(trackId);
                      }}
                      onPause={() => {
                        if (activeTrackId === trackId) {
                          setActiveTrackId(null);
                        }
                      }}
                      onTimeUpdate={() => handleTimeUpdate(trackId)}
                      onLoadedMetadata={() => handleTimeUpdate(trackId)}
                      onEnded={() => {
                        if (activeTrackId === trackId) {
                          setActiveTrackId(null);
                          setCurrentTime(0);
                        }
                      }}
                    />
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                          Track actions
                        </p>
                        <p className="mt-1 text-sm text-white/70">
                          Mark your preference for this song.
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {music.duration}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => toggleLike(trackId)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                          isLiked
                            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200 shadow-lg shadow-emerald-500/10"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {isLiked ? "Liked" : "Like"}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleDislike(trackId)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                          isDisliked
                            ? "border-rose-400/40 bg-rose-400/15 text-rose-200 shadow-lg shadow-rose-500/10"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {isDisliked ? "Disliked" : "Dislike"}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSave(trackId)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                          isSaved
                            ? "border-amber-300/40 bg-amber-300/15 text-amber-100 shadow-lg shadow-amber-500/10"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3 text-sm text-white/65">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${isLiked ? "bg-emerald-400" : isDisliked ? "bg-rose-400" : "bg-white/30"}`}
                      />
                      <span>
                        {isLiked
                          ? "You like this track"
                          : isDisliked
                            ? "You marked this track as skip"
                            : "No preference selected yet"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        <h1 className="text-4xl text-white/40  font-bold text-center p-4 mt-10">
          Albums <br />
          "Curated collections for every listener."
        </h1>
        <section className="grid flex-1 gap-4 overflow-auto pb-2 lg:grid-cols-2">
          {albums.map((music) => {
            const trackId = music._id;
            const isLiked = Boolean(liked[trackId]);
            const isDisliked = Boolean(disliked[trackId]);
            const isSaved = Boolean(saved[trackId]);
            const isPlaying = activeTrackId === trackId;
            const progress =
              duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

            return (
              <article
                key={trackId}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/7"
              >
                <div
                  className="h-2"
                  style={{ background: music.accentColor || "#1db954" }}
                />
                <div className="grid gap-5 p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.5rem] text-lg font-bold uppercase text-white shadow-lg shadow-black/30 transition duration-300 group-hover:scale-[1.03]"
                      style={{ background: music.accentColor || "#1db954" }}
                    >
                      {music.title.slice(0, 1)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#8cf0ad]">
                        Album {albums.indexOf(music) + 1}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        {music.title}
                      </h2>
                      <p></p>
                      <p className="mt-3 text-sm leading-6 text-white/65">
                        Crazy Albums that wont let u leave.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-white/10 bg-black/30 p-4 shadow-inner shadow-black/20">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handlePlayPause(trackId)}
                        className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white shadow-lg transition duration-200 hover:scale-105"
                        style={{ background: music.accentColor || "#1db954" }}
                        aria-label={isPlaying ? "Pause track" : "Play track"}
                      >
                        <span className="text-lg font-black">
                          {isPlaying && !audioRefs.current[trackId]?.paused
                            ? "❚❚"
                            : "▶"}
                        </span>
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] text-white/55">
                          <span className="truncate">{music.title}</span>
                          <span>
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          step="0.01"
                          value={isPlaying ? currentTime : 0}
                          onChange={handleSeek}
                          className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#1db954]"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
                      <span className="text-xs uppercase tracking-[0.25em] text-white/50">
                        Volume
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#1db954]"
                      />
                    </div>

                    {music.musics.map(() => {
                      <audio
                        ref={(node) => {
                          if (node) {
                            audioRefs.current[trackId] = node;
                            node.volume = volume;
                          }
                        }}
                        src={music.musics}
                        preload="metadata"
                        onPlay={() => {
                          pauseOtherTracks(trackId);
                          setActiveTrackId(trackId);
                        }}
                        onPause={() => {
                          if (activeTrackId === trackId) {
                            setActiveTrackId(null);
                          }
                        }}
                        onTimeUpdate={() => handleTimeUpdate(trackId)}
                        onLoadedMetadata={() => handleTimeUpdate(trackId)}
                        onEnded={() => {
                          if (activeTrackId === trackId) {
                            setActiveTrackId(null);
                            setCurrentTime(0);
                          }
                        }}
                      />;
                    })}
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                          Track actions
                        </p>
                        <p className="mt-1 text-sm text-white/70">
                          Mark your preference for this song.
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {music.duration}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => toggleLike(trackId)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                          isLiked
                            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200 shadow-lg shadow-emerald-500/10"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {isLiked ? "Liked" : "Like"}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleDislike(trackId)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                          isDisliked
                            ? "border-rose-400/40 bg-rose-400/15 text-rose-200 shadow-lg shadow-rose-500/10"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {isDisliked ? "Disliked" : "Dislike"}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleSave(trackId)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${
                          isSaved
                            ? "border-amber-300/40 bg-amber-300/15 text-amber-100 shadow-lg shadow-amber-500/10"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3 text-sm text-white/65">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${isLiked ? "bg-emerald-400" : isDisliked ? "bg-rose-400" : "bg-white/30"}`}
                      />
                      <span>
                        {isLiked
                          ? "You like this track"
                          : isDisliked
                            ? "You marked this track as skip"
                            : "No preference selected yet"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default Feed;

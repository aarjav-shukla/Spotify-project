import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { RiArrowRightLongLine } from "@remixicon/react";

const Post = () => {
  const [file, setfile] = useState("Select the song");
  const inputref = useRef();
  const navigate = useNavigate();
  async function formhandle(e) {
    e.preventDefault();
    const formdata = new FormData(e.target);
    try {
      const res = await axios.post(
        "https://spotify-project-la1t.onrender.com/api/music/upload",
        formdata,
        { withCredentials: true },
      );

      navigate("/admin");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }
  }

  return (
    <div className="h-screen overflow-hidden w-full bg-[#0C1014] text-white">
      <Link to="/admin">
        <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-zinc-700 bg-[#0C1014]/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-zinc-800">
          Home
          <RiArrowRightLongLine />
        </div>
      </Link>

      <div className="flex h-full items-center justify-center px-4 py-4">
        <form
          onSubmit={formhandle}
          className="flex w-full max-w-5xl overflow-hidden rounded-4xl border border-zinc-800 bg-[#0C1014] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="hidden w-1/2 md:block">
            <img
              src="https://images.unsplash.com/photo-1777425939321-30c2dba85d0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI0fGlVSXNuVnRqQjBZfHxlbnwwfHx8fHw%3D"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-6 p-8 md:w-1/2 md:p-10">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                New SOng
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                Create a New Banger
              </h2>
            </div>

            <input
              required
              type="file"
              className="hidden"
              name="music"
              ref={inputref}
              onChange={(e) => {
                if (e.target.files[0]) {
                  setfile(e.target.files[0].name);
                }
              }}
            />
            <button
              type="button"
              className="w-full max-w-xs rounded-full border border-zinc-700 bg-[#0C1014] px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              onClick={() => {
                inputref.current.click();
              }}
            >
              {file}
            </button>

            <input
              required
              type="text"
              placeholder="Enter Title"
              name="title"
              className="w-full max-w-xs rounded-2xl border border-zinc-700 bg-[#0C1014] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <button
              className="w-full max-w-xs rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              type="submit"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;

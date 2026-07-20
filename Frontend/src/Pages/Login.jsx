import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";
import axios from "axios";

const initialForm = {
  username: "",
  email: "",
  password: "",
  role: "user",
};

const initialLoginForm = {
  identifier: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [authMode, setAuthMode] = useState("register");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await fetch("/api/auth/loginuser", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         username: form.identifier,
  //         email: form.identifier,
  //         password: form.password,
  //         role: form.role,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Login failed");
  //     }

  //     const targetRoute = data.user?.role === "artist" ? "/admin" : "/feed";
  //     navigate(targetRoute);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlesumbit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/registeruser",
        {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        },
        { withCredentials: true },
      );

      console.log(response.data);
      navigate(form.role === "artist" ? "/admin" : "/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/loginuser",
        {
          username: loginForm.identifier,
          email: loginForm.identifier,
          password: loginForm.password,
        },
        { withCredentials: true },
      );

      console.log(response.data);
      navigate(response.data.user?.role === "artist" ? "/admin" : "/feed");
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };
  return (
    <div className="h-screen overflow-hidden bg-[#081016] text-white selection:bg-green-300 selection:text-black">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative flex h-full flex-col justify-between overflow-hidden px-6 py-6 sm:px-10 lg:px-14 lg:py-10">
          <div className="absolute inset-0 " />

          <div className="relative z-10 flex h-full max-w-2xl flex-col justify-between gap-10">
            <div>
              <div className="group mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1db954]/50 hover:bg-white/10 hover:shadow-lg hover:shadow-[#1db954]/10">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1db954] text-sm font-bold text-[#08110a] transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                  S
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.34em] text-white/75 transition duration-300 group-hover:text-white">
                  Streamify
                </span>
              </div>

              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Create your music space.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                Press Play. Feel Everything. Millions of songs. One soundtrack
                for your life.
              </p>
            </div>

            <div className=" gap-3 flex fixed bottom-10 left-40">
              <div className="group overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[#1db954]/15">
                <img
                  src={heroImage}
                  alt="Music studio artwork"
                  className="min-h-55 w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>

              <div className="text-wrap w-70 flex flex-col gap-3 justify-around">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1db954]/35 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8cf0ad]">
                    Listener mode
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Jump into the feed and explore new tracks, playlists, and
                    uploaded sounds.
                  </p>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1db954]/35 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8cf0ad]">
                    Artist mode
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Upload songs, build albums, and manage your releases from
                    the creator page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex h-full flex-col items-center justify-center overflow-hidden px-6 py-6 sm:px-10 lg:px-14 lg:py-10">
          <div className="mb-4 grid w-full max-w-md grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#1db954]/30 ${
                authMode === "register"
                  ? "bg-[#1db954] text-[#07110a] shadow-lg shadow-[#1db954]/20"
                  : "text-white/75 hover:bg-white/10"
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#1db954]/30 ${
                authMode === "login"
                  ? "bg-[#1db954] text-[#07110a] shadow-lg shadow-[#1db954]/20"
                  : "text-white/75 hover:bg-white/10"
              }`}
            >
              Login
            </button>
          </div>

          {authMode === "register" ? (
            <form
              onSubmit={handlesumbit}
              className="w-full max-w-md rounded-4xl border border-white/10 bg-[#111822]/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7"
            >
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8cf0ad]">
                  Get started
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  Register user
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Enter your account details and choose a role to continue.
                </p>
              </div>

              <label className="mb-3 block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Username
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="yourname"
                  autoComplete="username"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-white/35 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus:border-[#1db954] focus:bg-white/10 focus:ring-2 focus:ring-[#1db954]/20"
                />
              </label>

              <label className="mb-3 block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@studio.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-white/35 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus:border-[#1db954] focus:bg-white/10 focus:ring-2 focus:ring-[#1db954]/20"
                />
              </label>

              <label className="mb-3 block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-white/35 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus:border-[#1db954] focus:bg-white/10 focus:ring-2 focus:ring-[#1db954]/20"
                />
              </label>

              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Role
                </span>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus:border-[#1db954] focus:bg-white/10 focus:ring-2 focus:ring-[#1db954]/20"
                >
                  <option value="user" className="bg-[#111822] text-white">
                    Listener
                  </option>
                  <option value="artist" className="bg-[#111822] text-white">
                    Artist
                  </option>
                </select>
              </label>

              <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-white/50">
                  Current role
                </p>
                <p className="mt-2 text-sm text-white/80">
                  {form.role === "artist"
                    ? "Artist sign in for uploads and album creation."
                    : "Listener sign in for the public music feed."}
                </p>
              </div>

              {error ? (
                <p className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-2xl bg-[#1db954] px-4 py-3 font-semibold text-[#07110a] transition duration-300 hover:-translate-y-0.5 hover:bg-[#23d35f] hover:shadow-lg hover:shadow-[#1db954]/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Registering..." : `Register as ${form.role}`}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleLoginSubmit}
              className="w-full max-w-md rounded-4xl border border-white/10 bg-[#111822]/95 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7"
            >
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8cf0ad]">
                  Welcome back
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  Login
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Use your username or email and password to continue.
                </p>
              </div>

              <label className="mb-3 block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Username or email
                </span>
                <input
                  name="identifier"
                  value={loginForm.identifier}
                  onChange={handleLoginChange}
                  placeholder="name@studio.com or yourname"
                  autoComplete="username"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-white/35 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus:border-[#1db954] focus:bg-white/10 focus:ring-2 focus:ring-[#1db954]/20"
                />
              </label>

              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium text-white/80">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition duration-300 placeholder:text-white/35 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-black/10 focus:border-[#1db954] focus:bg-white/10 focus:ring-2 focus:ring-[#1db954]/20"
                />
              </label>

              {loginError ? (
                <p className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {loginError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loginLoading}
                className="mt-1 w-full rounded-2xl bg-[#1db954] px-4 py-3 font-semibold text-[#07110a] transition duration-300 hover:-translate-y-0.5 hover:bg-[#23d35f] hover:shadow-lg hover:shadow-[#1db954]/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginLoading ? "Signing in..." : "Login"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default Login;

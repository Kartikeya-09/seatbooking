import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api.js";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("batch1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await register({ name, username, email, password, type });
      navigate("/login");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.2),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(14,116,144,0.2),transparent_35%),linear-gradient(120deg,#fff7ed,#f8fafc_45%,#fff1f2_100%)] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between pb-10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100">
              SB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SeatFlow</p>
              <h1 className="text-2xl font-semibold">Create account</h1>
            </div>
          </div>
          <Link
            to="/"
            className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
          >
            Back to landing
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold">Set up your profile</h2>
            <p className="mt-2 text-sm text-slate-600">
              Choose a batch to define your booking days.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-700">
                Name
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Username
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="username"
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Email
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Password
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Batch
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="batch1">Batch 1 (Mon-Wed)</option>
                  <option value="batch2">Batch 2 (Thu-Fri)</option>
                </select>
              </label>
              <button
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-amber-100 shadow-lg transition hover:-translate-y-0.5"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
            {status ? <p className="mt-4 text-sm text-rose-500">{status}</p> : null}
            <p className="mt-4 text-sm text-slate-600">
              Already have an account?{" "}
              <Link className="font-semibold text-slate-900" to="/login">
                Sign in
              </Link>
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-amber-100 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
              Batch guidance
            </p>
            <h3 className="mt-4 text-2xl font-semibold">Pick your window</h3>
            <p className="mt-3 text-sm text-amber-200">
              Batch selection controls when you access regular seats.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-200">Batch 1</p>
                <p className="text-lg font-semibold">Mon-Wed regular seats</p>
              </div>
              <div className="rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-200">Batch 2</p>
                <p className="text-lg font-semibold">Thu-Fri regular seats</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, setAuthToken } from "../api.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const payload = await login({ email, password });
      setAuthToken(payload.token);
      navigate("/app");
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
              <h1 className="text-2xl font-semibold">Sign in</h1>
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
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">Sign in to book a seat.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-700">
                Email
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="user1@seatflow.local"
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
                  placeholder="Password@123"
                  required
                />
              </label>
              <button
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-amber-100 shadow-lg transition hover:-translate-y-0.5"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            {status ? <p className="mt-4 text-sm text-rose-500">{status}</p> : null}
            <p className="mt-4 text-sm text-slate-600">
              New here?{" "}
              <Link className="font-semibold text-slate-900" to="/signup">
                Create an account
              </Link>
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-amber-100 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
              Today at a glance
            </p>
            <h3 className="mt-4 text-2xl font-semibold">Seat availability signals</h3>
            <p className="mt-3 text-sm text-amber-200">
              We calculate the right seats for your batch and show flex windows
              instantly.
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

export default Login;

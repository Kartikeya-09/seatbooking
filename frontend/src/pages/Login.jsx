import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
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
    <div className="page-shell">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between pb-10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100 dark:bg-amber-100 dark:text-slate-900">
              SB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                SeatFlow
              </p>
              <h1 className="text-2xl font-semibold">Sign in</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
            >
              Back to landing
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border p-8 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-sm text-[color:var(--panel-muted)]">
              Sign in to book a seat.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-[color:var(--panel-text)]">
                Email
                <input
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm focus:outline-none bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)] focus:border-slate-400"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="user1@seatflow.local"
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-[color:var(--panel-text)]">
                Password
                <input
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm shadow-sm focus:outline-none bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)] focus:border-slate-400"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password@123"
                  required
                />
              </label>
              <button
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-amber-100 shadow-lg transition hover:-translate-y-0.5 dark:bg-amber-100 dark:text-slate-900"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            {status ? <p className="mt-4 text-sm text-rose-500">{status}</p> : null}
            <p className="mt-4 text-sm text-[color:var(--panel-muted)]">
              New here?{" "}
              <Link className="font-semibold text-[color:var(--panel-text)]" to="/signup">
                Create an account
              </Link>
            </p>
          </section>

          <section className="rounded-3xl border p-8 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
              Today at a glance
            </p>
            <h3 className="mt-4 text-2xl font-semibold">Seat availability signals</h3>
            <p className="mt-3 text-sm text-[color:var(--panel-muted)]">
              We calculate the right seats for your batch and show floater windows
              instantly.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                  Batch 1
                </p>
                <p className="text-lg font-semibold">Mon-Wed regular seats</p>
              </div>
              <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                  Batch 2
                </p>
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

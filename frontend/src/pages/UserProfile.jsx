import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthToken, getProfile, setAuthToken } from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("Loading profile...");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!getAuthToken()) {
          navigate("/login");
          return;
        }

        const data = await getProfile();
        setProfile(data);
        setStatus("");
      } catch (error) {
        setStatus(error.message);
        setAuthToken(null);
        navigate("/login");
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSignOut = () => {
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100 dark:bg-amber-100 dark:text-slate-900">
              SB
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                SeatFlow
              </p>
              <h1 className="text-2xl font-semibold">Profile</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/app"
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
            >
              Back to booking
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl border p-6 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
              Account details
            </p>
            {status ? (
              <p className="mt-4 text-sm text-[color:var(--panel-muted)]">{status}</p>
            ) : (
              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                  <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                    Name
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--panel-text)]">
                    {profile?.name || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                  <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                    Username
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--panel-text)]">
                    {profile?.username}
                  </p>
                </div>
                <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                  <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                    Email
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--panel-text)]">
                    {profile?.email}
                  </p>
                </div>
                <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                  <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                    Batch
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--panel-text)]">
                    {profile?.type === "batch1" ? "Batch 1 (Mon-Wed)" : "Batch 2 (Thu-Fri)"}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border p-6 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
              Booking rules
            </p>
            <h2 className="mt-4 text-2xl font-semibold">Your seat access</h2>
            <p className="mt-3 text-sm text-[color:var(--panel-muted)]">
              Regular seats are available on your batch days. Floater seats are
              available on the other weekdays for tomorrow only.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                  Regular seats
                </p>
                <p className="text-lg font-semibold">Book today up to 14 days ahead</p>
              </div>
              <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                  Floater seats
                </p>
                <p className="text-lg font-semibold">Tomorrow only, weekdays</p>
              </div>
              <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                  Releases
                </p>
                <p className="text-lg font-semibold">Allowed before booking date</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

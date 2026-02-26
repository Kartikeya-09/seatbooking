import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthToken, getProfile, setAuthToken } from "../api.js";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.25),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(14,116,144,0.2),transparent_35%),linear-gradient(120deg,#fff7ed,#f8fafc_45%,#fff1f2_100%)] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100">
              SB
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">SeatFlow</p>
              <h1 className="text-2xl font-semibold">Profile</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
            >
              Back to booking
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-amber-100 shadow-lg transition hover:-translate-y-0.5"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Account details
            </p>
            {status ? (
              <p className="mt-4 text-sm text-slate-600">{status}</p>
            ) : (
              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile?.name || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Username</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile?.username}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                  <p className="text-lg font-semibold text-slate-900">{profile?.email}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Batch</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {profile?.type === "batch1" ? "Batch 1 (Mon-Wed)" : "Batch 2 (Thu-Fri)"}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-amber-100 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
              Booking rules
            </p>
            <h2 className="mt-4 text-2xl font-semibold">Your seat access</h2>
            <p className="mt-3 text-sm text-amber-200">
              Regular seats are available on your batch days. Flex seats are
              available on the other weekdays for tomorrow only.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-200">Regular seats</p>
                <p className="text-lg font-semibold">Book today up to 14 days ahead</p>
              </div>
              <div className="rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-200">Flex seats</p>
                <p className="text-lg font-semibold">Tomorrow only, weekdays</p>
              </div>
              <div className="rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-200">Releases</p>
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

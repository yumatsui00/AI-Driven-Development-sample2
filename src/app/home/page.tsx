"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearLoginState, isLoggedInClient } from "@/utils/auth/state";
import { createTranslator } from "@/utils/translation";

export default function HomePage() {
  const translate = createTranslator();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isLoggedInClient()) {
      router.replace("/");
    }
  }, [router]);

  const handleSignOut = async (): Promise<void> => {
    setIsSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error(error);
    } finally {
      clearLoginState();
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {translate("home.protected.badge")}
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {translate("home.protected.title")}
          </h1>
          <p className="text-base leading-relaxed text-slate-700">
            {translate("home.protected.description")}
          </p>
        </div>
        <div>
          <button
            type="button"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {translate("home.protected.signOut")}
          </button>
        </div>
      </div>
    </main>
  );
}

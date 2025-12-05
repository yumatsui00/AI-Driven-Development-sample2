"use client";

import { createTranslator } from "@/utils/translation";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { setLoginState } from "@/utils/auth/state";

interface NavItem {
  key: string;
}

interface FilterItem {
  key: string;
}

interface TemplateCard {
  id: string;
  titleKey: string;
  providerKey: string;
  priceKey: string;
  badgeKey?: string;
  imageSrc: string;
  imageAltKey: string;
}

const navItems: NavItem[] = [
  { key: "landing.nav.links.notion" },
  { key: "landing.nav.links.mail" },
  { key: "landing.nav.links.calendar" },
  { key: "landing.nav.links.ai" },
  { key: "landing.nav.links.enterprise" },
  { key: "landing.nav.links.pricing" },
  { key: "landing.nav.links.resources" },
  { key: "landing.nav.links.contact" }
];

const filterItems: FilterItem[] = [
  { key: "landing.filters.creator" },
  { key: "landing.filters.price" },
  { key: "landing.filters.language" },
  { key: "landing.filters.sort" }
];

const templateCards: TemplateCard[] = [
  {
    id: "card-1",
    titleKey: "landing.card.title.landingBuilder",
    providerKey: "landing.card.provider.notion",
    priceKey: "landing.card.price.free",
    badgeKey: "landing.card.badge.recommended",
    imageSrc: "https://via.placeholder.com/800x450?text=Notion+Landing",
    imageAltKey: "landing.card.alt.generic"
  },
  {
    id: "card-2",
    titleKey: "landing.card.title.superBuilder",
    providerKey: "landing.card.provider.super",
    priceKey: "landing.card.price.free",
    imageSrc: "https://via.placeholder.com/800x450?text=Super+Builder",
    imageAltKey: "landing.card.alt.generic"
  },
  {
    id: "card-3",
    titleKey: "landing.card.title.websiteBuilder",
    providerKey: "landing.card.provider.super",
    priceKey: "landing.card.price.free",
    imageSrc: "https://via.placeholder.com/800x450?text=Website+Builder",
    imageAltKey: "landing.card.alt.generic"
  },
  {
    id: "card-4",
    titleKey: "landing.card.title.notionLanding",
    providerKey: "landing.card.provider.super",
    priceKey: "landing.card.price.free",
    imageSrc: "https://via.placeholder.com/800x450?text=Landing+Theme",
    imageAltKey: "landing.card.alt.generic"
  },
  {
    id: "card-5",
    titleKey: "landing.card.title.productTemplate",
    providerKey: "landing.card.provider.templateMarket",
    priceKey: "landing.card.price.paid",
    imageSrc: "https://via.placeholder.com/800x450?text=Product+Launch",
    imageAltKey: "landing.card.alt.generic"
  },
  {
    id: "card-6",
    titleKey: "landing.card.title.minimalTemplate",
    providerKey: "landing.card.provider.flow",
    priceKey: "landing.card.price.free",
    imageSrc: "https://via.placeholder.com/800x450?text=Minimal+Landing",
    imageAltKey: "landing.card.alt.generic"
  }
];

/**
 * Home route rendering the landing component with translated content.
 * @returns Landing page markup.
 */
export default function Home() {
  const translate = createTranslator();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  const handleAuthSuccess = (): void => {
    setLoginState();
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    router.push("/home");
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (!response.ok) {
        setLoginError(translate("auth.login.error"));
        return;
      }
      handleAuthSuccess();
    } catch (error) {
      console.error(error);
      setLoginError(translate("auth.login.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setSignupError(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword
        })
      });
      if (!response.ok) {
        setSignupError(translate("auth.signup.error"));
        return;
      }
      handleAuthSuccess();
    } catch (error) {
      console.error(error);
      setSignupError(translate("auth.signup.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xl font-semibold text-white">
                ○
              </span>
              <span className="text-lg font-semibold">{translate("landing.nav.brand")}</span>
            </div>
            <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 sm:flex">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="rounded-full px-3 py-2 transition hover:bg-slate-100"
                >
                  {translate(item.key)}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              disabled={isSubmitting}
              onClick={() => {
                setIsLoginOpen(true);
                setLoginError(null);
              }}
            >
              {translate("landing.nav.login")}
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
              disabled={isSubmitting}
              onClick={() => {
                setIsSignupOpen(true);
                setSignupError(null);
              }}
            >
              {translate("landing.nav.cta")}
            </button>
          </div>
        </header>

        <section className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                <span className="block">{translate("landing.hero.title.line1")}</span>
                <span className="block">{translate("landing.hero.title.line2")}</span>
              </h1>
              <p className="text-base leading-7 text-slate-700 sm:text-lg">
                {translate("landing.hero.description")}
              </p>
            </div>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              onClick={() => {
                setIsSignupOpen(true);
                setSignupError(null);
              }}
            >
              {translate("landing.hero.cta")}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              {filterItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>{translate(item.key)}</span>
                  <span className="text-xs text-slate-400">▼</span>
                </button>
              ))}
            </div>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <div className="relative h-80 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 via-white to-sky-100 shadow-lg ring-1 ring-slate-100">
              <div className="absolute inset-6 rounded-xl bg-white shadow-md ring-1 ring-slate-100" />
              <div className="absolute inset-12 rounded-lg bg-orange-200/60" />
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 sm:hidden">
              {filterItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>{translate(item.key)}</span>
                  <span className="text-xs text-slate-400">▼</span>
                </button>
              ))}
            </div>
            <div className="text-sm font-semibold text-slate-600">
              {translate("landing.stats.templatesCount")}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {templateCards.map((card) => (
              <article
                key={card.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={card.imageSrc}
                    alt={translate(card.imageAltKey)}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
                    {card.badgeKey ? (
                      <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        {translate(card.badgeKey)}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200">
                      {translate(card.priceKey)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 px-4 py-4">
                  <h3 className="text-base font-semibold text-slate-900">
                    {translate(card.titleKey)}
                  </h3>
                  <div className="text-sm text-slate-600">{translate(card.providerKey)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {isLoginOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {translate("auth.login.badge")}
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {translate("auth.login.title")}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                onClick={() => setIsLoginOpen(false)}
              >
                {translate("auth.form.close")}
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  {translate("auth.form.email")}
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  {translate("auth.form.password")}
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  required
                />
              </div>
              {loginError ? (
                <p className="text-sm text-red-600">{loginError}</p>
              ) : null}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                  onClick={() => setIsLoginOpen(false)}
                  disabled={isSubmitting}
                >
                  {translate("auth.form.cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  {translate("auth.login.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isSignupOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {translate("auth.signup.badge")}
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {translate("auth.signup.title")}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                onClick={() => setIsSignupOpen(false)}
              >
                {translate("auth.form.close")}
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  {translate("auth.form.name")}
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  value={signupName}
                  onChange={(event) => setSignupName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  {translate("auth.form.email")}
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  {translate("auth.form.password")}
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                  required
                />
              </div>
              {signupError ? (
                <p className="text-sm text-red-600">{signupError}</p>
              ) : null}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                  onClick={() => setIsSignupOpen(false)}
                  disabled={isSubmitting}
                >
                  {translate("auth.form.cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  {translate("auth.signup.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

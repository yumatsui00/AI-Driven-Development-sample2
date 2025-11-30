export interface HomePageProps {
  title: string;
  subtitle: string;
  overviewTitle: string;
  overviewBody: string;
  ctaLabel: string;
  loginLabel: string;
  signupLabel: string;
}

/**
 * Renders the landing view with navigation actions and project overview content.
 * @param props Copy strings sourced from translations for the landing layout.
 * @returns Structured landing content with hero and call-to-action.
 */
const HomePage = ({
  title,
  subtitle,
  overviewTitle,
  overviewBody,
  ctaLabel,
  loginLabel,
  signupLabel
}: HomePageProps) => {
  const featureCards = [
    { title: overviewTitle, body: overviewBody },
    { title: subtitle, body: overviewBody },
    { title: ctaLabel, body: subtitle }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img
                src="/Aotion.png"
                alt={title}
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-slate-800">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
            >
              {loginLabel}
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {signupLabel}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-16 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
            {overviewTitle}
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">{title}</h1>
          <p className="text-lg text-slate-600 sm:text-xl">{subtitle}</p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {ctaLabel}
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
            >
              {signupLabel}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                <span className="text-xl">✨</span>
              </div>
              <div className="space-y-3 text-left">
                <div className="text-sm font-semibold text-orange-600">{overviewTitle}</div>
                <p className="text-base leading-relaxed text-slate-700 sm:text-lg">{overviewBody}</p>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {ctaLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <div className="text-sm font-semibold text-slate-900">{card.title}</div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

export interface HomePageProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
}

/**
 * Renders the landing view with translated copy and optional call-to-action.
 * @param props Copy strings sourced from translations.
 * @returns Structured landing content.
 */
const HomePage = ({ title, subtitle, ctaLabel }: HomePageProps) => (
  <main className="flex min-h-screen items-center justify-center px-6">
    <div className="max-w-2xl space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        <p className="text-lg text-slate-300 sm:text-xl">{subtitle}</p>
      </div>
      {ctaLabel ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-sky-400 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          >
            {ctaLabel}
          </button>
        </div>
      ) : null}
    </div>
  </main>
);

export default HomePage;

import { createTranslator } from "@/utils/translation";

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
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {translate("landing.nav.login")}
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
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
    </main>
  );
}

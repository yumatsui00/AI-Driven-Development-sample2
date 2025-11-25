import HomePage from "@/components/home/HomePage";
import { createTranslator } from "@/utils/translation";

/**
 * Home route rendering the landing component with translated content.
 * @returns Landing page markup.
 */
export default function Home() {
  const translate = createTranslator();

  return (
    <HomePage
      title={translate("home.landing.title")}
      subtitle={translate("home.landing.subtitle")}
      ctaLabel={translate("home.landing.cta")}
    />
  );
}

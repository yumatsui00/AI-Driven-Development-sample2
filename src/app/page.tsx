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
      title={translate("home.hero.title")}
      subtitle={translate("home.hero.subtitle")}
      overviewTitle={translate("home.hero.overviewTitle")}
      overviewBody={translate("home.hero.overviewBody")}
      ctaLabel={translate("home.hero.cta")}
      loginLabel={translate("home.nav.login")}
      signupLabel={translate("home.nav.signup")}
    />
  );
}

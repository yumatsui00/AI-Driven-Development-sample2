import type { Metadata } from "next";
import { type ReactNode } from "react";

import "./globals.css";
import { createTranslator, DEFAULT_LOCALE } from "@/utils/translation";

const translate = createTranslator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: translate("home.landing.title"),
  description: translate("home.landing.subtitle"),
  icons: "/icon.svg"
};

/**
 * Root layout for the application applying global styles and metadata.
 * @param props Layout children.
 * @returns HTML shell wrapping all routes.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { GaslessServiceProvider } from "@/components/GaslessServiceContext";
import { Root } from "@/components/Root/Root";
import { I18nProvider } from "@/core/i18n/provider";
import { getLocale } from "next-intl/server";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";

import Image from "next/image";

export const metadata: Metadata = {
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <I18nProvider>
          <GaslessServiceProvider network="sepolia">
            <Root>{children}</Root>
          </GaslessServiceProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

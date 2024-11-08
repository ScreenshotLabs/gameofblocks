import "./_assets/globals.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { GaslessServiceProvider } from "@/components/gasless-service-context";
import { Root } from "@/components/root";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";

import Fonts from "@/components/fonts";
import { ReactQueryProvider } from "@/components/react-query-provider";

export const metadata: Metadata = {
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-game-background font-omnes">
        <Fonts />
        <ReactQueryProvider>
          <GaslessServiceProvider network="sepolia">
            <Root>{children}</Root>
          </GaslessServiceProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

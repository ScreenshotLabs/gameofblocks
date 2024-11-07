"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorPage } from "@/components/error-page";
import { setLocale } from "@/core/i18n/locale";
import { init } from "@/core/init";
import { env } from "@/env";
import { useClientOnce } from "@/hooks/useClientOnce";
import { useDidMount } from "@/hooks/useDidMount";
import { useTelegramMock } from "@/hooks/useTelegramMock";
import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import Loader from "./loader";

function RootInner({ children }: PropsWithChildren) {
  const isDev = env.NODE_ENV === "development";

  // Mock Telegram environment in development mode if needed.
  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const lp = useLaunchParams();
  const debug = isDev || lp.startParam === "debug";

  // Initialize the library.
  useClientOnce(() => {
    init(debug);
  });

  const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);

  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.languageCode);
  }, [initDataUser]);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    debug && import("eruda").then((lib) => lib.default.init());
  }, [debug]);

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <AppRoot
        appearance={isDark ? "dark" : "light"}
        platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
      >
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  );
}

export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <Loader />
  );
}

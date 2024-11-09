import {
  $debug,
  backButton,
  initData,
  init as initSDK,
  miniApp,
  swipeBehavior,
  themeParams,
  viewport,
} from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Mount all components used in the project.
  if (backButton.isSupported()) {
    backButton.mount();
  }

  miniApp.mount();
  themeParams.mount();
  initData.restore();
  swipeBehavior.mount();
  swipeBehavior.disableVertical();

  void viewport.mount().catch((e) => {
    console.error("Something went wrong mounting the viewport", e);
  });

  // Define components-related CSS variables.
  // viewport.bindCssVars();
  miniApp.bindCssVars();
  themeParams.bindCssVars();

  // Add Eruda if needed.
  debug &&
    import("eruda").then((lib) => lib.default.init()).catch(console.error);
}

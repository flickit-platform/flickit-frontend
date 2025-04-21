import { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { toastDefaultConfig } from "@config/toastConfigs";
import { ServiceProvider } from "./providers/ServiceProvider";
import { ThemeProvider } from "@mui/material/styles";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import { AppProvider } from "./providers/AppProvider";
import { AuthProvider, useAuthContext } from "./providers/AuthProvider";
import { ConfigProvider } from "./providers/ConfgProvider";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import keycloakService from "@/service/keycloakService";
import "./assets/font/fonts.css";
import "@utils/richEditorStyles.css";
import { AssessmentProvider } from "./providers/AssessmentProvider";
import i18next from "i18next";
import { FlagsmithProvider } from "flagsmith/react";
import flagsmith from "flagsmith";

// Lazy load non-critical components
const ToastContainer = lazy(() =>
  import("react-toastify").then((module) => ({
    default: module.ToastContainer,
  })),
);

const NovuProvider = lazy(() =>
  import("@novu/notification-center").then((module) => ({
    default: module.NovuProvider,
  })),
);

// Lazy load Sentry
const initializeSentry = async () => {
  const Sentry = await import("@sentry/react");

  Sentry.init({
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ["localhost", "https://flickit.sentry.io"],
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

// Initialize Sentry only in production
if (process.env.NODE_ENV !== "development") {
  initializeSentry();
}

const AppWithNovu = () => {
  const { userInfo } = useAuthContext();

  if (!userInfo) {
    return null;
  }

  return (
    <NovuProvider
      subscriberHash={userInfo.subscriberHash}
      subscriberId={userInfo.id.toString()}
      applicationIdentifier={import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER}
      backendUrl={import.meta.env.VITE_NOVU_BACKEND_URL}
      socketUrl={import.meta.env.VITE_NOVU_SOCKET_URL}
      i18n={theme.direction === "rtl" ? "fa" : "en"}
    >
      <App />
    </NovuProvider>
  );
};

const renderApp = () => {
  return createRoot(document.getElementById("root") as HTMLElement).render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppProvider>
          <AssessmentProvider>
            <AuthProvider>
              <ServiceProvider>
                <ConfigProvider>
                  <FlagsmithProvider
                    options={{ environmentID: "VACYXaMWbqJKXQYD3JV6k2" }}
                    flagsmith={flagsmith}
                  >
                    <CssBaseline />
                    <Suspense fallback={null}>
                      <ToastContainer
                        {...toastDefaultConfig}
                        toastStyle={{
                          fontFamily:
                            i18next.language === "fa"
                              ? farsiFontFamily
                              : primaryFontFamily,
                          direction: i18next.language === "fa" ? "rtl" : "ltr",
                          textAlign:
                            i18next.language === "fa" ? "right" : "left",
                        }}
                      />
                    </Suspense>

                    <AppWithNovu />
                  </FlagsmithProvider>
                </ConfigProvider>
              </ServiceProvider>
            </AuthProvider>
          </AssessmentProvider>
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>,
  );
};

keycloakService.initKeycloak(renderApp);

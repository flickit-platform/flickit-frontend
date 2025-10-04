import { Suspense, lazy, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { toastDefaultConfig } from "@config/toastConfigs";
import { ServiceProvider } from "./providers/service-provider";
import { ThemeProvider } from "@mui/material/styles";
import { farsiFontFamily, primaryFontFamily, getTheme } from "@config/theme";
import { AppProvider } from "./providers/app-provider";
import { AuthProvider, useAuthContext } from "./providers/auth-provider";
import { ConfigProvider } from "./providers/config-provider";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import keycloakService from "@/service/keycloakService";
import "../public/assets/font/fonts.css";
import "./components/common/charts/style.css";
import "@utils/richEditorStyles.css";
import { AssessmentProvider } from "./providers/assessment-provider";
import i18next from "i18next";
import { KitLanguageProvider } from "./providers/kit-provider";
import { LangProvider, useLangContext } from "./providers/lang-provider";
import "./globals.css"

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
      i18n={i18next.language === "fa" ? "fa" : "en"}
    >
      <App />
    </NovuProvider>
  );
};

const AppWithTheme = () => {
  const { lang } = useLangContext();
  const theme = useMemo(() => getTheme(lang), [lang]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppProvider>
          <AssessmentProvider>
            <AuthProvider>
              <ServiceProvider>
                <KitLanguageProvider>
                  <ConfigProvider>
                    <CssBaseline />
                    <Suspense fallback={null}>
                      <ToastContainer
                        {...toastDefaultConfig}
                        toastStyle={{
                          fontFamily:
                            lang === "fa"
                              ? farsiFontFamily
                              : primaryFontFamily,
                          direction: lang === "fa" ? "rtl" : "ltr",
                          textAlign: lang === "fa" ? "right" : "left",
                        }}
                      />
                    </Suspense>
                    <AppWithNovu />
                  </ConfigProvider>
                </KitLanguageProvider>
              </ServiceProvider>
            </AuthProvider>
          </AssessmentProvider>
        </AppProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const renderApp = () => {
  createRoot(document.getElementById("root") as HTMLElement).render(
    <LangProvider>
      <AppWithTheme />
    </LangProvider>
  );
};

keycloakService.initKeycloak(renderApp);

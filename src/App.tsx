import Routes from "./routes";
import "@config/i18n";
import useGetSignedInUserInfo from "./utils/useGetSignedInUserInfo";
import { styles } from "@styles";
import Box from "@mui/material/Box";
import ErrorDataLoading from "@common/errors/ErrorDataLoading";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import ErrorBoundary from "@common/errors/ErrorBoundry";
import { useEffect } from "react";
import flagsmith from "flagsmith";
import { useLocation, useSearchParams } from "react-router-dom";
import keycloakService, { isPublicRoute } from "@/service/keycloakService";
import { getOrCreateVisitorId } from "./utils/uniqueId";
import i18next from "i18next";
import { useLangDispatch } from "./providers/LangProvider";

function getLangFromHash() {
  const hash = window.location.hash;
  const paramsString = hash.split("?")[1];
  if (!paramsString) return null;
  const params = new URLSearchParams(paramsString);
  return params.get("lang");
}

function App() {
  const { pathname = "" } = useLocation();

  const [searchParams] = useSearchParams();
  let lang = searchParams.get("lang");
  if (!lang && window.location.hash) {
    const hashLang = getLangFromHash();
    if (hashLang) lang = hashLang;
  }

  const dispatch = useLangDispatch();


  const { error, loading } = useGetSignedInUserInfo({
    runOnMount: !isPublicRoute(pathname) || keycloakService.isLoggedIn(),
  });
  useEffect(() => {

    if (lang) {
      localStorage.setItem("lang", lang);
      document.cookie = `NEXT_LOCALE=${lang}; max-age=31536000; path=/`;
      i18next.changeLanguage(lang);

      dispatch({ type: "SET_LANG", payload: lang });
    }
    const customId =
      keycloakService._kc.tokenParsed?.preferred_username ??
      keycloakService._kc.tokenParsed?.sub;
    const visitorId = getOrCreateVisitorId();

    // @ts-ignore
    window._paq.push(["setVisitorId", visitorId]);

    // @ts-ignore
    if (customId && window.clarity) {
      // @ts-ignore
      window.clarity("set", "user_id", customId);
      // @ts-ignore
      window.clarity("identify", customId);
    }
    // @ts-ignore
    window._paq.push(["setUserId", customId]);
    // @ts-ignore
  }, [window.clarity]);

  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.clarity) {
      // @ts-ignore
      window.clarity("set", "page_view_id", new Date().getTime());
    }
  }, [pathname]);

  useEffect(() => {
    if (
      import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY &&
      import.meta.env.VITE_FLAGSMITH_API
    ) {
      flagsmith.init({
        environmentID: import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY,
        api: import.meta.env.VITE_FLAGSMITH_API,
      });
      flagsmith.identify(
        keycloakService._kc.tokenParsed?.preferred_username ??
          keycloakService._kc.tokenParsed?.sub ??
          "",
      );
    }
  }, []);
  return error ? (
    <Box sx={{ ...styles.centerVH }} height="100vh">
      <ErrorDataLoading />
    </Box>
  ) : (
    <ErrorBoundary>
      {loading ? (
        <Box width="100%" sx={{ mt: 10, ...styles.centerVH }}>
          <GettingThingsReadyLoading color="gray" />
        </Box>
      ) : (
        <Routes />
      )}
    </ErrorBoundary>
  );
}

export default App;

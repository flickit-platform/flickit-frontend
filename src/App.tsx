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
import { useLocation } from "react-router-dom";
import keycloakService, { isPublicRoute } from "@/service/keycloakService";

function App() {
  const { pathname = "" } = useLocation();

  const { error, loading } = useGetSignedInUserInfo({
    runOnMount: !isPublicRoute(pathname) || keycloakService.isLoggedIn(),
  });
  useEffect(() => {
    const customId = sessionStorage.getItem("currentUser");

    // @ts-ignore
    if (customId && window.clarity) {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("id", import.meta.env.VITE_CLARITY_KEY);
      script.setAttribute("defer", "");
      let code = `
              window.clarity('set', 'user_id', '${customId}');
              window.clarity("identify", "${customId}");
          `;
      // @ts-ignore
      window.clarity("set", "user_id", customId);
      // @ts-ignore
      window.clarity("identify", customId);

      script.appendChild(document.createTextNode(code));
      document.body.appendChild(script);
    }

    // @ts-ignore
  }, [window.clarity]);

  useEffect(() => {
    flagsmith.init({
      environmentID: import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY,
      api: import.meta.env.VITE_FLAGSMITH_API,
    });
    flagsmith.identify(sessionStorage.getItem("currentUser") ?? "");
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

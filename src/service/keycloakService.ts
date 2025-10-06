import Keycloak, { KeycloakInstance } from "keycloak-js";

const _kc: KeycloakInstance = new Keycloak({
  url: import.meta.env.VITE_SSO_URL,
  realm: import.meta.env.VITE_SSO_REALM,
  clientId: import.meta.env.VITE_SSO_CLIENT_ID,
});

const PUBLIC_PATHS = ["/assessment-kits", "/graphical-report/"];

export const isPublicRoute = (path: string) => {
  if (path.includes("/assessment-kits") && path.includes("createAssessment")) {
    return false;
  }

  return PUBLIC_PATHS.some((publicPath) => path.includes(publicPath));
};
const initKeycloak = (onAuthenticatedCallback: () => void) => {
  _kc
    .init({
      onLoad: "check-sso",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      const currentPath = location.href;
      if (!authenticated) {
        if (isPublicRoute(currentPath)) {
          onAuthenticatedCallback();
        } else {
          _kc.login();
        }
        return;
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

const doLogout = async () => {
  await _kc.logout();
};

const isTokenExpired = _kc.isTokenExpired;
const doLogin = _kc.login;

const getToken = (): string => _kc?.token ?? "";

const getTokenParsed = (): Record<string, any> | null =>
  _kc?.tokenParsed ?? null;

const isLoggedIn = (): boolean => !!_kc.token;

const updateToken = (successCallback: () => void) =>
  _kc.updateToken(30).then(successCallback).catch(doLogin);

const keycloakService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  isTokenExpired,
  _kc,
};

export default keycloakService;

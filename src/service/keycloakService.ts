import flagsmith from "flagsmith";
import Keycloak, { KeycloakInstance } from "keycloak-js";

const _kc: KeycloakInstance = new Keycloak({
  url: import.meta.env.VITE_SSO_URL,
  realm: import.meta.env.VITE_SSO_REALM,
  clientId: import.meta.env.VITE_SSO_CLIENT_ID,
});

const PUBLIC_PATHS = ["/assessment-kits","/graphical-report/"];

export const isPublicRoute = (path: string) =>
  PUBLIC_PATHS.some((publicPath) => path.includes(publicPath));

const initKeycloak = (onAuthenticatedCallback: () => void) => {
  _kc
    .init({
      onLoad: "check-sso",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      const currentPath = location.pathname;
      if (!authenticated && isPublicRoute(currentPath)) {
        onAuthenticatedCallback();
        return;
      }

      if (!authenticated) {
        doLogin();
        return;
      }

      const currentUser =
        _kc.tokenParsed?.preferred_username ?? _kc.tokenParsed?.sub;

      sessionStorage.setItem("currentUser", currentUser ?? "");

      const previousUser = localStorage.getItem("previousUser");
      const lastVisitedPage = localStorage.getItem("lastVisitedPage");

      if (location.pathname.includes("html-document")) {
        const space = location.pathname.split("/")[1];
        const id = location.pathname.split("/")[4];
        onAuthenticatedCallback();
        window.location.href = `/${space}/assessments/${id}/graphical-report/`;
        return;
      }

      const hasRedirected = localStorage.getItem("hasRedirected");

      if (!hasRedirected) {
        localStorage.setItem("hasRedirected", "true");

        if (previousUser && previousUser !== currentUser) {
          onAuthenticatedCallback();
          window.location.href = "/spaces/1";
          return;
        }

        if (lastVisitedPage) {
          localStorage.removeItem("lastVisitedPage");
          onAuthenticatedCallback();
          window.location.href = lastVisitedPage;
          return;
        }
      }

      // در حالت عادی فقط callback اجرا کن
      onAuthenticatedCallback();
    })
    .catch(console.error);
};

const doLogout = async () => {
  const currentUser =
    _kc.tokenParsed?.preferred_username ?? _kc.tokenParsed?.sub;

  localStorage.setItem("previousUser", currentUser ?? "");
  localStorage.setItem("lastVisitedPage", window.location.pathname);
  localStorage.removeItem("hasRedirected");
  sessionStorage.clear();

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

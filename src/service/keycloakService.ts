import Keycloak, { KeycloakInstance } from "keycloak-js";
// const _kc: KeycloakInstance = new Keycloak("/keycloak.json");
const _kc: KeycloakInstance = new Keycloak({
  url: import.meta.env.VITE_SSO_URL,
  realm: import.meta.env.VITE_SSO_REALM,
  clientId: import.meta.env.VITE_SSO_CLIENT_ID,
});
/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

const initKeycloak = (onAuthenticatedCallback: () => void) => {
  _kc
    .init({
      onLoad: "login-required",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      if (!authenticated) {
        doLogin();
        return;
      }

      const previousUser = localStorage.getItem("previousUser");
      const lastVisitedPage = localStorage.getItem("lastVisitedPage");
      const currentUser =
        _kc.tokenParsed?.preferred_username || _kc.tokenParsed?.sub;

      sessionStorage.setItem("currentUser", currentUser || "");

      if (location.pathname.includes("html-document")) {
        const space = location.pathname.split("/")[1];
        const page = location.pathname.split("/")[3];
        const id = location.pathname.split("/")[4];
        window.location.href = `/${space}/assessments/${page}/${id}/graphical-report/`;
      }

      const hasRedirected = localStorage.getItem("hasRedirected");
      if (!hasRedirected) {
        localStorage.setItem("hasRedirected", "true");
        if (previousUser && previousUser !== currentUser) {
          window.location.href = "/spaces/1";
          return;
        } else if (lastVisitedPage) {
          localStorage.removeItem("lastVisitedPage");
          window.location.href = lastVisitedPage;
          return;
        }
      } else {
        const currentUser =
          _kc.tokenParsed?.preferred_username || _kc.tokenParsed?.sub;

        sessionStorage.setItem("currentUser", currentUser || "");
        onAuthenticatedCallback();
      }
    })
    .catch(console.error);
};

const doLogout = async () => {
  const currentUser =
    _kc.tokenParsed?.preferred_username || _kc.tokenParsed?.sub;

  localStorage.setItem("previousUser", currentUser || "");
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

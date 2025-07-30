import axios from "axios";
import i18next, { t } from "i18next";
import { BASE_URL } from "@constants";
import keycloakService from "@/service/keycloakService";

export const setupAxiosDefaults = () => {
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.timeoutErrorMessage = t("common.checkNetworkConnection") as string;

  axios.interceptors.request.use(async (req: any) => {
    const accessToken = keycloakService.getToken();
    const hasTenantInUrl = req.url.includes("tenant");

    const currentLocale = i18next.language ?? navigator.language ?? "en-US";
    req.headers["Accept-Language"] = currentLocale;
    document.cookie = `NEXT_LOCALE=${currentLocale}; max-age=31536000; path=/`;

    if (!hasTenantInUrl) {
      req.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    if (keycloakService._kc.isTokenExpired(5) && accessToken) {
      try {
        await keycloakService._kc.updateToken(-1);
        const newAccessToken = keycloakService.getToken();
        req.headers["Authorization"] = `Bearer ${newAccessToken}`;
        localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
      } catch (error) {
        console.error("Failed to update token:", error);
      }
    }

    return req;
  });
};

export const fetchNewAccessToken = async (refresh: string) => {
  const { data = {} } = await axios.post(
    "/authinfo/jwt/refresh",
    { refresh },
    { isRefreshTokenReq: true },
  );

  return data.access;
};

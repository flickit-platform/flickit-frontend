import axios from "axios";
import i18next from "i18next";
import { BASE_URL } from "@constants";
import keycloakService from "@/service/keycloakService";

import * as assessmentKitService from "./assessment-kits";
import * as assessmentsService from "./assessments";
import * as expertGroupsService from "./expert-groups";
import * as kitVersionsService from "./kit-versions";
import * as questionsService from "./questions";
import commonService from "./ commonService";
import spaceService from "./spaceService";
import adviceService from "./adviceService";
import userService from "./userService";
import { report } from "@/features/assessment-report/api/report";

declare module "axios" {
  interface AxiosRequestConfig {
    isRefreshTokenReq?: boolean;
    skipAuth?: boolean;
  }
}

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

const getCurrentLocale = () => {
  const lng =
    i18next?.language ??
    (isBrowser ? navigator.language : undefined) ??
    "en-US";
  return lng;
};

export const createService = (
  signOut: () => void,
  initialAccessToken: string,
  setAccessToken: (t: string | null) => void,
) => {
  (axios as any).defaults = (axios as any).defaults || {};

  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;

  const fallbackTimeoutMsg = "Please check your network connection";
  const timeoutMsg =
    (i18next?.t && i18next.t("common.checkNetworkConnection")) ||
    fallbackTimeoutMsg;
  (axios.defaults as any).timeoutErrorMessage = timeoutMsg;

  axios.interceptors.request.use(async (req: any) => {
    req.headers = req.headers ?? {};

    const currentLocale = getCurrentLocale();
    req.headers["Accept-Language"] = currentLocale;
    if (isBrowser) {
      document.cookie = `NEXT_LOCALE=${currentLocale}; max-age=31536000; path=/`;
    }

    if (req.skipAuth) {
      return req;
    }

    let token: string | null | undefined =
      keycloakService?.getToken?.() ?? initialAccessToken ?? null;

    const hasTenantInUrl =
      typeof req.url === "string" && req.url.includes("tenant");

    if (!hasTenantInUrl && token) {
      req.headers["Authorization"] = `Bearer ${token}`;
    }

    if (isBrowser) {
      try {
        localStorage.setItem("accessToken", JSON.stringify(token));
      } catch {
        /* ignore */
      }
    }

    const shouldTryRefresh =
      process.env.NODE_ENV !== "test" &&
      !!keycloakService?._kc?.isTokenExpired &&
      keycloakService._kc.isTokenExpired(5) &&
      !!token;

    if (shouldTryRefresh) {
      try {
        await keycloakService._kc.updateToken(-1);
        token = keycloakService.getToken?.() ?? token;
        if (!hasTenantInUrl && token) {
          req.headers["Authorization"] = `Bearer ${token}`;
        }
        if (isBrowser) {
          try {
            localStorage.setItem("accessToken", JSON.stringify(token));
          } catch {
            /* ignore */
          }
        }
      } catch (error) {}
    }

    if (!hasTenantInUrl && !req.headers?.["Authorization"] && token) {
      req.headers["Authorization"] = `Bearer ${token}`;
    }

    return req;
  });

  return {
    assessmentKit: assessmentKitService,
    assessments: {
      ...assessmentsService,
      report,
    },
    expertGroups: expertGroupsService,
    kitVersions: kitVersionsService,
    questions: questionsService,
    common: commonService,
    advice: adviceService,
    space: spaceService,
    user: userService,
  };
};

export type TService = ReturnType<typeof createService>;

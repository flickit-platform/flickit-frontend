import axios from "axios";
import i18next, { t } from "i18next";
import { BASE_URL } from "@constants";
import keycloakService from "@/service//keycloakService";

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
import { evidence } from "@/features/questions/api/evidence";

declare module "axios" {
  interface AxiosRequestConfig {
    isRefreshTokenReq?: boolean;
    skipAuth?: boolean;
  }
}

const getCurrentLocale = () =>
  i18next.language ?? navigator.language ?? "en-US";

export const createService = (
  signOut: () => void,
  accessToken: string,
  setAccessToken: any,
) => {
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.timeoutErrorMessage = t(
    "common.checkNetworkConnection",
  ) as string;

  axios.interceptors.request.use(async (req: any) => {
    const currentLocale = getCurrentLocale();
    req.headers["Accept-Language"] = currentLocale;
    document.cookie = `NEXT_LOCALE=${currentLocale}; max-age=31536000; path=/`;

    if (req.skipAuth && !keycloakService.getToken()) {
      return req;
    }

    const accessToken = keycloakService.getToken();
    const hasTenantInUrl = req.url.includes("tenant");

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
    if (!hasTenantInUrl && !req.headers?.["Authorization"] && accessToken) {
      req.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return req;
  });

  return {
    assessmentKit: assessmentKitService,
    assessments: {
      ...assessmentsService,
      report,
    },
    evidence: evidence,
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

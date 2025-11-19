import axios from "axios";
import i18next, { t } from "i18next";
import { BASE_URL } from "@constants";
import keycloakService from "@/service/keycloakService";

import * as assessmentKitService from "./assessment-kits";
import * as assessmentsService from "./assessments";
import * as expertGroupsService from "./expert-groups";
import * as kitVersionsService from "./kit-versions";
import * as questionsService from "./questions";
import spaceService from "./spaceService";
import adviceService from "./adviceService";
import userService from "./userService";
import { report } from "@/features/assessment-report/api/report";
import { evidence } from "@/features/questions/api/evidence";
import { ECustomErrorType } from "@/types";
import commonService from "./ commonService";

declare module "axios" {
  interface AxiosRequestConfig {
    isRefreshTokenReq?: boolean;
    skipAuth?: boolean;
    __selfHealTried?: boolean;
  }
}

const getCurrentLocale = () =>
  i18next.language ?? navigator.language ?? "en-US";

function getAssessmentId(): string | undefined {
  if (typeof window === "undefined") return;

  const path = window.location.pathname || "";
  const parts = path.split("/").filter(Boolean);

  const i = parts.findIndex((p) => p.toLowerCase() === "assessments");
  if (i === -1) return;

  const after = parts.slice(i + 1);
  if (!after.length) return;

  const first = after[0];

  if (first && first.length > 10) {
    return first;
  }
  const second = after[1];
  return second || undefined;
}

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

    if (req.skipAuth && !keycloakService.getToken()) return req;

    const token = keycloakService.getToken();
    const hasTenantInUrl = req.url.includes("tenant");

    if (!hasTenantInUrl) req.headers["Authorization"] = `Bearer ${token}`;

    localStorage.setItem("accessToken", JSON.stringify(token));
    if (keycloakService._kc.isTokenExpired(5) && token) {
      try {
        await keycloakService._kc.updateToken(-1);
        const newToken = keycloakService.getToken();
        req.headers["Authorization"] = `Bearer ${newToken}`;
        localStorage.setItem("accessToken", JSON.stringify(newToken));
      } catch (error) {
        console.error("Failed to update token:", error);
      }
    }
    if (!hasTenantInUrl && !req.headers?.["Authorization"] && token) {
      req.headers["Authorization"] = `Bearer ${token}`;
    }

    return req;
  });

  axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const cfg = error?.config as import("axios").AxiosRequestConfig;
      const code = error?.response?.data?.code as ECustomErrorType | undefined;

      if (!cfg || !code) throw error;

      const assessmentId = getAssessmentId();
      if (!assessmentId) throw error;

      try {
        switch (code) {
          case ECustomErrorType.CALCULATE_NOT_VALID:
            await assessmentsService.info.calculateMaturity({ assessmentId });
            break;
          case ECustomErrorType.CONFIDENCE_CALCULATION_NOT_VALID:
            await assessmentsService.info.calculateConfidence({ assessmentId });
            break;
          case ECustomErrorType.DEPRECATED:
            await assessmentsService.info.migrateKitVersion({ assessmentId });
            break;
          default:
            throw error;
        }

        return axios.request(cfg);
      } catch {
        throw error;
      }
    },
  );

  return {
    assessmentKit: assessmentKitService,
    assessments: {
      ...assessmentsService,
      report,
    },
    evidence,
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

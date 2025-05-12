import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

const commonService = {
  // ========== Kit Customization ==========
  getKitCustomTitle(
    { kitInfo }: { kitInfo: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { kitCustomId } = kitInfo;
    return axios.get(`/api/v1/kit-customs/${kitCustomId}/`, config);
  },

  updateKitCustom(
    { UpdateId, customData }: { UpdateId: any; customData: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { kitCustomId } = UpdateId;
    return axios.put(`/api/v1/kit-customs/${kitCustomId}/`, customData, config);
  },

  // ========== Path & Navigation ==========
  getPathInfo(
    {
      assessmentId,
      spaceId,
      questionnaireId,
    }: { assessmentId?: string; spaceId?: string; questionnaireId?: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/path-info?${
        assessmentId ? `assessment_id=${assessmentId}` : ""
      }${spaceId ? `&&space_id=${spaceId}` : ""}${
        questionnaireId ? `&&questionnaire_id=${questionnaireId}` : ""
      }`,
      { skipAuth: true, ...config },
    );
  },

  getBreadcrumbInfo(
    args: { assessmentId?: TId; spaceId?: TId; questionnaireId?: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    const {
      assessmentId: assessment_id,
      spaceId: space_id,
      questionnaireId: questionnaire_id,
    } = args ?? {};
    return axios.post(
      `/assessment/breadcrumbinfo/`,
      { assessment_id, space_id, questionnaire_id },
      config,
    );
  },

  // ========== Misc ==========
  getKitLanguages(args: any, config: AxiosRequestConfig<any> | undefined = {}) {
    return axios.get(`/api/v1/kit-languages/`, {
      skipAuth: true,
      ...config,
    });
  },

  getTenantInfo(config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/tenant/`, {
      skipAuth: true,
      ...config,
    });
  },

  compareAssessments(
    { data }: { data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(`/api/v1/assessments-compare/${data}`, config);
  },

  getImageBlob(args: { url: string }, config?: AxiosRequestConfig<any>) {
    const { url } = args ?? {};
    return axios.get(url, {
      ...config,
      responseType: "blob",
    });
  },
};

export default commonService;

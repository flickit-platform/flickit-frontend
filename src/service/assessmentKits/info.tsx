import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const info = {
  getTags(args: any, config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/assessment-kit-tags/`, config);
  },

  updateByDSL(
    args: { assessmentKitId?: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentKitId, data } = args ?? {};
    return axios.post(
      `/baseinfo/assessmentkits/update/${assessmentKitId}/`,
      data,
      config,
    );
  },

  create(args: { data: any }, config?: AxiosRequestConfig<any>) {
    const { data } = args ?? {};
    return axios.post(`/api/v1/assessment-kits/`, data, config);
  },

  getAll(args: any, config: AxiosRequestConfig<any> | undefined = {}) {
    const { langs, isPrivate } = args ?? {};
    return axios.get(`/api/v2/assessment-kits/`, {
      params: { isPrivate, langs },
      ...config,
    });
  },

  getOptions(args: any, config: AxiosRequestConfig<any> | undefined = {}) {
    const { query } = args ?? {};
    const params = query ? { query } : {};
    return axios.get(`/api/v1/assessment-kits/options/search/`, {
      params,
      ...config,
    });
  },

  clone(
    { assessmentKitId }: { assessmentKitId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessment-kits/${assessmentKitId}/clone/`,
      config,
    );
  },

  getCustomization(
    { kitInfo, customId }: { kitInfo: any; customId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const {
      kit: { id },
      kitCustomId,
    } = kitInfo;
    return axios.get(`/api/v1/assessment-kits/${id}/custom-subjects/`, {
      ...(config ?? {}),
      params: {
        ...((customId || { kitCustomId }) ?? {}),
      },
    });
  },

  getById(args: { id: TId }, config?: AxiosRequestConfig<any>) {
    const { id } = args ?? {};
    return axios.get(`/api/v1/assessment-kits/${id}/`, config);
  },

  getMinInfo(args: { assessmentKitId: TId }, config?: AxiosRequestConfig<any>) {
    const { assessmentKitId } = args ?? {};
    return axios.get(
      `/api/v1/assessment-kits/${assessmentKitId}/min-info/`,
      config,
    );
  },

  getInfo(args: { assessmentKitId: TId }, config?: AxiosRequestConfig<any>) {
    const { assessmentKitId } = args ?? {};
    return axios.get(
      `/api/v2/assessment-kits/${assessmentKitId}/info/`,
      config,
    );
  },

  getStats(args: { assessmentKitId: TId }, config?: AxiosRequestConfig<any>) {
    const { assessmentKitId } = args ?? {};
    return axios.get(
      `/api/v2/assessment-kits/${assessmentKitId}/stats/`,
      config,
    );
  },

  updateStats(
    args: { assessmentKitId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentKitId, data } = args ?? {};
    return axios.patch(
      `/api/v2/assessment-kits/${assessmentKitId}/`,
      data,
      config,
    );
  },

  remove(args: { id: TId }, config?: AxiosRequestConfig<any>) {
    const { id } = args ?? {};
    return axios.delete(`/api/v2/assessment-kits/${id}/`, config);
  },

  like(args: { id: TId }, config?: AxiosRequestConfig<any>) {
    const { id } = args ?? {};
    return axios.post(`/api/v2/assessment-kits/${id}/like/`, {
      ...(config ?? {}),
    });
  },

  getAllBanners(args: { lang: string }, config?: AxiosRequestConfig<any>) {
    const { lang } = args ?? {};

    return axios.get(`/api/v1/assessment-kits-banners/`, {
      ...(config ?? {}),
      params: {
        lang,
      },
    });
  },

  banner() {},
};

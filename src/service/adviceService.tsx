import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

const adviceService = {
  create(
    { data }: { data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(`/api/v1/advice-items/`, data, config);
  },

  update(
    { adviceItemId, data }: { adviceItemId: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/advice-items/${adviceItemId}/`, data, config);
  },

  remove(
    { adviceItemId }: { adviceItemId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(`/api/v1/advice-items/${adviceItemId}`, config);
  },

  getList(
    { assessmentId, page, size }: { assessmentId: string; page: number; size: number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/advice-items/`, {
      ...config,
      params: {
        assessmentId,
        page,
        size,
      },
    });
  },

  getImpactLevels(config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/advice-item-impact-levels/`, config);
  },

  getPriorityLevels(config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/advice-item-priority-levels/`, config);
  },

  getCostLevels(config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/advice-item-cost-levels/`, config);
  },
};

export default adviceService;

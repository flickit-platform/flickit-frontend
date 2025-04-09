import axios, { AxiosRequestConfig } from "axios";

export const info = {
  getOptions({ url }: { url: string }, config?: AxiosRequestConfig<any>) {
    return axios.get(url?.startsWith("/") ? url : `baseinfo/${url}/`, config);
  },

  getConfidenceLevels(args: {}, config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/confidence-levels/`, config);
  },
};

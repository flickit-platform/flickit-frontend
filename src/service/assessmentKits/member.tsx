import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const member = {
  getList(args: { assessmentKitId: TId }, config?: AxiosRequestConfig<any>) {
    const { assessmentKitId } = args ?? {};
    return axios.get(
      `/api/v1/assessment-kits/${assessmentKitId}/users/`,
      config,
    );
  },

  add(
    args: { assessmentKitId: TId; email: string },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentKitId, email } = args ?? {};
    return axios.post(
      `/api/v1/assessment-kits/${assessmentKitId}/users/`,
      { email },
      config,
    );
  },

  remove(
    args: { assessmentKitId: TId; userId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentKitId, userId } = args ?? {};
    return axios.delete(
      `/api/v1/assessment-kits/${assessmentKitId}/users/${userId}/`,
      config,
    );
  },
};

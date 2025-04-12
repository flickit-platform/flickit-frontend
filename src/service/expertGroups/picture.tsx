import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const picture = {
  update(
    args: { id: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/expert-groups/${args.id}/picture/`, args.data, {
      ...(config ?? {}),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  remove(
    args: { expertGroupId: number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(`/api/v1/expert-groups/${args.expertGroupId}/picture/`, {
      ...(config ?? {}),
    });
  },
};

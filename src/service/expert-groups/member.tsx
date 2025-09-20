import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const member = {
  list(
    args: { id: TId; status: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/expert-groups/${args.id}/members/`, {
      ...(config ?? {}),
      params: {
        status: args.status,
      },
    });
  },

  remove(
    args: { id: TId; userId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(`/api/v1/expert-groups/${args.id}/members/${args.userId}/`, {
      ...(config ?? {}),
    });
  },

  confirmInvitation(
    args: { token: TId; expert_group_id: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/expert-groups/${args.expert_group_id}/invite/${args.token}/confirm/`,
      {
        ...(config ?? {}),
      },
    );
  },

  declineInvitation(
    { expertGroupId }: { expertGroupId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/expert-groups/${expertGroupId}/leave/`,
      config,
    );
  },

  invite(
    args: { id: TId; email: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/expert-groups/${args.id}/invite/`,
      { email: args.email },
      config,
    );
  },
};

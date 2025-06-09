import { TId } from "@/types";
import axios, { AxiosRequestConfig } from "axios";

const space = {
  getList(
    { page, size }: { page: number; size: number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/spaces/`, {
      ...config,
      params: { size, page: page - 1 },
    });
  },

  getById({ spaceId }: { spaceId: string }, config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/spaces/${spaceId}/`, config);
  },

  checkCreate(config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/check-create-space/`, config);
  },

  markAsSeen({ spaceId }: { spaceId: TId }, config?: AxiosRequestConfig<any>) {
    return axios.put(`/api/v1/spaces/${spaceId}/seen/`, config);
  },

  remove({ spaceId }: { spaceId: string }, config?: AxiosRequestConfig<any>) {
    return axios.delete(`/api/v1/spaces/${spaceId}/`, config);
  },

  create(data: any, config?: AxiosRequestConfig<any>) {
    return axios.post(`/api/v1/spaces/`, data, config);
  },

  getTypes(config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/space-types/`, config);
  },

  update(
    { spaceId, data }: { spaceId: string; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/spaces/${spaceId}/`, data, config);
  },

  addMember(
    { spaceId, email }: { spaceId: string; email: string | undefined },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(`/api/v1/spaces/${spaceId}/members/`, { email }, config);
  },

  setCurrent(
    { spaceId }: { spaceId: string | number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(`/authinfo/changecurrentspace/${spaceId}/`, config);
  },

  removeMember(
    { spaceId, memberId }: { spaceId: string; memberId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/spaces/${spaceId}/members/${memberId}/`,
      config,
    );
  },

  removeInvite(
    { inviteId }: { inviteId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(`/api/v1/space-invitations/${inviteId}/`, config);
  },

  getMembers(
    { spaceId, size, page }: { spaceId: string; size?: number; page?: number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/spaces/${spaceId}/members/`, {
      ...config,
      params: { size, page },
    });
  },

  getInvitees(
    { spaceId }: { spaceId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/spaces/${spaceId}/invitees/`, config);
  },

  inviteMember(
    { id, data }: { id: TId; data: any },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(`/api/v1/spaces/${id}/invite/`, data, config);
  },

  leave({ spaceId }: { spaceId: TId }, config?: AxiosRequestConfig<any>) {
    return axios.delete(`/api/v1/spaces/${spaceId}/leave/`, config);
  },
  topSpaces(
        args?: any,
        config?: AxiosRequestConfig<any>
  ) {
    return axios.get(`/api/v1/spaces/top-spaces/`, config);
  },
};

export default space;

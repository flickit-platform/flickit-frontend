import axios, { AxiosRequestConfig } from "axios";

export const member = {
  inviteUser(
    args: { assessmentId: any; email: any; roleId: any },
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, email, roleId } = args ?? {};
    return axios.post(
      `/api/v1/assessments/${assessmentId}/invite/`,
      { email, roleId },
      config,
    );
  },

  getInvitees(
    { assessmentId }: { assessmentId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/assessments/${assessmentId}/invitees/`, config);
  },

  getUsers(
    {
      assessmentId,
      page,
      size,
    }: { assessmentId: string; page?: number; size?: number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(`/api/v1/assessments/${assessmentId}/users`, {
      ...(config ?? {}),
      params: { page, size },
    });
  },

  assignUserRole(
    args: { assessmentId: string; userId: string; roleId: number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/assessments/${args.assessmentId}/assessment-user-roles/`,
      args,
      config,
    );
  },

  removeUserRole(
    { assessmentId, args: userId }: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/assessments/${assessmentId}/assessment-user-roles/${userId}/`,
      config,
    );
  },

  updateUserRole(
    args: any,
    config?: AxiosRequestConfig<any>,
  ) {
    const { assessmentId, userId } = args;
    return axios.put(
      `/api/v1/assessments/${assessmentId}/assessment-user-roles/${userId}/`,
      args,
      config,
    );
  },

  updateInviteeRole(
    args: { id: string; roleId: number },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(`/api/v1/assessment-invites/${args.id}/`, args, config);
  },

  removeInvitee(
    args: { invitedId: string },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(`/api/v1/assessment-invites/${args.invitedId}/`, config);
  },

  getRoles(args: any, config?: AxiosRequestConfig<any>) {
    return axios.get(`/api/v1/assessment-user-roles/`, config);
  },

};

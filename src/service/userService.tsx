import axios, { AxiosRequestConfig } from "axios";

const user = {
  getCurrent(config?: AxiosRequestConfig) {
    return axios.get(`/api/v1/users/me/`, config);
  },

  getNotificationHash(config?: AxiosRequestConfig) {
    return axios.get(`/api/v1/notification-platform-settings/`, config);
  },

  getProfile(config?: AxiosRequestConfig) {
    return axios.get(`/api/v1/user-profile/`, config);
  },

  updatePicture({ data }: { data: any }, config?: AxiosRequestConfig) {
    return axios.put(`/api/v1/user-profile/picture/`, data, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateProfile(args: any, config?: AxiosRequestConfig) {
    const { data } = args ?? {};

    return axios.put(`/api/v1/user-profile/`, data, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getByEmail({ email }: { email: string }, config?: AxiosRequestConfig) {
    return axios.get(`/api/v1/users/email/${email}/`, config);
  },
};

export default user;

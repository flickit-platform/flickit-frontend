import axios, { AxiosRequestConfig } from "axios";
import { TId } from "@/types";

export const levelsCompetences = {
  create(
    { kitVersionId }: { kitVersionId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.post(
      `/api/v1/kit-versions/${kitVersionId}/level-competences/`,
      data,
      config,
    );
  },

  update(
    {
      kitVersionId,
      levelCompetenceId,
    }: { kitVersionId: TId; levelCompetenceId: TId },
    data: any,
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.put(
      `/api/v1/kit-versions/${kitVersionId}/level-competences/${levelCompetenceId}/`,
      data,
      config,
    );
  },

  remove(
    {
      kitVersionId,
      levelCompetenceId,
    }: { kitVersionId: TId; levelCompetenceId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.delete(
      `/api/v1/kit-versions/${kitVersionId}/level-competences/${levelCompetenceId}/`,
      config,
    );
  },

  getAll(
    { kitVersionId }: { kitVersionId: TId },
    config?: AxiosRequestConfig<any>,
  ) {
    return axios.get(
      `/api/v1/kit-versions/${kitVersionId}/level-competences`,
      config,
    );
  },
};

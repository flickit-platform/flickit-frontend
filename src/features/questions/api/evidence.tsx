import { TId } from "@/types";
import axios, { AxiosRequestConfig } from "axios";

interface ICreateEvidence {
  description: string;
  questionId: TId;
  assessmentId: TId;
  type: string;
  id?: TId;
}
export const evidence = {
  create(data: ICreateEvidence, config?: AxiosRequestConfig<any>) {
    return axios.post(`/api/v1/evidences/`, data, config);
  },
};

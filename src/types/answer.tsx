import { TId } from "./common";
import { IUserInfo } from "./user";

export interface IAnswerTemplate {
  title: string;
  index: number;
  id: TId;
}

export type TAnswerTemplates = IAnswerTemplate[];

export type TEvidences = {
  created_by_id: TId;
  creation_time: any;
  description: string;
  id: TId;
  last_modification_date: any;
  question_value_id: string;
};

export type TAnswer = {
  confidenceLevel?: {
    id: TId;
    title: string;
  };
  isNotApplicable?: boolean;
  selectedOption?: {
    id: TId;
    index: number;
    title: string;
  };
  approve?: boolean;
  id?: TId;
  index?: string | number;
  caption?: string;
  evidences?: TEvidences;
  approved?: boolean;
};

export interface IAnswerHistory {
  answer: TAnswer;
  creationTime: string;
  createdBy: IUserInfo;
}

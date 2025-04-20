import { TId } from "./common";

export interface MultiLang {[key : string]: {title?: string, description?: string}}

export interface KitDesignListItems {
  id: TId;
  title: string;
  value: number;
  index: number;
  description: string;
  weight?: number;
  questionsCount?: number;
  translations?: MultiLang;
}

export interface IKitVersion {
  id: TId;
  creationTime: string;
  assessmentKit: {
    id: TId;
    title: string;
    expertGroup: {
      id: TId;
      title: string;
    };
  };
}

import { TId } from "./common";

export interface KitDesignListItems {
  id: TId;
  title: string;
  value: number;
  index: number;
  description: string;
  weight?: number;
  questionsCount?: number;
  translations?: any;
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

export interface ILanguage {
  code: string;
  title: string;
}

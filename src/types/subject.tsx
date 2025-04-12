import { TId } from "./common";
import { IMaturityLevel } from "./maturity";

export interface IAttribute {
  id: number;
  title: string;
  description: string;
  index: number;
  confidenceValue: number;
  maturityLevel: IMaturityLevel;
}

export interface ISubject {
  id: number;
  title: string;
  index: number;
  description: string;
  confidenceValue: number | null;
  maturityLevel: IMaturityLevel;
  attributes: IAttribute[];
}

export interface ISubjectInfo {
  attributes?: IAttribute[];
  description: string;
  id: TId;
  image: string | null;
  progress?: number;
  status: string;
  title: string;
  total_answered_question_number: number;
  total_question_number: number;
  maturityLevel?: IMaturityLevel;
}

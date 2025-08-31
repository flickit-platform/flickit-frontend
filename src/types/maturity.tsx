import { TId } from "./common";

export interface IMaturityLevel {
  id?: TId | null;
  title: string;
  value: number;
  index: number;
  description: string;
  weight?: number;
  translations?: any;
  confidenceValue?: number;
}

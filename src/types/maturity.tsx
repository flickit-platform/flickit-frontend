import { TId } from "./common";

export interface IMaturityLevel {
  id: TId;
  title: string;
  value: number;
  index: number;
  description: string;
  weight?: number;
}

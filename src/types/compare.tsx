import { TId, TStatus } from "./common";

export type TCompareResultBaseInfos = ICompareResultBaseInfo[];

export interface ICompareResultCompareItems {
  title: string;
  items: any[];
}

export interface ICompareResultBaseInfo {
  id: TId;
  title: string;
  status: TStatus;
  assessment_kit: string;
}

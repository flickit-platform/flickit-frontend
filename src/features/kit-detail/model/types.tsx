import { IExpertGroup, TId } from "@/types";

type LevelCompetence = {
  title: string;
  value: number;
  maturityLevelId: number;
};

export interface KitStatsType {
  creationTime: string;
  lastModificationTime: string;
  questionnairesCount: number;
  attributesCount: number;
  questionsCount: number;
  maturityLevelsCount: number;
  likes: number;
  assessmentCounts: number;
  measuresCount: number;
  subjects: { title: string }[];
  expertGroup: IExpertGroup;
}

export interface KitInfoType {
  id: number;
  title: string;
  summary: string;
  published: boolean;
  isPrivate: boolean;
  price: number;
  about: string;
  tags: [];
  editable?: boolean;
  hasActiveVersion?: boolean;
  mainLanguage?: { code: string; title: string };
  metadata?: { context: string; goal: string };
  translations?: any;
  languages: { code: string; title: string }[];
  draftVersionId: number | null;
}

interface translations<T> {
  T: IIndexedItem;
}
interface IIndexedItem {
  id: TId;
  title: string;
  index: number;
  translations: translations<"FA" | "EN">;
}
export type IMaturityLevelIndexedItem = IIndexedItem & {
  description: string;
  competences: LevelCompetence[];
};
export interface KitDetailsType {
  maturityLevels: IMaturityLevelIndexedItem[];
  measures: IIndexedItem[];
  questionnaires: IIndexedItem[];
  subjects: (IIndexedItem & { attributes: IIndexedItem[] })[];
  answerRanges: IIndexedItem[];
}

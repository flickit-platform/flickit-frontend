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
export interface IIndexedItem {
  id: TId;
  title: string;
  index: number;
  translations?:  Record<string, { title?: string; description?: string }>;
}

type options = Omit<IIndexedItem, "id"> & { value: number };
export type IMaturityLevelIndexedItem = IIndexedItem & {
  description: string;
  competences: LevelCompetence[];
};
export type IAnswerRangeIndexedItem = Omit<IIndexedItem, "index"> & {
  answerOptions: options[];
  translations: Record<string, { title: string }>;
};
export interface KitDetailsType {
  maturityLevels: IMaturityLevelIndexedItem[];
  measures: IIndexedItem[];
  questionnaires: IIndexedItem[];
  subjects: (IIndexedItem & { attributes: IIndexedItem[] })[];
  answerRanges: IAnswerRangeIndexedItem[];
}

type QuestionDetaisl = IIndexedItem & {
  mayNotBeApplicable: boolean;
  advisable: boolean;
};

export interface QuestionnaireDetails {
  questionsCount: number;
  description: string;
  questions: QuestionDetaisl[];
  translations?: translations<"FA" | "EN">;
}

export interface QuestionDetailss {
  hint?: string;
  options: options[];
  attributeImpacts: {
    id: TId;
    title: string;
    affectedLevels: {
      maturityLevel: IIndexedItem;
      weight: number;
    }[];
  }[];
  answerRange?: {
    id: TId;
    title: string;
  };
  measure?: {
    id: TId;
    title: string;
  };
  translations: any;
}

export interface MeasureDetails {
  questionsCount: number;
  description: string;
  questions: (QuestionDetaisl & {
    options: options[];
    answerRange: { title: string; id: TId };
    questionnaire: IIndexedItem;
  })[];
  translations?: translations<"FA" | "EN">;
}

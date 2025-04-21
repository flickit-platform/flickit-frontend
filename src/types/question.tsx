import { IDefaultModel, TId, TImages } from "./common";
import { TAnswerTemplates, TAnswer } from "./answer";
import { IPermissions } from "./permissions";
import { MultiLangs } from "@/types/kitDesigner";

export interface IAssessmentResult {
  assessment_project: string;
  id: TId;
}

export interface IQuestion {
  id: TId;
  index: number;
  title: string;
  answer_templates: TAnswerTemplates;
  answer: TAnswer;
}

export interface IQuestionsModel {
  items: IQuestion[];
  assessment_result_id: string;
  permissions: any;
  total: number;
}

export interface IQuestionInfo {
  id: TId;
  index: number;
  answer: TAnswer | null;
  title: string;
  questionResultId?: string | number;
  options?: TAnswerTemplates;
  translations: any;
  hint?: string;
  mayNotBeApplicable?: boolean;
  is_not_applicable?: boolean;
  confidence_level?: any;
  advisable?: boolean;
  answerRangeId?: number;
  measureId?: number;
  issues?: {
    isUnanswered?: boolean;
    hasUnapprovedAnswer?: boolean;
    isAnsweredWithLowConfidence?: boolean;
    isAnsweredWithoutEvidences?: boolean;
    unresolvedCommentsCount?: number;
  };
}

export type TQuestionsInfo = {
  total_number_of_questions: number;
  resultId?: TId;
  questions: IQuestionInfo[];
  permissions?: IPermissions;
};

export interface IOption {
  id: TId;
  title: string;
  index: number;
  value: number;
  questionId?: TId;
}

export interface IQuestionsResultsModel
  extends IDefaultModel<IQuestionsResult> {}

export interface IQuestionsResult extends IAssessmentResult {
  answer: TAnswer;
  question: IQuestionResult;
}

export interface IQuestionResult {
  id: TId;
  index: number;
  title: string;
  question_impacts: TQuestionImpacts;
  quality_attributes: IQualityAttribute[];
}

export interface IQualityAttribute {
  code: string;
  description: string;
  id: TId;
  images: TImages;
  title: string;
}

export type TQuestionImpacts = IQuestionImpact[];

export interface IQuestionImpact {
  id: TId;
  level: number;
  quality_attribute: number;
}

export interface IQuestionsModel {
  items: IQuestion[];
  assessment_result_id: string;
  permissions: any;
  total: number;
}

export interface IQuestion {
  id: TId;
  index: number;
  title: string;
  answer_templates: TAnswerTemplates;
  answer: TAnswer;
}

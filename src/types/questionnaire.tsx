import { ITotalProgress, TId } from "./common";

export interface IQuestionnaire {
  answered_question: number;
  id: TId;
  question_number: number;
  progress: number;
  title: string;
  last_updated?: string;
}

export interface IQuestionnairesInfo {
  answerCount: number;
  id: TId;
  questionCount: number;
  progress: number;
  last_updated?: string;
  nextQuestion: number;
  title: string;
  description: string;
  subjects: { id: TId; title: string }[];
  issues: {
    answeredWithLowConfidence?: number;
    answeredWithoutEvidence?: number;
    unanswered?: number;
    unresolvedComments?: number;
    unapprovedAnswers?: number;
    unapprovedAnswer?: number;
  };
}

export interface IQuestionnairesPageDataModel {
  assessment_title: string;
  subjects: { id: TId; title: string }[];
}

export interface IQuestionnairesModel extends ITotalProgress {
  assessment_title: string;
  questionaries_info: IQuestionnairesInfo[];
}

export interface IQuestionnairesInfo {
  answerCount: number;
  id: TId;
  questionCount: number;
  progress: number;
  last_updated?: string;
  nextQuestion: number;
  title: string;
  description: string;
  subjects: { id: TId; title: string }[];
  issues: {
    answeredWithLowConfidence?: number;
    answeredWithoutEvidence?: number;
    unanswered?: number;
    unresolvedComments?: number;
    unapprovedAnswers?: number;
    unapprovedAnswer?: number;
  };
}

export interface IQuestionnaire {
  answered_question: number;
  id: TId;
  question_number: number;
  progress: number;
  title: string;
  last_updated?: string;
}

export interface IQuestionnaireModel {
  code: string;
  id: TId;
  title: string;
}

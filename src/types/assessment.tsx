import { VISIBILITY } from "@/utils/enumType";
import { TId, TStatus, IColor, IDefaultModel } from "./common";
import { IExpertGroup } from "./expertGroup";
import { ILanguage } from "./kitDesigner";
import { IMaturityLevel } from "./maturity";
import { IAssessmentPermissions } from "./permissions";
import { IQuestionnaire } from "./questionnaire";
import { ISubject } from "./subject";
import { IUserPermissions } from "./user";

export interface IAssessmentKit {
  code: string;
  description: string;
  id: TId;
  title: string;
  kit?: IAssessmentKit;
}

type LevelCompetence = {
  title: string;
  value: number;
  maturityLevelId: number;
};

interface AssessmentKitStatsSubjects {
  title: string;
}

interface AssessmentKitDetailsMaturityLevel {
  id: number;
  title: string;
  index: number;
  competences: LevelCompetence[];
}

export interface IAssessmentKitReportModel {
  id: number;
  title: string;
  summary: string;
  about?: string;
  maturityLevelCount: number;
  expertGroup: IExpertGroup;
  maturityLevels: IMaturityLevel[];
}

export interface IAssessmentReportModel {
  id: string;
  title: string;
  assessmentKit: IAssessmentKitReportModel;
  maturityLevel: IMaturityLevel;
  confidenceValue: number;
  isCalculateValid: boolean;
  isConfidenceValid: boolean;
  color: IColor;
  creationTime: string;
  lastModificationTime: string;
}

export interface AdviceItem {
  id: string;
  title: string;
  description: string;
  cost: { code: string; title: string };
  priority: { code: string; title: string };
  impact: { code: string; title: string };
}

export interface IAssessmentInfo {
  id: string;
  title: string;
  shortTitle?: string | null;
  space: {
    id: number;
    title: string;
  };
  kitCustomId?: string | null;
  kit?: {
    id: number;
    title?: string;
  };
  creationTime: string;
  lastModificationTime: string;
  createdBy: {
    id: string;
    displayName: string;
  };
  maturityLevel: {
    id: number;
    title: string;
    index: number;
    value: number;
    description?: string;
  };
  isCalculateValid: boolean;
  language: {
    code: string;
    title: string;
  };
  mode: {
    code: string;
    title: string;
  };
  manageable: boolean;
  viewable: boolean;
}

export interface IAssessmentModel extends IDefaultModel<IAssessment> {
  requested_space: string | null;
}

export interface IAssessmentResponse {
  assessment: any; // to be refined
  subjects: any[];
  assessmentPermissions: {
    manageable: boolean;
    exportable: boolean;
  };
}

export interface IAssessmentKitList {
  id: TId;
  title?: string;
  maturityLevelsCount: number;
}

export interface IGraphicalReport {
  assessment: {
    title: string;
    intro: string;
    overallInsight: string;
    creationTime: string;
    assessmentKit: any;
    maturityLevel: IMaturityLevel;
    confidenceValue: number;
    prosAndCons: string;
    language: string;
  };
  subjects: ISubject[];
  recommendationsSummary: string;
  advice: {
    adviceItems: AdviceItem[];
    narration: string;
  };
  permissions: IUserPermissions;
  assessmentProcess: {
    steps: string;
    participant: string;
  };
  lang: ILanguage;
  visibility: VISIBILITY;
  mode: ILanguage;
  linkHash: string;
}

type insight = {
  insight?: string;
  isValid?: boolean;
  creaationTime?: string;
};

export interface IAssessmentInsight {
  defaultInsight: insight | null;
  assessorInsight: insight | null;
  editable?: boolean;
}

export interface IAssessmentResponse {
  assessment: any;
  subjects: any[];
  assessmentPermissions: IAssessmentPermissions;
}

export interface AssessmentKitDetailsType {
  maturityLevel: AssessmentKitDetailsMaturityLevel;
  subjects: { id: number; title: string; index: number }[];
  questionnaires: { id: number; title: string; index: number }[];
}

export interface IAssessmentKitInfo {
  id: TId;
  title: string;
  summary: string;
  about: string;
  published: boolean;
  isPrivate: boolean;
  creationTime: string;
  lastModificationTime: string;
  like: {
    count: number;
    liked: boolean;
  };
  assessmentsCount: number;
  subjectsCount: number;
  questionnairesCount: number;
  expertGroupId: number;
  subjects: ISubject[];
  questionnaires: IQuestionnaire[];
  maturityLevels: IMaturityLevel[];
  tags: { id: TId; title: string }[];
}

export interface AssessmentKitStatsType {
  creationTime: string;
  lastModificationTime: string;
  questionnairesCount: number;
  attributesCount: number;
  questionsCount: number;
  maturityLevelsCount: number;
  likes: number;
  assessmentCounts: number;
  subjects: AssessmentKitStatsSubjects[];
  expertGroup: IExpertGroup[];
}

export interface AssessmentKitInfoType {
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
}

export interface IAssessmentModel extends IDefaultModel<IAssessment> {
  requested_space: string | null;
}

export interface IAssessment {
  id: TId;
  lastModificationTime: string;
  status: TStatus;
  title: string;
  hasReport: boolean;
  color: IColor;
  isCalculateValid: boolean;
  isConfidenceValid?: boolean;
  assessment_results: string[];
  kit: IAssessmentKitList;
  confidenceValue: number;
  maturityLevel: IMaturityLevel;
  mode?: { code: string };
  permissions: {
    canManageSettings: boolean;
    canViewReport: boolean;
    canShareReport: boolean;
    canViewDashboard: boolean;
    canViewQuestionnaires: boolean;
    canManageVisibility: boolean;
  };
  language: ILanguage;
}

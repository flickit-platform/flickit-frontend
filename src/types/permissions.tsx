export interface IPermissions {
  viewAssessment: boolean;
  viewEvidenceAttachment: boolean;
  answerQuestion: boolean;
  viewQuestionnaireQuestions: boolean;
  deleteEvidenceAttachment: boolean;
  viewAssessmentUserList: boolean;
  viewAnswerHistory: boolean;
  calculateAssessment: boolean;
  viewAssessmentList: boolean;
  deleteEvidence: boolean;
  viewSubjectReport: boolean;
  addEvidence: boolean;
  viewAssessmentReport: boolean;
  deleteAssessment: boolean;
  updateUserAssessmentRole: boolean;
  calculateConfidence: boolean;
  updateAssessment: boolean;
  grantUserAssessmentRole: boolean;
  createAdvice: boolean;
  viewEvidenceList: boolean;
  viewAssessmentProgress: boolean;
  deleteUserAssessmentRole: boolean;
  viewAttributeEvidenceList: boolean;
  viewAssessmentInviteeList: boolean;
  viewSubjectProgress: boolean;
  updateEvidence: boolean;
  viewAttributeScoreDetail: boolean;
  viewAssessmentQuestionnaireList: boolean;
  viewEvidence: boolean;
  createAssessment: boolean;
  addEvidenceAttachment: boolean;
  exportAssessmentReport: boolean;
  readonly?: boolean;
  viewDashboard?: boolean;
  approveAnswer?: boolean;
}

export interface IAssessmentPermissions {
  manageable: boolean;
  exportable: boolean;
}

export interface RolesType {
  items: {
    id: number;
    title: string;
    description: string;
  }[];
}

import axios, { AxiosRequestConfig } from "axios";
import i18next, { t } from "i18next";
import { TId } from "@types";
import { BASE_URL } from "@constants";
import keycloakService from "@/service//keycloakService";

declare module "axios" {
  interface AxiosRequestConfig {
    isRefreshTokenReq?: boolean;
  }
}

const getCurrentLocale = () =>
  i18next.language || navigator.language || "en-US";

export const createService = (
  signOut: () => void,
  accessToken: string,
  setAccessToken: any,
) => {
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.timeoutErrorMessage = t("checkNetworkConnection") as string;

  axios.interceptors.request.use(async (req: any) => {
    const accessToken = keycloakService.getToken();
    const hasTenantInUrl = req.url.includes("tenant");

    const currentLocale = getCurrentLocale();
    req.headers["Accept-Language"] = currentLocale;
    document.cookie = `NEXT_LOCALE=${currentLocale}; max-age=31536000; path=/`;
    if (!hasTenantInUrl) {
      req.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    if (keycloakService._kc.isTokenExpired(5) && accessToken) {
      try {
        await keycloakService._kc.updateToken(-1);
        const newAccessToken = keycloakService.getToken();
        req.headers["Authorization"] = `Bearer ${newAccessToken}`;
        localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
      } catch (error) {
        console.error("Failed to update token:", error);
      }
    }
    if (!hasTenantInUrl && !req.headers?.["Authorization"] && accessToken) {
      req.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return req;
  });

  const service = {
    activateUser(
      { uid, token }: { uid: string; token: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/authinfo/activate/${uid}/${token}/`, config);
    },
    signIn(
      data: { email: string; password: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(`/authinfo/jwt/create/`, data, config);
    },
    signUp(
      data: { display_name: string; email: string; password: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(`/authinfo/users/`, data, config);
    },
    getSignedInUser(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/users/me/`, config);
    },
    getSubscriberHash(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/notification-platform-settings/`, config);
    },
    getUserProfile(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/user-profile/`, config);
    },
    updateUserProfilePicture(
      args: { data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { data = {} } = args ?? {};

      return axios.put(`/api/v1/user-profile/picture/`, data, {
        ...(config ?? {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    updateUserInfo(args: any, config: AxiosRequestConfig<any> | undefined) {
      const { data } = args ?? {};
      return axios.put(`/api/v1/user-profile/`, data, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    fetchSpaces(
      args: { page: number; size: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { page = 1, size = 10 } = args ?? {};
      return axios.get(`/api/v1/spaces/`, {
        ...(config ?? {}),
        params: { size, page: page - 1 },
      });
    },
    fetchSpace(
      { spaceId }: { spaceId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/spaces/${spaceId}/`, config);
    },
    checkCreateSpace(arg: any, config?: AxiosRequestConfig<any>) {
      return axios.get(`/api/v1/check-create-space/`, config);
    },
    seenSpaceList(
      { spaceId }: { spaceId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(`/api/v1/spaces/${spaceId}/seen/`, config);
    },
    deleteSpace(
      { spaceId }: { spaceId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(`/api/v1/spaces/${spaceId}/`, config);
    },
    createSpace(data: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.post(`/api/v1/spaces/`, data, config);
    },
    fetchSpaceType(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/space-types/`, config);
    },
    updateSpace(
      { spaceId, data }: { spaceId: string; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(`/api/v1/spaces/${spaceId}/`, data, config);
    },
    addMemberToSpace(
      args: { spaceId: string; email: string | undefined },
      config?: AxiosRequestConfig<any>,
    ) {
      const { spaceId, email } = args ?? {};
      return axios.post(
        `/api/v1/spaces/${spaceId}/members/`,
        {
          email,
        },
        config,
      );
    },

    grantReportAccess(
      args: { assessmentId: any; email: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, email } = args ?? {};

      return axios.post(
        `/api/v1/assessments/${assessmentId}/grant-report-access/`,
        { email },
        {
          ...(config ?? {}),
        },
      );
    },
    fetchGraphicalReportUsers(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/users-with-report-access/`,
        config,
      );
    },
    inviteMemberToAssessment(
      args: { assessmentId: any; email: any; roleId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, email, roleId } = args ?? {};

      return axios.post(
        `/api/v1/assessments/${assessmentId}/invite/`,
        { email, roleId },
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAssessmentMembersInvitees(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}/invitees/`, config);
    },
    fetchKitCustomization(
      { kitInfo, customId }: { kitInfo: any; customId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const {
        kit: { id },
        kitCustomId,
      } = kitInfo;
      return axios.get(`/api/v1/assessment-kits/${id}/custom-subjects/`, {
        ...(config || {}),
        params: {
          ...(customId || { kitCustomId } || {}),
        },
      });
    },
    fetchKitCustomTitle(
      { kitInfo }: { kitInfo: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { kitCustomId } = kitInfo;
      return axios.get(`/api/v1/kit-customs/${kitCustomId}/`, config);
    },
    sendKitCustomization(
      { assessmentId, customData }: { assessmentId: TId; customData: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/assign-kit-custom/`,
        customData,
        config,
      );
    },
    updateKitCustomization(
      { UpdateId, customData }: { UpdateId: any; customData: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { kitCustomId } = UpdateId;
      return axios.put(
        `/api/v1/kit-customs/${kitCustomId}/`,
        customData,
        config,
      );
    },
    RemoveAssessmentMembersInvitees(
      args: { invitedId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      const { invitedId } = args;
      return axios.delete(`/api/v1/assessment-invites/${invitedId}/`, config);
    },
    loadUserByEmail(args: { email: string }, config?: AxiosRequestConfig<any>) {
      const { email } = args ?? {};
      return axios.get(`/api/v1/users/email/${email}/`, config);
    },
    setCurrentSpace(
      { spaceId }: { spaceId: string | number },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(`/authinfo/changecurrentspace/${spaceId}/`, config);
    },
    deleteSpaceMember(
      { spaceId, memberId }: { spaceId: string; memberId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/spaces/${spaceId}/members/${memberId}/`,
        config,
      );
    },
    deleteSpaceInvite(
      { inviteId }: { inviteId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(`/api/v1/space-invitations/${inviteId}/`, config);
    },
    fetchSpaceMembers(
      {
        spaceId,
        size,
        page,
      }: { spaceId: string; size?: number; page?: number },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/spaces/${spaceId}/members/`, {
        ...(config ?? {}),
        params: {
          size,
          page,
        },
      });
    },
    fetchSpaceMembersInvitees(
      { spaceId }: { spaceId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/spaces/${spaceId}/invitees/`, config);
    },
    fetchPathInfo(
      {
        assessmentId,
        spaceId,
        questionnaireId,
      }: { assessmentId?: string; spaceId?: string; questionnaireId?: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/path-info?${
          assessmentId ? `assessment_id=${assessmentId}` : ""
        }${spaceId ? `&&space_id=${spaceId}` : ""}${
          questionnaireId ? `&&questionnaire_id=${questionnaireId}` : ""
        }`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAssessments(
      {
        spaceId,
        assessmentKitId,
        size,
        page,
      }: {
        spaceId: string | undefined;
        assessmentKitId?: TId;
        size: number;
        page: number;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/space-assessments/`, {
        ...(config ?? {}),
        params: {
          page: page,
          size: size,
          spaceId: spaceId,
          ...(assessmentKitId && { assessment_kit_id: assessmentKitId }),
        },
      });
    },
    AssessmentsLoad(
      { assessmentId }: { assessmentId?: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}`, {
        ...(config ?? {}),
      });
    },
    createAssessment(
      { data }: { data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(`/api/v2/assessments/`, data, config);
    },
    fetchAssessmentsRoles(args: any, config?: AxiosRequestConfig<any>) {
      return axios.get(`/api/v1/assessment-user-roles/`, config);
    },
    fetchAssessmentMembers(
      {
        assessmentId,
        page,
        size,
      }: { assessmentId: string; page?: number; size?: number },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}/users`, {
        ...(config ?? {}),
        params: {
          page: page,
          size: size,
        },
      });
    },
    addRoleMember(
      args: { assessmentId: string; userId: string; roleId: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId } = args ?? {};
      return axios.post(
        `/api/v1/assessments/${assessmentId}/assessment-user-roles/`,
        args,
        config,
      );
    },
    deleteUserRole(
      { assessmentId, args: userId }: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/assessments/${assessmentId}/assessment-user-roles/${userId}/
`,
        config,
      );
    },
    editUserRole(args: any, config: AxiosRequestConfig<any> | undefined) {
      const { assessmentId, userId } = args;
      return axios.put(
        `/api/v1/assessments/${assessmentId}/assessment-user-roles/${userId}/`,
        args,
        config,
      );
    },
    editUserRoleInvited(
      args: { id: string; roleId: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id } = args;
      return axios.put(`/api/v1/assessment-invites/${id}/`, args, config);
    },
    loadAssessment(
      { rowId }: { rowId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/assessment/projects/${rowId}/`, config);
    },
    updateAssessment(
      { id, data }: { id: any; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(`/api/v2/assessments/${id}/`, data, config);
    },
    deleteAssessment({ id }: { id: any }, config?: AxiosRequestConfig<any>) {
      return axios.delete(`/api/v1/assessments/${id}/`, config);
    },
    comparessessments(
      { data }: { data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(`/api/v1/assessments-compare/${data}`, {
        ...(config ?? {}),
      });
    },
    fetchSubjectInsight(
      { assessmentId, subjectId }: { assessmentId: string; subjectId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/insight`,
        {
          ...(config ?? {}),
        },
      );
    },
    ApproveAISubject(
      { assessmentId, subjectId }: { assessmentId: string; subjectId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/approve-insight/`,
        config,
      );
    },
    InitInsight(
      { assessmentId, subjectId }: { assessmentId: string; subjectId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/init-insight/`,
        {
          ...(config ?? {}),
        },
      );
    },
    updateSubjectInsight(
      {
        assessmentId,
        data,
        subjectId,
      }: { assessmentId: string; data: any; subjectId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/insight/`,
        data,
        {
          ...(config ?? {}),
        },
      );
    },
    initAssessmentInsight(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/init-overall-insight/`,
        config,
      );
    },
    approveAssessmentInsight(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/approve-overall-insight/`,
        config,
      );
    },
    fetchAssessmentInsight(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}/overall-insight/`, {
        ...(config ?? {}),
      });
    },
    updateAssessmentInsight(
      { assessmentId, data }: { assessmentId: string; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/overall-insight/`,
        data,
        {
          ...(config ?? {}),
        },
      );
    },
    postAdviceItem({ data }: { data: any }, config?: AxiosRequestConfig<any>) {
      return axios.post(`/api/v1/advice-items/`, data, {
        ...(config ?? {}),
      });
    },
    updateAdviceItem(
      { adviceItemId, data }: { adviceItemId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(`/api/v1/advice-items/${adviceItemId}/`, data, {
        ...(config ?? {}),
      });
    },
    fetchAdviceNarration(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/advice-narration/
`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAdviceImpactList(args: any, config?: AxiosRequestConfig<any>) {
      return axios.get(`/api/v1/advice-item-impact-levels/`);
    },
    fetchAdvicePriorityList(args: any, config?: AxiosRequestConfig<any>) {
      return axios.get(`/api/v1/advice-item-priority-levels/`);
    },
    fetchCostList(args: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/advice-item-cost-levels/`);
    },
    updateAdviceNarration(
      { assessmentId, data }: { assessmentId: string; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/advice-narration/`,
        data,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAdviceItems(
      args: { assessmentId: string; page: number; size: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, page, size } = args ?? {};
      return axios.get(`/api/v1/advice-items/`, {
        ...(config ?? {}),
        params: {
          assessmentId: assessmentId,
          page,
          size,
        },
      });
    },
    deleteAdviceItem(
      { adviceItemId }: { adviceItemId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(`/api/v1/advice-items/${adviceItemId}`, config);
    },

    fetchExportReport(
      { assessmentId, attributeId }: { assessmentId: string; attributeId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/export-report/attributes/${attributeId}/`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchGraphicalReport(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/graphical-report/`,
        {
          ...(config ?? {}),
        },
      );
    },
    patchUpdateReportFields(
      { assessmentId, reportData }: { assessmentId: string; reportData: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.patch(
        `/api/v1/assessments/${assessmentId}/report-metadata/`,
        reportData,
        config,
      );
    },
    fetchReportFields(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}/report-metadata/`, {
        ...(config ?? {}),
      });
    },
    PublishReportStatus(
      { assessmentId, data }: { assessmentId: string; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/report-publish-status/`,
        data,
        {
          ...(config ?? {}),
        },
      );
    },
    loadAttributeInsight(
      { assessmentId, attributeId }: { assessmentId: string; attributeId: TId },
      config?: AxiosRequestConfig<any> | undefined,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/insight/`,
        config,
      );
    },
    generateAIInsight(
      { assessmentId, attributeId }: { assessmentId: string; attributeId: TId },
      config?: AxiosRequestConfig<any> | undefined,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/ai-insight/`,
        config,
      );
    },

    fetchScoreState(
      args: {
        assessmentId: TId;
        attributeId: TId;
        levelId: TId;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, attributeId, levelId } = args ?? {};
      return axios.get(
        `/api/v1/assessments/${assessmentId}/report/attributes/${attributeId}/stats/`,
        {
          ...(config ?? {}),
          params: {
            maturityLevelId: levelId,
          },
        },
      );
    },

    fetchMeasures(
      args: {
        assessmentId: TId;
        attributeId: TId;
        sort: any;
        order: any;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, attributeId, sort, order } = args ?? {};
      return axios.get(
        `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/measures/
`,
        {
          ...(config ?? {}),
          params: {
            sort: sort,
            order: order,
          },
        },
      );
    },
    ApprovedAIAttribute(
      args: {
        assessmentId: TId;
        attributeId: TId;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, attributeId } = args ?? {};
      return axios.put(
        `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/approve-insight/`,
        config,
      );
    },
    createAttributeInsight(
      {
        data,
        assessmentId,
        attributeId,
      }: { data: any; assessmentId: string; attributeId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/attributes/${attributeId}/insight/`,
        data,
        config,
      );
    },
    postMaturityLevel(
      { kitVersionId }: { kitVersionId: any },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/maturity-levels/`,
        data,
        config,
      );
    },
    updateMaturityLevel(
      {
        kitVersionId,
        maturityLevelId,
      }: { kitVersionId: TId; maturityLevelId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/maturity-levels/${maturityLevelId}/`,
        data,
        config,
      );
    },
    loadKitVersion(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/kit-versions/${kitVersionId}/`, config);
    },
    validateKitVersion(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/validate/`,
        config,
      );
    },
    deleteMaturityLevel(
      {
        kitVersionId,
        maturityLevelId,
      }: { kitVersionId: TId; maturityLevelId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/maturity-levels/${maturityLevelId}`,
        config,
      );
    },

    getMaturityLevels(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/maturity-levels`,
        config,
      );
    },

    changeMaturityLevelsOrder(
      { kitVersionId }: { kitVersionId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/maturity-levels-change-order/`,
        data,
        config,
      );
    },

    addCompetencyToMaturityLevel(
      { kitVersionId }: { kitVersionId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/level-competences/`,
        data,
        config,
      );
    },

    updateCompetencyOfMaturityLevel(
      {
        kitVersionId,
        levelCompetenceId,
      }: { kitVersionId: TId; levelCompetenceId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/level-competences/${levelCompetenceId}/`,
        data,
        config,
      );
    },

    deleteCompetencyOfMaturityLevel(
      {
        kitVersionId,
        levelCompetenceId,
      }: { kitVersionId: TId; levelCompetenceId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/level-competences/${levelCompetenceId}/`,
        config,
      );
    },

    getMaturityLevelsCompetences(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/level-competences`,
        config,
      );
    },
    activateKit(
      { kitVersionId }: { kitVersionId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/activate/`,
        data,
        config,
      );
    },
    deleteKitVersion(
      { kitVersionId }: { kitVersionId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(`/api/v1/kit-versions/${kitVersionId}/`, config);
    },
    fetchSubjectKit(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/subjects/`,
        config,
      );
    },
    postSubjectKit(
      { kitVersionId, data }: { kitVersionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/subjects/`,
        data,
        config,
      );
    },
    changeSubjectOrder(
      { kitVersionId }: { kitVersionId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/subjects-change-order/`,
        data,
        config,
      );
    },
    deleteSubjectKit(
      { kitVersionId, subjectId }: { kitVersionId: TId; subjectId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/subjects/${subjectId}/`,
        config,
      );
    },
    updateKitSubject(
      {
        kitVersionId,
        subjectId,
        data,
      }: { kitVersionId: TId; subjectId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/subjects/${subjectId}/`,
        data,
        config,
      );
    },
    fetchAttributeKit(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/attributes/`,
        config,
      );
    },
    postAttributeKit(
      { kitVersionId, data }: { kitVersionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/attributes/`,
        data,
        config,
      );
    },
    changeAttributeOrder(
      { kitVersionId }: { kitVersionId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/attributes-change-order/`,
        data,
        config,
      );
    },
    deleteAttributeKit(
      { kitVersionId, attributeId }: { kitVersionId: TId; attributeId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/attributes/${attributeId}/`,
        config,
      );
    },
    updateKitAttribute(
      {
        kitVersionId,
        attributeId,
        data,
      }: { kitVersionId: TId; attributeId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/attributes/${attributeId}/`,
        data,
        config,
      );
    },
    fetchPreAdviceInfo(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/pre-advice-info/`,
        config,
      );
    },
    fetchAssessment(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v1/assessments/${assessmentId}/insights/`, config);
    },
    fetchInsightsIssues(
      { assessmentId }: { assessmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/insights-issues/`,
        config,
      );
    },
    fetchSubject(
      { subjectId, assessmentId }: { subjectId: string; assessmentId: string },
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      return axios.get(
        `/api/v2/assessments/${assessmentId}/report/subjects/${subjectId}/`,
        config,
      );
    },
    fetchQuestionnairesKit(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/questionnaires/`,
        config,
      );
    },
    changeQuestionnairesOrder(
      { kitVersionId }: { kitVersionId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/questionnaires-change-order/`,
        data,
        config,
      );
    },
    deleteQuestionnairesKit(
      {
        kitVersionId,
        questionnaireId,
      }: { kitVersionId: TId; questionnaireId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/questionnaires/${questionnaireId}/`,
        config,
      );
    },
    postQuestionnairesKit(
      { kitVersionId, data }: { kitVersionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/questionnaires/`,
        data,
        config,
      );
    },
    updateKitQuestionnaires(
      {
        kitVersionId,
        questionnaireId,
        data,
      }: { kitVersionId: TId; questionnaireId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/questionnaires/${questionnaireId}/`,
        data,
        config,
      );
    },
    fetchQuestionListKit(
      {
        kitVersionId,
        questionnaireId,
      }: { kitVersionId: TId; questionnaireId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/questionnaires/${questionnaireId}/questions/`,
        {
          ...(config ?? {}),
          params: {
            page: 0,
            size: 100,
          },
        },
      );
    },
    changeQuestionsOrder(
      { kitVersionId }: { kitVersionId: TId },
      data: any,
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/questions-change-order/`,
        data,
        config,
      );
    },
    postQuestionsKit(
      { kitVersionId, data }: { kitVersionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/questions/`,
        data,
        config,
      );
    },
    loadQuestionsKit(
      { kitVersionId, questionId }: { kitVersionId: TId; questionId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/`,
        config,
      );
    },
    updateQuestionsKit(
      {
        kitVersionId,
        questionId,
        data,
      }: { kitVersionId: TId; questionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/`,
        data,
        config,
      );
    },
    deleteQuestionsKit(
      { kitVersionId, questionId }: { kitVersionId: TId; questionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/`,
        config,
      );
    },
    postQuestionImpactsKit(
      { kitVersionId, data }: { kitVersionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/question-impacts/`,
        data,
        config,
      );
    },
    loadQuestionImpactsList(
      { kitVersionId, questionId }: { kitVersionId: TId; questionId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/impacts/`,
        config,
      );
    },
    updateQuestionImpactsKit(
      {
        kitVersionId,
        questionImpactId,
        data,
      }: { kitVersionId: TId; questionImpactId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/question-impacts/${questionImpactId}/`,
        data,
        config,
      );
    },
    deleteQuestionImpactsKit(
      {
        kitVersionId,
        questionImpactId,
      }: { kitVersionId: TId; questionImpactId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/question-impacts/${questionImpactId}/`,
        config,
      );
    },
    loadAnswerOptionsList(
      { kitVersionId, questionId }: { kitVersionId: TId; questionId: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/questions/${questionId}/options/`,
        config,
      );
    },
    deleteAnswerOptionsKit(
      {
        kitVersionId,
        answerOptionId,
      }: { kitVersionId: TId; answerOptionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/kit-versions/${kitVersionId}/answer-options/${answerOptionId}/`,
        config,
      );
    },
    postAnswerOptionsKit(
      {
        kitVersionId,
        data,
      }: {
        kitVersionId: TId;
        data?: { questionId: number; index: number; title: string };
      },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/answer-options/`,
        data,
        config,
      );
    },
    loadAnswerRangesList(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/answer-ranges/`,
        config,
      );
    },
    updateAnswerRangesKit(
      {
        kitVersionId,
        answerRangeId,
        data,
      }: { kitVersionId: TId; answerRangeId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/answer-ranges/${answerRangeId}/`,
        data,
        config,
      );
    },
    fetchAnswerRangeKit(
      { kitVersionId }: { kitVersionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/kit-versions/${kitVersionId}/answer-ranges/`,
        config,
      );
    },
    updateKitAnswerRange(
      {
        kitVersionId,
        answerRangeId,
        data,
      }: { kitVersionId: TId; answerRangeId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/answer-ranges/${answerRangeId}/`,
        data,
        config,
      );
    },
    postKitAnswerRange(
      { kitVersionId, data }: { kitVersionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/answer-ranges/`,
        data,
        config,
      );
    },
    postOptionsKit(
      { kitVersionId, data }: { kitVersionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/kit-versions/${kitVersionId}/answer-range-options/`,
        data,
        config,
      );
    },
    EditAnswerRangeOption(
      {
        kitVersionId,
        answerOptionId,
        data,
      }: { kitVersionId: TId; answerOptionId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/kit-versions/${kitVersionId}/answer-options/${answerOptionId}/`,
        data,
        config,
      );
    },
    createAdvice(
      {
        assessmentId,
        attributeLevelTargets,
      }: { assessmentId: string; attributeLevelTargets: any },
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/advice/`,
        {
          attributeLevelTargets,
        },
        config,
      );
    },
    createAINarration(
      {
        assessmentId,
        attributeLevelTargets,
        adviceListItems,
      }: {
        assessmentId: string;
        attributeLevelTargets: any;
        adviceListItems: any;
      },
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/advice-narration-ai/`,
        {
          attributeLevelTargets,
          adviceListItems,
        },
        config,
      );
    },
    fetchSubjectProgress(
      { subjectId, assessmentId }: { subjectId: string; assessmentId: string },
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/subjects/${subjectId}/progress/`,
        config,
      );
    },
    migrateKitVersion(
      args: { assessmentId: TId },
      config?: AxiosRequestConfig<any> | undefined,
    ) {
      const { assessmentId } = args ?? {};
      return axios.post(
        `/api/v1/assessments/${assessmentId}/migrate-kit-version/`,
        {
          ...config,
        },
      );
    },
    fetchQuestionnaires(
      args: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId } = args ?? {};
      return axios.get(`/api/v2/assessments/${assessmentId}/questionnaires/`, {
        ...config,
      });
    },
    fetchQuestionnaire(
      { questionnaireId }: { questionnaireId: string | undefined },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/baseinfo/questionnaires/${questionnaireId}/`, config);
    },
    fetchOptions({ url }: { url: string }, config?: AxiosRequestConfig<any>) {
      return axios.get(url?.startsWith("/") ? url : `baseinfo/${url}/`, config);
    },
    createResult(
      { subjectId = null }: { subjectId: string | undefined | null },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        "/assessment/results/",
        {
          assessment_project: subjectId,
        },
        config,
      );
    },
    fetchResults(arg: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/results/`, config);
    },
    submitAnswer(
      { assessmentId, data }: { assessmentId: TId | undefined; data: any },
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      return axios.put(
        `/api/v2/assessments/${assessmentId ?? ""}/answer-question/`,
        data,
        { ...config },
      );
    },
    fetchQuestions(
      { questionnaireId }: { questionnaireId: string | undefined },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/baseinfo/questionnaires/${questionnaireId}/questions/`,
        config,
      );
    },
    fetchQuestionsResult(
      {
        questionnaireId,
        assessmentId,
        page,
        size,
      }: {
        questionnaireId: TId;
        assessmentId: TId;
        size: number;
        page: number;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/questionnaires/${questionnaireId}/`,
        {
          ...(config ?? {}),
          params: {
            page: page,
            size: size,
          },
        },
      );
    },
    fetchAnswersHistory(
      {
        questionId,
        assessmentId,
        page,
        size,
      }: {
        questionId: TId;
        assessmentId: TId;
        size: number;
        page: number;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/questions/${questionId}/answer-history/`,
        {
          ...(config ?? {}),
          params: {
            page: page - 1,
            size: size,
          },
        },
      );
    },
    fetchQuestionIssues(
      args: { assessmentId: TId; questionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, questionId } = args ?? {};

      return axios.get(
        `/api/v1/assessments/${assessmentId}/questions/${questionId}/issues`,
        {
          ...(config ?? {}),
        },
      );
    },
    approveAnswer(
      { assessmentId, data }: { assessmentId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/approve-answer/`,
        data,
        config,
      );
    },
    fetchTotalProgress(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/assessment/progress/${assessmentId}/`, config);
    },
    fetchAssessmentTotalProgress(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/api/v2/assessments/${assessmentId}/progress/`, config);
    },
    calculateMaturityLevel(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/calculate/`,
        config,
      );
    },
    calculateConfidenceLevel(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessments/${assessmentId}/calculate-confidence/`,
        config,
      );
    },
    fetchQuestionnairesPageData(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/assessment/subjects/${assessmentId}/`, config);
    },

    fetchQuestionnaireResult(
      {
        resultId,
        questionnaireId,
      }: { resultId: string; questionnaireId: string },
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      return axios.get(`/assessment/results/${resultId}/questionvalues/`, {
        ...config,
        params: {
          questionnaire_pk: questionnaireId,
          ...(config.params ?? {}),
        },
      });
    },
    fetchCompare(args: any, config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/assessment/loadcompare/`, {
        ...config,
        withCredentials: true,
      });
    },
    fetchCompareResult(
      args: { assessmentIds: string[] },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentIds } = args ?? {};
      return axios.post(
        `/assessment/compare/`,
        { assessment_list_ids: assessmentIds ?? [] },
        {
          ...config,
          withCredentials: true,
        },
      );
    },
    fetchAssessmentPermissions(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/permissions/`,
        config,
      );
    },
    fetchDashboard(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(
        `/api/v1/assessments/${assessmentId}/dashboard/`,
        config,
      );
    },
    approveInsights(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/approve-insights/`,
        { ...config },
      );
    },
    generateInsights(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/generate-insights/`,
        { ...config },
      );
    },
    regenerateInsights(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/regenerate-expired-insights/`,
        { ...config },
      );
    },
    approveExpiredInsights(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/approve-expired-insights/`,
        { ...config },
      );
    },
    resolvedAllComments(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(
        `/api/v1/assessments/${assessmentId}/resolve-comments/`,
        { ...config },
      );
    },
    approveAllAnswers(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.put(`/api/v1/assessments/${assessmentId}/approve-answers/`, {
        ...config,
      });
    },
    saveCompareItem(
      { assessmentId }: { assessmentId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.get(`/assessment/savecompare/${assessmentId}/`, {
        ...config,
        withCredentials: true,
      });
    },
    fetchAssessmentKits(
      args: any,
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      const { langs, isPrivate } = args ?? {};
      return axios.get(`/api/v2/assessment-kits/`, {
        params: {
          isPrivate,
          langs,
        },
        ...config,
      });
    },
    fetchKitLanguage(
      args: any,
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      return axios.get(`/api/v1/kit-languages/`, config);
    },
    fetchAssessmentKitsOptions(
      args: any,
      config: AxiosRequestConfig<any> | undefined = {},
    ) {
      const { query } = args ?? {};
      const params = query ? { query } : {};
      return axios.get(`/api/v1/assessment-kits/options/search/`, {
        params,
        ...config,
      });
    },
    fetchCompareItemAssessments(args: any, config?: AxiosRequestConfig<any>) {
      return axios.get(`/assessment/currentuserprojects/`, config);
    },
    fetchBreadcrumbInfo(
      args: { assessmentId?: TId; spaceId?: TId; questionnaireId?: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const {
        assessmentId: assessment_id,
        spaceId: space_id,
        questionnaireId: questionnaire_id,
      } = args ?? {};
      return axios.post(
        `/assessment/breadcrumbinfo/`,
        { assessment_id, space_id, questionnaire_id },
        config,
      );
    },
    fetchAssessmentsInfo(
      args: { assessmentIds: TId[] },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentIds } = args ?? {};
      return axios.post(
        `/assessment/compareselect/`,
        { assessment_list_ids: assessmentIds ?? [] },
        config,
      );
    },
    uploadAssessmentKitDSL(file: any, config?: AxiosRequestConfig<any>) {
      return axios.post(
        `/baseinfo/dsl/`,
        { dsl_file: file?.file },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    uploadAssessmentKitDSLFile(
      args: { file: any; expertGroupId?: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { file, expertGroupId } = args ?? {};
      return axios.post(
        `/api/v1/assessment-kits/upload-dsl/`,
        { dslFile: file, expertGroupId: expertGroupId },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    convertExcelToDSLFile(
      args: { file: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { file } = args ?? {};
      return axios.post(
        `/api/v1/assessment-kits/excel-to-dsl/`,
        { file },
        {
          ...config,
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    fetchExcelToDSLSampleFile(args: any, config?: AxiosRequestConfig<any>) {
      return axios.get(`/api/v1/assessment-kits/excel-to-dsl/sample/`, {
        ...config,
      });
    },
    deleteAssessmentKitDSL(
      args: { id: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id } = args ?? {};
      return axios.delete(`/baseinfo/dsl/${id}/`, config);
    },
    createAssessmentKit(args: { data: any }, config?: AxiosRequestConfig<any>) {
      const { data } = args ?? {};
      return axios.post(`/api/v1/assessment-kits/create-by-dsl/`, data, config);
    },
    createAssessmentKitByApplication(
      args: { data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { data } = args ?? {};
      return axios.post(`/api/v1/assessment-kits/`, data, config);
    },
    updateAssessmentKit(
      args: { assessmentKitId?: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, data } = args ?? {};
      return axios.post(
        `/baseinfo/assessmentkits/update/${assessmentKitId}/`,
        data,
        config,
      );
    },
    cloneAssessmentKit(
      { assessmentKitId }: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.post(
        `/api/v1/assessment-kits/${assessmentKitId}/clone/`,
        config,
      );
    },
    updateAssessmentKitDSL(
      args: { assessmentKitId?: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, data } = args ?? {};
      return axios.put(
        `/api/v1/assessment-kits/${assessmentKitId}/update-by-dsl/`,
        data,
        config,
      );
    },
    fetchAssessmentKitdata(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/baseinfo/assessmentkits/get/${assessmentKitId}/`,
        config,
      );
    },
    fetchAssessmentKit(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};
      return axios.get(`/api/v1/assessment-kits/${id}/`, config);
    },
    fetchAffectedQuestionsOnAttribute(
      args: {
        assessmentId: TId;
        attributeId: TId;
        levelId: TId;
        sort: any;
        order: any;
        page?: any;
        size?: any;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentId, attributeId, levelId, sort, order, page, size } =
        args ?? {};
      return axios.get(
        `/api/v1/assessments/${assessmentId}/report/attributes/${attributeId}/`,
        {
          ...(config ?? {}),
          params: {
            maturityLevelId: levelId,
            sort: sort,
            order: order,
            page: page,
            size: size,
          },
        },
      );
    },
    assessmentKitUsersList(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v1/assessment-kits/${assessmentKitId}/users/`,
        config,
      );
    },
    assessmentKitMinInfo(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v1/assessment-kits/${assessmentKitId}/min-info/`,
        config,
      );
    },
    fetchAssessmentKitUsersList(
      args: { id: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id } = args ?? {};
      return axios.get(`/api/v1/assessment-kits/${id}/users/`, config);
    },
    fetchAssessmentKitInfo(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/info/`,
        config,
      );
    },
    fetchAssessmentKitStats(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/stats/`,
        config,
      );
    },
    updateAssessmentKitStats(
      args: { assessmentKitId: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, data } = args ?? {};
      return axios.patch(
        `/api/v2/assessment-kits/${assessmentKitId}/`,
        data,
        config,
      );
    },
    fetchAssessmentKitTags(args: any, config?: AxiosRequestConfig<any>) {
      return axios.get(`/api/v1/assessment-kit-tags/`, config);
    },
    deleteAssessmentKit(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};
      return axios.delete(`/api/v2/assessment-kits/${id}/`, config);
    },
    uploadAssessmentKitPhoto(file: any, config?: AxiosRequestConfig<any>) {
      return axios.post(
        `/baseinfo/assessmentkits/1/images/`,
        { image: file },
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    deleteAssessmentKitPhoto(
      args: { id: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/baseinfo/assessmentkits/1/images/${args?.id}/`,
        config,
      );
    },
    inspectAssessmentKit(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/baseinfo/inspectassessmentkit/${assessmentKitId}/`,
        config,
      );
    },
    fetchTenantInfo(config: AxiosRequestConfig<any> | undefined) {
      return axios.get(`/api/v1/tenant/`, {
        ...(config ?? {}),
      });
    },
    fetchUserExpertGroups(args: any, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};

      return axios.get(`/baseinfo/expertgroups/`, {
        ...(config ?? {}),
        params: { user_id: id },
      });
    },
    fetchExpertGroups(
      args: { page: number; size: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { page = 1, size = 20 } = args ?? {};

      return axios.get(`/api/v1/expert-groups/`, {
        ...(config ?? {}),
        params: { size: size, page: page - 1 },
      });
    },
    fetchUserExpertGroup(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};
      return axios.get(`/api/v1/expert-groups/${id}/`, config);
    },
    deleteExpertGroupMember(
      args: { id: TId; userId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id, userId } = args ?? {};
      return axios.delete(
        `/api/v1/expert-groups/${id}/members/${userId}/`,
        config,
      );
    },
    fetchExpertGroupAssessmentKits(
      args: { id: TId; size: number; page: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id, size, page } = args ?? {};
      return axios.get(`/api/v1/expert-groups/${id}/assessment-kits/`, {
        ...(config || {}),
        params: { size: size, page: page - 1 },
      });
    },
    fetchExpertGroupUnpublishedAssessmentKits(
      args: { id: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id } = args ?? {};
      return axios.get(
        `/baseinfo/expertgroup/unpublishedassessmentkits/${id}/`,
        config,
      );
    },
    publishAssessmentKit(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};
      return axios.post(`/baseinfo/assessmentkits/publish/${id}/`, config);
    },
    unPublishAssessmentKit(
      args: { id: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id } = args ?? {};
      return axios.post(`/baseinfo/assessmentkits/archive/${id}/`, config);
    },
    addMemberToExpertGroup(
      args: { id: TId; email: string },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id, email } = args ?? {};
      return axios.post(
        `/api/v1/expert-groups/${id}/invite/`,
        { email },
        config,
      );
    },
    addMemberToKitPermission(
      args: { assessmentKitId: TId; email: string },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, email } = args ?? {};
      return axios.post(
        `/api/v1/assessment-kits/${assessmentKitId}/users/`,
        { email },
        config,
      );
    },
    deleteMemberToKitPermission(
      args: { assessmentKitId: TId; userId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, userId } = args ?? {};
      return axios.delete(
        `/api/v1/assessment-kits/${assessmentKitId}/users/${userId}/`,
        config,
      );
    },
    createExpertGroup(args: { data: any }, config?: AxiosRequestConfig<any>) {
      const { data = {} } = args ?? {};

      return axios.post(`/api/v1/expert-groups/`, data, {
        ...(config ?? {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    updateExpertGroup(
      args: { id: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { data = {}, id } = args ?? {};

      return axios.put(`/api/v1/expert-groups/${id}/`, data, {
        ...(config ?? {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    updateExpertGroupPicture(
      args: { id: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { data = {}, id } = args ?? {};

      return axios.put(`/api/v1/expert-groups/${id}/picture/`, data, {
        ...(config ?? {}),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    deleteExpertGroup(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};
      return axios.delete(`/api/v1/expert-groups/${id}/`, config);
    },
    deleteExpertGroupImage(
      args: { expertGroupId: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { expertGroupId } = args ?? {};

      return axios.delete(`/api/v1/expert-groups/${expertGroupId}/picture/`, {
        ...(config ?? {}),
      });
    },
    seenExpertGroup(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};
      return axios.put(`/api/v1/expert-groups/${id}/seen/`, config);
    },
    inviteSpaceMember(
      args: { id: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { data = {}, id } = args ?? {};

      return axios.post(`/api/v1/spaces/${id}/invite/`, data, {
        ...(config ?? {}),
      });
    },
    inviteExpertGroupMember(
      args: { id: TId; data: any },
      config?: AxiosRequestConfig<any>,
    ) {
      const { data = {}, id } = args ?? {};

      return axios.post(`/baseinfo/expertgroups/${id}/`, data, {
        ...(config ?? {}),
      });
    },
    fetchExpertGroupMembers(
      args: { id: TId; status: string },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id, status } = args ?? {};

      return axios.get(`/api/v1/expert-groups/${id}/members/`, {
        ...(config ?? {}),
        params: {
          status: status,
        },
      });
    },
    removeExpertGroupMembers(
      args: { id: TId; userId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id, userId } = args ?? {};
      return axios.delete(`/api/v1/expert-groups/${id}/members/${userId}`, {
        ...(config ?? {}),
      });
    },
    confirmExpertGroupInvitation(
      args: { token: TId; expert_group_id: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { token, expert_group_id } = args ?? {};

      return axios.put(
        `/api/v1/expert-groups/${expert_group_id}/invite/${token}/confirm/`,
        {
          ...(config ?? {}),
        },
      );
    },
    declineInvitationQueryData(
      { expertGroupId }: { expertGroupId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      return axios.delete(
        `/api/v1/expert-groups/${expertGroupId}/leave/`,
        config,
      );
    },
    likeAssessmentKit(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};

      return axios.post(`/api/v2/assessment-kits/${id}/like/`, {
        ...(config ?? {}),
      });
    },
    fetchImage(args: { url: string }, config?: AxiosRequestConfig<any>) {
      const { url } = args ?? {};

      return axios.get(url, {
        ...(config ?? {}),
        responseType: "blob",
      });
    },
    resolveComment(
      args: {
        id: TId;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      const { id } = args ?? {};
      return axios.put(`/api/v1/evidences/${id}/resolve/`, config);
    },
    addEvidence(
      args: {
        description: string;
        questionId: TId;
        assessmentId: TId;
        type: string;
        id?: TId;
      },
      config?: AxiosRequestConfig<any>,
    ) {
      const { description, questionId, assessmentId, type, id } = args ?? {};
      return id
        ? axios.put(`/api/v1/evidences/${id}/`, {
            description,
            type,
          })
        : axios.post(`/api/v1/evidences/`, {
            assessmentId: assessmentId,
            questionId: questionId,
            type: type,
            description,
          });
    },
    deleteEvidence(args: { id: TId }, config?: AxiosRequestConfig<any>) {
      const { id } = args ?? {};
      return axios.delete(`/api/v1/evidences/${id}/`, config);
    },
    updateEvidence(
      args: { description: string; id: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { description, id } = args ?? {};
      return axios.put(`/assessment/updateevidence/${id}/`, {
        description,
      });
    },
    fetchEvidences(
      args: { questionId: TId; assessmentId: TId; page: number; size: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { questionId, assessmentId, page, size } = args ?? {};

      return axios.get(`/api/v1/evidences/`, {
        ...(config ?? {}),
        params: {
          questionId: questionId,
          assessmentId: assessmentId,
          page: page - 1,
          size,
        },
      });
    },
    fetchComments(
      args: { questionId: TId; assessmentId: TId; page: number; size: number },
      config?: AxiosRequestConfig<any>,
    ) {
      const { questionId, assessmentId, page, size } = args ?? {};

      return axios.get(`/api/v1/comments/`, {
        ...(config ?? {}),
        params: {
          questionId: questionId,
          assessmentId: assessmentId,
          page: page - 1,
          size,
        },
      });
    },
    loadEvidences(args: { evidenceID: TId }, config?: AxiosRequestConfig<any>) {
      const { evidenceID } = args ?? {};
      return axios.get(`/api/v1/evidences/${evidenceID}/`, {
        ...(config ?? {}),
      });
    },
    fetchEvidenceAttachments(
      args: { evidence_id: string },
      config?: AxiosRequestConfig<any>,
    ) {
      const { evidence_id } = args ?? {};

      return axios.get(`/api/v1/evidences/${evidence_id}/attachments/`, {
        ...(config ?? {}),
      });
    },
    addEvidenceAttachments(
      args: { evidenceId: "string"; data: {} },
      config?: AxiosRequestConfig<any>,
    ) {
      const { evidenceId, data } = args ?? {};
      return axios.post(`/api/v1/evidences/${evidenceId}/attachments/`, data, {
        ...(config ?? {}),
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    RemoveEvidenceAttachments(
      args: { evidenceId: string; attachmentId: string },
      config?: AxiosRequestConfig<any>,
    ) {
      const { evidenceId, attachmentId } = args ?? {};
      return axios.delete(
        `/api/v1/evidences/${evidenceId}/attachments/${attachmentId}/`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchConfidenceLevelsList(args: {}, config?: AxiosRequestConfig<any>) {
      return axios.get(`/api/v1/confidence-levels/`, {
        ...(config ?? {}),
      });
    },
    leaveSpace(args: { spaceId: TId }, config?: AxiosRequestConfig<any>) {
      const { spaceId } = args ?? {};

      return axios.delete(`/api/v1/spaces/${spaceId}/leave/`, {
        ...(config ?? {}),
      });
    },
    analyzeAssessmentKit(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};

      return axios.get(`/baseinfo/analyzeassessmentkit/${assessmentKitId}/`, {
        ...(config ?? {}),
      });
    },
    fetchAssessmentKitDetails(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};

      return axios.get(`/api/v2/assessment-kits/${assessmentKitId}/details/`, {
        ...(config ?? {}),
      });
    },
    fetchAssessmentKitSubjectDetails(
      args: { assessmentKitId: TId; subjectId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, subjectId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/subjects/${subjectId}/`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAssessmentKitSubjectAttributesDetails(
      args: { assessmentKitId: TId; attributeId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, attributeId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/attributes/${attributeId}/`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAssessmentKitQuestionnaires(
      args: { assessmentKitId: TId; questionnaireId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, questionnaireId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/questionnaires/${questionnaireId}`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAssessmentKitQuestionnairesQuestions(
      args: { assessmentKitId: TId; questionId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, questionId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/questions/${questionId}`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAssessmentKitDownloadUrl(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};

      return axios.get(
        `/api/v1/assessment-kits/${assessmentKitId}/dsl-download-link/`,
        {
          ...(config ?? {}),
        },
      );
    },
    fetchAssessmentKitExportUrl(
      args: { assessmentKitId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId } = args ?? {};
      return axios.get(
        `/api/v1/assessment-kits/${assessmentKitId}/export-dsl/`,
        {
          ...config,
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    fetchMaturityLevelQuestions(
      args: { assessmentKitId: TId; attributeId: TId; maturityLevelId: TId },
      config?: AxiosRequestConfig<any>,
    ) {
      const { assessmentKitId, attributeId, maturityLevelId } = args ?? {};

      return axios.get(
        `/api/v2/assessment-kits/${assessmentKitId}/details/attributes/${attributeId}/maturity-levels/${maturityLevelId}/`,
        {
          ...(config ?? {}),
        },
      );
    },
  };

  return service;
};

/**
 * fetches new access token
 */
const fetchNewAccessToken = async (refresh: string) => {
  const { data = {} } = await axios.post(
    "/authinfo/jwt/refresh",
    { refresh },
    { isRefreshTokenReq: true },
  );

  const { access } = data;

  return access;
};

export type TService = ReturnType<typeof createService>;

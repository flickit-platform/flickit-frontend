import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/utils/useQuery";
import { VISIBILITY } from "@/utils/enumType";
import { ICustomError } from "@/utils/CustomError";
import showToast from "@/utils/toastError";
import { getBasePath } from "@/utils/helpers";
import { TId } from "@/types";

// --- Types
export interface ReportAccessUser {
  id: string | number;
  email: string;
  displayName: string;
  pictureLink?: string | null;
  deletable?: boolean;
}

export interface ReportAccessUsersResponse {
  users: ReportAccessUser[];
  invitees: ReportAccessUser[];
}

export interface UpdateVisibilityResponse {
  linkHash?: string;
}

export type UseShareDialogArgs = {
  open: boolean;
  visibility: VISIBILITY;
  linkHash?: string;
};

export type InviteFormData = { email: string };

export function useShareDialog({
  open,
  visibility,
  linkHash,
}: UseShareDialogArgs) {
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const [access, setAccess] = useState<VISIBILITY>(visibility);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchGraphicalReportUsers = useQuery<ReportAccessUsersResponse>({
    service: (args, config) =>
      service.assessments.report.getReportAccessUsers(
        { assessmentId, ...(args ?? {}) },
        config,
      ),
    runOnMount: false,
  });

  const deleteUserRole = useQuery({
    service: (args, config) =>
      service.assessments.member.removeUserRole({ assessmentId, args }, config),
    runOnMount: false,
  });

  const RemoveMembersInvitees = useQuery({
    service: (args, config) =>
      service.assessments.member.removeInvitee(
        args ?? { invitedId: "" },
        config,
      ),
    runOnMount: false,
  });

  const PublishReportStatus = useQuery<UpdateVisibilityResponse>({
    service: (args, config) =>
      service.assessments.report.updateVisibilityStatus(args, config),
    runOnMount: false,
  });

  const grantReportAccess = useQuery<void>({
    service: (args, config) =>
      service.assessments.report.grantReportAccess(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (!open) return;

    fetchGraphicalReportUsers.query();

    if (access === VISIBILITY.PUBLIC && linkHash) {
      const currentPath = window.location.pathname;
      const basePath = getBasePath(currentPath);
      const newPath = `${basePath}${linkHash}/`;
      if (currentPath !== newPath) {
        window.history.pushState({}, "", newPath);
      }
    }
  }, [open, linkHash]);

  const handleSelect = useCallback(
    async (newAccess: VISIBILITY) => {
      try {
        setAccess(newAccess);
        const response = await PublishReportStatus.query({
          data: { visibility: newAccess },
          assessmentId,
        });

        const currentPath = window.location.pathname;
        const basePath = getBasePath(currentPath);
        let finalPath = basePath;

        const nextHash = response?.linkHash ?? linkHash;
        if (newAccess === VISIBILITY.PUBLIC && nextHash) {
          const expectedPath = `${basePath}${nextHash}/`;
          if (currentPath !== expectedPath) finalPath = expectedPath;
        }

        if (window.location.pathname !== finalPath) {
          window.history.replaceState({}, "", finalPath);
        }
      } catch (error) {
        showToast(error as ICustomError);
      }
    },
    [PublishReportStatus, assessmentId, linkHash],
  );

  const onInviteSubmit = useCallback(
    async (data: InviteFormData, reset: () => void) => {
      try {
        await grantReportAccess.query({ email: data.email, assessmentId });
        fetchGraphicalReportUsers.query();
        reset();
      } catch (error) {
        showToast(error as ICustomError);
      }
    },
    [grantReportAccess, assessmentId, fetchGraphicalReportUsers],
  );

  const handleCopyClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbarOpen(true);
    } catch (error) {
      showToast(error as ICustomError);
    }
  }, []);

  const deleteUserRoleHandler = async (id: TId) =>{
    await deleteUserRole.query(id);
    await fetchGraphicalReportUsers.query();
  }
  const deleteInviteeHandler = async (id: TId) =>{
    await RemoveMembersInvitees.query({invitedId: id});
    await fetchGraphicalReportUsers.query();
  }

  const closeSnackbar = () => setSnackbarOpen(false);

  return {
    // state
    access,
    setAccess,
    snackbarOpen,
    closeSnackbar,

    // queries data
    fetchGraphicalReportUsers,

    // actions
    handleSelect,
    onInviteSubmit,
    handleCopyClick,
    deleteUserRoleHandler,
    deleteInviteeHandler
  };
}

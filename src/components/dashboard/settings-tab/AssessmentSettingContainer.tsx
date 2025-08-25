import React, { useEffect, useMemo, useState } from "react";
import QueryBatchData from "@common/QueryBatchData";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useLocation, useParams } from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { Trans } from "react-i18next";
import { IAssessmentInfo, RolesType } from "@/types/index";
import {
  AssessmentSettingGeneralBox,
  AssessmentSettingMemberBox,
} from "./AssessmentSettingBox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AddMemberDialog from "./addMemberDialog";
import ConfirmRemoveMemberDialog from "./confirmRemoveMemberDialog";
import KitCustomization from "./KitCustomization";
import PermissionControl from "@common/PermissionControl";
import { kitActions, useKitDesignerContext } from "@/providers/KitProvider";
import { useAssessmentContext } from "@/providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@/utils/enumType";

const AssessmentSettingContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [expandedRemoveModal, setExpandedRemoveModal] = useState<{
    display: boolean;
    name: string;
    id: string;
    invited?: boolean;
  }>({ display: false, name: "", id: "", invited: false });
  const [listOfUser, setListOfUser] = useState([]);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [changeData, setChangeData] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [kitInfo, setKitInfo] = useState<IAssessmentInfo | undefined>(
    undefined,
  );
  const { state } = useLocation();
  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) =>
      service.assessments.member.getRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const { dispatch } = useKitDesignerContext();
  const { assessmentInfo } = useAssessmentContext();
  const fetchAssessmentMembers = useQuery({
    service: (args: { page?: number; size?: number } = {}, config) =>
      service.assessments.member.getUsers(
        {
          assessmentId,
          page: args.page ?? 0,
          size: args.size ?? 10,
        },
        config,
      ),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: true,
  });

  const inviteesMemberList = useQuery({
    service: (args, config) =>
      service.assessments.member.getInvitees({ assessmentId }, config),
    runOnMount: false,
  });

  useEffect(() => {
    setKitInfo(assessmentInfo);
    dispatch(kitActions.setMainLanguage(assessmentInfo?.language));
  }, [assessmentId]);

  useEffect(() => {
    (async () => {
      const { items = [], total = 0 } =
        (await fetchAssessmentMembers.query({ page, size: rowsPerPage })) || {};
      setListOfUser(items);
      setTotalUser(total);
    })();
  }, [changeData, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  const handleOpenRemoveModal = (
    name: string,
    id: string,
    invited?: boolean,
  ) => {
    setExpandedRemoveModal({ display: true, name, id, invited });
  };
  const handleCloseRemoveModal = () => {
    setExpandedRemoveModal({
      display: false,
      name: "",
      id: "",
      invited: false,
    });
  };

  const isAdvanceMode = useMemo(() => {
    return assessmentInfo?.mode?.code === ASSESSMENT_MODE.ADVANCED;
  }, [assessmentInfo?.mode?.code]);

  return (
    <PermissionControl
      error={[
        fetchPathInfo.errorObject?.response,
        fetchAssessmentsRoles.errorObject?.response,
        fetchAssessmentMembers.errorObject?.response,
      ]}
    >
      <QueryBatchData
        queryBatchData={[fetchPathInfo, fetchAssessmentsRoles]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo = {}, roles = {}]) => {
          const {
            assessment: { title },
          } = pathInfo;
          const { items: listOfRoles } = roles;
          return (
            <Box m="auto" mt={2}>
              <Grid container columns={12}>
                <Grid item sm={12} xs={12}>
                  <AssessmentSettingGeneralBox
                    AssessmentTitle={title}
                    fetchPathInfo={fetchPathInfo.query}
                    color={state}
                  />
                </Grid>
              </Grid>
              <Grid container columns={12}>
                <Grid item sm={12} xs={12}>
                  <AssessmentSettingMemberBox
                    listOfRoles={listOfRoles}
                    listOfUser={listOfUser}
                    inviteesMemberList={inviteesMemberList}
                    openModal={handleClickOpen}
                    openRemoveModal={handleOpenRemoveModal}
                    setChangeData={setChangeData}
                    changeData={changeData}
                    totalUser={totalUser}
                    page={page}
                    handleChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    kitInfo={assessmentInfo}
                  />
                </Grid>
              </Grid>
              {isAdvanceMode && (
                <Grid container columns={12}>
                  <Grid item sm={12} xs={12}>
                    <KitCustomization kitInfo={assessmentInfo} />
                  </Grid>
                </Grid>
              )}

              <AddMemberDialog
                expanded={expanded}
                onClose={handleClose}
                listOfRoles={listOfRoles}
                assessmentId={assessmentId}
                cancelText={<Trans i18nKey="common.cancel" />}
                confirmText={<Trans i18nKey="common.done" />}
                setChangeData={setChangeData}
              />
              <ConfirmRemoveMemberDialog
                expandedRemoveDialog={expandedRemoveModal}
                onCloseRemoveDialog={handleCloseRemoveModal}
                assessmentId={assessmentId}
                fetchAssessmentMembers={fetchAssessmentMembers.query}
                inviteesMemberList={inviteesMemberList}
                assessmentName={title}
                setChangeData={setChangeData}
              />
            </Box>
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentSettingContainer;

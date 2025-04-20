import React, { useEffect, useState } from "react";
import QueryBatchData from "@common/QueryBatchData";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useLocation, useParams } from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { Trans } from "react-i18next";
import { RolesType } from "@/types/index";
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
  const [kitInfo, setKitInfo] = useState<null | {
    kit: { id: number; title: string };
    kitCustomId: null | number;
  }>(null);
  const { state } = useLocation();
  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) =>
      service.assessments.member.getRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

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

  const AssessmentInfo = useQuery({
    service: (args, config) =>
      service.assessments.info.getById(args ?? { assessmentId }, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const inviteesMemberList = useQuery({
    service: (args, config) =>
      service.assessments.member.getInvitees({ assessmentId }, config),
    runOnMount: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await AssessmentInfo.query();
        if (res) {
          const { kit, kitCustomId } = res;
          setKitInfo({ kit, kitCustomId });
        } else {
          console.warn("AssessmentInfo.query returned null or undefined");
        }
      } catch (err) {
        console.error("Failed to fetch assessment info:", err);
      }
    })();
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

  return (
    <PermissionControl
      error={[
        fetchPathInfo.errorObject?.response,
        fetchAssessmentsRoles.errorObject?.response,
        AssessmentInfo.errorObject?.response,
        fetchAssessmentMembers.errorObject?.response,
      ]}
    >
      <QueryBatchData
        queryBatchData={[fetchPathInfo, fetchAssessmentsRoles, AssessmentInfo]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo = {}, roles = {}, assessmentInfo = {}]) => {
          const {
            assessment: { title },
          } = pathInfo;
          const { items: listOfRoles } = roles;
          return (
            <Box m="auto" mt={"32px"}>
              <Grid container columns={12}>
                <Grid item sm={12} xs={12}>
                  <AssessmentSettingGeneralBox
                    AssessmentInfoQuery={AssessmentInfo.query}
                    AssessmentInfo={assessmentInfo}
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
                  />
                </Grid>
              </Grid>
              <Grid container columns={12}>
                <Grid item sm={12} xs={12}>
                  <KitCustomization kitInfo={kitInfo} />
                </Grid>
              </Grid>
              <AddMemberDialog
                expanded={expanded}
                onClose={handleClose}
                listOfRoles={listOfRoles}
                assessmentId={assessmentId}
                cancelText={<Trans i18nKey={"cancel"} />}
                confirmText={<Trans i18nKey={"addToThisAssessment"} />}
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

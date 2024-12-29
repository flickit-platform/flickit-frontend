import { useEffect, useState } from "react";
import QueryBatchData from "@common/QueryBatchData";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { RolesType } from "@types";
import {
  AssessmentSettingGeneralBox,
  AssessmentSettingMemberBox,
} from "@components/assessment-setting/AssessmentSettingBox";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AddMemberDialog from "@components/assessment-setting/addMemberDialog";
import ConfirmRemoveMemberDialog from "@components/assessment-setting/confirmRemoveMemberDialog";
import AssessmentSettingTitle from "@components/assessment-setting/AssessmentSettingTitle";
import KitCustomization from "@components/assessment-setting/KitCustomization";
import PermissionControl from "@common/PermissionControl";

const AssessmentSettingContainer = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [expandedRemoveModal, setExpandedRemoveModal] = useState<{
    display: boolean;
    name: string;
    id: string;
    invited?: boolean;
  }>({ display: false, name: "", id: "", invited: false });
  const [listOfUser, setListOfUser] = useState([]);
  const [changeData, setChangeData] = useState(false);
  const [kitInfo, setKitInfo] = useState<null | {
    kit: { id: number; title: string };
    kitCustomId: null | number;
  }>(null);

  const { state } = useLocation();
  const fetchAssessmentsRoles = useQuery<RolesType>({
    service: (args, config) => service.fetchAssessmentsRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  const fetchAssessmentsUserListRoles = useQuery({
    service: (args = { assessmentId }, config) =>
      service.fetchAssessmentsUserListRoles(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ assessmentId, ...(args || {}) }, config),
    runOnMount: true,
  });

  const AssessmentInfo = useQuery({
    service: (args = { assessmentId }, config) =>
      service.AssessmentsLoad(args, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const inviteesMemberList = useQuery({
    service: (args, config) =>
      service.fetchAssessmentMembersInvitees({ assessmentId }, config),
    runOnMount: false,
  });

  useEffect(() => {
    (async () => {
      const { manageable, kit, kitCustomId } = await AssessmentInfo.query();
      setKitInfo({ kit, kitCustomId });
      if (!manageable) {
        return navigate("*");
      }
    })();
  }, [assessmentId]);
  useEffect(() => {
    (async () => {
      const { items } = await fetchAssessmentsUserListRoles.query();
      setListOfUser(items);
    })();
  }, [changeData]);

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
        fetchAssessmentsUserListRoles.errorObject?.response,
      ]}
    >
      <QueryBatchData
        queryBatchData={[fetchPathInfo, fetchAssessmentsRoles, AssessmentInfo]}
        renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
        render={([pathInfo = {}, roles = {}, assessmentInfo = {}]) => {
          const {
            space,
            assessment: { title },
          } = pathInfo;
          const { items: listOfRoles } = roles;
          return (
            <Box m="auto" pb={3}>
              <Grid container columns={12} mb={"32px"}>
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
              <Grid container columns={12} mb={"32px"}>
                <Grid item sm={12} xs={12}>
                  <AssessmentSettingMemberBox
                    listOfRoles={listOfRoles}
                    listOfUser={listOfUser}
                    inviteesMemberList={inviteesMemberList}
                    openModal={handleClickOpen}
                    openRemoveModal={handleOpenRemoveModal}
                    setChangeData={setChangeData}
                    changeData={changeData}
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
                listOfUser={listOfUser}
                assessmentId={assessmentId}
                cancelText={<Trans i18nKey={"cancel"} />}
                confirmText={<Trans i18nKey={"addToThisAssessment"} />}
                setChangeData={setChangeData}
              />
              <ConfirmRemoveMemberDialog
                expandedRemoveDialog={expandedRemoveModal}
                onCloseRemoveDialog={handleCloseRemoveModal}
                assessmentId={assessmentId}
                fetchAssessmentsUserListRoles={
                  fetchAssessmentsUserListRoles.query
                }
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

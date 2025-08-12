import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import Title from "@common/Title";
import ExpertGroupsItem from "./ExpertGroupsItem";
import showToast from "@utils/toastError";

const ExpertGroupConfirmInvitationContainer = () => {
  const { service } = useServiceContext();
  const { expertGroupId, token } = useParams();
  const navigate = useNavigate();
  const expertGroupQueryData = useQuery({
    service: (args, config) =>
      service.expertGroups.info.getById(args ?? { id: expertGroupId }, config),
  });
  const confirmInvitationQueryData = useQuery({
    service: (args, config) =>
      service.expertGroups.member.confirmInvitation(
        args ?? { token, expert_group_id: expertGroupId },
        config,
      ),
    runOnMount: false,
  });

  const declineInvitationQueryData = useQuery({
    service: (args, config) =>
      service.expertGroups.member.declineInvitation(
        args ?? { expertGroupId },
        config,
      ),
    runOnMount: false,
  });

  const confirmInvitation = async () => {
    try {
      await confirmInvitationQueryData.query();
      navigate(`/user/expert-groups/${expertGroupId}`, {
        replace: true,
      });
      showToast(<Trans i18nKey="expertGroups.sueccessJoinToExpertGroup" />, {
        variant: "success",
      });
    } catch (e) {
      const err = e as ICustomError;
      if (err?.response?.data?.code === "ALREADY_EXISTS") {
        navigate(`/user/expert-groups/${expertGroupId}`, {
          replace: true,
        });
      } else {
        showToast(err);
      }
    }
  };

  const decline = async () => {
    try {
      await declineInvitationQueryData.query();
      navigate("/spaces/1", { replace: true });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };


  return (
    <QueryData
      {...expertGroupQueryData}
      render={(data) => {
        return (
          <Box
            sx={{
              maxWidth: { xs: "100%", sm: "90%", md: "60%", lg: "40%" },
              m: "auto",
            }}
          >
            <Title size="small" textTransform={"none"}>
              <Trans i18nKey="expertGroups.youHaveBeenInvitedToExpertGroup" />
            </Title>
            <Box my={3}>
              <ExpertGroupsItem data={data} disableActions={true} />
            </Box>
            <Box>
              <LoadingButton
                sx={{
                  marginInlineStart: "unset",
                  marginInlineEnd: 1,
                }}
                loading={confirmInvitationQueryData.loading}
                variant="contained"
                onClick={confirmInvitation}
              >
                <Trans i18nKey="expertGroups.acceptInvitation" />
              </LoadingButton>
              <LoadingButton
                loading={confirmInvitationQueryData.loading}
                onClick={decline}
              >
                <Trans i18nKey="common.decline" />
              </LoadingButton>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default ExpertGroupConfirmInvitationContainer;

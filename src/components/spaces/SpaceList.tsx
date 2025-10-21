import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import useMenu from "@/hooks/useMenu";
import { ICustomError } from "@/utils/custom-error";
import toastError from "@/utils/toast-error";
import MoreActions from "@common/MoreActions";
import { styles } from "@styles";
import { TDialogProps } from "@/hooks/useDialog";
import {
  ISpaceModel,
  ISpacesModel,
  SPACE_LEVELS,
  TQueryFunction,
} from "@/types/index";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import premium from "@/assets/svg/premium.svg";
import { t } from "i18next";
import Grid from "@mui/material/Grid";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { v3Tokens } from "@/config/tokens";
import { Text } from "../common/Text";

interface ISpaceListProps {
  dialogProps: TDialogProps;
  data: any[];
  fetchSpaces: any;
}

const SpacesList = (props: ISpaceListProps) => {
  const { dialogProps, data, fetchSpaces } = props;

  return (
    <Grid container spacing={3}>
      {data.map((item: any) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={item?.id}>
            <SpaceCard
              key={item?.id}
              item={item}
              isActiveSpace={false}
              owner={item?.owner}
              dialogProps={dialogProps}
              fetchSpaces={fetchSpaces}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

interface ISpaceCardProps {
  item: ISpaceModel;
  isActiveSpace: boolean;
  owner: any;
  dialogProps: TDialogProps;
  fetchSpaces: TQueryFunction<ISpacesModel>;
}

export const SpaceCard = (props: ISpaceCardProps) => {
  const { item, isActiveSpace, dialogProps, fetchSpaces, owner } = props;
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { service } = useServiceContext();
  const isOwner = owner?.isCurrentUserOwner;
  const navigate = useNavigate();
  const { loading, abortController } = useQuery({
    service: (args, config) => service.space.setCurrent({ spaceId }, config),
    runOnMount: false,
    toastError: true,
  });
  const {
    title,
    id: spaceId,
    is_default_space_for_current_user,
    type,
  } = item ?? {};

  const trackSeen = () => {
    service.space.markAsSeen({ spaceId }, {});
  };
  const changeCurrentSpaceAndNavigateToAssessments = async (e: any) => {
    e.preventDefault();
    trackSeen();
    service.user
      .getCurrent({ signal: abortController.signal })
      .then(({ data }) => {
        navigate(`/${spaceId}/assessments/1`);
      })
      .catch((e) => {});
  };
  return (
    <Box
      component="div"
      data-cy="space-card"
      onClick={changeCurrentSpaceAndNavigateToAssessments}
      sx={{
        ...styles.centerV,
        justifyContent: "space-between",
        boxShadow: "0 0 8px 0 #0A234240",
        borderRadius: 2,
        paddingInlineStart: 3,
        paddingInlineEnd: 1,
        py: 1,
        bgcolor: "white",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          ...styles.centerV,
          gap: 2,
        }}
      >
        <FolderRoundedIcon color="primary" fontSize="large" />
        <Box display="flex" flexDirection="column" gap="4px">
          <Box
            sx={{
              ...styles.centerV,
              gap: 1,
            }}
          >
            <Text
              variant="semiBoldLarge"
              color="primary.dark"
              data-testid={"space-card-title-test"}
            >
              {loading ? <CircularProgress size={20} /> : title}
            </Text>

            {type?.code === SPACE_LEVELS.PREMIUM && (
              <Tooltip
                title={t("spaces.premiumSpace")}
                data-testid={"space-card-premium-test"}
              >
                <Box
                  component="img"
                  src={premium}
                  alt="premium"
                  sx={{ width: 24, height: 24 }}
                />
              </Tooltip>
            )}
          </Box>
          <Text
            variant="bodyMedium"
            color="text.primary"
            data-testid="space-card-show-displayName"
          >
            {t("common.owner")}: {isOwner ? t("common.you") : owner.displayName}
          </Text>
        </Box>
      </Box>
      <Box
        sx={{
          ...styles.centerV,
          flexWrap: "wrap",
          justifyContent: { xs: "space-between", md: "flex-end" },
          gap: { xs: 0.5, sm: 2, md: 6 },
        }}
      >
        <Box sx={{ ...styles.centerV, gap: 0.5 }}>
          <Tooltip
            open={showTooltip}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => {
              setShowTooltip(false);
              e.stopPropagation();
            }}
            title={<Trans i18nKey="common.moreActions" />}
          >
            <Box>
              <Actions
                isActiveSpace={isActiveSpace}
                dialogProps={dialogProps}
                space={item}
                fetchSpaces={fetchSpaces}
                isOwner={isOwner}
                setShowTooltip={setShowTooltip}
                is_default_space_for_current_user={
                  is_default_space_for_current_user
                }
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

const Actions = (props: any) => {
  const {
    space,
    fetchSpaces,
    dialogProps,
    isOwner,
    is_default_space_for_current_user,
    setShowTooltip,
  } = props;
  const { id: spaceId } = space;
  const { service } = useServiceContext();
  const [editLoading, setEditLoading] = useState(false);
  const {
    query: deleteSpace,
    loading,
    abortController,
  } = useQuery({
    service: (args, config) => service.space.remove({ spaceId }, config),
    runOnMount: false,
  });
  const leaveSpaceQuery = useQuery({
    service: (args, config) => service.space.leave({ spaceId }, config),
    runOnMount: false,
  });
  const openEditDialog = (e: any) => {
    setEditLoading(true);
    service.space
      .getById({ spaceId }, { signal: abortController.signal })
      .then(({ data }) => {
        setEditLoading(false);
        dialogProps.openDialog({ data, type: "update" });
      })
      .catch((e) => {
        const err = e as ICustomError;
        toastError(err);
        setEditLoading(false);
      });
  };

  const deleteItem = async (e: any) => {
    try {
      await deleteSpace();
      await fetchSpaces();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const leaveSpace = async (e: any) => {
    try {
      await leaveSpaceQuery.query();
      await fetchSpaces();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ ml: 0.2 }}
      loading={loading || editLoading || leaveSpaceQuery.loading}
      items={[
        isOwner && {
          icon: <EditOutlinedIcon fontSize="small" />,
          text: <Trans i18nKey="common.edit" />,
          onClick: openEditDialog,
        },
        isOwner && {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: deleteItem,
        },
        !is_default_space_for_current_user &&
          !isOwner && {
            icon: <ExitToAppRoundedIcon fontSize="small" />,
            text: <Trans i18nKey="spaces.leaveSpace" />,
            onClick: leaveSpace,
          },
      ]}
      setShowTooltip={setShowTooltip}
      color={v3Tokens.surface.on}
      IconButtonProps={{ width: "20px", height: "20px" }}
    />
  );
};

export { SpacesList };

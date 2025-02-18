import { useState } from "react";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import useMenu from "@utils/useMenu";
import IconButton from "@mui/material/IconButton";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import MoreActions from "@common/MoreActions";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { styles } from "@styles";
import { TDialogProps } from "@utils/useDialog";
import { ISpaceModel, ISpacesModel, TQueryFunction } from "@types";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import premium from "@/assets/svg/premium.svg";
interface ISpaceListProps {
  dialogProps: TDialogProps;
  data: any[];
  fetchSpaces: any;
}

const SpacesList = (props: ISpaceListProps) => {
  const { dialogProps, data, fetchSpaces } = props;

  return (
    <Box sx={{ overflowX: "hidden", py: 1 }}>
      <Box sx={{ minWidth: { xs: "320px", sm: "440px" } }}>
        {data.map((item: any) => {
          return (
            <SpaceCard
              key={item?.id}
              item={item}
              isActiveSpace={false}
              owner={item?.owner}
              dialogProps={dialogProps}
              fetchSpaces={fetchSpaces}
            />
          );
        })}
      </Box>
    </Box>
  );
};

interface ISpaceCardProps {
  item: ISpaceModel;
  isActiveSpace: boolean;
  owner: any;
  dialogProps: TDialogProps;
  fetchSpaces: TQueryFunction<ISpacesModel>;
}

const SpaceCard = (props: ISpaceCardProps) => {
  const { item, isActiveSpace, dialogProps, fetchSpaces, owner } = props;
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { service } = useServiceContext();
  const isOwner = owner?.isCurrentUserOwner;
  const navigate = useNavigate();
  const { loading, abortController } = useQuery({
    service: (args, config) => service.setCurrentSpace({ spaceId }, config),
    runOnMount: false,
    toastError: true,
  });
  const {
    title,
    id: spaceId,
    membersCount = 0,
    assessmentsCount = 0,
    is_default_space_for_current_user,
    type,
  } = item || {};

  const trackSeen = () => {
    service.seenSpaceList({ spaceId }, {});
  };
  const changeCurrentSpaceAndNavigateToAssessments = async (e: any) => {
    e.preventDefault();
    trackSeen();
    service
      .getSignedInUser(undefined, { signal: abortController.signal })
      .then(({ data }) => {
        navigate(`/${spaceId}/assessments/1`);
      })
      .catch((e) => {});
  };
  return (
    <Box
      sx={{
        ...styles.centerV,
        boxShadow: (t) => `0 5px 8px -8px ${t.palette.grey[400]}`,
        borderRadius: 2,
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 1, md: 2 },
        mb: { xs: 1, md: 2 },
        backgroundColor: "white",
        textDecoration: "none",
        height: { xs: "auto", md: "56px" },
      }}
      justifyContent="space-between"
      data-cy="space-card"
      component={Link}
      to={`/${spaceId}/assessments/1`}
      onClick={changeCurrentSpaceAndNavigateToAssessments}
    >
      <Box
        sx={{
          ...styles.centerV,
          width: { xs: "min-content", sm: "auto" },
          gap: { xs: "10px", sm: "20px" },
        }}
        alignSelf="stretch"
      >
        <Typography
          variant="h6"
          data-cy="space-card-link"
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            textDecoration: "none",
            height: "100%",
            display: "flex",
            alignItems: "center",
            alignSelf: "stretch",
            // px: 2,
            color: (t) => t.palette.primary.dark,
            fontFamily: languageDetector(title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {loading ? <CircularProgress size="20px" /> : <>{title}</>}
        </Typography>
        {type?.code !== "PREMIUM" && (
          <img
            style={{ width: "24px", height: "32px" }}
            src={premium}
            alt={"premium-sign"}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", gap: { xs: 1, sm:2, md: 4 } }}>
        <Box sx={{ ...styles.centerV, gap: { xs: 1, sm: 2, md: 4 } }}>
          <Tooltip title={<Trans i18nKey={owner?.displayName} />}>
            <Chip
              sx={{
                opacity: 0.7,
                color: `${isOwner ? theme.palette.primary.main : "#2B333B"}`,
                borderColor: `${isOwner ? theme.palette.primary.main : "#C7CCD1"}`,
                width: { xs: "80px", sm: "120px", md: "auto" },
              }}
              label={
                <>
                  <Trans i18nKey={"ownerName"} />
                  {isOwner ? (
                    <Trans i18nKey={"you"} />
                  ) : (
                    <Trans i18nKey={owner?.displayName} />
                  )}
                </>
              }
              size="small"
              variant="outlined"
            />
          </Tooltip>
          <Tooltip title={<Trans i18nKey={"membersCount"} />}>
            <Box
              sx={{
                ...styles.centerV,
                gap: 1,
                opacity: 0.8,
                textDecoration: "none",
                color: "initial",
                width: { sm: "52px" },
              }}
            >
              <PeopleOutlineRoundedIcon
                sx={{
                  marginInlineStart: 0.5,
                }}
                fontSize="small"
              />
              <Typography fontWeight={"bold"}>{membersCount}</Typography>
            </Box>
          </Tooltip>
          <Tooltip title={<Trans i18nKey={"assessmentsCount"} />}>
            <Box
              sx={{
                ...styles.centerV,
                gap: 1,
                opacity: 0.8,
                textDecoration: "none",
                color: "initial",
                width: { sm: "52px" },
              }}
            >
              <DescriptionOutlinedIcon
                sx={{
                  marginInlineStart: 0.5,
                  opacity: 0.8,
                }}
                fontSize="small"
              />
              <Typography fontWeight={"bold"}>{assessmentsCount}</Typography>
            </Box>
          </Tooltip>
        </Box>
        <Box
          justifyContent={"flex-end"}
          sx={{ ...styles.centerV, minWidth: { xs: "60px", sm: "120px" } }}
        >
          {isActiveSpace && (
            <Box mr={1}>
              <Chip
                label={<Trans i18nKey={"current"} />}
                color="info"
                size="small"
              />
            </Box>
          )}
          <>
            <Tooltip title={<Trans i18nKey={"spaceSetting"} />}>
              <Box onClick={trackSeen} sx={{ ...styles.centerV }}>
                <IconButton
                  size="small"
                  component={Link}
                  to={`/${spaceId}/setting`}
                >
                  <SettingsOutlinedIcon />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip
              open={showTooltip}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => {
                setShowTooltip(false);
                e.stopPropagation();
              }}
              title={<Trans i18nKey={"moreAction"} />}
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
          </>
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
    service: (args, config) => service.deleteSpace({ spaceId }, config),
    runOnMount: false,
  });
  const leaveSpaceQuery = useQuery({
    service: (args, config) => service.leaveSpace({ spaceId }, config),
    runOnMount: false,
  });
  const openEditDialog = (e: any) => {
    setEditLoading(true);
    service
      .fetchSpace({ spaceId }, { signal: abortController.signal })
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
          icon: <EditRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="edit" />,
          onClick: openEditDialog,
        },
        isOwner && {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="delete" />,
          onClick: deleteItem,
        },
        !is_default_space_for_current_user &&
          !isOwner && {
            icon: <ExitToAppRoundedIcon fontSize="small" />,
            text: <Trans i18nKey="leaveSpace" />,
            onClick: leaveSpace,
          },
      ]}
      setShowTooltip={setShowTooltip}
    />
  );
};

export { SpacesList };

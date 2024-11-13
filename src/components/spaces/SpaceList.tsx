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
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
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
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { secondaryFontFamily, theme } from "@/config/theme";

interface ISpaceListProps {
  dialogProps: TDialogProps;
  data: any[];
  fetchSpaces: any;
}

const SpacesList = (props: ISpaceListProps) => {
  const { dialogProps, data, fetchSpaces } = props;

  // const setUserInfo = (signal: AbortSignal) => {
  //   // service
  //   //   .getSignedInUser(undefined, { signal })
  //   //   .then(({ data }) => {
  //   //     // dispatch(authActions.setUserInfo(data));
  //   //   })
  //   //   .catch((e) => {
  //   //     const err = e as ICustomError;
  //   //     toastError(err);
  //   //   });
  // };

  // useEffect(() => {
  //   const controller = new AbortController();
  //   // setUserInfo(controller.signal);
  //   return () => {
  //     controller?.abort();
  //   };
  // }, []);

  // const { items = [] } = data || {};

  return (
    <Box sx={{ overflowX: "hidden", py: 1 }}>
      <Box sx={{ minWidth: { xs: "320px", sm: "440px" } }}>
        {data.map((item: any) => {
          // console.log(items,"test items")
          return (
            <SpaceCard
              key={item?.id}
              item={item}
              isActiveSpace={false}
              owner={item?.owner}
              dialogProps={dialogProps}
              fetchSpaces={fetchSpaces}
              // setUserInfo={setUserInfo}
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
        // dispatch(authActions.setUserInfo(data));
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
        px: 1,
        py: 1,
        mb: 1,
        backgroundColor: "white",
      }}
      justifyContent="space-between"
      data-cy="space-card"
    >
      <Box sx={{ ...styles.centerV }} alignSelf="stretch">
        <Box sx={{ ...styles.centerV }} alignSelf="stretch">
          <Typography
            component={Link}
            variant="h6"
            to={`/${spaceId}/assessments/1`}
            data-cy="space-card-link"
            onClick={changeCurrentSpaceAndNavigateToAssessments}
            sx={{
              fontFamily: secondaryFontFamily,
              fontSize: "1.2rem",
              fontWeight: "bold",
              textDecoration: "none",
              height: "100%",
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
              px: 2,
              color: (t) => t.palette.primary.dark,
            }}
          >
            {loading ? <CircularProgress size="20px" /> : <>{title}</>}
          </Typography>
          <Chip
            sx={{
              ml: 1,
              opacity: 0.7,
              color: `${isOwner ? "#9A003C" : ""}`,
              borderColor: `${isOwner ? "#9A003C" : "#bdbdbd"}`,
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
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ ...styles.centerV }} gap={4}>
          <Tooltip title={<Trans i18nKey={"membersCount"} />}>
            <Box sx={{ ...styles.centerV, opacity: 0.8 }}>
              <PeopleOutlineRoundedIcon
                sx={{
                  marginRight: theme.direction === "ltr" ? 0.5 : "unset",
                  marginLeft: theme.direction === "rtl" ? 0.5 : "unset",
                }}
                fontSize="small"
              />
              <Typography fontWeight={"bold"}>{membersCount}</Typography>
            </Box>
          </Tooltip>
          <Tooltip title={<Trans i18nKey={"assessmentsCount"} />}>
            <Box sx={{ ...styles.centerV, opacity: 0.8 }}>
              <DescriptionRoundedIcon
                sx={{
                  marginRight: theme.direction === "ltr" ? 0.5 : "unset",
                  marginLeft: theme.direction === "rtl" ? 0.5 : "unset",
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
          sx={{ ...styles.centerV, minWidth: { xs: "80px", sm: "220px" } }}
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
                  <SettingsRoundedIcon />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip
              open={showTooltip}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(false)}
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
      // console.log(err);
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

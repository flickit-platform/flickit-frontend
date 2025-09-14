import Box from "@mui/material/Box";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Avatar from "@mui/material/Avatar";
import useMenu from "@utils/useMenu";
import { Trans } from "react-i18next";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { t } from "i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAuthContext } from "@providers/AuthProvider";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import MoreActions from "@common/MoreActions";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import useScreenResize from "@utils/useScreenResize";
import { styles } from "@styles";
import { IDialogProps, IMemberModel, TQueryProps } from "@/types/index";
import InviteMemberDialog from "@common/dialogs/InviteMemberDialog";
import useDialog from "@utils/useDialog";
import { ICustomError } from "@utils/CustomError";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import stringAvatar from "@utils/stringAvatar";
import { useConfigContext } from "@/providers/ConfgProvider";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import languageDetector from "@utils/languageDetector";
import { getReadableDate } from "@utils/readableDate";
import showToast from "@utils/toastError";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import NewTitle from "@common/newTitle";

export const SpaceMembers = (props: any) => {
  const { editable } = props;
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { userInfo } = useAuthContext();
  const userId = userInfo?.id;
  const user_id_ref = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    status: boolean;
    id: string;
  }>({ status: false, id: "" });
  const spaceMembersQueryData = useQuery({
    service: (args, config) =>
      service.space.getMembers({ spaceId, page: page - 1, size: 10 }, config),
  });
  const spaceMembersInviteeQueryData = useQuery<IMemberModel>({
    service: (args, config) => service.space.getInvitees({ spaceId }, config),
  });
  const deleteSpaceMember = useQuery({
    service: (arg, config) =>
      service.space.removeMember(
        { spaceId, memberId: openDeleteDialog.id },
        config,
      ),
    runOnMount: false,
    toastError: false,
  });

  const deleteItem = async () => {
    try {
      await deleteSpaceMember.query();
      await spaceMembersQueryData.query();
      setOpenDeleteDialog({ status: false, id: "" });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const dialogProps = useDialog();
  const {
    query: addMember,
    loading,
    data,
  } = useQuery({
    service: (
      { id = spaceId, value = user_id_ref.current?.value }: any,
      config,
    ) => service.space.addMember({ spaceId: id, email: value }, config),
    runOnMount: false,
  });
  const resetForm = () => {
    user_id_ref.current?.form?.reset();
  };
  useEffect(() => {
    let controller: AbortController;
    if (data?.id) {
      controller = new AbortController();
      resetForm();
      spaceMembersQueryData.query();
      service.user.getCurrent({ signal: controller.signal });
    }
    return () => {
      controller?.abort();
    };
  }, [data]);

  useEffect(() => {
    spaceMembersQueryData.query();
  }, [page]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setPage(page);
  };

  const totalPages = useMemo(
    () =>
      !spaceMembersQueryData.data || spaceMembersQueryData?.data?.size === 0
        ? 1
        : Math.ceil(
            spaceMembersQueryData?.data?.total /
              spaceMembersQueryData.data?.size,
          ),
    [spaceMembersQueryData?.data?.size],
  );

  return (
    <Box mt={1} p={3} borderRadius={1} bgcolor="background.containerLowest">
      <Box>
        <NewTitle
          size="small"
          mb={2}
          titleProps={{
            fontSize: "1rem",
            textTransform: "unset",
            letterSpacing: ".05rem",
          }}
        >
          <Trans i18nKey="common.addNewMember" />
        </NewTitle>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!user_id_ref.current?.value) {
              showToast(t("errors.pleaseEnterEmailAddress"));
            } else {
              try {
                await addMember({
                  id: spaceId,
                  value: user_id_ref.current?.value,
                });
                await spaceMembersQueryData.query();
                user_id_ref.current.value = "";
              } catch (e) {
                const err = e as ICustomError;
                if (err.response?.data.code !== "NOT_FOUND") {
                  showToast(err);
                } else {
                  dialogProps.openDialog({
                    type: "invite",
                    data: { email: user_id_ref.current?.value },
                  });
                }
              }
            }
          }}
        >
          <TextField
            fullWidth
            type="email"
            size="small"
            variant="outlined"
            inputRef={user_id_ref}
            placeholder={t("user.enterEmailOfTheUserYouWantToAdd") as string}
            label={<Trans i18nKey="user.userEmail" />}
            InputProps={{
              endAdornment: <AddMemberButton loading={loading} />,
            }}
          />
        </form>
      </Box>
      <Box mt={6}>
        <NewTitle
          mb={2}
          size="small"
          titleProps={{
            fontSize: "1rem",
            textTransform: "capitalize",
            letterSpacing: ".05rem",
          }}
          toolbar={
            <Box mb="auto" sx={{ ...styles.centerV, opacity: 0.8 }}>
              <PeopleOutlineRoundedIcon
                sx={{
                  marginInlineStart: "unset",
                  marginInlineEnd: 0.5,
                }}
                fontSize="small"
              />
              <Typography fontWeight={"bold"}>
                {spaceMembersQueryData?.data?.items?.length}
              </Typography>
            </Box>
          }
        >
          <Trans i18nKey="expertGroups.members" />
        </NewTitle>
        <QueryData
          {...spaceMembersQueryData}
          renderLoading={() => {
            return (
              <>
                {[1, 2, 3, 4, 5].map((item) => {
                  return (
                    <Skeleton
                      key={item}
                      variant="rectangular"
                      sx={{ borderRadius: 2, height: "50px", mb: 1 }}
                    />
                  );
                })}
              </>
            );
          }}
          render={(data) => {
            const { items } = data;
            return (
              <Box>
                {items.map((member: any) => {
                  const { displayName, id, pictureLink, isOwner, email } =
                    member;
                  return (
                    displayName && (
                      <Box
                        key={id}
                        sx={{
                          ...styles.centerV,
                          boxShadow: 1,
                          borderRadius: 2,
                          my: 1,
                          py: 0.8,
                          px: 1.5,
                        }}
                      >
                        <Box sx={{ ...styles.centerV, width: "85%" }}>
                          <Box>
                            <Avatar
                              {...stringAvatar(displayName.toUpperCase())}
                              src={pictureLink}
                              sx={{ width: 34, height: 34 }}
                            ></Avatar>
                          </Box>
                          <Box
                            marginInlineStart={2}
                            marginInlineEnd="unset"
                            width="35%"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            sx={{
                              fontFamily: languageDetector(displayName)
                                ? farsiFontFamily
                                : primaryFontFamily,
                            }}
                          >
                            {displayName}
                          </Box>
                          <Box
                            marginInlineStart={2}
                            marginInlineEnd="unset"
                            width="45%"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {email}
                          </Box>
                        </Box>
                        <Box
                          marginInlineStart="auto"
                          marginInlineEnd={0}
                          sx={{ ...styles.centerV }}
                        >
                          {isOwner && (
                            <Chip
                              label={<Trans i18nKey="common.owner" />}
                              size="small"
                              sx={{
                                marginInlineStart: "unset",
                                marginInlineEnd: 1.5,
                              }}
                            />
                          )}
                          {
                            <Actions
                              isOwner={isOwner}
                              member={member}
                              editable={editable}
                              fetchSpaceMembers={spaceMembersQueryData.query}
                              setOpenDeleteDialog={setOpenDeleteDialog}
                              deleteSpaceMember={deleteSpaceMember}
                            />
                          }
                        </Box>
                      </Box>
                    )
                  );
                })}
                <Stack spacing={2} mt={3} sx={{ ...styles.centerVH }}>
                  <Pagination
                    variant="outlined"
                    color="primary"
                    count={totalPages}
                    onChange={handleChangePage}
                    page={page}
                  />
                </Stack>
              </Box>
            );
          }}
        />
        <DeleteConfirmationDialog
          open={openDeleteDialog.status}
          onClose={() =>
            setOpenDeleteDialog({ ...openDeleteDialog, status: false })
          }
          onConfirm={deleteItem}
          title="common.warning"
          content="spaces.areYouSureYouWantDeleteThisMember"
          confirmButtonText={t("common.continue")}
        />
        <QueryData
          {...spaceMembersInviteeQueryData}
          renderLoading={() => {
            return (
              <>
                {[1, 2, 3, 4, 5].map((item) => {
                  return (
                    <Skeleton
                      key={item}
                      variant="rectangular"
                      sx={{ borderRadius: 2, height: "50px", mb: 1 }}
                    />
                  );
                })}
              </>
            );
          }}
          render={(data) => {
            const { items } = data;
            return (
              <Box>
                {items.length > 0 && (
                  <Box mt={4}>
                    <Title
                      size="small"
                      titleProps={{
                        textTransform: "none",
                        fontSize: ".95rem",
                      }}
                    >
                      <Trans i18nKey="common.invitees" />
                    </Title>
                    <Box mt={1}>
                      {items.map((invitees: any) => {
                        const { id, email, expirationDate } = invitees;

                        const expirationDateTime = new Date(
                          expirationDate,
                        ).getTime();
                        const timeNow = new Date().getTime();

                        const name = email;
                        const isOwner = userId == id;

                        return (
                          <Box
                            key={id}
                            boxShadow={1}
                            borderRadius={2}
                            flexDirection={{ xs: "column", sm: "row" }}
                            my={1}
                            py={0.8}
                            px={1.5}
                            sx={{ ...styles.centerV }}
                          >
                            <Box
                              mr={{ xs: "auto", sm: "0px" }}
                              sx={{ ...styles.centerV }}
                            >
                              <Box>
                                <Avatar sx={{ width: 34, height: 34 }}>
                                  <PersonRoundedIcon />
                                </Avatar>
                              </Box>
                              <Box ml={2}>{name}</Box>
                            </Box>
                            <Box
                              marginInlineStart="auto"
                              marginInlineEnd="unset"
                              sx={{ ...styles.centerV }}
                            >
                              <Box
                                px={0.4}
                                marginInlineStart="unset"
                                marginInlineEnd={2}
                                sx={{
                                  ...styles.centerV,
                                  opacity: 0.8,
                                }}
                              >
                                <EventBusyRoundedIcon
                                  fontSize="small"
                                  sx={{
                                    marginInlineStart: "unset",
                                    marginInlineEnd: 0.5,
                                  }}
                                />
                                <Typography variant="body2">
                                  {getReadableDate(expirationDate)}
                                </Typography>
                              </Box>
                              {
                                <Actions
                                  isOwner={isOwner}
                                  member={invitees}
                                  fetchSpaceMembers={
                                    spaceMembersInviteeQueryData.query
                                  }
                                  isInvitationExpired={
                                    expirationDateTime <= timeNow
                                  }
                                  isInvitees={true}
                                  email={email}
                                  editable={editable}
                                  inviteId={id}
                                />
                              }
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          }}
        />
      </Box>
      <InviteSpaceMemberDialog
        {...dialogProps}
        spaceMembersQueryData={spaceMembersQueryData}
        spaceMembersInviteeQueryData={spaceMembersInviteeQueryData}
        resetForm={resetForm}
      />
    </Box>
  );
};

const AddMemberButton = ({ loading }: { loading: boolean }) => {
  const isSmallScreen = useScreenResize("sm");
  return (
    <InputAdornment position="end">
      <LoadingButton
        sx={{
          minWidth: "10px",
          p: isSmallScreen ? 0.5 : undefined,
        }}
        startIcon={isSmallScreen ? undefined : <AddRoundedIcon />}
        loading={loading}
        type="submit"
        variant="contained"
        size="small"
      >
        {isSmallScreen ? (
          <AddRoundedIcon fontSize="small" />
        ) : (
          <Trans i18nKey="expertGroups.addMember" />
        )}
      </LoadingButton>
    </InputAdornment>
  );
};

const Actions = (props: any) => {
  const {
    isOwner,
    member,
    fetchSpaceMembers,
    isInvitees,
    isInvitationExpired,
    email,
    editable,
    inviteId,
    setOpenDeleteDialog,
    deleteSpaceMember,
  } = props;
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { query: deleteSpaceInvite } = useQuery({
    service: (config) => service.space.removeInvite({ inviteId }, config),
    runOnMount: false,
    toastError: false,
  });
  const inviteMemberQueryData = useQuery({
    service: (args, config) =>
      service.space.inviteMember(
        args ?? { id: spaceId, data: { email } },
        config,
      ),
    runOnMount: false,
  });

  const deleteItemInvite = async (e: any) => {
    try {
      await deleteSpaceInvite();
      await fetchSpaceMembers();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const inviteMember = async () => {
    try {
      await inviteMemberQueryData.query();
      showToast(t("spaces.invitationSentSuccessfully"), { variant: "success" });
      fetchSpaceMembers();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      loading={deleteSpaceMember?.loading || inviteMemberQueryData?.loading}
      items={[
        isInvitees && isInvitationExpired && editable
          ? {
              icon: <EmailRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="common.resendInvitation" />,
              onClick: inviteMember,
            }
          : undefined,
        isInvitees &&
          editable && {
            icon: <DeleteRoundedIcon fontSize="small" />,
            text: <Trans i18nKey="common.cancelInvitation" />,
            onClick: deleteItemInvite,
          },
        !isInvitees &&
          !isOwner &&
          editable && {
            icon: <DeleteRoundedIcon fontSize="small" />,
            text: <Trans i18nKey="common.remove" />,
            onClick: () => setOpenDeleteDialog({ status: true, id: member.id }),
          },
      ]}
    />
  );
};

const InviteSpaceMemberDialog = (
  props: {
    spaceMembersQueryData: TQueryProps;
    spaceMembersInviteeQueryData: TQueryProps;
    resetForm: () => void;
  } & IDialogProps,
) => {
  const { config } = useConfigContext();
  const {
    spaceMembersQueryData,
    spaceMembersInviteeQueryData,
    resetForm,
    ...rest
  } = props;
  const { spaceId } = useParams();
  const { service } = useServiceContext();
  const { query: inviteMemberQuery, loading } = useQuery({
    service: (args, config) =>
      service.space.inviteMember(
        args ?? { id: spaceId, data: rest.context?.data ?? {} },
        config,
      ),
    runOnMount: false,
  });

  const onInvite = async () => {
    try {
      await inviteMemberQuery();
      showToast(t("spaces.invitationSentSuccessfully"), { variant: "success" });
      resetForm();
      rest.onClose();
      spaceMembersQueryData.query();
      spaceMembersInviteeQueryData.query();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  return (
    <InviteMemberDialog
      {...(rest as any)}
      onInvite={onInvite}
      loading={loading}
      maxWidth="sm"
    >
      <Typography>
        <Trans
          i18nKey="user.emailIsNotOnAppTitleYet"
          values={{
            email: rest.context?.data?.email ?? "This user",
            title: config.appTitle,
          }}
        />{" "}
        <Trans i18nKey="user.wouldYouLikeToInviteThemToJoin" />
      </Typography>
    </InviteMemberDialog>
  );
};

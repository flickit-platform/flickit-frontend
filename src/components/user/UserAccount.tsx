import { t } from "i18next";
import { Trans } from "react-i18next";
import useDialog from "@utils/useDialog";
import { useQuery } from "@utils/useQuery";
import getUserName from "@utils/getUserName";
import useDocumentTitle from "@utils/useDocumentTitle";
import AccountCEFormDialog from "./UserCEFormDialog";
import { useServiceContext } from "@providers/ServiceProvider";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { useEffect, useState } from "react";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import formatBytes from "@utils/formatBytes";
import { ICustomError } from "@utils/CustomError";
import { styles } from "@styles";
import languageDetector from "@/utils/languageDetector";
import showToast from "@utils/toastError";
import { useTheme } from "@mui/material";
import NewTitle from "@common/newTitle";

const UserAccount = () => {
  const [hover, setHover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const { service } = useServiceContext();
  const userQueryData = useQuery({
    service: (args, config) => service.user.getProfile(config),
    runOnMount: false,
  });
  const { userInfo: userProfileInfo } = useAuthContext();
  const [userInfo, setUserInfo] = useState<any>({
    id: 1,
    displayName: "",
    email: "",
    pictureLink: undefined,
    linkedin: undefined,
    bio: undefined,
  });
  useEffect(() => {
    setUserInfo(userProfileInfo);
  }, [userQueryData?.data]);

  const dialogProps = useDialog();
  useDocumentTitle(`${t("user.userProfile")}: ${getUserName(userInfo)}`);

  const onSubmit = async () => {
    const res = await userQueryData.query();
    dispatch(authActions.setUserInfo(res));
  };

  const openDialog = () => {
    dialogProps.openDialog({ type: "update", data: userInfo });
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const maxSize = 2097152;
      if (file.size > maxSize) {
        showToast(`Maximum upload file size is ${formatBytes(maxSize)}.`);
        return;
      }
      setHover(false);
      setIsLoading(true);
      try {
        const pictureData = { pictureFile: file };
        await service.user.updatePicture({ data: pictureData }, undefined);
        setIsLoading(false);
        onSubmit().then();
      } catch (e: any) {
        setIsLoading(false);
        showToast(e as ICustomError);
      }
    }
  };
  const theme = useTheme();

  return (
    <Box>
      <Box
        height={"200px"}
        width="100%"
        sx={{
          borderRadius: "80px 6px 6px 6px",
          background: "linear-gradient(145deg, #efaa9d, #ccf7f9)",
        }}
      >
        <Box
          position="relative"
          display="inline-block"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            marginInlineStart: 1,
            top: "168px",
            left: "24px",
          }}
        >
          <Avatar
            sx={{
              bgcolor: (t) => t.palette.grey[800],
              textDecoration: "none",
              border: "4px solid whitesmoke",
              width: "94px",
              height: "94px",
              position: "relative",
            }}
            alt={userInfo?.displayName}
            src={userInfo?.pictureLink ?? "/"}
          ></Avatar>
          {isLoading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: theme.direction === "ltr" ? "50%" : "unset",
                right: theme.direction === "rtl" ? "50%" : "unset",
                marginTop: "-12px",
                marginInlineStart: "-12px",
              }}
            />
          )}
          {!isLoading ? (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              borderRadius="50%"
              sx={{ ...styles.centerVH }}
            >
              {hover && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  bgcolor="rgba(0, 0, 0, 0.6)"
                  borderRadius="50%"
                  border="4px solid whitesmoke"
                  sx={{ cursor: "pointer", ...styles.centerVH }}
                />
              )}
              {userInfo?.pictureLink ? (
                <Tooltip title={"Edit Picture"}>
                  <IconButton
                    component="label"
                    sx={{ padding: 0, color: "whitesmoke" }}
                  >
                    {hover && <EditIcon />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={"Add Picture"}>
                  <IconButton component="label" sx={{ color: "whitesmoke" }}>
                    {hover && <AddIcon />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box sx={{ marginInlineStart: "130px" }} mt={1}>
        <NewTitle
          textTransform={"capitalize"}
          sub={<Box textTransform={"none"}>{userInfo?.email}</Box>}
          toolbar={
            <>
              <IconButton
                sx={{
                  marginInlineStart: 1.5,
                  mb: 1.2,
                }}
                onClick={openDialog}
                color="primary"
                size="small"
              >
                <BorderColorRoundedIcon />
              </IconButton>
              <AccountCEFormDialog {...dialogProps} onSubmitForm={onSubmit} />
            </>
          }
        >
          {userInfo?.displayName}
        </NewTitle>
      </Box>
      <Box mt={8}>
        <Box borderTop={"1px solid #d1d1d1"} px={1} py={3} m={1}>
          <Grid container spacing={3}>
            <Grid item md={3}>
              <NewTitle size="small" textTransform={"none"}>
                <Trans i18nKey="common.about" />
              </NewTitle>
            </Grid>
            <Grid item md={9}>
              <Box>
                <Typography variant="subLarge">
                  <Trans i18nKey="common.linkedin" />
                </Typography>
                <Typography
                  sx={{
                    pt: 0.5,
                    fontWeight: "bold",
                    fontFamily: languageDetector(userInfo?.linkedin)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {userInfo?.linkedin}
                </Typography>
              </Box>
              <Box mt={2.5}>
                <Typography variant="subLarge">
                  <Trans i18nKey="common.bio" />
                </Typography>
                <Typography
                  sx={{
                    pt: 0.5,
                    fontWeight: "bold",
                    fontFamily: languageDetector(userInfo?.bio)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {userInfo?.bio}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UserAccount;

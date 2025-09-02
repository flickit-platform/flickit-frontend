import React, { lazy, useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import { useParams, NavLink } from "react-router-dom";
import { styles } from "@styles";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { FLAGS } from "@/types/index";
import keycloakService from "@/service//keycloakService";
import { useConfigContext } from "@/providers/ConfgProvider";
import { IMessage } from "@novu/notification-center";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import NotificationEmptyState from "@/assets/svg/notificationEmptyState.svg";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import LanguageSelector from "./LangSelector";
import i18n from "i18next";
import { MULTILINGUALITY } from "@/config/constants";
import languageDetector from "@utils/languageDetector";
import { getReadableDate } from "@utils/readableDate";
import flagsmith from "flagsmith";
import { useTheme } from "@mui/material";

const NotificationCenter = lazy(() =>
  import("@novu/notification-center").then((module) => ({
    default: module.NotificationCenter,
  })),
);

const drawerWidth = 240;
const LandingPage = import.meta.env.VITE_LANDING_PAGE;

const NotificationIndicator = ({ seen }: { seen: boolean }) => (
  <Box
    minWidth="4px"
    height="24px"
    bgcolor={seen ? "background.onVariant" : "#2D80D2"}
    borderRadius="2px"
    marginInlineStart={1}
    marginInlineEnd="unset"
  />
);

const NotificationItem = ({
  message,
  onNotificationClick,
}: {
  message: any;
  onNotificationClick: any;
}) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onNotificationClick}
      marginBlock="4px"
      justifyContent="space-between"
      padding="12px 16px"
      border={`0.5px solid ${theme.palette.outline?.variant}`}
      bgcolor={
        message.seen ? "background.containerLowest" : "background.container"
      }
      position="relative"
      flexDirection={theme.direction === "rtl" ? "row-reverse" : "row"}
      sx={{
        ...styles.centerV,
        cursor: "pointer",
        "&:hover": { backgroundColor: "#f1f1f1" },
      }}
    >
      <NotificationIndicator seen={message.seen} />
      <Box
        flexGrow={1}
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        justifyContent={theme.direction === "rtl" ? "flex-end" : "flex-start"}
        sx={{ ...styles.centerV }}
      >
        <Typography
          variant="titleSmall"
          color="text.primary"
          fontWeight={message.seen ? 400 : 600}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </Box>
      <Typography
        variant="labelSmall"
        color="#3D4D5C"
        marginInlineStart="8px"
        marginInlineEnd="0"
        whiteSpace="nowrap"
      >
        {getReadableDate(message.createdAt, "relative")}
      </Typography>
      <ArrowForwardIos
        sx={{
          fontSize: "16px",
          color: "#2962FF",
          marginInlineStart: "8px",
          marginInlineEnd: "0",
          transform: theme.direction === "rtl" ? "rotate(180deg)" : "none",
        }}
      />
      <Box
        position="absolute"
        top="8px"
        left={theme.direction === "rtl" ? "8px" : "unset"}
        right={theme.direction === "ltr" ? "8px" : "unset"}
        width="8px"
        height="8px"
        bgcolor="secondary.main"
        borderRadius="50%"
        display={message.seen ? "none" : "block"}
      />
    </Box>
  );
};

const NotificationCenterComponent = ({ setNotificationCount }: any) => {
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const theme = useTheme();
  const handleUnseenCountChanged = (unseenCount: number) =>
    setNotificationCount(unseenCount);
  const handleNotificationClick = (
    message: IMessage,
    onNotificationClick: () => void,
  ) => {
    setSelectedMessage(message);
    onNotificationClick();
  };
  const handleBackClick = () => setSelectedMessage(null);

  const getLinkedContent = (message: any): string => {
    const { content, payload, templateIdentifier } = message;
    const data = payload?.data;
    let titleToLink = "";
    let href = "";
    if (data?.kit?.id && payload?.title === "New Assessment on Your Kit") {
      titleToLink = data.kit.title;
      href = `/assessment-kits/${data.kit.id}`;
    } else if (
      data?.assessment?.id &&
      data?.assessment?.spaceId &&
      data?.assessment?.title
    ) {
      titleToLink = data.assessment.title;
      if (templateIdentifier === "grantaccesstoreport") {
        href = `/${data.assessment.spaceId}/assessments/${data.assessment.id}/graphical-report`;
      } else {
        href = `/${data.assessment.spaceId}/assessments/1/${data.assessment.id}/dashboard`;
      }
    } else {
      return content;
    }
    if (!titleToLink) return content;
    const escapedTitle = titleToLink.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
    const regex = new RegExp(escapedTitle, "g");
    const link = `<a href="${href}" style="color: #1976d2; text-decoration: underline;">${titleToLink}</a>`;
    return content.replace(regex, link);
  };

  return (
    <Box>
      {selectedMessage ? (
        <Box
          className="nc-layout-wrapper"
          borderRadius={1}
          width={{ md: 420, sm: 320 }}
        >
          <Box className="nc-header" height="55px" sx={{ ...styles.centerV }}>
            <Typography
              className="nc-header-title"
              color="#525266"
              textAlign="left"
              lineHeight="24px"
              fontSize="20px"
              fontStyle="normal"
              fontWeight={700}
            >
              <IconButton onClick={handleBackClick}>
                <ArrowBackIos
                  sx={{
                    transform:
                      theme.direction === "rtl" ? "scaleX(-1)" : "none",
                    fontSize: "16px",
                  }}
                />
              </IconButton>
              <Trans i18nKey="notification.notificationDetails" />
            </Typography>
          </Box>
          <Box className="nc-notifications-list" height={400}>
            <Box
              marginBlock="4px"
              justifyContent="space-between"
              padding="12px 16px"
              bgcolor="background.containerLowest"
              position="relative"
              sx={{ ...styles.centerV }}
            >
              <Box
                position="absolute"
                left={theme.direction === "ltr" ? 8 : "unset"}
                right={theme.direction === "rtl" ? 8 : "unset"}
                top={8}
                bottom={0}
                width="4px"
                bgcolor={
                  selectedMessage?.seen ? "background.onVariant" : "#2D80D2"
                }
                borderRadius="2px"
              />
              <Box
                paddingLeft="12px"
                gap="4px"
                display="flex"
                flexDirection="column"
              >
                <Typography variant="titleMedium">
                  {(selectedMessage as any)?.payload?.title}
                </Typography>
                <Box
                  flexGrow={1}
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                >
                  <Typography
                    variant="bodyMedium"
                    dangerouslySetInnerHTML={{
                      __html: getLinkedContent(selectedMessage),
                    }}
                  />
                </Box>
                <Typography variant="labelSmall" color="#3D4D5C">
                  {getReadableDate(
                    selectedMessage?.createdAt,
                    "relativeWithDate",
                    true,
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <NotificationCenter
          onUnseenCountChanged={handleUnseenCountChanged}
          showUserPreferences={false}
          colorScheme="light"
          emptyState={
            <Box
              width="100%"
              height="400px"
              sx={{ ...styles.centerCVH, direction: theme.direction }}
              gap={1}
            >
              <img src={NotificationEmptyState} alt={"No assesment here!"} />
              <Typography variant="bodyMedium" color="primary">
                <Trans i18nKey="notification.notificationEmptyState" />
              </Typography>
            </Box>
          }
          listItem={(
            message: IMessage,
            _onAction,
            onNotificationClick: () => void,
          ) => (
            <NotificationItem
              message={message}
              onNotificationClick={() =>
                handleNotificationClick(message, onNotificationClick)
              }
            />
          )}
        />
      )}
    </Box>
  );
};

const Navbar = () => {
  const { userInfo, dispatch } = useAuthContext();
  const { config } = useConfigContext();
  const { spaceId } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationCenterRef = useRef(null);
  const bellButtonRef = useRef(null);
  const { service } = useServiceContext();
  const theme = useTheme();

  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.common.getPathInfo({ spaceId, ...(args ?? {}) }, config),
    runOnMount: false,
  });

  const fetchSpaceInfo = async () => {
    const res = await fetchPathInfo.query();
    dispatch(authActions.setCurrentSpace(res?.space));
  };

  useEffect(() => {
    if (spaceId) fetchSpaceInfo();
  }, [spaceId]);

  const handleDrawerToggle = () => setMobileOpen((p) => !p);
  const toggleNotificationCenter = () => setNotificationCenterOpen((p) => !p);

  const handleClickOutside = (event: any) => {
    if (
      notificationCenterRef.current &&
      !(notificationCenterRef.current as HTMLButtonElement).contains(
        event.target,
      ) &&
      bellButtonRef.current &&
      !(bellButtonRef.current as HTMLButtonElement).contains(event.target)
    ) {
      setNotificationCenterOpen(false);
    }
  };

  useEffect(() => {
    if (notificationCenterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationCenterOpen]);

  const drawer = (
    <Box onClick={handleDrawerToggle} textAlign="center">
      <Typography
        variant="h6"
        bgcolor="primary.main"
        height="56px"
        width="100%"
        sx={{ ...styles.centerVH }}
        component={NavLink}
        to={LandingPage}
      >
        <img
          src={config.appLogoUrl}
          alt={"logo"}
          width={"224px"}
          height={"40px"}
        />
      </Typography>
      <Divider />
      <List dense>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderRadius: 1.5 }}
            component={NavLink}
            to="/spaces"
          >
            <ListItemText primary={<Trans i18nKey="spaces.spaces" />} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderRadius: 1.5 }}
            component={NavLink}
            to={`/assessment-kits`}
          >
            <ListItemText primary={<Trans i18nKey="common.kitLibrary" />} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        sx={{
          borderRadius: "0px",
          backgroundColor: "primary.main",
          position: "sticky",
          px: { xxl: 26, xl: 18, lg: 8, xs: 0 },
          boxShadow: "0 0px 8px rgba(10, 35, 66, 0.25)",
        }}
        data-cy="nav-bar"
      >
        <Toolbar
          variant="dense"
          sx={{
            backgroundColor: "primary.main",
            borderRadius: 1,
            justifyContent: "space-between",
            position: "relative",
            minHeight: "44px",
          }}
        >
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 0.5,
              display: { xs: "inline-flex", sm: "none" },
              color: "background.containerLowest",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={NavLink}
            sx={{
              display: { xs: "none", md: "block" },
              color: "grey",
              height: "42px",
              width: "110px",
            }}
            to={LandingPage}
          >
            <img
              src={config.appLogoUrl}
              alt={"logo"}
              style={{ maxWidth: "120px", height: "100%" }}
            />
          </Typography>

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1.5,
              pointerEvents: "none",
            }}
          >
            <Button
              component={NavLink}
              data-cy="spaces"
              to={`/spaces`}
              sx={{
                ...styles.activeNavbarLink,
                textTransform: "uppercase",
                marginInlineStart: 0.8,
                marginInlineEnd: 0.1,
                color: "background.containerLowest",
                height: "32px",
                px: 1.5,
                pointerEvents: "auto",
              }}
              size="small"
            >
              <Trans i18nKey="assessment.myAssessments" />
            </Button>

            <Button
              component={NavLink}
              to={`/assessment-kits`}
              sx={{
                ...styles.activeNavbarLink,
                textTransform: "uppercase",
                marginInlineStart: 0.8,
                marginInlineEnd: 0.1,
                color: "background.containerLowest",
                height: "32px",
                px: 1.5,
                pointerEvents: "auto",
              }}
              size="small"
            >
              <Trans i18nKey="common.kitLibrary" />
            </Button>
          </Box>

          <Box gap="0.7rem" sx={{ ...styles.centerV }}>
            {MULTILINGUALITY.toString() == "true" ? <LanguageSelector /> : ""}
            <IconButton onClick={toggleNotificationCenter} ref={bellButtonRef}>
              <Badge
                max={99}
                badgeContent={notificationCount}
                color="error"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "secondary.main",
                    minWidth: "16px",
                    padding: 0,
                    height: "16px",
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: 20, color: "white" }} />
              </Badge>
            </IconButton>
            <AccountDropDownButton userInfo={userInfo} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* کشوی موبایل */}
      <Box component="nav">
        <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          anchor={i18n.language == "fa" ? "right" : "left"}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {notificationCenterOpen && (
        <Box
          ref={notificationCenterRef}
          position="fixed"
          top={60}
          right={theme.direction === "ltr" ? 20 : "unset"}
          left={theme.direction === "rtl" ? 20 : "unset"}
          zIndex={1300}
        >
          <NotificationCenterComponent
            setNotificationCount={setNotificationCount}
          />
        </Box>
      )}

      <Box display="none">
        <NotificationCenterComponent
          setNotificationCount={setNotificationCount}
        />
      </Box>
    </>
  );
};

const AccountDropDownButton = ({ userInfo }: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const showGroups =
    flagsmith.hasFeature(FLAGS.display_expert_groups) || !flagsmith.initialised;

  return (
    <>
      <Button
        data-cy="spaces"
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e as any);
        }}
        sx={{
          ...styles.activeNavbarLink,
          color: "background.containerLowest",
          fontFamily: languageDetector(userInfo.displayName)
            ? farsiFontFamily
            : primaryFontFamily,
        }}
        size="small"
        endIcon={
          open ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />
        }
      >
        <Avatar
          sx={{
            width: 26,
            height: 26,
            marginInlineEnd: 1.3,
            marginInlineStart: "unset",
          }}
          alt={userInfo.displayName}
          src={userInfo.pictureLink ?? ""}
        />
        {userInfo.displayName}
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: "180px" } }}
      >
        <MenuItem
          dense
          component={NavLink}
          to={`/user/account`}
          onClick={handleClose}
        >
          <ListItemIcon>
            <AccountBoxRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Trans i18nKey="user.account" />
          </ListItemText>
        </MenuItem>

        {showGroups && (
          <MenuItem
            dense
            onClick={handleClose}
            component={NavLink}
            to={`/user/expert-groups`}
          >
            <ListItemIcon>
              <EngineeringIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Trans i18nKey="expertGroups.expertGroups" />
            </ListItemText>
          </MenuItem>
        )}

        <Divider />
        <MenuItem
          dense
          onClick={() => {
            keycloakService.doLogout();
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Trans i18nKey="common.signOut" />
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;

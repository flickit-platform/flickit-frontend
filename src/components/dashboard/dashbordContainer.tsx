import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@/providers/ServiceProvider";
import DashboardTitle from "@components/dashboard/dashboardContainerTitle";
import QueryBatchData from "@common/QueryBatchData";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { useQuery } from "@utils/useQuery";
import { PathInfo } from "@/types/index";
import { NavLink, useLocation, useOutlet, useParams } from "react-router-dom";
import MainTabs from "@/components/dashboard/MainTabs";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import useScreenResize from "@utils/useScreenResize";
import { styles } from "@styles";
import MenuItem from "@mui/material/MenuItem";
import { Trans } from "react-i18next";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ListItemText from "@mui/material/ListItemText";
import { t } from "i18next";

const tabListTitle = [
  { label: "dashboard", address: "dashboard", permission: "viewDashboard" },
  {
    label: "questions",
    address: "questionnaires",
    permission: "viewAssessmentQuestionnaireList",
  },
  {
    label: "insights",
    address: "insights",
    permission: "viewAssessmentInsights",
  },
  { label: "advice", address: "advice", permission: "createAdvice" },
  {
    label: "reportTitle",
    address: "report",
    permission: "manageReportMetadata",
  },
  {
    label: "settings",
    address: "settings",
    permission: "grantUserAssessmentRole",
  },
];

const DashbordContainer = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const outlet = useOutlet();
  const buttonRef = useRef<any>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const showTabName = () => {
    return t(
      `${tabListTitle.find((item) => item.address === selectedTab)?.label}`,
    );
  };

  useEffect(() => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);
    const lastPart = pathSegments[4];
    setSelectedTab(lastPart);
  }, [location]);

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: true,
  });

  const isMobileScreen = useScreenResize("sm");

  return (
    <QueryBatchData
      queryBatchData={[fetchPathInfo]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={([pathInfo]) => {
        return (
          <Box m="auto" pb={3}>
            <DashboardTitle pathInfo={pathInfo} />
            <Grid
              container
              columns={12}
              display="flex"
              alignItems="center"
              mt={0.5}
            >
              <Grid
                item
                sm={Number(pathInfo?.assessment?.title?.length) < 20 ? 4 : 12}
                xs={Number(pathInfo?.assessment?.title?.length) < 20 ? 7 : 12}
              >
                <Typography
                  color="primary"
                  textAlign="left"
                  variant="headlineLarge"
                  sx={{
                    fontFamily: languageDetector(pathInfo?.assessment?.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {pathInfo?.assessment?.title}
                </Typography>
              </Grid>
              <Grid
                item
                sm={Number(pathInfo?.assessment?.title?.length) < 20 ? 8 : 12}
                xs={Number(pathInfo?.assessment?.title?.length) < 20 ? 5 : 12}
                sx={{ display: "flex" }}
              >
                {isMobileScreen ? (
                  <Box
                    sx={{
                      ...styles.centerVH,
                      mt: 1,
                      background: "#2466A814",
                      borderRadius: "16px",
                      p: 1.3,
                    }}
                  >
                    <Button
                      ref={buttonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(e);
                      }}
                      endIcon={
                        open ? (
                          <ArrowDropUpRoundedIcon />
                        ) : (
                          <ArrowDropDownRoundedIcon />
                        )
                      }
                    >
                      {showTabName()}
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        sx: {
                          width: buttonRef.current
                            ? `${buttonRef?.current?.offsetWidth}px`
                            : "180px",
                        },
                      }}
                    >
                      {tabListTitle.map((item) => {
                        const { label, address } = item;
                        return (
                          <MenuItem
                            key={label}
                            dense
                            component={NavLink}
                            to={address}
                            onClick={handleClose}
                            sx={{
                              fontFamily: languageDetector(label)
                                ? farsiFontFamily
                                : primaryFontFamily,
                              ...theme.typography.semiBoldMedium,
                              fontSize: "14px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <ListItemText>
                              <Trans i18nKey={label} />
                            </ListItemText>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Box>
                ) : (
                  <MainTabs
                    onTabChange={handleTabChange}
                    selectedTab={selectedTab}
                    tabListTitle={tabListTitle}
                  />
                )}
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  {outlet}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};
export default DashbordContainer;

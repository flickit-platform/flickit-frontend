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
import {
  Link,
  NavLink,
  useLocation,
  useOutlet,
  useParams,
} from "react-router-dom";
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
import { IconButton } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useAssessmentContext } from "@/providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@/utils/enumType";

// ---------- Types
type TabItem = {
  label: string;
  address: string;
  permission: string;
};

const tabListTitle: TabItem[] = [
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
];

const maxLength = 40;

const DashbordContainer: React.FC = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<string>("dashboard");
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams<{ assessmentId?: string }>();
  const outlet = useOutlet();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { assessmentInfo } = useAssessmentContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const showTabName = () =>
    t(tabListTitle.find((item) => item.address === selectedTab)?.label || "");

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    setSelectedTab(pathSegments[4] || "dashboard");
  }, [location]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) =>
    setSelectedTab(newValue);

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: true,
  });

  const isMobileScreen = useScreenResize("sm");
  const titleLength = assessmentInfo?.title?.length || 0;

  return (
    <QueryBatchData
      queryBatchData={[fetchPathInfo]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={([pathInfo]) => (
        <Box sx={{ ...styles.centerCV }} m="auto" pb={3} gap={1}>
          <DashboardTitle pathInfo={pathInfo} title={assessmentInfo?.title} />
          <Grid
            container
            columns={12}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid
              item
              sm={
                titleLength < maxLength || selectedTab === "settings" ? 6.8 : 12
              }
              xs={titleLength < maxLength ? 7 : 12}
              sx={{
                my:
                  assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK ? 2 : 0,
              }}
            >
              {selectedTab === "settings" ? (
                <Typography
                  color="primary"
                  textAlign="left"
                  variant="headlineLarge"
                >
                  <IconButton
                    color="primary"
                    component={Link}
                    to={`./questionnaires/`}
                  >
                    <ArrowForward
                      sx={{
                        ...theme.typography.headlineMedium,
                        transform: `scaleX(${theme.direction === "rtl" ? 1 : -1})`,
                      }}
                    />
                  </IconButton>
                  {t("settings")}
                </Typography>
              ) : (
                <Typography
                  color="primary"
                  textAlign="left"
                  variant="headlineLarge"
                  sx={{
                    fontFamily: languageDetector(assessmentInfo?.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {assessmentInfo?.title}
                </Typography>
              )}
            </Grid>
            {/* Tab Menu Section */}
            <Grid
              item
              sm={
                titleLength < maxLength || selectedTab === "settings" ? 5.2 : 12
              }
              xs={titleLength < maxLength ? 5 : 12}
              sx={{ display: "flex", my: 1 }}
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
                          ? `${buttonRef.current.offsetWidth}px`
                          : "180px",
                      },
                    }}
                  >
                    {tabListTitle.map(({ label, address }) => (
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
                    ))}
                  </Menu>
                </Box>
              ) : (
                <MainTabs
                  onTabChange={handleTabChange}
                  selectedTab={selectedTab}
                  tabListTitle={tabListTitle}
                  flexColumn={titleLength < maxLength}
                />
              )}
            </Grid>
            {/* Outlet */}
            <Grid container mt={2}>
              <Grid item xs={12}>
                {outlet}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    />
  );
};

export default DashbordContainer;

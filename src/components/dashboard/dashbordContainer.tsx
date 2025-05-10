import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@/providers/ServiceProvider";
import DashboardTitle from "@components/dashboard/dashboardContainerTitle";
import QueryBatchData from "@common/QueryBatchData";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { useQuery } from "@utils/useQuery";
import { PathInfo } from "@/types/index";
import { useLocation, useNavigate, useOutlet, useParams } from "react-router-dom";
import MainTabs from "@/components/dashboard/MainTabs";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import useScreenResize from "@utils/useScreenResize";
import { styles } from "@styles";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { theme } from "@/config/theme";
import { Trans } from "react-i18next";

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
  const navigate = useNavigate()
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


  const handleChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setSelectedTab(value as string);

    const selectedItem = tabListTitle.find((item) => item.address === value);
    if (selectedItem) {
      const { address } = selectedItem;
      navigate(`./${address}/`);
    }
  };

  const isMobileScreen = useScreenResize("sm")

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
                xs={12}
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
                xs={Number(pathInfo?.assessment?.title?.length) < 20 ? 8 : 12}
                sx={{ display: "flex" }}
              >
                {isMobileScreen ? (
                  <Box
                    sx={{
                      ...styles.centerVH,
                      mt: 1,
                      background: "#2466A814",
                      width: "70%",
                      borderRadius: "16px",
                      p: 1.3,
                    }}
                  >
                    <FormControl fullWidth>
                      <Select
                        value={selectedTab}
                        onChange={(event: any) => handleChange(event)}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              mt: 0,
                              borderTop: "none",
                              borderRadius: "0 0 8px 8px",
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            },
                          },
                          MenuListProps: {
                            disablePadding: true,
                          },
                        }}
                        sx={{
                          height: "40px",
                          background: "#fff",
                          width: { xs: "100%" },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px 8px 0 0",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.25)!important",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            boxShadow: "none",
                          },
                          "& .MuiTypography-root": {
                            ...theme.typography.semiBoldMedium,
                          },
                          color: theme.palette.primary.main,
                        }}
                      >
                        {tabListTitle.map((item) => {
                          const { label, address } = item;
                          return (
                            <MenuItem
                              key={label}
                              value={address}
                              sx={{
                                fontFamily: languageDetector(label)
                                  ? farsiFontFamily
                                  : primaryFontFamily,
                                ...theme.typography.semiBoldMedium,
                                fontSize: "14px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#2466A830",
                                  color: theme.palette.primary.main,
                                  fontWeight: 600,
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "#2466A820 !important",
                                },
                                "&.Mui-selected:hover": {
                                  backgroundColor: "#2466A840 !important",
                                },
                              }}
                            >
                              <Trans i18nKey={label} />
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
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

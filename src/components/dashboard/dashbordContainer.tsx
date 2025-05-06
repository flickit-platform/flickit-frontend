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
import {
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
import MainTabs from "@/components/dashboard/MainTabs";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Trans } from "react-i18next";
import { useMediaQuery } from "@mui/material";

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
  const navigate = useNavigate();

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
  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm"),
  );
  const handleChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setSelectedTab(value as string);

    const selectedItem = tabListTitle.find((item) => item.address === value);
    if (selectedItem) {
      const { address } = selectedItem;
      navigate(`./${address}/`);
    }
  };
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
              spacing={1}
            >
              <Grid
                item
                xs={6}
                sm={Number(pathInfo?.assessment?.title?.length) < 20 ? 4 : 12}
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
                xs={6}
                sm={Number(pathInfo?.assessment?.title?.length) < 20 ? 8 : 12}
                sx={{ display: "flex" }}
              >
                {isMobileScreen ? (
                  <FormControl sx={{ mt: 1 }} fullWidth>
                    <Select
                      value={selectedTab}
                      onChange={(event) => handleChange(event)}
                      sx={{
                        background: "#fff",
                        width: { xs: "100%" },
                        "& .MuiTypography-root": {
                          ...theme.typography.semiBoldMedium,
                        },
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
                            }}
                          >
                            <Trans i18nKey={label} />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
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

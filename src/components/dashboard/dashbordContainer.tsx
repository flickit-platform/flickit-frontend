import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@/providers/ServiceProvider";
import DashboardTitle from "@components/dashboard/dashboardContainerTitle";
import QueryBatchData from "@common/QueryBatchData";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { useQuery } from "@utils/useQuery";
import { ICustomError, PathInfo } from "@/types/index";
import { Link, useLocation, useOutlet, useParams } from "react-router-dom";
import MainTabs from "@/components/dashboard/MainTabs";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { styles } from "@styles";
import { t } from "i18next";
import { IconButton } from "@mui/material";
import { ArrowForward, EditOutlined } from "@mui/icons-material";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@/utils/enumType";
import InputCustomEditor from "../common/fields/InputCustomEditor";
import { toast } from "react-toastify";
import showToast from "@/utils/toastError";

const maxLength = 40;

const DashbordContainer: React.FC = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<string>("dashboard");
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams<{ assessmentId?: string }>();
  const outlet = useOutlet();
  const { assessmentInfo, permissions, dispatch } = useAssessmentContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState<string>("");

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    setSelectedTab(pathSegments[4] ?? "dashboard");
  }, [location]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) =>
    setSelectedTab(newValue);

  const fetchPathInfo = useQuery<PathInfo>({
    service: (args, config) =>
      service.common.getPathInfo({ assessmentId, ...(args ?? {}) }, config),
    runOnMount: true,
  });

  const title =
    assessmentInfo?.title ?? fetchPathInfo?.data?.assessment?.title ?? "";
  const titleLength = title.length;

  const handleStartEdit = () => {
    setEditedValue(title);
    setIsEditing(true);
  };

  const updateAssessmentQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.update(
        args ?? {
          id: assessmentId,
          data: {
            title: editedValue,
          },
        },
        config,
      ),
    runOnMount: false,
  });

  const handleSaveEdit = async () => {
    try {
      const res = await updateAssessmentQuery.query();
      res.message && showToast(res.message, { variant: "success" });
      if (assessmentInfo) {
        dispatch(
          assessmentActions.setAssessmentInfo({
            ...assessmentInfo,
            title: editedValue,
          }),
        );
      }
      setIsEditing(false);
    } catch (e) {
      const err = e as ICustomError;
      showToast(err.message);
    }
  };
  const handleCancelEdit = () => {
    setEditedValue(title);
    setIsEditing(false);
  };

  return (
    <QueryBatchData
      queryBatchData={[fetchPathInfo]}
      renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
      render={() => (
        <Box sx={{ ...styles.centerCV }} m="auto" pb={3} gap={1}>
          <DashboardTitle
            pathInfo={fetchPathInfo.data}
            title={assessmentInfo?.title}
            permissions={permissions}
          />

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
                  {t("common.settings")}
                </Typography>
              ) : (
                <Box paddingX={isEditing ? 1 : 0}>
                  {isEditing ? (
                    <InputCustomEditor
                      value={editedValue}
                      inputHandler={(e: any) => setEditedValue(e.target.value)}
                      handleDone={handleSaveEdit}
                      handleCancel={handleCancelEdit}
                      hasError={false}
                    />
                  ) : (
                    <Typography
                      color="primary"
                      textAlign="left"
                      variant="headlineLarge"
                      sx={{
                        fontFamily: languageDetector(title)
                          ? farsiFontFamily
                          : primaryFontFamily,
                      }}
                    >
                      {title}
                      <IconButton color="primary" onClick={handleStartEdit}>
                        <EditOutlined />
                      </IconButton>
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>

            <Grid
              item
              sm={
                titleLength < maxLength || selectedTab === "settings" ? 5.2 : 12
              }
              xs={titleLength < maxLength ? 5 : 12}
              sx={{ display: "flex", my: 1 }}
              justifyContent="flex-end"
            >
              <MainTabs
                onTabChange={handleTabChange}
                selectedTab={selectedTab}
                flexColumn={titleLength < maxLength}
              />
            </Grid>

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

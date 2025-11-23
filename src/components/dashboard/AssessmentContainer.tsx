import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useServiceContext } from "@/providers/service-provider";
import DashboardTitle from "@/components/dashboard/AssessmentTitle";
import QueryBatchData from "@common/QueryBatchData";
import LoadingSkeletonOfAssessmentRoles from "@common/loadings/LoadingSkeletonOfAssessmentRoles";
import { useQuery } from "@/hooks/useQuery";
import { ICustomError, PathInfo } from "@/types/index";
import { Link, useLocation, useOutlet, useParams } from "react-router-dom";
import MainTabs from "@/components/dashboard/MainTabs";
import { styles } from "@styles";
import { t } from "i18next";
import { IconButton, useTheme } from "@mui/material";
import { ArrowForward, EditOutlined } from "@mui/icons-material";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/assessment-provider";
import { ASSESSMENT_MODE } from "@/utils/enum-type";
import InputCustomEditor from "../common/fields/InputCustomEditor";
import showToast from "@/utils/toast-error";
import { Text } from "../common/Text";
import QueryData from "../common/QueryData";
import PermissionControl from "../common/PermissionControl";

const maxLength = 40;

const DashbordContainer: React.FC = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<string>("dashboard");
  const { service } = useServiceContext();
  const { assessmentId = "", questionnaireId = "" } = useParams();
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
      service.common.getPathInfo(
        { assessmentId, questionnaireId, ...(args ?? {}) },
        config,
      ),
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
  const theme = useTheme();

  useEffect(() => {
    fetchPathInfo.query();
  }, [questionnaireId, assessmentId]);

  return (
    <>
      {!fetchPathInfo.errorObject && (
        <QueryData
          {...fetchPathInfo}
          renderLoading={() => <LoadingSkeletonOfAssessmentRoles />}
          render={(pathInfo) => (
            <DashboardTitle
              pathInfo={pathInfo}
              title={assessmentInfo?.title}
              permissions={permissions}
            />
          )}
        />
      )}
      <Box sx={{ ...styles.centerCV }} m="auto" pb={3} gap={1}>
        <Grid
          container
          columns={12}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Grid
            size={{
              xs: titleLength < maxLength ? 7 : 12,
              sm:
                titleLength < maxLength || selectedTab === "settings"
                  ? 6.8
                  : 12,
            }}
            sx={{
              my: assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK ? 2 : 0,
            }}
          >
            {selectedTab === "settings" ? (
              <Text color="primary" textAlign="left" variant="headlineLarge">
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
              </Text>
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
                  <Text
                    color="primary"
                    textAlign="left"
                    variant="headlineLarge"
                  >
                    {title}
                    {permissions?.grantUserAssessmentRole && (
                      <IconButton color="primary" onClick={handleStartEdit}>
                        <EditOutlined />
                      </IconButton>
                    )}
                  </Text>
                )}
              </Box>
            )}
          </Grid>

          <Grid
            size={{
              xs: titleLength < maxLength ? 5 : 12,
              sm:
                titleLength < maxLength || selectedTab === "settings"
                  ? 5.2
                  : 12,
            }}
            sx={{ display: "flex", my: 1, justifyContent: "flex-end" }}
          >
            <MainTabs
              onTabChange={handleTabChange}
              selectedTab={selectedTab}
              flexColumn={titleLength < maxLength}
            />
          </Grid>

          <Grid sx={{ width: "100%" }} container mt={2}>
            <Grid size={{ xs: 12 }}>{outlet}</Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DashbordContainer;

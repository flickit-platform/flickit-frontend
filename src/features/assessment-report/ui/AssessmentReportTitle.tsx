import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import { styles } from "@styles";
import { useAuthContext } from "@/providers/auth-provider";
import { ArrowForward } from "@mui/icons-material";
import Title from "@common/Title";
import { t } from "i18next";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

const AssessmentReportTitle = (props: any) => {
  const { pathInfo, rtlLanguage, lng, children, permissions } = props;
  const { spaceId } = useParams();
  const { space, assessment } = pathInfo;
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticatedUser } = useAuthContext();

  const from = state?.location?.pathname || state?.from;

  const handleBack = () => {
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(`/${spaceId}/assessments/1/`, { replace: true });
    }
  };

  const canViewSecond =
    !!permissions?.canViewDashboard || !!permissions?.canViewQuestionnaires;

  const secondTo = permissions?.canViewQuestionnaires
    ? `/${spaceId}/assessments/1/${assessment?.id}/questionnaires`
    : `/${spaceId}/assessments/1/${assessment?.id}/dashboard`;

  const routes = [
    {
      title: space?.title,
      to: `/${spaceId}/assessments/1`,
      icon: (
        <FolderOutlinedIcon
          fontSize="small"
          sx={{ ...styles.iconDirectionStyle(lng) }}
        />
      ),
    },
    ...(canViewSecond
      ? [
          {
            title: assessment?.title,
            to: secondTo,
            icon: (
              <AssignmentOutlinedIcon
                fontSize="small"
                sx={{ ...styles.iconDirectionStyle(lng) }}
              />
            ),
          },
        ]
      : []),
    {
      title: t("assessmentReport.assessmentReport", { lng }) ?? "",
      icon: (
        <DescriptionOutlinedIcon
          fontSize="small"
          sx={{ ...styles.iconDirectionStyle(lng) }}
        />
      ),
    },
  ];
  // === END NEW

  return (
    <Title
      backLink="/spaces"
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
        },
      }}
      size="large"
      sx={{
        ...styles.rtlStyle(rtlLanguage),
        textAlign: "left",
        width: "100%",
        textTransform: "none",
        color: "primary.main",
      }}
      sup={<SupTitleBreadcrumb routes={routes} displayChip />}
    >
      <Box
        mt={3.125}
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems="flex-end"
      >
        <Box>
          {isAuthenticatedUser && (
            <IconButton color="primary" onClick={handleBack} size="small">
              <ArrowForward
                sx={(theme) => ({
                  ...theme.typography.headlineMedium,
                  transform: `scaleX(${rtlLanguage ? 1 : -1})`,
                })}
              />
            </IconButton>
          )}
          {assessment?.title}
        </Box>
        {children}
      </Box>
    </Title>
  );
};

export default AssessmentReportTitle;

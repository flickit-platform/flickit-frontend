import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import { styles } from "@styles";
import { useAuthContext } from "@/providers/AuthProvider";
import { ArrowForward } from "@mui/icons-material";

const AssessmentReportTitle = (props: any) => {
  const { pathInfo, rtlLanguage, children } = props;
  const { spaceId } = useParams();
  const { space, assessment } = pathInfo;
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticatedUser } = useAuthContext();

  const from = state?.location?.from;

  const handleBack = () => {
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(`/${spaceId}/assessments/1/`, { replace: true });
    }
  };

  return (
    <Title
      backLink="/spaces"
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
        },
      }}
      width="100%"
      textTransform="none"
      variant="headlineLarge"
      color="primary"
      sx={{ ...styles.rtlStyle(rtlLanguage), textAlign: "left" }}
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: space?.title,
              to: `/${spaceId}/assessments/${assessment?.id ?? "1"}`,
            },
            { title: assessment?.title },
          ]}
          displayChip
        />
      }
    >
      <Box mt={4} display="flex" justifyContent="space-between" width="100%" alignItems="flex-end">
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

import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { Link, useParams } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { styles } from "@styles";
import { IconButton } from "@mui/material";
import { useMemo } from "react";
import Title from "@common/Title";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

const DashboardTitle = (props: any) => {
  const { pathInfo, title, permissions } = props;
  const { spaceId, page, assessmentId } = useParams();

  const hasAccessTonSettings = useMemo(() => {
    return permissions?.grantUserAssessmentRole;
  }, [permissions]);

  const routes = useMemo(() => {
    const baseRoutes = [
      {
        title: pathInfo?.space?.title,
        to: `/${spaceId}/assessments/${page}`,
        icon: <FolderOutlinedIcon fontSize="small" />,
      },
      {
        title: `${title ?? pathInfo?.assessment?.title}`,
        to: `/${spaceId}/assessments/${page}/${assessmentId}/questionnaires/`,
        icon: <AssignmentOutlinedIcon fontSize="small" />,
      },
    ];

    if (pathInfo.questionnaire?.title) {
      return [
        ...baseRoutes,
        {
          title: `${pathInfo.questionnaire.title}`,
          icon: <AssignmentOutlinedIcon fontSize="small" />,
        },
      ];
    }

    return baseRoutes;
  }, [pathInfo, spaceId, page, title]);

  return (
    <Title
      backLink="/spaces"
      sup={<SupTitleBreadcrumb routes={routes} displayChip />}
      toolbar={
        hasAccessTonSettings && (
          <IconButton component={Link} to={"settings"}>
            <SettingsOutlinedIcon
              sx={{ ...styles.centerCVH, color: "background.onVariant" }}
            />
          </IconButton>
        )
      }
    ></Title>
  );
};

export default DashboardTitle;

import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { Link, useParams } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { styles } from "@styles";
import { IconButton } from "@mui/material";
import { useMemo } from "react";

const DashboardTitle = (props: any) => {
  const { pathInfo, title, permissions } = props;
  const { spaceId, page } = useParams();
  const { space } = pathInfo;

  const hasAccessTonSettings = useMemo(() => {
    return permissions?.grantUserAssessmentRole;
  }, [permissions]);
  return (
    <Title
      backLink="/spaces"
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: space?.title,
              to: `/${spaceId}/assessments/${page}`,
            },
            {
              title: `${title ?? pathInfo.assessment.title}`,
            },
          ]}
          displayChip
        />
      }
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

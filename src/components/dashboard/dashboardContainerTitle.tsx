import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { Link, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { styles } from "@styles";
import { IconButton } from "@mui/material";

const DashboardTitle = (props: any) => {
  const { pathInfo, title } = props;
  const { spaceId, page } = useParams();
  const { space, assessment } = pathInfo;

  return (
    <Title
      backLink="/"
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
          justifyContent: "center",
        },
      }}
      sup={
        <SupTitleBreadcrumb
          routes={[
            {
              title: space?.title,
              to: `/${spaceId}/assessments/${page}`,
            },
            {
              title: `${title}`,
            },
          ]}
          displayChip
        />
      }
      toolbar={
        <IconButton component={Link} to={"settings"}>
          <SettingsOutlinedIcon
            sx={{ ...styles.centerCVH, color: "#6C8093" }}
          />
        </IconButton>
      }
    ></Title>
  );
};

export default DashboardTitle;

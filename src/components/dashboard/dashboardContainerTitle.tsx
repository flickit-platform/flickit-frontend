import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { Link, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useAssessmentContext } from "@providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@utils/enumType";

const DashboardTitle = (props: any) => {
  const { pathInfo } = props;
  const { spaceId, page } = useParams();
  const { space, assessment } = pathInfo;

  const { assessmentInfo } = useAssessmentContext();

  return (
    <Title
      backLink="/"
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
          justifyContent: "center"
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
              title: `${assessment?.title}`,
            },
          ]}
          displayChip
        />
      }
     toolbar={
       <Box component={Link} to={"settings"}>
         <SettingsOutlinedIcon sx={{display: assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK ? "flex" : "none", alignSelf: "center", color: "#6C8093"}} />
       </Box>
     }
    ></Title>
  );
};

export default DashboardTitle;

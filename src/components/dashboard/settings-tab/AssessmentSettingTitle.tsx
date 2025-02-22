import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { useParams } from "react-router-dom";
import { t } from "i18next";

interface IAssessmentAccessManagementTitle {
  pathInfo: {
    space: {
      id: number;
      title: string;
    };
    assessment: {
      id: string;
      title: string;
    };
  };
}

const AssessmentSettingTitle = (props: IAssessmentAccessManagementTitle) => {
  const { pathInfo } = props;
  const { spaceId, page } = useParams();
  const { space, assessment } = pathInfo;

  return (
    <Title
      backLink="/"
      wrapperProps={{
        sx: {
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
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
              title: t("assessmentSettings") as string,
            },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default AssessmentSettingTitle;

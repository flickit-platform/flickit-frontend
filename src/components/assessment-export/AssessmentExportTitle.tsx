import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { useParams } from "react-router-dom";
import { t } from "i18next";

interface IAssessmentExportTitle {
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

const AssessmentExportTitle = (props: IAssessmentExportTitle) => {
  const { pathInfo } = props;
  const { spaceId, page } = useParams();
  const { space } = pathInfo;

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
              title: `${pathInfo?.assessment?.title} ${t("insights")}`,
              to: `/${spaceId}/assessments/${page}/${pathInfo?.assessment?.id}/insights`,
            },
            {
              title: t("assessmentDocument") as string,
            },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default AssessmentExportTitle;

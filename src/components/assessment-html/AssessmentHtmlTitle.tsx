import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import { useParams } from "react-router-dom";
import { t } from "i18next";

const AssessmentHtmlTitle = (props: any) => {
  const { pathInfo, language } = props;
  const { spaceId } = useParams();
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
              to: `/${spaceId}/assessments/1`,
            },
            {
              title: t("assessmentReport.assessmentReport", { lng: language }) as string,
            },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default AssessmentHtmlTitle;

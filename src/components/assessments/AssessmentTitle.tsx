import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import Title from "@common/Title";

interface IAssessmentReportTitle {
  data: any;
}

const AssessmentTitle = (props: IAssessmentReportTitle) => {
  const { data } = props;
  const { title } = data;

  return (
    <Title
      backLink="/spaces"
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
              title: title ?? "",
              to: `/`,
            },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default AssessmentTitle;

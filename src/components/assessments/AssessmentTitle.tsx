import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import NewTitle from "@common/newTitle";

interface IAssessmentReportTitle {
  data: any;
}

const AssessmentTitle = (props: IAssessmentReportTitle) => {
  const { data } = props;
  const { title } = data;

  return (
    <NewTitle
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
    ></NewTitle>
  );
};

export default AssessmentTitle;

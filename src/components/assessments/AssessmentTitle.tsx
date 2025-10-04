import SupTitleBreadcrumb from "@/components/common/SupTitleBreadcrumb";
import Title from "@common/Title";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

interface IAssessmentReportTitle {
  title: string;
}

const AssessmentTitle = (props: IAssessmentReportTitle) => {
  const { title } = props;

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
              title: title,
              icon: <FolderOutlinedIcon fontSize="small" />,
            },
          ]}
          displayChip
        />
      }
    ></Title>
  );
};

export default AssessmentTitle;

import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/service-provider";
import QueryBatchData from "@/components/common/QueryBatchData";
import PageTitle from "./PageTitle";
import KitDetailsAside from "./KitDetailsAside";
import EditableKitDetail from "./EditableKitDetail";
import { AssessmentKitInfoType, AssessmentKitStatsType } from "@/types";
import { useAssessmentKitDetail } from "../model/useAssessmentKitDetail";

const AssessmentKitDetail = () => {
  const { assessmentKitId, expertGroupId } = useParams();
  const { service } = useServiceContext();

  const {
    fetchAssessmentKitInfoQuery,
    fetchAssessmentKitStatsQuery,
    info,
    stats,
    languages,
  } = useAssessmentKitDetail(assessmentKitId, service);

  return (
    <QueryBatchData
      queryBatchData={[fetchAssessmentKitInfoQuery, fetchAssessmentKitStatsQuery]}
      render={([infoData, statsData]) => {
        const _info = (info ?? infoData) as AssessmentKitInfoType;
        const _stats = (stats ?? statsData) as AssessmentKitStatsType;

        return (
          <>
            <PageTitle
              title={_info.title}
              expertGroupId={expertGroupId}
              expertGroupTitle={_stats.expertGroup.title}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <EditableKitDetail
                  fetchAssessmentKitInfoQuery={fetchAssessmentKitInfoQuery}
                  info={_info}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <KitDetailsAside
                  stats={_stats}
                  languages={languages}
                  assessmentKitTitle={_info.title}
                  draftVersionId={_info.draftVersionId}
                />
              </Grid>
            </Grid>
          </>
        );
      }}
    />
  );
};

export default AssessmentKitDetail;

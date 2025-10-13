import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import QueryBatchData from "@/components/common/QueryBatchData";
import PageTitle from "./PageTitle";
import KitDetailsAside from "./KitAside";
import EditableKitDetail from "./KitInfo";
import { useKitDetailContainer } from "../model/useKitDetailContainer";
import { KitDetailsType, KitInfoType, KitStatsType } from "../model/types";
import FooterContainer from "./footer/FooterContainer";
import QueryData from "@/components/common/QueryData";

const KitDetailContainer = () => {
  const { assessmentKitId, expertGroupId } = useParams();

  const {
    fetchKitInfoQuery,
    fetchKitStatsQuery,
    fetchKitDetailQuery,
    info,
    stats,
    details,
    languages,
  } = useKitDetailContainer(assessmentKitId);
  console.log("selectedId");

  return (
    <QueryBatchData
      queryBatchData={[
        fetchKitInfoQuery,
        fetchKitStatsQuery,
        fetchKitDetailQuery,
      ]}
      render={([infoData, statsData, detailsData]) => {
        const _info = (info ?? infoData) as KitInfoType;
        const _stats = (stats ?? statsData) as KitStatsType;
        const _details = (details ?? detailsData) as KitDetailsType;
        return (
          <>
            <PageTitle
              title={_info.title}
              expertGroupId={expertGroupId}
              expertGroupTitle={_stats.expertGroup.title}
            />
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <EditableKitDetail
                  fetchAssessmentKitInfoQuery={fetchKitInfoQuery}
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
              <Grid item sm={12} xs={12}>
                {_info.hasActiveVersion && (
                  <FooterContainer details={_details} />
                )}
              </Grid>
            </Grid>
          </>
        );
      }}
    />
  );
};

export default KitDetailContainer;

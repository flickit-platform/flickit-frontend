import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import QueryBatchData from "@/components/common/QueryBatchData";
import PageTitle from "./PageTitle";
import KitDetailsAside from "./KitAside";
import EditableKitDetail from "./KitInfo";
import { useKitDetailContainer } from "../model/useKitDetailContainer";
import { KitInfoType, KitStatsType } from "../model/types";
import FooterContainer from "./footer/FooterContainer";

const KitDetailContainer = () => {
  const { assessmentKitId, expertGroupId } = useParams();

  const {
    fetchKitInfoQuery,
    fetchKitStatsQuery,
    info,
    stats,
    languages,
  } = useKitDetailContainer(assessmentKitId);

  return (
    <QueryBatchData
      queryBatchData={[fetchKitInfoQuery, fetchKitStatsQuery]}
      render={([infoData, statsData]) => {
        const _info = (info ?? infoData) as KitInfoType;
        const _stats = (stats ?? statsData) as KitStatsType;

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
              {_info.hasActiveVersion && <FooterContainer />}
            </Grid>
          </>
        );
      }}
    />
  );
};

export default KitDetailContainer;

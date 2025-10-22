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
import { useEffect } from "react";

const KitDetailContainer = () => {
  const { assessmentKitId, expertGroupId } = useParams();

  const {
    fetchKitInfoQuery,
    fetchKitStatsQuery,
    fetchKitDetailQuery,
    info,
    stats,
    languages,
  } = useKitDetailContainer(assessmentKitId);

  useEffect(() => {
    if (info?.hasActiveVersion) {
      fetchKitDetailQuery.query();
    }
  }, [info?.hasActiveVersion]);

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
            <Grid container spacing={4}>
              <Grid size={{xs: 12, md: 8}}>
                <EditableKitDetail
                  fetchAssessmentKitInfoQuery={fetchKitInfoQuery}
                  info={_info}
                />
              </Grid>
              <Grid size={{xs: 12, md: 4}}>
                <KitDetailsAside
                  stats={_stats}
                  languages={languages}
                  assessmentKitTitle={_info.title}
                  draftVersionId={_info.draftVersionId}
                />
              </Grid>
              <Grid size={{sm: 12, xs: 12}}>
                {_info.hasActiveVersion && (
                  <QueryData
                    {...fetchKitDetailQuery}
                    render={(details) => {
                      return <FooterContainer details={details} />;
                    }}
                  />
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

import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import { Grid, Tab, Tabs } from "@mui/material";
import QueryBatchData from "../../../components/common/QueryBatchData";
import { AssessmentKitInfoType, AssessmentKitStatsType } from "@/types";
import i18next from "i18next";
import { formatLanguageCodes } from "@/utils/language-utils";
import PageTitle from "./PageTitle";
import KitDetailsAside from "./KitDetailsAside";
import EditableKitDetail from "./EditableKitDetail";
import KitDetailsMenu from "@/features/kit-detail/ui/kitDetailsMenu";

const AssessmentKitDetail = () => {
  const { assessmentKitId, expertGroupId } = useParams();
  const { service } = useServiceContext();

  const fetchAssessmentKitInfoQuery = useQuery<AssessmentKitInfoType>({
    service: (args, config) =>
      service.assessmentKit.info.getInfo(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });
  const fetchAssessmentKitStatsQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getStats(args ?? { assessmentKitId }, config),
    runOnMount: true,
  });

  return (
    <QueryBatchData
      queryBatchData={[
        fetchAssessmentKitInfoQuery,
        fetchAssessmentKitStatsQuery,
      ]}
      render={([info, stat]) => {
        const stats = stat as AssessmentKitStatsType;

        return (
          <>
            <PageTitle
              title={info.title}
              expertGroupId={expertGroupId}
              expertGroupTitle={stats.expertGroup.title}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <EditableKitDetail
                  fetchAssessmentKitInfoQuery={fetchAssessmentKitInfoQuery}
                  info={info as AssessmentKitInfoType}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <KitDetailsAside
                  stats={stats}
                  languages={formatLanguageCodes(
                    info.languages,
                    i18next.language,
                  )}
                  assessmentKitTitle={info.title}
                />
              </Grid>
            </Grid>


            <Grid container sm={12} xs={12} mt={6}>
              <KitDetailsMenu/>
            </Grid>
          </>
        );
      }}
    />
  );
};

export default AssessmentKitDetail;

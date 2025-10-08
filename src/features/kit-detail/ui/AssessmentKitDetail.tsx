import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/service-provider";
import QueryBatchData from "@/components/common/QueryBatchData";
import PageTitle from "./PageTitle";
import KitDetailsAside from "./KitDetailsAside";
import EditableKitDetail from "./EditableKitDetail";
import KitDetailsMenu from "@/features/kit-detail/ui/kitDetailsMenu";
import { useAssessmentKit } from "@components/assessment-kit/AssessmentKitExpertViewContainer";
import { useEffect, useState } from "react";
import { AssessmentKitInfoType, AssessmentKitStatsType } from "@/types";
import { useAssessmentKitDetail } from "../model/useAssessmentKitDetail";

const AssessmentKitDetail = () => {
  const { assessmentKitId, expertGroupId } = useParams();
  const { service } = useServiceContext();
  const [details, setDetails] = useState<any[]>([]);
  const { fetchAssessmentKitDetailQuery } = useAssessmentKit();

  const {
    fetchAssessmentKitInfoQuery,
    fetchAssessmentKitStatsQuery,
    info,
    stats,
    languages,
  } = useAssessmentKitDetail(assessmentKitId, service);

  useEffect(() => {
    const fetchDetails = async () => {
      const res: any = await fetchAssessmentKitDetailQuery.query();
      const tabMap = [
        {
          key: "maturityLevel",
          title: "common.maturityLevel",
          Component: <></>,
          Items: [],
        },
        {
          key: "subjects",
          title: "common.subjects",
          Component: <></>,
          Items: res.subjects ?? [],
        },
        {
          key: "questionnaires",
          title: "common.questionnaires",
          Component: <></>,
          Items: res.questionnaires ?? [],
        },
        {
          key: "measures",
          title: "assessmentKit.numberMeasures",
          Component: <></>,
          Items: res.questionnaires ?? [],
        },
        {
          key: "answerRanges",
          title: "kitDesigner.answerRanges",
          Component: <></>,
          Items: [],
        },
      ];

      setDetails(tabMap);
    };
    fetchDetails();
  }, []);

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


            {details.length > 0 && <Grid container sm={12} xs={12} mt={6}>
              <KitDetailsMenu details={details}/>
            </Grid>}
          </>
        );
      }}
    />
  );
};

export default AssessmentKitDetail;

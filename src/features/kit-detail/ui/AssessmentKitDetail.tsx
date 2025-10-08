import { Grid, Tab, Tabs } from "@mui/material";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/service-provider";
import QueryBatchData from "@/components/common/QueryBatchData";
import PageTitle from "./PageTitle";
import KitDetailsAside from "./KitDetailsAside";
import EditableKitDetail from "./EditableKitDetail";
import {
  AssessmentKitDetailsType,
  AssessmentKitInfoType,
  AssessmentKitStatsType,
} from "@/types";
import { useAssessmentKitDetail } from "../model/useAssessmentKitDetail";
import { Trans } from "react-i18next";
import { Text } from "@/components/common/Text";
import QueryData from "@/components/common/QueryData";
import PermissionControl from "@/components/common/PermissionControl";
import { MaturityLevels } from "./tabs/MaturityLevels";

const AssessmentKitDetail = () => {
  const { assessmentKitId, expertGroupId } = useParams();

  const {
    fetchAssessmentKitInfoQuery,
    fetchAssessmentKitStatsQuery,
    fetchAssessmentKitDetailsQuery,
    info,
    stats,
    details,
    languages,
  } = useAssessmentKitDetail(assessmentKitId);

  return (
    <QueryBatchData
      queryBatchData={[
        fetchAssessmentKitInfoQuery,
        fetchAssessmentKitStatsQuery,
      ]}
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
              {_info.hasActiveVersion && (
                <QueryData
                  {...fetchAssessmentKitDetailsQuery}
                  render={(detailsData) => {
                    const _details = (details ??
                      detailsData) as AssessmentKitDetailsType;

                    return (
                      <Grid container sm={12} xs={12} mt={6}>
                        <Grid
                          item
                          sm={3}
                          xs={12}
                          sx={{ display: "flex", flexDirection: "column" }}
                        >
                          <Tabs
                            sx={{
                              borderRight: 1,
                              borderColor: "divider",
                              flexGrow: 1,
                              backgroundColor: "rgba(36, 102, 168, 0.04)",
                              padding: 0,
                              color: "rgba(0, 0, 0, 0.6)",

                              "& .Mui-selected": {
                                color: "primary.main",
                                fontWeight: "bold",
                              },

                              "& .MuiTabs-indicator": {
                                backgroundColor: "primary.main",
                              },
                            }}
                          >
                            <Tab
                              sx={{
                                alignItems: "flex-start",
                                textTransform: "none",
                              }}
                              label={
                                <Text variant="semiBoldLarge">
                                </Text>
                              }
                            />
                          </Tabs>
                        </Grid>

                        <Grid
                          item
                          sm={9}
                          xs={12}
                          sx={{
                            height: "100%",
                            padding: "16px 32px",
                            bgcolor: "background.containerLowest",
                          }}
                        >
                          <MaturityLevels maturityLevels={_details.maturityLevels} />
                        </Grid>
                      </Grid>
                    );
                  }}
                />
              )}
            </Grid>
          </>
        );
      }}
    />
  );
};

export default AssessmentKitDetail;

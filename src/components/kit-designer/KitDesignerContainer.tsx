import { useEffect, useState } from "react";
import { Box, Grid, Typography, Tabs, Tab } from "@mui/material";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";

import KitDesignerTitle from "./KitDesignerContainerTitle";
import MaturityLevelsContent from "./maturityLevels/MaturityLevelsContent";
import SubjectsContent from "./subjects/SubjectsContent";
import AttributesContent from "./attributes/AttributeContent";
import AnaweRangeContent from "./answerRange/AnswerRangeContent";
import MeasuresContent from "./measures/MeasuresContent";
import QuestionnairesContent from "./questionnaires/QuestionnairesContent";
import PublishContent from "./publish/PublishContent";
import GeneralContent from "./general/GeneralContent";

import QueryBatchData from "../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { IKitVersion, ILanguage } from "@/types";
import { useKitDesignerContext, kitActions } from "@/providers/KitProvider";

const tabMap = [
  { key: "General", title: "common.general", Component: GeneralContent },
  {
    key: "Maturity-Levels",
    title: "common.maturityLevels",
    Component: MaturityLevelsContent,
  },
  { key: "Subjects", title: "common.subjects", Component: SubjectsContent },
  { key: "Attributes", title: "common.attributes", Component: AttributesContent },
  { key: "Answer-Ranges", title: "kitDesigner.answerRanges", Component: AnaweRangeContent },
  {
    key: "Measures",
    title: "kitDesigner.measures",
    Component: MeasuresContent,
  },
  {
    key: "Questionnaires",
    title: "common.questionnaires",
    Component: QuestionnairesContent,
  },
  { key: "Release", title: "kitDesigner.release", Component: PublishContent },
];

const KitDesignerContainer = () => {
  const { kitVersionId = "" } = useParams();
  const { service } = useServiceContext();
  const { dispatch } = useKitDesignerContext();

  const [selectedTab, setSelectedTab] = useState(0);

  const kitVersionQuery = useQuery<IKitVersion>({
    service: (args, config) =>
      service.kitVersions.info.getById(args ?? { kitVersionId }, config),
    runOnMount: true,
  });

  const assessmentKitQuery = useQuery({
    service: (args, config) => service.assessmentKit.info.getInfo(args, config),
    runOnMount: false,
  });

  // Initialize tab from hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const index = tabMap.findIndex((tab) => tab.key === hash);
    setSelectedTab(index >= 0 ? index : 0);
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
    window.location.hash = tabMap[newValue].key;
  };

  // Fetch assessment kit info when kitVersion loads
  useEffect(() => {
    if (kitVersionQuery.data) {
      assessmentKitQuery.query({
        assessmentKitId: kitVersionQuery.data.assessmentKit.id,
      });
    }
  }, [kitVersionQuery.data]);

  // Set main and translated language
  useEffect(() => {
    const data = assessmentKitQuery.data;
    if (data) {
      const defaultTranslated = data.languages?.find(
        (lang: ILanguage) => lang.code !== data.mainLanguage?.code,
      );
      dispatch(kitActions.setMainLanguage(data.mainLanguage));
      dispatch(kitActions.setTranslatedLanguage(defaultTranslated));
    }
  }, [assessmentKitQuery.data]);

  return (
    <QueryBatchData
      queryBatchData={[kitVersionQuery]}
      render={([kitVersion]) => {
        const CurrentComponent = tabMap[selectedTab].Component;
        return (
          <Box m="auto" pb={3}>
            <KitDesignerTitle kitVersion={kitVersion} />

            <Grid container spacing={1} columns={12}>
              <Grid item sm={12} xs={12} mt={1}>
                <Typography
                  color="primary"
                  textAlign="left"
                  variant="headlineLarge"
                >
                  <Trans i18nKey="kitDesigner.kitDesigner" />
                </Typography>
              </Grid>

              <Grid container sm={12} xs={12} mt={6}>
                <Grid
                  item
                  sm={3}
                  xs={12}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Tabs
                    textColor="primary"
                    indicatorColor="primary"
                    orientation="vertical"
                    variant="scrollable"
                    value={selectedTab}
                    onChange={handleTabChange}
                    aria-label="Vertical tabs"
                    sx={{
                      borderRight: 1,
                      borderColor: "divider",
                      flexGrow: 1,
                      backgroundColor: "rgba(36, 102, 168, 0.04)",
                      padding: 0,
                      color: "rgba(0, 0, 0, 0.6)", // Default text color

                      "& .Mui-selected": {
                        color: "primary.main",
                        fontWeight: "bold",
                      },

                      "& .MuiTabs-indicator": {
                        backgroundColor: "primary.main",
                      },
                    }}
                  >
                    {tabMap.map((tab, idx) => (
                      <Tab
                        key={tab.key}
                        sx={{ alignItems: "flex-start", textTransform: "none" }}
                        label={
                          <Typography variant="semiBoldLarge">
                            <Trans i18nKey={tab.title} />
                          </Typography>
                        }
                      />
                    ))}
                  </Tabs>
                </Grid>

                <Grid
                  item
                  sm={9}
                  xs={12}
                  sx={{ height: "100%", padding: 3, background: "white" }}
                >
                  <CurrentComponent kitVersion={kitVersion} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

export default KitDesignerContainer;

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import KitDesignerTitle from "./KitDesignerContainerTitle";
import { Trans } from "react-i18next";
import MaturityLevelsContent from "./maturityLevels/MaturityLevelsContent";
import SubjectsContent from "./subjects/SubjectsContent";
import PublishContent from "./publish/PublishContent";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@/utils/useQuery";
import { IKitVersion, ILanguage } from "@/types/index";
import QuestionnairesContent from "@components/kit-designer/questionnaires/QuestionnairesContent";
import AttributesContent from "./attributes/AttributeContent";
import AnaweRangeContent from "@components/kit-designer/answerRange/AnswerRangeContent";
import QueryBatchData from "../common/QueryBatchData";
import MeasuresContent from "./measures/MeasuresContent";
import GeneralContent from "./general/GeneralContent";
import {
  setMainLanguage,
  setTranslatedLanguage,
  useKitLanguageContext,
  kitActions,
} from "@/providers/KitProvider";

const KitDesignerContainer = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { service } = useServiceContext();
  const { dispatch } = useKitLanguageContext();
  const { kitVersionId = "" } = useParams();

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
    window.location.hash = event.target.textContent.replace(" ", "-");
  };

  useEffect(() => {
    let currentHash = window.location.hash.replace("#", "");
    if (!currentHash || currentHash.startsWith("new")) {
      window.location.hash = "General";
      setSelectedTab(0);
    }

    const tabEl = [
      "General",
      "Maturity-Levels",
      "Subjects",
      "Attributes",
      "Answer-Ranges",
      "Measures",
      "Questionnaires",
      "Release",
    ];

    const index = tabEl.findIndex((item) => item === currentHash);
    if (index >= 0) setSelectedTab(index);
  }, []);

  const kitVersionQuery = useQuery<IKitVersion>({
    service: (args, config) =>
      service.kitVersions.info.getById(args ?? { kitVersionId }, config),
    runOnMount: true,
  });

  const kitVersion = kitVersionQuery.data;

  const assessmentKitQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getInfo(
        args ?? { assessmentKitId: kitVersion?.assessmentKit.id },
        config,
      ),
    runOnMount: !!kitVersion && selectedTab !== 0,
  });

  useEffect(() => {
    if (assessmentKitQuery.data) {
      const data = assessmentKitQuery.data;
      const defaultTranslatedLanguage = data.languages?.find(
        (lang: ILanguage) => lang.code !== data.mainLanguage?.code,
      );
      dispatch(kitActions.setMainLanguage(data.mainLanguage));
      dispatch(kitActions.setTranslatedLanguage(defaultTranslatedLanguage));
    }
  }, [assessmentKitQuery.data]);

  if (!kitVersionQuery.loaded) return null;

  return (
    <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
      <KitDesignerTitle kitVersion={kitVersion!} />
      <Grid container spacing={1} columns={12}>
        <Grid item sm={12} xs={12} mt={1}>
          <Typography color="primary" textAlign="left" variant="headlineLarge">
            <Trans i18nKey="kitDesigner" />
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
                color: "rgba(0, 0, 0, 0.6)",
                "& .Mui-selected": {
                  color: "#2466A8 !important",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              {[
                "general",
                "maturityLevels",
                "subjects",
                "attributes",
                "answerRanges",
                "kitDesignerTab.measures",
                "questionnaires",
                "release",
              ].map((key) => (
                <Tab
                  key={key}
                  sx={{ alignItems: "flex-start", textTransform: "none" }}
                  label={
                    <Typography variant="semiBoldLarge">
                      <Trans i18nKey={key} />
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
            {selectedTab === 0 && <GeneralContent kitVersion={kitVersion!} />}
            {selectedTab === 1 && <MaturityLevelsContent />}
            {selectedTab === 2 && <SubjectsContent />}
            {selectedTab === 3 && <AttributesContent />}
            {selectedTab === 4 && <AnaweRangeContent />}
            {selectedTab === 5 && <MeasuresContent />}
            {selectedTab === 6 && <QuestionnairesContent />}
            {selectedTab === 7 && <PublishContent kitVersion={kitVersion!} />}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KitDesignerContainer;

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
import { IKitVersion } from "@/types";
import QuestionnairesContent from "@components/kit-designer/questionnaires/QuestionnairesContent";
import AttributesContent from "./attributes/AttributeContent";
import AnaweRangeContent from "@components/kit-designer/answerRange/AnswerRangeContent";
import QueryBatchData from "../common/QueryBatchData";

const KitDesignerContainer = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
    window.location.hash = event.target.textContent.replace(" ", "-");
  };

  useEffect(() => {
    let currentHash = window.location.hash.replace("#", "");

    if (!currentHash || currentHash.startsWith("new")) {
      window.location.hash = "Maturity-Levels";
      setSelectedTab(0);
    }

    const tabEl = [
      { title: "Maturity-Levels", index: 0 },
      { title: "Subjects", index: 1 },
      { title: "Attributes", index: 2 },
      { title: "Answer-Ranges", index: 3 },
      { title: "Questionnaires", index: 4 },
      { title: "Release", index: 5 },
    ];

    tabEl.forEach((item) => {
      if (item.title === currentHash) {
        setSelectedTab(item.index);
      }
    });
  }, []);

  const kitVersionQuery = useQuery<IKitVersion>({
    service: (args = { kitVersionId }, config) =>
      service.loadKitVersion(args, config),
    runOnMount: true,
  });

  return (
    <QueryBatchData
      queryBatchData={[kitVersionQuery]}
      render={([kitVersion]) => {
        return (
          <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
            <KitDesignerTitle kitVersion={kitVersion} />
            <Grid container spacing={1} columns={12}>
              <Grid item sm={12} xs={12} mt={1}>
                <Typography
                  color="primary"
                  textAlign="left"
                  variant="headlineLarge"
                >
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
                      color: "rgba(0, 0, 0, 0.6)", // Default text color

                      "& .Mui-selected": {
                        color: "#2466A8 !important",
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
                        <Typography variant="semiBoldLarge">
                          <Trans i18nKey="maturityLevels" />
                        </Typography>
                      }
                    />
                    <Tab
                      sx={{
                        alignItems: "flex-start",
                        textTransform: "none",
                      }}
                      label={
                        <Typography variant="semiBoldLarge">
                          <Trans i18nKey="subjects" />
                        </Typography>
                      }
                    />
                    <Tab
                      sx={{
                        alignItems: "flex-start",
                        textTransform: "none",
                      }}
                      label={
                        <Typography variant="semiBoldLarge">
                          <Trans i18nKey="attributes" />
                        </Typography>
                      }
                    />
                    <Tab
                      sx={{
                        alignItems: "flex-start",
                        textTransform: "none",
                      }}
                      label={
                        <Typography variant="semiBoldLarge">
                          <Trans i18nKey="answerRanges" />
                        </Typography>
                      }
                    />
                    <Tab
                      sx={{
                        alignItems: "flex-start",
                        textTransform: "none",
                      }}
                      label={
                        <Typography variant="semiBoldLarge">
                          <Trans i18nKey="questionnaires" />
                        </Typography>
                      }
                    />{" "}
                    <Tab
                      sx={{
                        alignItems: "flex-start",
                        textTransform: "none",
                      }}
                      label={
                        <Typography variant="semiBoldLarge">
                          <Trans i18nKey="release" />
                        </Typography>
                      }
                    />
                  </Tabs>
                </Grid>

                <Grid
                  item
                  sm={9}
                  xs={12}
                  sx={{ height: "100%", padding: 3, background: "white" }}
                >
                  {selectedTab === 0 && <MaturityLevelsContent />}
                  {selectedTab === 1 && <SubjectsContent />}
                  {selectedTab === 2 && <AttributesContent />}
                  {selectedTab === 3 && <AnaweRangeContent />}
                  {selectedTab === 4 && <QuestionnairesContent />}
                  {selectedTab === 5 && (
                    <PublishContent kitVersion={kitVersion} />
                  )}
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

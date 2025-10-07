import React, { useEffect, useState } from "react";
import { Grid, Tab, Tabs } from "@mui/material";
import { Text } from "@common/Text";
import { Trans } from "react-i18next";
import GeneralContent from "@components/kit-designer/general/GeneralContent";
import { useAssessmentKit } from "@components/assessment-kit/AssessmentKitExpertViewContainer";



const KitDetailsMenu = (props: any) => {
  const { fetchAssessmentKitDetailQuery } = useAssessmentKit();
  const {} = props
  const [selectedTab, setSelectedTab] = useState(0);
  const [details, setDetails] = useState<any>([]);

  const AssessmentKitDetail = async () => {
    return  await fetchAssessmentKitDetailQuery.query()
  };

  useEffect(() => {
      AssessmentKitDetail().then((res: any)=>{
        const tabMap = [
          { key: "maturityLevel", title: "common.maturityLevel", Component: GeneralContent, subItems: res.maturityLevels ?? [] },
          { key: "subjects", title: "common.subjects", Component: GeneralContent, subItems: res.subjects ?? [] },
          { key: "questionnaires", title: "common.questionnaires", Component: GeneralContent, subItems: res.questionnaires },
          { key: "measures", title: "assessmentKit.numberMeasures", Component: GeneralContent, subItems: res.questionnaires },
        ];
        setDetails(tabMap)
      })
  }, []);

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
    window.location.hash = details[newValue].key;
  };

  return (
    <>
      <Grid
        item
        sm={2}
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
          {details.map((tab: any, idx: any) => (
            <Tab
              key={tab.key}
              sx={{ alignItems: "flex-start", textTransform: "none" }}
              label={
                <Text variant="semiBoldLarge">
                  <Trans i18nKey={tab.title} />
                </Text>
              }
            />
          ))}
        </Tabs>
      </Grid>

      <Grid
        item
        sm={10}
        xs={12}
        sx={{ height: "100%", padding: 3, bgcolor: "background.containerLowest" }}
      >
         {/*todo*/}
      </Grid>
    </>
  );
};

export default KitDetailsMenu;
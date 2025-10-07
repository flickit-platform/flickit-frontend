import React, { useEffect, useState } from "react";
import { Grid, Tab, Tabs, Box, Collapse } from "@mui/material";
import { Trans } from "react-i18next";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useAssessmentKit } from "@components/assessment-kit/AssessmentKitExpertViewContainer";
import GeneralContent from "@components/kit-designer/general/GeneralContent";

const KitDetailsMenu = () => {
  const { fetchAssessmentKitDetailQuery } = useAssessmentKit();
  const [selectedTab, setSelectedTab] = useState(0);
  const [details, setDetails] = useState<any[]>([]);
  const [expandedItem, setExpandedItem] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      const res: any = await fetchAssessmentKitDetailQuery.query();
      const tabMap = [
        { key: "maturityLevel", title: "common.maturityLevel", Component: GeneralContent, Items: [] },
        {
          key: "subjects",
          title: "common.subjects",
          Component: GeneralContent,
          Items: res.subjects ?? [],
          subItems: [
            { id: 4633, title: "sub", index: 1 },
            { id: 4644, title: "sub", index: 2 },
          ],
        },
        { key: "questionnaires", title: "common.questionnaires", Component: GeneralContent, Items: res.questionnaires ?? [] },
        { key: "measures", title: "assessmentKit.numberMeasures", Component: GeneralContent, Items: res.questionnaires ?? [] },
        { key: "answerRanges", title: "kitDesigner.answerRanges", Component: GeneralContent, Items: [] },
      ];
      setDetails(tabMap);
    };
    fetchDetails();
  }, [fetchAssessmentKitDetailQuery]);

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
    window.location.hash = details[newValue]?.key;
  };

  const handleExpand = (key: string) => {
    setExpandedItem(prev => (prev === key ? "" : key));
  };

  return (
    <>
      <Grid item sm={2} xs={12} sx={{ display: "flex", flexDirection: "column" }}>
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
            backgroundColor: "#FCFCFD",
            padding: 0,
            color: "surface.inverse",
            "& .MuiTab-root": { position: "relative", zIndex: 1 },
            "& .Mui-selected": { color: "inherit", fontWeight: "bold" },
            "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
          }}
        >
          {details.map((tab, idx) => (
            <CustomTab
              key={tab.key}
              tab={tab}
              value={idx}
              selectedValue={selectedTab}
              expandedItem={expandedItem}
              onSelect={handleTabChange}
              onExpand={handleExpand}
            />
          ))}
        </Tabs>
      </Grid>

      <Grid item sm={10} xs={12} sx={{ height: "100%", padding: 3, bgcolor: "background.containerLowest" }}>
        {/* todo: محتوای تب انتخاب شده */}
      </Grid>
    </>
  );
};

interface CustomTabProps {
  tab: any;
  value: number;
  selectedValue: number;
  expandedItem: string;
  onSelect: (_: any, value: number) => void;
  onExpand: (key: string) => void;
}

const CustomTab: React.FC<CustomTabProps> = ({ tab, value, selectedValue, expandedItem, onSelect, onExpand }) => {
  const isExpanded = expandedItem === tab.key;

  return (
    <>
      <Tab
        value={value}
        sx={{ alignItems: "flex-start", textTransform: "none", justifyContent: "flex-start", width: "100%" }}
        onClick={() => {
          onSelect(null, value);
          onExpand(tab.key);
        }}
        label={<span style={{ fontWeight: 600 }}><Trans i18nKey={tab.title} /></span>}
        icon={
          tab.Items?.length > 0 ? (
            <KeyboardArrowDownRoundedIcon
              sx={{ transition: "transform 0.2s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          ) : (
            <KeyboardArrowDownRoundedIcon sx={{ visibility: "hidden" }} />
          )
        }
        iconPosition="start"
      />

      {tab.Items?.length > 0 && (
        <Collapse in={isExpanded} timeout={200} unmountOnExit>
          <Box sx={{ pl: 6, display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {tab.Items.map((item: any) => (
              <Box
                key={item.key || item.id}
                sx={{ cursor: "pointer", color: "text.secondary", "&:hover": { color: "primary.main" } }}
                onClick={item.onClick}
              >
                <Trans i18nKey={item.title} />
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </>
  );
};

export default KitDetailsMenu;

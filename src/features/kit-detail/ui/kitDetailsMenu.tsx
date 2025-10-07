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
  }, []);

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
            color: "background.secondaryDark",
            "& .MuiTab-root": { position: "relative", zIndex: 1 },
            "& .Mui-selected": { color: "primary.main", fontWeight: "bold" },
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

      {/*<Grid item sm={10} xs={12} sx={{ height: "100%", padding: 3, bgcolor: "background.containerLowest" }}>*/}
      {/*  /!* todo: محتوای تب انتخاب شده *!/*/}
      {/*</Grid>*/}
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
  const isSelected = selectedValue == value

  console.log(isSelected, selectedValue, value);
  return (
    <>
      <Tab
        value={value}
        sx={{ alignItems: "flex-start", textTransform: "none", justifyContent: "flex-start", width: "100%", color: isSelected ? "primary.main" : "background.secondaryDark",
          backgroundColor: isSelected ? "rgba(25,118,210,0.08)" : "transparent",}}
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
          <Box sx={{ pl: 6, display: "flex", flexDirection: "column", gap: 1, mt: 1, backgroundColor: isSelected ? "rgba(25,118,210,0.08)" : "transparent" }}>
            {tab.Items.map((item: any) =>{
                return (
                  <NestedItem key={item.key} item={item} isSelected={isSelected} {...tab} />
                )
            })}
          </Box>
        </Collapse>
      )}
    </>
  );
};

const NestedItem = ({ item, subItems, isSelected }: { item: any, subItems: any, isSelected: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubItems = subItems?.length > 0;

  return (
    <Box>
      <Box
        sx={{ cursor: "pointer", display: "flex", alignItems: "center", color: "text.secondary", "&:hover": { color: "primary.main" } }}
        onClick={() => hasSubItems && setExpanded(prev => !prev)}
      >
        {hasSubItems && (
          <KeyboardArrowDownRoundedIcon
            sx={{ ml: 1, transition: "transform 0.2s ease", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        )}
        <Trans i18nKey={item.title} />
      </Box>

      {hasSubItems && (
        <Collapse in={expanded} timeout={1000} unmountOnExit>
          <Box sx={{ pl: 3, display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {subItems.map((sub: any) => (
              <Box
                key={sub.id || sub.key}
                sx={{ cursor: "pointer", color: "text.secondary", "&:hover": { color: "primary.main" } }}
                onClick={sub.onClick}
              >
                <Trans i18nKey={sub.title} />
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default KitDetailsMenu;

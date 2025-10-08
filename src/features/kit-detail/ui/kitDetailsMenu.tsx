import React, { useEffect, useState } from "react";
import { Grid, Tab, Tabs, Box, Collapse } from "@mui/material";
import { Trans } from "react-i18next";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useAssessmentKit } from "@components/assessment-kit/AssessmentKitExpertViewContainer";
import GeneralContent from "@components/kit-designer/general/GeneralContent";
import log from "eslint-plugin-react/lib/util/log";
import { values } from "lodash";
import { blue } from "@config/colors";

const KitDetailsMenu = () => {
  const { fetchAssessmentKitDetailQuery } = useAssessmentKit();
  const [selectedTab, setSelectedTab] = useState(0);
  const [details, setDetails] = useState<any[]>([]);
  const [expandedItem, setExpandedItem] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      const res: any = await fetchAssessmentKitDetailQuery.query();
      const tabMap = [
        {
          key: "maturityLevel",
          title: "common.maturityLevel",
          Component: GeneralContent,
          Items: [],
        },
        {
          key: "subjects",
          title: "common.subjects",
          Component: GeneralContent,
          Items: res.subjects ?? [],
        },
        {
          key: "questionnaires",
          title: "common.questionnaires",
          Component: GeneralContent,
          Items: res.questionnaires ?? [],
        },
        {
          key: "measures",
          title: "assessmentKit.numberMeasures",
          Component: GeneralContent,
          Items: res.questionnaires ?? [],
        },
        {
          key: "answerRanges",
          title: "kitDesigner.answerRanges",
          Component: GeneralContent,
          Items: [],
        },
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
    setExpandedItem((prev) => (prev === key ? "" : key));
  };
  return (
    <>
      <Grid
        item
        md={2.5}
        xs={12}
        sx={{ display: "flex", flexDirection: "column",py :2,  backgroundColor: "#FCFCFD", }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Vertical tabs"
          sx={{
            flexGrow: 1,
            borderBottom: "none",
            padding: 0,
            color: "background.secondaryDark",
            "& .MuiTab-root": { position: "relative", zIndex: 1 },
            "& .Mui-selected": { color: "primary.main", fontWeight: "bold" },
            "& .MuiTabs-indicator": { backgroundColor: "primary.main !important", zIndex: 2 },
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

      {/*<Grid item md={9.5} xs={12} sx={{ height: "100%", padding: 3, bgcolor: "background.containerLowest" }}>*/}
      {/*todo*/}
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

const CustomTab: React.FC<CustomTabProps> = ({
  tab,
  value,
  selectedValue,
  expandedItem,
  onSelect,
  onExpand,
}) => {
  const isExpanded = expandedItem === tab.key;
  const isSelected = selectedValue == value;

  return (
    <>
      <Tab
        value={value}
        sx={{
          alignItems: "flex-start",
          textTransform: "none",
          justifyContent: "flex-start",
          mb: isSelected ? "0px" : "4px",
          width: "100%",
          height: "41px",
          color: isSelected ? "primary.main" : "background.secondaryDark",
          backgroundColor: isSelected ? blue[95] : "transparent",
          opacity: 1,
        }}
        onClick={() => {
          onSelect(null, value);
          onExpand(tab.key);
        }}
        label={
          <span style={{ fontWeight: 600 }}>
            <Trans i18nKey={tab.title} />
          </span>
        }
        icon={
          tab.Items?.length > 0 ? (
            <KeyboardArrowDownRoundedIcon
              sx={{
                transition: "transform 0.2s ease",
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          ) : (
            <KeyboardArrowDownRoundedIcon sx={{ visibility: "hidden" }} />
          )
        }
        iconPosition="start"
      />

      {tab.Items?.length > 0 && (
        <Collapse in={isExpanded} timeout={500} unmountOnExit>
          <Box
            sx={{
              paddingInlineStart: 3.8,
              display: "flex",
              flexDirection: "column",
              py: 1,
              backgroundColor: isSelected
                ? blue[95]
                : "transparent",
            }}
          >
            {tab.Items.map((item: any) => {
              return <NestedItem key={item.key} item={item} />;
            })}
          </Box>
        </Collapse>
      )}
    </>
  );
};

const NestedItem = ({ item }: { item: any }) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubItems = item?.attributes?.length > 0;

  return (
    <Box>
      <Box
        sx={{
          cursor: "pointer",
          height: "41px",
          display: "flex",
          alignItems: "center",
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
        onClick={() => hasSubItems && setExpanded((prev) => !prev)}
      >
        {hasSubItems && (
          <KeyboardArrowDownRoundedIcon
            sx={{
              ml: 1,
              transition: "transform 0.2s ease",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}
        <Trans i18nKey={item.title} />
      </Box>

      {hasSubItems && (
        <Collapse in={expanded} timeout={500} unmountOnExit>
          <Box
            sx={{
              paddingInlineStart: 4.7,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 1,
              justifyContent: "center",
            }}
          >
            {item?.attributes.map((sub: any) => (
              <Box
                key={sub.id || sub.key}
                sx={{
                  cursor: "pointer",
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                  height: "41px",
                  display: "flex",
                  alignItems: "center",
                }}
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

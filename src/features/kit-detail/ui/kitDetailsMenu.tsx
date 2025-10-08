import React, { useState } from "react";
import { Grid, Tab, Tabs, Box, Collapse } from "@mui/material";
import { Trans } from "react-i18next";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { blue } from "@config/colors";
import { Text } from "@common/Text";
import i18next from "i18next";

const KitDetailsMenu = ({ details }: any) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [parentValue, setParentValue] = useState(0);
  const [expandedItem, setExpandedItem] = useState("");
  const isRTL = i18next.language === "fa";

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedTab(newValue);
    globalThis.location.hash = details[newValue]?.key;
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
        sx={{
          display: "flex",
          flexDirection: "column",
          py: 2,
          backgroundColor: "#FCFCFD",
          borderRadius: isRTL ? "0px 12px 12px 0px" : "12px 0px 0px 12px",
          borderLeft: isRTL ? "1px solid #C7CCD1" : "none",
          borderRight: isRTL ? "none" : "1px solid #C7CCD1",
        }}
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
            "& .MuiTab-root": { position: "relative", zIndex: 1 },
            "& .MuiTabs-indicator": {
              maxHeight: "41px",
              left: isRTL ? 0 : "auto",
              right: isRTL ? "auto" : 0,
              backgroundColor: "primary.main !important",
              zIndex: 2,
            },
          }}
        >
          {details.map((tab: any, index: number) => (
            <ParentTab
              key={tab.key}
              tab={tab}
              value={index}
              selectedTab={selectedTab}
              expandedItem={expandedItem}
              onSelect={handleTabChange}
              onExpand={handleExpand}
              setParentValue={setParentValue}
              parentValue={parentValue}
              isRTL={isRTL}
            />
          ))}
        </Tabs>
      </Grid>
      <Grid
        item
        md={9.5}
        xs={12}
        sx={{
          height: "100%",
          padding: 3,
          bgcolor: "background.containerLowest",
        }}
      ></Grid>
    </>
  );
};

interface ParentTabProps {
  tab: any;
  value: number;
  selectedTab: number;
  expandedItem: string;
  onSelect: (_: any, value: number) => void;
  onExpand: (key: string) => void;
  setParentValue: React.Dispatch<React.SetStateAction<number>>;
  parentValue: number;
  isRTL: boolean;
}

const ParentTab: React.FC<ParentTabProps> = ({
  tab,
  value,
  selectedTab,
  expandedItem,
  onSelect,
  onExpand,
  setParentValue,
  parentValue,
  isRTL,
}) => {
  const isExpanded = expandedItem === tab.key;
  const isSelected = parentValue === value;

  const handleClick = () => {
    onSelect(null, value);
    onExpand(tab.key);
    setParentValue(value);
  };

  return (
    <>
      <Tab
        value={value}
        onClick={handleClick}
        iconPosition="start"
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
        label={
          <Text variant="titleSmall">
            <Trans i18nKey={tab.title} />
          </Text>
        }
        sx={{
          textTransform: "none",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          mb: isSelected ? "0px" : "4px",
          width: "100%",
          height: "41px",
          color: isSelected ? "primary.main" : "background.secondaryDark",
          backgroundColor: isSelected ? "#2466a814" : "transparent",
          opacity: 1,
        }}
      />

      {tab.Items?.length > 0 && (
        <Collapse in={isExpanded} timeout={500} unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: isSelected ? blue[95] : "transparent",
            }}
          >
            {tab.Items.map((item: any) => (
              <NestedItem
                key={item.key}
                item={item}
                onSelect={onSelect}
                selectedValue={selectedTab}
                setParentValue={setParentValue}
                parentValue={value}
                isRTL={isRTL}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </>
  );
};

interface NestedItemProps {
  item: any;
  onSelect: any;
  selectedValue: number;
  parentValue: number;
  setParentValue: React.Dispatch<React.SetStateAction<number>>;
  isRTL: boolean;
}

const NestedItem: React.FC<NestedItemProps> = ({
  item,
  onSelect,
  selectedValue,
  parentValue,
  setParentValue,
  isRTL,
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubItems = item?.attributes?.length > 0;

  const handleSelect = () => {
    setParentValue(parentValue);
    if (hasSubItems) setExpanded((prev) => !prev);
    else onSelect(null, item.id);
  };

  return (
    <Box>
      <Tabs
        orientation="vertical"
        value={selectedValue}
        onClick={handleSelect}
        sx={{
          cursor: "pointer",
          height: "41px",
          display: "flex",
          alignItems: "center",
          borderBottom: "none",
          color: "background.secondaryDark",
          paddingRight: isRTL ? "" : 0,
          paddingLeft: isRTL ? 0 : "",
          paddingInlineStart: hasSubItems ? 3 : 0,
        }}
      >
        <Tab
          value={item.id}
          label={
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                textAlign: "left",
                width: "100%",
                paddingInlineStart: hasSubItems ? 0 : 3.8,
              }}
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
              <Text variant="titleSmall" sx={{ textAlign: "left" }}>
                <Trans i18nKey={item.title} />
              </Text>
            </Box>
          }
          sx={{ textTransform: "none" }}
        />
      </Tabs>

      {hasSubItems && (
        <Collapse in={expanded} timeout={500} unmountOnExit>
          <Tabs
            value={selectedValue}
            orientation="vertical"
            sx={{
              paddingInlineStart: 4.7,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
              borderBottom: "none",
              alignItems: "flex-start !important",
              "& .MuiTabs-flexContainer": {
                alignItems: "flex-start",
              },
              textAlign: "left",
              paddingRight: isRTL ? "" : 0,
              paddingLeft: isRTL ? 0 : "",
            }}
          >
            {item.attributes.map((sub: any) => (
              <Tab
                key={sub.id || sub.key}
                value={sub.id}
                onClick={() => {
                  onSelect(null, sub.id);
                  setParentValue(parentValue);
                }}
                label={
                  <Text variant="titleSmall">
                    <Trans i18nKey={sub.title} />
                  </Text>
                }
                sx={{
                  textTransform: "none",
                  cursor: "pointer",
                  color: "background.secondaryDark",
                  height: "41px",
                  display: "flex",
                  alignItems: "flex-start",
                  textAlign: "left",
                  width: "100%",
                }}
              />
            ))}
          </Tabs>
        </Collapse>
      )}
    </Box>
  );
};

export default KitDetailsMenu;

import React, { useState } from "react";
import { Grid, Tab, Tabs, Box, Collapse } from "@mui/material";
import { Trans } from "react-i18next";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { blue } from "@config/colors";
import { Text } from "@common/Text";
import i18next from "i18next";

const KitDetailsMenu = (props: any) => {

  const {details} = props
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedItem, setExpandedItem] = useState("");
 const isRTl = i18next.language == "fa"


  const handleTabChange = (_: any, newValue: number) => {
    console.log(newValue,"testtt");
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
        sx={{ display: "flex", flexDirection: "column",py :2,
          backgroundColor: "#FCFCFD", borderRadius: isRTl ? "0px 12px 12px 0px" :  "12px 0px 0px 12px",
          borderLeft: isRTl ? "1px solid #C7CCD1" : "none",
          borderRight: isRTl ? "none" : "1px solid #C7CCD1"
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
            "& .MuiTabs-indicator": {maxHeight: "41px", left: isRTl ? 0 : "auto", right: isRTl ? "auto" : 0, backgroundColor: "primary.main !important", zIndex: 2 },
          }}
        >
          {details.map((tab: any, idx: any) => (
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
          backgroundColor: isSelected ? "#2466a814" : "transparent",
          opacity: 1,
        }}
        onClick={() => {
          onSelect(null, value);
          onExpand(tab.key);
        }}
        label={
          <Text variant={"titleSmall"} >
            <Trans i18nKey={tab.title} />
          </Text>
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
              return <NestedItem key={item.key} item={item} onSelect={onSelect} selectedValue={selectedValue} />;
            })}
          </Box>
        </Collapse>
      )}
    </>
  );
};

const NestedItem = ({ item, onSelect, selectedValue }: any) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubItems = item?.attributes?.length > 0;

  const onSelectedFunc = () =>{
if(hasSubItems){
  setExpanded((prev) => !prev)
}else{
onSelect(null,item?.id)
}

  }
  return (
    <Box>
      <Box
        sx={{
          cursor: "pointer",
          height: "41px",
          display: "flex",
          alignItems: "center",
          color: "background.secondaryDark",
        }}
        onClick={onSelectedFunc}
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
        <Text variant={"titleSmall"}>
          <Trans i18nKey={item.title} />
        </Text>
      </Box>

      {hasSubItems && (
        <Collapse in={expanded} timeout={500} unmountOnExit>
          <Tabs
            value={selectedValue}
            orientation="vertical"
            sx={{
              // paddingInlineStart: 4.7,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 1,
              justifyContent: "center",
              borderBottom: "none",
              alignItems: "flex-start !important",
              "& .MuiTabs-flexContainer": {
                alignItems: "flex-start", // 👈 این بخش واقعاً تب‌ها رو تراز می‌کنه
              },
              textAlign: "left"
            }}
          >
            {item?.attributes.map((sub: any) => (
              <Tab
                value={sub.id}
                label={ <Text variant={"titleSmall"}>
                  <Trans i18nKey={sub.title} />
                </Text>}
                key={sub.id || sub.key}
                sx={{
                  cursor: "pointer",
                  color: "background.secondaryDark",
                  height: "41px",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "left"
                }}
                onClick={()=>onSelect(null, sub.id)}
              />
            ))}
          </Tabs>
        </Collapse>
      )}
    </Box>
  );
};

export default KitDetailsMenu;

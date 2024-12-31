import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { uniqueId } from "lodash";
import { theme } from "@config/theme";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

const MainTabs = (props: any) => {
  const { onTabChange, selectedTab } = props;

  const tabListTitle = [
    { label: "dashboard", address: "dashboard" },
    { label: "questions", address: "questionnaires" },
    { label: "insights", address: "insights" },
    { label: "reportTitle", address: "report" },
    { label: "advices", address: "advices" },
    { label: "settings", address: "settings" },
  ];

  return (
    <Box
      sx={{
        background: "#2466A814",
        width: "100%",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // boxShadow: "0 4px 4px rgba(0,0,0,25%)",
        my: 3,
        paddingBlock: 1,
        paddingInline: "48px",
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={(event, newValue) => onTabChange(event, newValue)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{
          border: "none",
          width: "100%",
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {tabListTitle.map((tab: any) => {
          return (
            <Tab
              key={uniqueId()}
              disabled={tab.label === "reportTitle" || tab.label === "advices"}
              to={`./${tab.address}/`}
              component={Link}
              value={tab.address}
              sx={{
                ...theme.typography.semiBoldLarge,
                flexGrow: 1,
                mr: 1,
                border: "none",
                textTransform: "none",
                paddingY: 1.5,
                color: "#2B333B",
                "&.Mui-selected": {
                  boxShadow: "0 1px 4px rgba(0,0,0,25%) !important",
                  borderRadius: 1,
                  color: theme.palette.primary.main,
                  background: "#fff",
                  "&:hover": {
                    background: "#fff",
                    border: "none",
                  },
                },
              }}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey={tab.label} />
                  </Typography>
                </Box>
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default MainTabs;

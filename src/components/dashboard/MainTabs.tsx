import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import uniqueId from "@/utils/uniqueId";
import { theme } from "@config/theme";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "../common/loadings/LoadingSkeleton";
import {
  ASSESSMENT_ACTIONS_TYPE,
  useAssessmentDispatch,
} from "@/providers/AssessmentProvider";

const MainTabs = (props: any) => {
  const dispatch = useAssessmentDispatch();

  const { onTabChange, selectedTab } = props;
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const tabListTitle = [
    { label: "dashboard", address: "dashboard", permission: "viewDashboard" },
    {
      label: "questions",
      address: "questionnaires",
      permission: "viewAssessmentQuestionnaireList",
    },
    {
      label: "insights",
      address: "insights",
      permission: true,
    },
    { label: "advice", address: "advice", permission: "createAdvice" },
    {
      label: "reportTitle",
      address: "report",
      permission: "manageReportMetadata",
    },
    {
      label: "settings",
      address: "settings",
      permission: "grantUserAssessmentRole",
    },
  ];
  const [filteredTabList, setFilteredTabList] = useState(tabListTitle);

  const fetchAssessmentPermissions = useQuery({
    service: (args, config) =>
      service.fetchAssessmentPermissions(
        { assessmentId, ...(args || {}) },
        config,
      ),
    runOnMount: true,
  });

  useEffect(() => {
    const permissionsData = fetchAssessmentPermissions.data?.permissions;
    dispatch({
      type: ASSESSMENT_ACTIONS_TYPE.SET_PERMISSIONS,
      payload: fetchAssessmentPermissions.data,
    });
    if (permissionsData) {
      const updatedTabList = tabListTitle.filter((tab) => {
        if (typeof tab.permission === "boolean") {
          return tab.permission;
        }
        return permissionsData[tab.permission] === true;
      });

      setFilteredTabList(updatedTabList);
    }
  }, [fetchAssessmentPermissions.data]);

  return (
    <>
      {fetchAssessmentPermissions.loading ? (
        <LoadingSkeleton />
      ) : (
        <Box
          sx={{
            background: "#2466A814",
            width: "100%",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
            mb: 2,
            paddingBlock: 1,
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
            {filteredTabList.map((tab: any) => {
              return (
                <Tab
                  key={uniqueId()}
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
                    maxWidth: "unset",
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
      )}
    </>
  );
};

export default MainTabs;

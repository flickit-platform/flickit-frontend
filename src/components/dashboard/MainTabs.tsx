import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import uniqueId from "@/utils/uniqueId";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, NavLink, useParams } from "react-router-dom";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { useEffect, useMemo, useRef, useState } from "react";
import { LoadingSkeleton } from "../common/loadings/LoadingSkeleton";
import {
  ASSESSMENT_ACTIONS_TYPE,
  assessmentActions,
  useAssessmentContext,
  useAssessmentDispatch,
} from "@/providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@utils/enumType";
import { styles } from "@styles";
import { Button, ListItemText, Menu, MenuItem, useTheme } from "@mui/material";
import useScreenResize from "@/utils/useScreenResize";
import { ArrowDropDownRounded, ArrowDropUpRounded } from "@mui/icons-material";
import languageDetector from "@/utils/languageDetector";
import useMenu from "@/utils/useMenu";
import { t } from "i18next";

type TabItem = {
  label: string;
  address: string;
  permission: string;
};

const tabListTitle: TabItem[] = [
  {
    label: "dashboard.dashboard",
    address: "dashboard",
    permission: "viewDashboard",
  },
  {
    label: "common.questions",
    address: "questionnaires",
    permission: "viewAssessmentQuestionnaireList",
  },
  {
    label: "common.insights",
    address: "insights",
    permission: "viewAssessmentInsights",
  },
  { label: "advice.advice", address: "advice", permission: "createAdvice" },
  {
    label: "assessmentReport.reportTitle",
    address: "report",
    permission: "manageReportMetadata",
  },
  {
    label: "assessmentReport.reportTitle",
    address: "settings",
    permission: "viewDashboard",
  },
];

const MainTabs = (props: any) => {
  const dispatch = useAssessmentDispatch();
  const theme = useTheme();

  const { onTabChange, selectedTab, flexColumn } = props;
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const isMobileScreen = useScreenResize("md");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { open, openMenu, closeMenu, anchorEl } = useMenu();
  const showTabName = () =>
    t(tabListTitle.find((item) => item.address === selectedTab)?.label ?? "");

  const { assessmentInfo } = useAssessmentContext();
  const [filteredTabList, setFilteredTabList] = useState(tabListTitle);
  const fetchAssessmentPermissions = useQuery({
    service: (args, config) =>
      service.assessments.info.getPermissions(
        { assessmentId, ...(args ?? {}) },
        config,
      ),
    runOnMount: true,
  });

  const AssessmentInfo = useQuery({
    service: (args, config) =>
      service.assessments.info.getById(args ?? { assessmentId }, config),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });

  useEffect(() => {
    const permissionsData = fetchAssessmentPermissions.data?.permissions;
    dispatch({
      type: ASSESSMENT_ACTIONS_TYPE.SET_PERMISSIONS,
      payload: fetchAssessmentPermissions.data?.permissions,
    });
    if (permissionsData) {
      const updatedTabList = tabListTitle?.filter((tab: any) => {
        if (typeof tab.permission === "boolean") {
          return tab.permission;
        }
        return permissionsData[tab.permission] === true;
      });

      setFilteredTabList(updatedTabList);
    }
  }, [fetchAssessmentPermissions.data]);

  useEffect(() => {
    dispatch(assessmentActions.setAssessmentInfo(AssessmentInfo.data));
  }, [AssessmentInfo.data]);

  const isAdvanceMode = useMemo(() => {
    return assessmentInfo?.mode?.code === ASSESSMENT_MODE.ADVANCED;
  }, [assessmentInfo?.mode?.code]);
  return (
    <>
      {isMobileScreen && selectedTab !== "settings" ? (
        <Box
          sx={{
            ...styles.centerVH,
            mt: 1,
            bgcolor: "#2466A814",
            borderRadius: "16px",
            p: 1.3,
          }}
        >
          <Button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              openMenu(e);
            }}
            endIcon={open ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
          >
            {showTabName()}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            PaperProps={{
              sx: {
                width: buttonRef.current
                  ? `${buttonRef.current.offsetWidth}px`
                  : "180px",
              },
            }}
          >
            {tabListTitle.map(({ label, address }) => (
              <MenuItem
                key={label}
                dense
                component={NavLink}
                to={address}
                onClick={closeMenu}
                sx={{
                  fontFamily: languageDetector(label)
                    ? farsiFontFamily
                    : primaryFontFamily,
                  ...theme.typography.semiBoldMedium,
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemText>
                  <Trans i18nKey={label} />
                </ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ) : (
        <>
          {isAdvanceMode && selectedTab !== "settings" ? (
            <>
              {" "}
              {fetchAssessmentPermissions.loading ? (
                <LoadingSkeleton />
              ) : (
                <Box
                  sx={{
                    bgcolor: "#2466A814",
                    borderRadius: "16px",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
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
                      "& .MuiTabs-indicator": {
                        display: "none",
                      },
                    }}
                  >
                    {filteredTabList?.map((tab: any) => {
                      return (
                        <Tab
                          key={uniqueId()}
                          to={`./${tab.address}/`}
                          component={Link}
                          value={tab.address}
                          sx={{
                            ...theme.typography.semiBoldLarge,
                            display:
                              tab.address == "settings" ? "none" : "initial",
                            flexGrow: flexColumn ? 0 : 1,
                            border: "none",
                            textTransform: "none",
                            color: "text.primary",
                            maxWidth: "unset",
                            "&.Mui-selected": {
                              boxShadow: "0 1px 4px rgba(0,0,0,25%) !important",
                              borderRadius: 1,
                              color: "primary.main",
                              bgcolor: "background.containerLowest",
                              "&:hover": {
                                bgcolor: "background.containerLowest",
                                border: "none",
                              },
                            },
                          }}
                          label={
                            <Box gap={1} sx={{ ...styles.centerVH }}>
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
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default MainTabs;

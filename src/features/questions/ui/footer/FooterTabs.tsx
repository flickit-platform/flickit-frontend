import {
  useMemo,
  useState,
  useEffect,
  SyntheticEvent,
  useCallback,
} from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import useFetchData from "../../model/evidenceTabs/useFetchData";
import { CircularProgress, Avatar, Chip } from "@mui/material";
import EvidenceContainer from "./EvidenceContainer";

type FooterTab = "evidences" | "comments" | "history";

const FooterTabs = (props: any) => {
  const { activeQuestion } = props;
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<FooterTab>("evidences");

  const {
    fetchByTab,
    loadMoreByTab,
    evidences,
    comments,
    histories,
    evidencesState,
    commentsState,
    historyState,
  } = useFetchData();

  const tabItems = useMemo(
    () => [
      {
        value: "evidences" as const,
        label: t("questions_temp.evidences"),
        counts: activeQuestion?.counts?.evidences ?? 0,
      },
      {
        value: "comments" as const,
        label: t("questions_temp.comments"),
        counts: activeQuestion?.counts?.comments ?? 0,
      },
      {
        value: "history" as const,
        label: t("questions_temp.answersHistory"),
        counts: activeQuestion?.counts?.answerHistories ?? 0,
      },
    ],
    [activeQuestion, t],
  );

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue as FooterTab);
  };

  useEffect(() => {
    fetchByTab(selectedTab);
  }, [selectedTab, activeQuestion?.id]);

  const handleWindowScroll = useCallback(() => {
    const currentState = getCurrentState();
    if (!currentState.hasMore || currentState.loadingMore) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollThreshold = 500;

    if (scrollTop + windowHeight >= documentHeight - scrollThreshold) {
      loadMoreByTab(selectedTab);
    }
  }, [selectedTab, loadMoreByTab]);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [handleWindowScroll]);

  const getCurrentState = () => {
    switch (selectedTab) {
      case "evidences":
        return evidencesState;
      case "comments":
        return commentsState;
      case "history":
        return historyState;
      default:
        return evidencesState;
    }
  };

  const getCurrentData = () => {
    switch (selectedTab) {
      case "evidences":
        return evidences;
      case "comments":
        return comments;
      case "history":
        return histories;
      default:
        return evidences;
    }
  };

  const currentState = getCurrentState();
  const currentData = getCurrentData();

  return (
    <>
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="footer tabs">
            {tabItems.map((item) => (
              <Tab
                key={item.value}
                value={item.value}
                label={
                  <Text
                    variant="bodyMedium"
                    sx={{
                      textTransform: "none",
                      color:
                        selectedTab === item.value
                          ? "primary.main"
                          : "background.secondaryDark",
                      fontWeight: selectedTab === item.value ? 600 : 400,
                    }}
                  >
                    {item.label} ({item.counts})
                  </Text>
                }
              />
            ))}
          </TabList>
        </Box>

        {/* Evidences */}
        <TabPanel value="evidences" sx={{ px: 0 }}>
          {!currentState.initialized && currentState.loadingMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : currentData.length === 0 ? (
            <Text variant="bodySmall" color="text.secondary">
              {t("common.noData")}
            </Text>
          ) : (
            <Box display="flex" flexDirection="column" gap={1.5}>
              {currentData.map((ev: any) => (
                <EvidenceContainer item={ev} />
              ))}

              {currentState.loadingMore && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}
        </TabPanel>

        {/* Comments */}
        <TabPanel value="comments" sx={{ px: 0 }}>
          {!currentState.initialized && currentState.loadingMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : currentData.length === 0 ? (
            <Text variant="bodySmall" color="text.secondary">
              {t("common.noData")}
            </Text>
          ) : (
            <Box display="flex" flexDirection="column" gap={1.5}>
              {currentData.map((cm: any) => (
                <EvidenceContainer item={cm} />
              ))}

              {currentState.loadingMore && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}
        </TabPanel>

        {/* History */}
        <TabPanel value="history" sx={{ px: 0 }}>
          {!currentState.initialized && currentState.loadingMore ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : currentData.length === 0 ? (
            <Text variant="bodySmall" color="text.secondary">
              {t("common.noData")}
            </Text>
          ) : (
            <Box display="flex" flexDirection="column" gap={1.5}>
              {currentData.map((h: any) => (
                <EvidenceContainer item={h} />
              ))}

              {currentState.loadingMore && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}
        </TabPanel>
      </TabContext>
    </>
  );
};

export default FooterTabs;

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
} from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { CircularProgress } from "@mui/material";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import useFetchData from "../../model/footer/useFetchData";
import EvidenceContainer from "./Container";
import CreateForm from "../CreateForm";

type FooterTab = "evidences" | "comments" | "history";

type PanelState = {
  initialized: boolean;
  loadingMore: boolean;
  hasMore: boolean;
};

type PanelConfig = {
  value: FooterTab;
  label: string;
  count: number;
  data: any[];
  state: PanelState;
};

const Tabs = (props: any) => {
  const { activeQuestion } = props;
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<FooterTab>("evidences");
  const [attachmentTargetId, setAttachmentTargetId] = useState<number | null>(
    null,
  );

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

  const configs: PanelConfig[] = useMemo(
    () => [
      {
        value: "evidences",
        label: t("questions_temp.evidences"),
        count: activeQuestion?.counts?.evidences ?? 0,
        data: evidences ?? [],
        state: evidencesState,
      },
      {
        value: "comments",
        label: t("questions_temp.comments"),
        count: activeQuestion?.counts?.comments ?? 0,
        data: comments ?? [],
        state: commentsState,
      },
      {
        value: "history",
        label: t("questions_temp.answersHistory"),
        count: activeQuestion?.counts?.answerHistories ?? 0,
        data: histories ?? [],
        state: historyState,
      },
    ],
    [
      activeQuestion?.counts?.evidences,
      activeQuestion?.counts?.comments,
      activeQuestion?.counts?.answerHistories,
      evidences,
      comments,
      histories,
      evidencesState,
      commentsState,
      historyState,
      t,
    ],
  );

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue as FooterTab);
  };

  useEffect(() => {
    fetchByTab(selectedTab);
  }, [selectedTab, activeQuestion?.id]);

  const handleWindowScroll = useCallback(() => {
    const cfg = configs.find((c) => c.value === selectedTab);
    if (!cfg) return;
    const { state } = cfg;
    if (!state.hasMore || state.loadingMore) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 500;

    if (scrollTop + windowHeight >= documentHeight - threshold) {
      loadMoreByTab(selectedTab);
    }
  }, [configs, selectedTab, loadMoreByTab]);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [handleWindowScroll]);

  return (
    <TabContext value={selectedTab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="footer tabs">
          {configs.map((cfg) => (
            <Tab
              key={cfg.value}
              value={cfg.value}
              label={
                <Text
                  variant="bodyMedium"
                  sx={{
                    textTransform: "none",
                    color:
                      selectedTab === cfg.value
                        ? "primary.main"
                        : "background.secondaryDark",
                    fontWeight: selectedTab === cfg.value ? 600 : 400,
                  }}
                >
                  {cfg.label} ({cfg.count})
                </Text>
              }
            />
          ))}
        </TabList>
      </Box>

      {configs.map((cfg) => (
        <TabPanel key={cfg.value} value={cfg.value} sx={{ px: 4, py: 2 }}>
          {cfg.value !== "history" && (
            <CreateForm
              showTabs={cfg.value === "evidences"}
              fetchQuery={() => fetchByTab(selectedTab)}
              onOpenAttachments={() => {
                setAttachmentTargetId(0);
              }}
            />
          )}

          <ListPanel
            data={cfg.data}
            state={cfg.state}
            isActive={cfg.value === selectedTab}
            renderItem={(item: any, index: number) => {
              return (
                <>
                  <EvidenceContainer
                    key={item?.id}
                    item={item}
                    fetchByTab={() => fetchByTab(selectedTab)}
                    autoOpenAttachments={attachmentTargetId === index}
                    onAttachmentsFlowDone={() => setAttachmentTargetId(null)}
                  />
                </>
              );
            }}
          />
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default Tabs;

const ListPanel = ({
  data,
  state,
  isActive,
  renderItem,
}: {
  data: any[];
  state: PanelState;
  isActive: boolean;
  renderItem: any;
}) => {
  if (!state.initialized && state.loadingMore) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      {data.map(renderItem)}

      {isActive && state.loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

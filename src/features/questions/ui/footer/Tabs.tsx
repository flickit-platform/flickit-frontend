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
import Panel from "./Panel";
import CreateForm from "../question/CreateForm";
import { useQuestionContext } from "../../context";

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
  disabled?: boolean;
};

const Tabs = (
  props: Readonly<{ readonly?: boolean; hideAnswerHistory?: boolean }>,
) => {
  const { readonly, hideAnswerHistory } = props;
  const { selectedQuestion } = useQuestionContext();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<FooterTab>("evidences");
  const { evidences, comments, answerHistory } = useQuestionContext();

  const {
    fetchByTab,
    loadMoreByTab,
    evidencesState,
    commentsState,
    historyState,
  } = useFetchData();

  const configs: PanelConfig[] = useMemo(() => {
    const base: PanelConfig[] = [
      {
        value: "evidences",
        label: t("questions_temp.evidencesLabel"),
        count: selectedQuestion?.counts?.evidences ?? evidences?.length,
        data: evidences ?? [],
        state: evidencesState,
      },
      {
        value: "comments",
        label: t("questions_temp.commentsLabel"),
        count: selectedQuestion?.counts?.comments ?? comments?.length,
        data: comments ?? [],
        state: commentsState,
      },
    ];

    if (!hideAnswerHistory) {
      base.push({
        value: "history",
        label: t("questions_temp.answerHistoryLabel"),
        count:
          selectedQuestion?.counts?.answerHistories ?? answerHistory?.length,
        data: answerHistory ?? [],
        state: historyState,
      });
    }

    return base;
  }, [
    hideAnswerHistory,
    selectedQuestion?.counts?.evidences,
    selectedQuestion?.counts?.comments,
    selectedQuestion?.counts?.answerHistories,
    evidences,
    comments,
    answerHistory,
    evidencesState,
    commentsState,
    historyState,
    t,
  ]);

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue as FooterTab);
  };

  useEffect(() => {
    fetchByTab(selectedTab);
  }, [selectedTab, selectedQuestion?.id, selectedQuestion?.question?.id]);

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
              disabled={cfg.disabled}
              key={cfg.value}
              value={cfg.value}
              label={
                <Text
                  variant="bodyMedium"
                  sx={{
                    textTransform: "none",

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
        <TabPanel
          key={cfg.value}
          value={cfg.value}
          sx={{ px: { lg: 4 }, py: { lg: 2 } }}
        >
          {cfg.value !== "history" && !readonly && (
            <CreateForm showTabs={cfg.value === "evidences"} />
          )}

          <PanelContainer
            data={cfg.data}
            state={cfg.state}
            isActive={cfg.value === selectedTab}
            renderItem={(item: any) => {
              return <Panel key={item?.id} item={item} readonly={readonly} />;
            }}
          />
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default Tabs;

const PanelContainer = ({
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
    <Box display="flex" flexDirection="column" gap={1.5} my={2}>
      {data.map(renderItem)}

      {isActive && state.loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

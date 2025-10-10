import { useMemo, useState, SyntheticEvent, ReactNode } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { Text } from "@common/Text";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import type { KitDetailsType } from "../../model/types";
import { ExpandLessRounded } from "@mui/icons-material";

const ROW_HEIGHT = 41;
const INDICATOR_WIDTH = 3;
const INDICATOR_RADIUS = 2;

export type Subject = KitDetailsType["subjects"][number];
export type Attribute = Subject["attributes"][number];
export type Questionnaire = KitDetailsType["questionnaires"][number];

const NodeLabel = ({ children }: { children: ReactNode }) => (
  <Text variant="titleSmall">{children}</Text>
);

const sectionActiveSx = (active: boolean) =>
  active
    ? { color: "primary.main", backgroundColor: "primary.states.hover" }
    : undefined;

const makeTreeSx = (isRTL: boolean) => ({
  flexGrow: 1,
  [isRTL ? "borderLeft" : "borderRight"]: 1,
  borderColor: "divider",
  backgroundColor: "background.containerLow",
  py: 2,
  borderStartStartRadius: "12px",
  borderEndStartRadius: "12px",

  "& .MuiTreeItem-content": {
    position: "relative",
    paddingInlineStart: 2,
    height: `${ROW_HEIGHT}px`,
    alignItems: "center",
    color: "background.secondaryDark",
    transition: "background-color .2s, color .2s",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      height: "100%",
      [isRTL ? "left" : "right"]: 0,
      width: `${INDICATOR_WIDTH}px`,
      borderRadius: `${INDICATOR_RADIUS}px`,
    },
  },

  "& .MuiTreeItem-content.Mui-selected, & .Mui-selected > .MuiTreeItem-content, & .MuiTreeItem-content:focus":
    {
      color: "primary.main",
      backgroundColor: "primary.states.selected",
      "&::before": { backgroundColor: "primary.main" },
    },

  "& .MuiTreeItem-group": {
    marginLeft: 0,
    paddingInlineStart: 1,
  },

  "& .MuiTreeItem-iconContainer": {
    mr: isRTL ? 0 : 0.75,
    ml: isRTL ? 0.75 : 0,
  },

  "& .MuiTreeItem-content:hover": {
    backgroundColor: "primary.states.hover",
  },
});

const renderSubjectBranch = (sub: Subject) => (
  <TreeItem
    key={sub.id}
    nodeId={`subject-${sub.id}`}
    label={<NodeLabel>{sub.title}</NodeLabel>}
  >
    {sub.attributes?.map((attr: Attribute) => (
      <TreeItem
        key={`${sub.id}-${attr.id}`}
        nodeId={`attribute-${sub.id}-${attr.id}`}
        label={<NodeLabel>{attr.title}</NodeLabel>}
      />
    ))}
  </TreeItem>
);

const renderQuestionnaireLeaf = (q: Questionnaire) => (
  <TreeItem
    key={q.id}
    nodeId={`questionnaire-${q.id}`}
    label={<NodeLabel>{q.title}</NodeLabel>}
  />
);

export default function KitDetailsTreeView({
  details,
}: {
  details: KitDetailsType;
}) {
  const isRTL = i18next.language === "fa";
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeSection = useMemo(() => {
    if (!selectedId) return null;
    if (
      selectedId.startsWith("subject-") ||
      selectedId.startsWith("attribute-")
    )
      return "subjects-root" as const;
    if (selectedId.startsWith("questionnaire-"))
      return "questionnaires-root" as const;
    return null;
  }, [selectedId]);

  const handleSelect = (_: SyntheticEvent, nodeId: string) =>
    setSelectedId(nodeId);

  const ExpandedIcon = <ExpandLessRounded fontSize="small" />;

  const CollapsedIcon = <ExpandMoreRounded fontSize="small" />;

  return (
    <TreeView
      aria-label="navigator"
      defaultCollapseIcon={ExpandedIcon}
      defaultExpandIcon={CollapsedIcon}
      selected={selectedId ?? undefined}
      onNodeSelect={handleSelect}
      sx={makeTreeSx(isRTL)}
    >
      <TreeItem
        nodeId="maturity-levels-root"
        label={<NodeLabel>{t("common.maturityLevels")}</NodeLabel>}
      />

      <TreeItem
        nodeId="subjects-root"
        label={<NodeLabel>{t("common.subjects")}</NodeLabel>}
        sx={sectionActiveSx(activeSection === "subjects-root")}
      >
        {details?.subjects?.map(renderSubjectBranch)}
      </TreeItem>

      <TreeItem
        nodeId="questionnaires-root"
        label={<NodeLabel>{t("common.questionnaires")}</NodeLabel>}
        sx={sectionActiveSx(activeSection === "questionnaires-root")}
      >
        {details?.questionnaires?.map(renderQuestionnaireLeaf)}
      </TreeItem>

      <TreeItem
        nodeId="answer-ranges-root"
        label={<NodeLabel>{t("kitDesigner.answerRanges")}</NodeLabel>}
      />
    </TreeView>
  );
}

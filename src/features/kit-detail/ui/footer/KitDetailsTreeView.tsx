import React, { useMemo, useState, useCallback } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRounded from "@mui/icons-material/ExpandLessRounded";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Text } from "@common/Text";
import { buildTree } from "../../config/config";
import { KitDetailsType } from "../../model/types";

const INDICATOR_WIDTH = 3;
const INDICATOR_RADIUS = 2;

const NodeLabel = ({ children }: { children: React.ReactNode }) => (
  <Text variant="titleSmall">{children}</Text>
);

const sectionActiveSx = (active: boolean) =>
  active
    ? {
        color: "primary.main",
        backgroundColor: "primary.states.hover",
        "&::before": { backgroundColor: "primary.main" },
      }
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
    paddingBlock: 1,
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
  "& .MuiTreeItem-label": { paddingInline: 0 },
});

function getActiveRoot(selectedId: string | null): string | null {
  if (!selectedId) return null;
  if (selectedId.startsWith("subject-") || selectedId.startsWith("attribute-"))
    return "subjects-root";
  if (selectedId.startsWith("questionnaire-")) return "questionnaires-root";
  return null;
}

function renderNodes(
  nodes: ReturnType<typeof buildTree>,
  activeRoot: string | null,
) {
  return nodes.map((n) => (
    <TreeItem
      key={n.nodeId}
      nodeId={n.nodeId}
      label={<NodeLabel>{n.title}</NodeLabel>}
      sx={sectionActiveSx(n.nodeId === activeRoot)}
    >
      {n.children?.length ? renderNodes(n.children, activeRoot) : null}
    </TreeItem>
  ));
}

type FlatNode = { nodeId: string; children?: FlatNode[] };

const buildParentMap = (nodes: FlatNode[]) => {
  const m: Record<string, string | null> = {};
  const dfs = (xs: FlatNode[], p: string | null) =>
    xs.forEach((n) => {
      m[n.nodeId] = p;
      if (n.children?.length) dfs(n.children, n.nodeId);
    });
  dfs(nodes, null);
  return m;
};

export default function KitDetailsTreeView({
  details,
  onSelect,
  initialSelectedId,
}: {
  details: KitDetailsType;
  onSelect?: (nodeId: string) => void;
  initialSelectedId?: string;
}) {
  const isRTL = i18next.language === "fa";
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? null,
  );
  const [expanded, setExpanded] = useState<string[]>([]);

  const nodes = useMemo(() => buildTree(details, t as any), [details, t]);
  const activeRoot = useMemo(() => getActiveRoot(selectedId), [selectedId]);

  const parentById = useMemo(
    () => buildParentMap(nodes as unknown as FlatNode[]),
    [nodes],
  );

  const handleSelect = (_e: React.SyntheticEvent, nodeId: string) => {
    setSelectedId(nodeId);
    onSelect?.(nodeId);
  };

  const handleToggle = useCallback(
    (_e: React.SyntheticEvent, nextIds: string[]) => {
      const prev = new Set(expanded);
      const added = nextIds.find((id) => !prev.has(id)); 
      if (!added) {
        setExpanded(nextIds);
        return;
      }
      const p = parentById[added] ?? null;
      setExpanded(nextIds.filter((id) => id === added || parentById[id] !== p));
    },
    [expanded, parentById],
  );

  return (
    <TreeView
      aria-label="navigator"
      defaultCollapseIcon={<ExpandLessRounded fontSize="small" />}
      defaultExpandIcon={<ExpandMoreRounded fontSize="small" />}
      selected={selectedId ?? undefined}
      onNodeSelect={handleSelect}
      expanded={expanded}
      onNodeToggle={handleToggle}
      sx={makeTreeSx(isRTL)}
    >
      {renderNodes(nodes, activeRoot)}
    </TreeView>
  );
}

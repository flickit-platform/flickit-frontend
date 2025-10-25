import React, { useMemo, useState, useCallback, useEffect } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRounded from "@mui/icons-material/ExpandLessRounded";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Text } from "@common/Text";
import { buildTree, treeConfig } from "../../config/config";
import { KitDetailsType } from "../../model/types";

const setHash = (nodeId: string, method: "push" | "replace" = "push") => {
  const url = new URL(window.location.href);
  url.hash = nodeId;
  const fn = method === "push" ? "pushState" : "replaceState";
  if (window.history[fn]) {
    window.history[fn](null, "", url.toString());
  } else {
    window.location.hash = nodeId;
  }
};

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

  "& .MuiTreeItem-content": {
    position: "relative",
    paddingInlineStart: 2,
    paddingInlineEnd: 0,
    paddingBlock: 1,
    alignItems: "center",
    color: "background.secondaryDark",
    transition: "background-color .2s, color .2s",
  },

  "& .MuiTreeItem-content.Mui-selected::after, \
       & .MuiTreeItem-content.Mui-focusVisible::after": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    [isRTL ? "left" : "right"]: 0,
    width: "3px",
    backgroundColor: "primary.main",
    borderRadius: 0,
    pointerEvents: "none",
    zIndex: 1,
  },

  "& .MuiTreeItem-content::before": { display: "none" },

  "& .MuiTreeItem-groupTransition": {
    marginLeft: 0,
    paddingInlineStart: 1,
  },
  "& .MuiTreeItem-iconContainer": {
    mr: isRTL ? 0 : 0.75,
    ml: isRTL ? 0.75 : 0,
  },

  "& .MuiTreeItem-label": { paddingInline: 0 },
});

function getActiveRoot(selectedId: string | null): string | null {
  if (!selectedId) return null;
  if (selectedId.startsWith("subject-") || selectedId.startsWith("attribute-"))
    return "subjects-root";
  if (selectedId.startsWith("questionnaire-")) return "questionnaires-root";
  if (selectedId.startsWith("measure-")) return "measures-root";
  return null;
}

function renderNodes(
  nodes: ReturnType<typeof buildTree>,
  activeRoot: string | null,
) {
  return nodes.map((n) => (
    <TreeItem
      key={n.nodeId}
      itemId={n.nodeId}
      label={<NodeLabel>{n.title}</NodeLabel>}
      sx={{
        ...sectionActiveSx(n.nodeId === activeRoot),
        "& .Mui-disabled": {
          cursor: !!n.disabled ? "default !important" : "pointer !important",
        },
      }}
      disabled={!!n.disabled}
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
const banTreeView = treeConfig.filter((t) => t.component === undefined);
const getHashId = () =>
  decodeURIComponent(window.location.hash.replace(/^#/, ""));
export default function KitDetailsTreeView({
  details,
  onSelect,
  selectedId,
}: {
  details: KitDetailsType;
  onSelect?: (nodeId: string) => void;
  selectedId: string;
}) {
  const isRTL = i18next.language === "fa";
  const { t } = useTranslation();
  const [highlightId, setHighlightId] = useState<string | null>(
    selectedId ?? null,
  );
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const nodes = useMemo(() => buildTree(details, t as any), [details, t]);
  const activeRoot = useMemo(() => getActiveRoot(selectedId), [selectedId]);

  const parentById = useMemo(
    () => buildParentMap(nodes as unknown as FlatNode[]),
    [nodes],
  );

  const handleItemSelectionToggle = useCallback(
    (_e: React.SyntheticEvent | null, itemId: string | null) => {
      if (!itemId) return;
      setHighlightId(itemId);

      if (!banTreeView.some((t) => t.rootNodeId === itemId)) {
        onSelect?.(itemId);
        setHash(itemId, "push");
      }
    },
    [onSelect],
  );

  const handleExpandedItemsChange = useCallback(
    (_e: React.SyntheticEvent | null, nextIds: string[]) => {
      const prev = new Set(expandedItems);
      const added = nextIds.find((id) => !prev.has(id));
      if (!added) {
        setExpandedItems(nextIds);
        return;
      }
      const p = parentById[added] ?? null;
      setExpandedItems(
        nextIds.filter((id) => id === added || parentById[id] !== p),
      );
    },
    [expandedItems, parentById],
  );

  useEffect(() => {
    const initial = getHashId();
    if (!initial) return;

    setHighlightId(initial);
    const path: string[] = [];
    let cur: string | null = initial;
    while (cur && parentById[cur]) {
      const p: any = parentById[cur]!;
      path.unshift(p);
      cur = p;
    }
    setExpandedItems((prev) => Array.from(new Set([...prev, ...path])));

    if (!banTreeView.some((t) => t.rootNodeId === initial)) {
      onSelect?.(initial);
    }
    if (initial !== selectedId) setHash(initial, "replace");
  }, [parentById, selectedId]);
  return (
    <SimpleTreeView
      aria-label="navigator"
      slots={{ collapseIcon: ExpandLessRounded, expandIcon: ExpandMoreRounded }}
      selectedItems={highlightId ?? null}
      onSelectedItemsChange={handleItemSelectionToggle}
      expandedItems={expandedItems}
      onExpandedItemsChange={handleExpandedItemsChange}
      sx={makeTreeSx(isRTL)}
    >
      {renderNodes(nodes, activeRoot)}
    </SimpleTreeView>
  );
}

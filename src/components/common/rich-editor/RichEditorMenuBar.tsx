import Box from "@mui/material/Box";
import { Editor } from "@tiptap/react";
import RichEditorMenuItem, { IRichEditorMenuItem } from "./RichEditorMenuItem";
import defaultGetMenuItems from "./DefaultMenuItems";

type Divider = { type: "divider" };
type MenuItem = IRichEditorMenuItem | Divider;

type GetMenuItemsOpts = {
  includeTable?: boolean;
  hasPermission?: (perm: string) => boolean;
};

interface IRichEditorMenuBarProps {
  editor: Editor;
  getMenuItems?: (editor: Editor, opts?: GetMenuItemsOpts) => MenuItem[];
  includeTable?: boolean;
  hasPermission?: (perm: string) => boolean;
  top?: string;
  boxShadow?: string;
}

const RichEditorMenuBar = (props: IRichEditorMenuBarProps) => {
  const {
    editor,
    getMenuItems = defaultGetMenuItems,
    includeTable = true,
    hasPermission,
    top = "-11px",
    boxShadow = " 2px 2px 12px -3px #9d9d9d61",
    ...rest
  } = props;

  const menuItems = getMenuItems(editor, { includeTable, hasPermission });
  return (
    <Box
      className="rich-editor--menu"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        position: "absolute",
        bgcolor: "background.containerLowest",
        zIndex: -1,
        right: 0,
        opacity: 0,
        transform: "translateY(-100%)",
        py: 0.5,
        px: 0.6,
        maxWidth: "100%",
        borderRadius: 1,
        transition: "z-index .2s .1s ease, opacity .2s .1s ease",
        top,
        boxShadow,
        justifyContent: includeTable ? "flex-start" : "center",
        ...rest,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onFocus={(e) => e.preventDefault()}
      tabIndex={-1}
    >
      {menuItems.map((menuItem, idx) => {
        return (
          <Box
            key={
              menuItem.type === "divider"
                ? `divider-${idx}`
                : `${(menuItem as IRichEditorMenuItem).title ?? "item"}-${idx}`
            }
            sx={{ display: "flex", flexWrap: "wrap" }}
            onFocus={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {menuItem.type === "divider" ? (
              <Box
                sx={{
                  height: "20px",
                  width: "1px",
                  backgroundColor: "#f1f1f1",
                  my: 1,
                  mx: 0.6,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            ) : (
              <RichEditorMenuItem menuItem={menuItem} />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default RichEditorMenuBar;

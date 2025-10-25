import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { Editor } from "@tiptap/react";
import { t } from "i18next";
import { useRef } from "react";
import { Trans } from "react-i18next";
import { IRichEditorMenuItem } from "./RichEditorMenuItem";
import FormatBoldRoundedIcon from "@mui/icons-material/FormatBoldRounded";
import FormatItalicRoundedIcon from "@mui/icons-material/FormatItalicRounded";
import FormatStrikethroughRoundedIcon from "@mui/icons-material/FormatStrikethroughRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import FormatListNumberedRoundedIcon from "@mui/icons-material/FormatListNumberedRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";
import SubdirectoryArrowLeftRoundedIcon from "@mui/icons-material/SubdirectoryArrowLeftRounded";
import FormatClearRoundedIcon from "@mui/icons-material/FormatClearRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import FormatAlignLeftRoundedIcon from "@mui/icons-material/FormatAlignLeftRounded";
import FormatAlignRightRoundedIcon from "@mui/icons-material/FormatAlignRightRounded";
import FormatAlignJustifyRoundedIcon from "@mui/icons-material/FormatAlignJustifyRounded";
import FormatAlignCenterRoundedIcon from "@mui/icons-material/FormatAlignCenterRounded";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableColumnAddRightIcon from "@atlaskit/icon/core/table-column-add-right";
import TableColumnAddLeftIcon from "@atlaskit/icon/core/table-column-add-left";
import TableColumnDeleteIcon from "@atlaskit/icon/core/table-column-delete";
import TableRowAddAboveIcon from "@atlaskit/icon/core/table-row-add-above";
import TableRowAddBelowIcon from "@atlaskit/icon/core/table-row-add-below";
import TableRowDeleteIcon from "@atlaskit/icon/core/table-row-delete";
import TableCellClearIcon from "@atlaskit/icon/core/table-cell-clear";
import TableCellMergeIcon from "@atlaskit/icon/core/table-cell-merge";
import TableCellSplitIcon from "@atlaskit/icon/core/table-cell-split";
import showToast from "@/utils/toast-error";

const defaultGetMenuItems = (
  editor: Editor,
): (IRichEditorMenuItem | { type: "divider" })[] => {
  return [
    {
      title: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      title: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      title: "P",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    { type: "divider" },
    {
      icon: <FormatBoldRoundedIcon fontSize="small" />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: <FormatItalicRoundedIcon fontSize="small" />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: <FormatStrikethroughRoundedIcon fontSize="small" />,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: <FormatAlignLeftRoundedIcon fontSize="small" />,
      title: "align-left",
      action: () => (editor.chain().focus() as any).setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <FormatAlignCenterRoundedIcon fontSize="small" />,
      title: "align-center",
      action: () =>
        (editor.chain().focus() as any).setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <FormatAlignRightRoundedIcon fontSize="small" />,
      title: "align-right",
      action: () => (editor.chain().focus() as any).setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <FormatAlignJustifyRoundedIcon fontSize="small" />,
      title: "align-justify",
      action: () =>
        (editor.chain().focus() as any).setTextAlign("justify").run(),
      isActive: () => editor.isActive({ textAlign: "justify" }),
    },
    {
      type: "divider",
    },

    {
      icon: <FormatListBulletedRoundedIcon fontSize="small" />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: <FormatListNumberedRoundedIcon fontSize="small" />,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: <FormatQuoteRoundedIcon fontSize="small" />,
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: <InsertLinkRoundedIcon fontSize="small" />,
      title: "link",
      prompt: {
        promptBody(closePrompt) {
          return <PromptLinkBody editor={editor} closePrompt={closePrompt} />;
        },
        title: t("common.addLink") as string,
      },
      action: editor.isActive("link")
        ? () => editor.chain().focus().unsetLink().run()
        : ({ openDialog }) => openDialog(),
      isActive: () => editor.isActive("link"),
    },
    {
      icon: <HorizontalRuleRoundedIcon fontSize="small" />,
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "divider",
    },
    {
      icon: <SubdirectoryArrowLeftRoundedIcon fontSize="small" />,
      title: "Hard Break",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: <FormatClearRoundedIcon fontSize="small" />,
      title: "Clear Format",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      type: "divider",
    },
    {
      icon: <UndoRoundedIcon fontSize="small" />,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <RedoRoundedIcon fontSize="small" />,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
    { type: "divider" },
    {
      icon: <TableChartIcon fontSize={"small"} />,
      title: "table",
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      icon: <TableColumnAddLeftIcon label="" />,
      title: "Add column before",
      action: () => editor.chain().focus().addColumnBefore().run(),
      // disable: !editor.can().addColumnBefore(),
    },
    {
      icon: <TableColumnAddRightIcon label="" />,
      title: "Add column after",
      action: () => editor.chain().focus().addColumnAfter().run(),
      // disable: !editor.can().addColumnAfter(),
    },
    {
      icon: <TableColumnDeleteIcon label="" />,
      title: "Delete column",
      action: () => editor.chain().focus().deleteColumn().run(),
      // disable: !editor.can().deleteColumn(),
    },
    {
      icon: <TableRowAddAboveIcon label="" />,
      title: "Add row before",
      action: () => editor.chain().focus().addRowBefore().run(),
      // disable: !editor.can().addRowBefore(),
    },
    {
      icon: <TableRowAddBelowIcon label="" />,
      title: "Add row after",
      action: () => editor.chain().focus().addRowAfter().run(),
      // disable: !editor.can().addRowAfter(),
    },
    {
      icon: <TableRowDeleteIcon label="" />,
      title: "Delete row",
      action: () => editor.chain().focus().deleteRow().run(),
      // disable: !editor.can().deleteRow(),
    },
    {
      icon: <TableCellClearIcon label="" />,
      title: "Delete table",
      action: () => editor.chain().focus().deleteTable().run(),
      // disable: !editor.can().deleteTable(),
    },
    {
      icon: <TableCellMergeIcon label="" />,
      title: "Merge cells",
      action: () => editor.chain().focus().mergeCells().run(),
      // disable: !editor.can().mergeCells(),
    },
    {
      icon: <TableCellSplitIcon label="" />,
      title: "Split cell",
      action: () => editor.chain().focus().splitCell().run(),
      // disable: !editor.can().splitCell(),
    },
  ];
};

const PromptLinkBody = (props: { editor: Editor; closePrompt: () => void }) => {
  const { editor, closePrompt } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const addLink = () => {
    const { value } = inputRef.current ?? {};
    if (!value) {
      showToast(t("pleaseEnterALink") as string);
      return;
    }
    (editor.chain().focus() as any).toggleLink({ href: value }).run();
    closePrompt();
  };

  return (
    <>
      <DialogContent>
        <TextField
          placeholder="https://example.com"
          fullWidth
          size="small"
          inputRef={inputRef}
          defaultValue="https://"
        />
      </DialogContent>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Button onClick={closePrompt} size="small">
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button onClick={addLink} variant="contained" size="small">
          <Trans i18nKey="common.addLink" />
        </Button>
      </DialogActions>
    </>
  );
};

export default defaultGetMenuItems;

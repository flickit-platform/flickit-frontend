import Box from "@mui/material/Box";
import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

import { useEffect, useMemo, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { useTheme } from "@mui/material";

import RichEditorMenuBar from "./RichEditorMenuBar";
import firstCharDetector from "@/utils/first-char-detector";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

type OnChange = (html: string) => void;

interface IRichEditorProps {
  value?: string;
  onChange?: OnChange;
  onBlur?: () => void;

  field?: ControllerRenderProps<FieldValues, any>;

  defaultValue?: string;
  isEditable?: boolean;
  editorProps?: Partial<EditorOptions>;
  className?: string;
  checkLang?: boolean;
  placeholder?: string;
  type?: string;
  showEditorMenu?: boolean;
  bgcolor?: string;
  menuProps?: any;
  richEditorProps?: any;
}

function stripText(html?: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.replaceAll(/\u00A0/g, " ").trim() ?? "";
}

function isDefined<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

const RichEditor = (props: IRichEditorProps) => {
  const {
    value,
    onChange,
    onBlur,

    field,

    defaultValue = "",
    isEditable = false,
    editorProps = {},
    className,
    checkLang,
    placeholder,
    type,
    showEditorMenu,
    bgcolor,
    menuProps,
    richEditorProps,
  } = props;

  const theme = useTheme();

  const hasFieldValue = !!field && isDefined(field.value);
  const hasPropValue = isDefined(value);

  let initialContent: string;
  let externalValue: string;

  if (hasFieldValue) {
    initialContent = field!.value;
    externalValue = field!.value;
  } else if (hasPropValue) {
    initialContent = value;
    externalValue = value;
  } else {
    initialContent = defaultValue;
    externalValue = defaultValue;
  }

  const [isFarsi, setIsFarsi] = useState<boolean>(() =>
    isDefined(checkLang)
      ? !!checkLang
      : firstCharDetector(stripText(initialContent)),
  );
  const [isEmpty, setIsEmpty] = useState<boolean>(
    () => stripText(initialContent).length === 0,
  );

  useEffect(() => {
    if (typeof checkLang === "boolean") setIsFarsi(checkLang);
  }, [checkLang]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link,
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
    ],
    content: initialContent,
    onCreate({ editor }) {
      const html = editor.getHTML();
      const plain = stripText(html);
      setIsEmpty(plain.length === 0);
      setIsFarsi(firstCharDetector(plain));

      if (hasFieldValue || hasPropValue) {
        field?.onChange?.(html);
        onChange?.(html);
      }
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const plain = stripText(html);
      const empty = plain.length === 0;

      setIsEmpty(empty);
      setIsFarsi(firstCharDetector(plain));

      if (empty) {
        field?.onChange?.("");
        onChange?.("");
      } else {
        field?.onChange?.(html);
        onChange?.(html);
      }
    },
    onBlur() {
      onBlur?.();
      field?.onBlur?.();

      if (editor) {
        const plain = stripText(editor.getHTML());
        if (plain.length === 0) {
          field?.onChange?.("");
          onChange?.("");
          setIsEmpty(true);
        }
      }
    },
    editorProps: {
      ...(editorProps?.editorProps ?? {}),
      attributes: {
        ...(editorProps?.editorProps?.attributes ?? {}),
        id: "proseMirror",
      },
    },
    editable: isEditable,
    ...editorProps,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== externalValue) {
      editor.commands.setContent(externalValue);
      const plain = stripText(externalValue);
      setIsEmpty(plain.length === 0);
      setIsFarsi(firstCharDetector(plain));
    }
  }, [externalValue, editor]);

  const contentFontFamily = useMemo(
    () =>
      languageDetector(editor?.getText()) ? farsiFontFamily : primaryFontFamily,
    [editor?.state],
  );

  return (
    <Box
      className={className}
      sx={
        isEditable
          ? {
              direction: isFarsi ? "rtl" : "ltr",
              textAlign: isFarsi ? "right" : "left",
              cursor: "text",
              fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
              position: "relative",
              marginTop: "0px !important",
              width: "100%",

              "&.Mui-focused .ProseMirror": {
                borderColor: `${isEmpty && type === "error" ? "#8A0F2480" : "#1976d2"}`,
                borderWidth: "2px",
                ...richEditorProps,
              },
              "&.Mui-focused:hover .ProseMirror": {
                borderColor: `${isEmpty && type === "error" ? "#8A0F2480" : "#1976d2"}`,
                ...richEditorProps,
              },
              "&.Mui-error .ProseMirror": { borderColor: "#d32f2f" },
              "&.Mui-error:hover .ProseMirror": {
                borderColor: `${isEmpty && type === "error" ? "#8A0F2480" : "#d32f2f"}`,
              },
              "&:hover .ProseMirror": {
                borderColor: `${isEmpty && type === "error" ? "#8A0F2480" : "rgba(0, 0, 0, 0.87)"}`,
                ...richEditorProps,
              },

              "& .rich-editor--menu":
                editor?.isFocused || showEditorMenu
                  ? { opacity: 1, zIndex: 10 }
                  : {},
              "&:hover .rich-editor--menu": { opacity: 1, zIndex: 10 },

              ".ProseMirror p.is-editor-empty:first-child:before ": {
                float: theme.direction === "rtl" ? "right" : "left",
                direction: theme.direction === "rtl" ? "rtl" : "ltr",
              },
              "& .ProseMirror": {
                outline: "none",
                minHeight: `${isEmpty && type === "error" ? "100px" : "110px"}`,
                border: `1px solid ${
                  isEmpty && type === "error"
                    ? "#8A0F2480"
                    : "rgba(0, 0, 0, 0.23)"
                }`,
                borderRadius: 1,
                bgcolor: bgcolor ?? "white",
                paddingInline: 1.5,
                py: 1,
                "& > p": isEmpty
                  ? {
                      marginBlockStart: 0,
                      marginBlockEnd: 0,
                      textAlign: "initial",
                    }
                  : { unicodeBidi: "plaintext", textAlign: "initial" },
                ...richEditorProps,
              },
              "& .ProseMirror table": {
                direction: theme.direction,
                width: "100%",
                borderCollapse: "collapse",
              },
            }
          : {}
      }
    >
      {editor && isEditable && (
        <RichEditorMenuBar editor={editor} {...menuProps} />
      )}

      <EditorContent
        editor={editor}
        style={{
          ...theme.typography.bodyMedium,
          fontFamily: contentFontFamily,
          wordBreak: "break-word",
        }}
      />
    </Box>
  );
};

export default RichEditor;

import Box, { BoxProps } from "@mui/material/Box";
import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import RichEditorMenuBar from "./RichEditorMenuBar";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import firstCharDetector from "@/utils/first-char-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";
import languageDetector from "@/utils/language-detector";
import { useTheme } from "@mui/material";
import { Table } from "@tiptap/extension-table";

interface IRichEditorProps {
  defaultValue?: string;
  isEditable?: boolean;
  editorProps?: Partial<EditorOptions>;
  className?: string;
  field?: ControllerRenderProps<FieldValues, any>;
  content?: string;
  checkLang?: boolean;
  placeholder?: any;
  type?: string;
  showEditorMenu?: boolean;
  bgcolor?: string;
  menuProps?: any;
  richEditorProps?: any;
}

const RichEditor = (props: IRichEditorProps) => {
  const {
    content = "",
    defaultValue = content,
    isEditable = false,
    editorProps = {},
    className,
    field,
    checkLang,
    placeholder,
    type,
    showEditorMenu,
    bgcolor,
    menuProps,
    richEditorProps,
  } = props;

  const [isFarsi, setIsFarsi] = useState<any>(checkLang);
  const theme = useTheme();

  useEffect(() => {
    setIsFarsi(checkLang);
  }, [checkLang]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Table.configure({ resizable: true }),
    ],
    content: defaultValue,
    onUpdate(props) {
      if (!field) {
        return;
      }

      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());

        setIsFarsi(firstCharDetector(props.editor.getText()));
      }
    },
    onCreate(props) {
      if (!field) {
        return;
      }
      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());
      }
    },
    onBlur(props) {
      if (!field) {
        return;
      }
      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());
      } else {
        field.onChange("");
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

  return (
    <Box
      className={className}
      sx={
        isEditable
          ? {
              direction: `${isFarsi ? "rtl" : "ltr"}`,
              textAlign: `${isFarsi ? "right" : "left"}`,
              cursor: "text",
              fontFamily: `${isFarsi ? farsiFontFamily : primaryFontFamily}`,
              position: "relative",
              marginTop: "0px !important",
              width: "100%",
              "&.Mui-focused .ProseMirror": {
                borderColor: `${editor?.isEmpty && type === "error" ? "#8A0F2480" : "#1976d2"}`,
                borderWidth: "2px",
                ...richEditorProps,
              },
              "&.Mui-focused:hover .ProseMirror": {
                borderColor: `${editor?.isEmpty && type === "error" ? "#8A0F2480" : "#1976d2"}`,
                ...richEditorProps
              },
              "&.Mui-error .ProseMirror": {
                borderColor: "#d32f2f",
              },
              "&.Mui-error:hover .ProseMirror": {
                borderColor: `${editor?.isEmpty && type === "error" ? "#8A0F2480" : "#d32f2f"}`,
              },
              "&:hover .ProseMirror": {
                borderColor: `${editor?.isEmpty && type === "error" ? "#8A0F2480" : "rgba(0, 0, 0, 0.87)"}`,
                ...richEditorProps,
              },
              "& .rich-editor--menu":
                editor?.isFocused || showEditorMenu
                  ? {
                      opacity: 1,
                      zIndex: 10,
                    }
                  : {},
              "&:hover .rich-editor--menu": {
                opacity: 1,
                zIndex: 10,
              },
              ".ProseMirror p.is-editor-empty:first-child:before ": {
                float: theme.direction == "rtl" ? "right" : "left",
                direction: theme.direction == "rtl" ? "rtl" : "ltr",
              },
              "& .ProseMirror": {
                outline: "none",
                minHeight: `${editor?.isEmpty && type === "error" ? "100px" : "110px"}`,
                border: `1px solid ${editor?.isEmpty && type === "error" ? "#8A0F2480" : "rgba(0, 0, 0, 0.23)"}`,
                borderRadius: 1,
                bgcolor: bgcolor ?? "white",
                paddingInline: 1.5,
                py: 1,
                "& > p": editor?.isEmpty
                  ? {
                      marginBlockStart: 0,
                      marginBlockEnd: 0,
                      textAlign: "initial",
                    }
                  : {
                      unicodeBidi: "plaintext",
                      textAlign: "initial",
                    },

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
          fontFamily: languageDetector(editor?.getText())
            ? farsiFontFamily
            : primaryFontFamily,
        }}
      />
    </Box>
  );
};

export default RichEditor;

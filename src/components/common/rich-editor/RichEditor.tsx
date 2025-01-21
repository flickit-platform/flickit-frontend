import Box, { BoxProps } from "@mui/material/Box";
import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import RichEditorMenuBar from "./RichEditorMenuBar";
import Link from "@tiptap/extension-link";
import { useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import firstCharDetector from "@/utils/firstCharDetector";
import { primaryFontFamily } from "@/config/theme";
import Table from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import "./style.css";
import Placeholder from "@tiptap/extension-placeholder";

interface IRichEditorProps {
  defaultValue?: string;
  isEditable?: boolean;
  editorProps?: Partial<EditorOptions>;
  className?: string;
  field?: ControllerRenderProps<FieldValues, any>;
  content?: string;
  boxProps?: BoxProps;
  checkLang?: boolean;
  setLangDir?: any;
  placeholder?: any;
}

const RichEditor = (props: IRichEditorProps) => {
  const {
    content = "",
    defaultValue = content,
    isEditable = false,
    editorProps = {},
    className,
    field,
    boxProps = {},
    checkLang,
    setLangDir,
    placeholder,
  } = props;

  const [isFarsi, setIsFarsi] = useState<any>(checkLang);
  const CustomTableCell = TableCell.extend({
    addAttributes() {
      return {
        // extend the existing attributes …
        ...this.parent?.(),

        // and add a new one …
        backgroundColor: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-background-color"),
          renderHTML: (attributes) => {
            return {
              "data-background-color": attributes.backgroundColor,
              style: `background-color: ${attributes.backgroundColor}`,
            };
          },
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      // Default TableCell
      // TableCell,
      // Custom TableCell with backgroundColor attribute
      TableCell,
      CustomTableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: defaultValue,
    onUpdate(props) {
      if (!field) {
        return;
      }

      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());

        setIsFarsi(firstCharDetector(props.editor.getText()));
        setLangDir(firstCharDetector(props.editor.getText()));
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
      ...(editorProps?.editorProps || {}),
      attributes: {
        ...(editorProps?.editorProps?.attributes || {}),
        id: "proseMirror",
      },
    },
    editable: isEditable,
    ...editorProps,
  });
  // const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const farsiPattern =
  //     /[\u0600-\u06FF\uFB50-\uFBFF\u0590-\u05FF\u2000-\u206F]/;
  //   const firstCharacter = event.target.value?.charAt(0);
  //   event.target.dir = farsiPattern.test(firstCharacter) ? "rtl" : "ltr";
  //   event.target.style.fontFamily = farsiPattern.test(firstCharacter)
  //     ? "VazirMatn"
  //     : primaryFontFamily;
  // };

  return (
    <Box
      {...boxProps}
      className={className}
      sx={
        isEditable
          ? {
              ...(boxProps.sx || {}),
              direction: `${isFarsi ? "rtl" : "ltr"}`,
              textAlign: `${isFarsi ? "right" : "left"}`,
              cursor: "text",
              fontFamily: `${isFarsi ? "VazirMatn" : primaryFontFamily}`,
              position: "relative",
              marginTop: "0px !important",
              width: "100%",
              mt: 1.5,
              "&.Mui-focused .ProseMirror": {
                borderColor: "#1976d2",
                borderWidth: "2px",
              },
              "&.Mui-focused:hover .ProseMirror": {
                borderColor: "#1976d2",
              },
              "&.Mui-error .ProseMirror": {
                borderColor: "#d32f2f",
              },
              "&.Mui-error:hover .ProseMirror": {
                borderColor: "#d32f2f",
              },
              "&:hover .ProseMirror": { borderColor: "rgba(0, 0, 0, 0.87)" },
              "& .rich-editor--menu": editor?.isFocused
                ? {
                    opacity: 1,
                    zIndex: 10,
                  }
                : {},
              "&:hover .rich-editor--menu": {
                opacity: 1,
                zIndex: 10,
              },
              "& .ProseMirror": {
                outline: "none",
                minHeight: "80px",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: 1,
                background: "#fff",
                px: 1.5,
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
              },
            }
          : { ...(boxProps.sx || {}) }
      }
    >
      {editor && isEditable && <RichEditorMenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichEditor;

import Box, { BoxProps } from "@mui/material/Box";
import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import RichEditorMenuBar from "@common/rich-editor/RichEditorMenuBar";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import firstCharDetector from "@/utils/firstCharDetector";
import { primaryFontFamily, theme } from "@/config/theme";
import Table from "@tiptap/extension-table";
import {TableRow} from "@tiptap/extension-table-row";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableCell} from "@tiptap/extension-table-cell";

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
  setNewAdvice?: any;
  removeDescriptionAdvice?: any;
  fieldLabel?: string;
}

const RichEditorAssessment = (props: IRichEditorProps) => {
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
    setNewAdvice,
    removeDescriptionAdvice,
    fieldLabel,
  } = props;
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(defaultValue);
      editor.commands.focus();
    }
  }, [defaultValue]);
  const [isFarsi, setIsFarsi] = useState<any>(checkLang);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link,
      // Placeholder.configure({
      //   placeholder: placeholder,
      // }),
    ],
    content: defaultValue,
    onUpdate(props) {
      if (!field) {
        return;
      }
      setNewAdvice((prev: any) => ({
        ...prev,
        description: props.editor.getHTML(),
      }));
      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());

        setIsFarsi(firstCharDetector(props.editor.getText()));
        if (setLangDir) {
          setLangDir(firstCharDetector(props.editor.getText()));
        }
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

  if (removeDescriptionAdvice.current) {
    editor?.commands.clearContent(true);
    removeDescriptionAdvice.current = false;
  }
  console.log(fieldLabel);
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
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-2px",
                  left: theme.direction === "ltr" ? "6px" : "unset",
                  right: theme.direction === "rtl" ? "6px" : "unset",
                  width: `${fieldLabel ? fieldLabel.length * 8 : 5 * 8}px`,
                  height: "2px",
                  backgroundColor: "#fff",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  width: "-2px",
                  backgroundColor: "#fff",
                },
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
              "& .rich-editor--menu": {
                opacity: 1,
                zIndex: 10,
              },
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

export default RichEditorAssessment;

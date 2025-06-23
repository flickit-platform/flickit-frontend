import React, { ChangeEvent } from "react";
import { Box, IconButton, Link } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { MultiLangs } from "@/types";
import { useKitDesignerContext } from "@/providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

interface AnswerRangeFormProps {
  newItem: {
    title: string;
    id: any;
    translations: MultiLangs | null;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setNewAnswerRange: React.Dispatch<React.SetStateAction<any>>;
  handleSave: () => void;
  handleCancel: () => void;
}

const AnswerRangeForm = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewAnswerRange,
}: AnswerRangeFormProps) => {
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code;

  const { updateTranslation } = useTranslationUpdater(langCode);

  return (
    <Box
      mt={1.5}
      p={1.5}
      sx={{
        backgroundColor: "#F3F5F6",
        borderRadius: "8px",
        border: "0.3px solid #73808c30",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Box flexGrow={1}>
        <MultiLangTextField
          name="title"
          value={newItem.title}
          onChange={handleInputChange}
          inputProps={{
            style: {
              fontFamily: languageDetector(newItem.title)
                ? farsiFontFamily
                : primaryFontFamily,
            },
          }}
          translationValue={
            langCode ? newItem.translations?.[langCode]?.title ?? "" : ""
          }
          onTranslationChange={updateTranslation("title", setNewAnswerRange)}
          label={<Trans i18nKey="common.title" />}
        />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={1.5}
        mt={0.5}
      >
        <Link
          href="#answer-range-header"
          sx={{
            textDecoration: "none",
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={handleSave}
            data-testid="check-icon"
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={handleCancel}
            data-testid="close-icon"
          >
            <CloseIcon />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default AnswerRangeForm;

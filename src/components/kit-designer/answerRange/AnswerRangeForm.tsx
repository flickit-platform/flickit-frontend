import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import React from "react";
import { MultiLangs } from "@/types";

interface QuestionnairesFormProps {
  newItem: {
    translations: MultiLangs | null;
    title: string;
    id: any;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setNewAnswerRange: ([key]: any) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const AnswerRangeForm = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewAnswerRange,
}: QuestionnairesFormProps) => (
  <Box
    mt={1.5}
    p={1.5}
    sx={{
      backgroundColor: "#F3F5F6",
      borderRadius: "8px",
      border: "0.3px solid #73808c30",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
    }}
  >
    <Box width="100%" mx={1}>
      <MultiLangTextField
        id="new-maturity"
        name="title"
        value={newItem.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInputChange(e)
        }
        inputProps={{
          style: {
            fontFamily: languageDetector(newItem.title)
              ? farsiFontFamily
              : primaryFontFamily,
          },
        }}
        translationValue={newItem.translations?.FA?.title ?? ""}
        onTranslationChange={(e) =>
          setNewAnswerRange((prev: any) => ({
            ...prev,
            translations: {
              ...prev.translations,
              FA: {
                ...prev.translations?.FA,
                title: e.target.value,
              },
            },
          }))
        }
        label={<Trans i18nKey="title" />}
      />
    </Box>

    {/* Check and Close Buttons */}
    <Box
      display="flex"
      alignItems="center"
      flexDirection={"column"}
      gap={"20px"}
    >
      <Link
        href="#subject-header"
        sx={{
          textDecoration: "none",
          opacity: 0.9,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {" "}
        <IconButton
          size="small"
          color="primary"
          data-testid="check-icon"
          onClick={handleSave}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          size="small"
          color="secondary"
          data-testid="close-icon"
          onClick={handleCancel}
        >
          <CloseIcon />
        </IconButton>
      </Link>
    </Box>
  </Box>
);

export default AnswerRangeForm;

import { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import languageDetector from "@utils/languageDetector";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { useKitLanguageContext } from "@/providers/KitProvider";

interface MaturityLevelFormProps {
  newMaturityLevel: {
    title: string;
    description: string;
    index: number;
    value: number;
    translations?: any;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewMaturityLevel: React.Dispatch<
    React.SetStateAction<MaturityLevelFormProps["newMaturityLevel"]>
  >;
}

const MaturityLevelForm = ({
  newMaturityLevel,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewMaturityLevel,
}: MaturityLevelFormProps) => {
  const { kitState } = useKitLanguageContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const [showTranslation, setShowTranslation] = useState({
    title: !!newMaturityLevel.translations?.[langCode]?.title,
    description: !!newMaturityLevel.translations?.[langCode]?.description,
  });

  const handleTranslationChange = (
    field: "title" | "description",
    value: string,
  ) => {
    if (!langCode) return;

    const trimmed = value.trim();
    setNewMaturityLevel((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [langCode]: {
          ...prev.translations?.[langCode],
          [field]: trimmed === "" ? undefined : trimmed,
        },
      },
    }));
  };

  return (
    <Box
      mt={1.5}
      p={1.5}
      sx={{
        backgroundColor: "#F3F5F6",
        borderRadius: 2,
        border: "0.3px solid #73808c30",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Box
        sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
        borderRadius="0.5rem"
      >
        <TextField
          type="number"
          name="value"
          required
          value={newMaturityLevel.value}
          onChange={handleInputChange}
          size="small"
          inputProps={{
            "data-testid": "value-id",
            style: { textAlign: "center", width: 40 },
          }}
          sx={{
            backgroundColor: "#fff",
            "& .MuiInputBase-root": { fontSize: 14 },
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {(["title", "description"] as const).map((field) => (
          <MultiLangTextField
            key={field}
            name={field}
            label={<Trans i18nKey={field} />}
            value={newMaturityLevel[field]}
            onChange={handleInputChange}
            translationValue={newMaturityLevel.translations?.[langCode]?.[field] ?? ""}
            onTranslationChange={(e) =>
              handleTranslationChange(field, e.target.value)
            }
            showTranslation={showTranslation[field]}
            setShowTranslation={(val) =>
              setShowTranslation((prev) => ({
                ...prev,
                [field]: val,
              }))
            }
            multiline={field === "description"}
            minRows={field === "description" ? 2 : undefined}
            maxRows={field === "description" ? 5 : undefined}
            inputProps={{
              style: {
                fontFamily: languageDetector(newMaturityLevel[field])
                  ? farsiFontFamily
                  : primaryFontFamily,
              },
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          mt: 0.5,
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={handleSave}
          data-testid="check-icon-id"
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          size="small"
          color="secondary"
          onClick={handleCancel}
          data-testid="close-icon-id"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MaturityLevelForm;

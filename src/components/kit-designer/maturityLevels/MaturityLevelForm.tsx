import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import languageDetector from "@utils/languageDetector";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";

interface MaturityLevelFormProps {
  newMaturityLevel: {
    title: string;
    description: string;
    index: number;
    value: number;
    translations: any;
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
  const [showTitleTranslation, setShowTitleTranslation] = useState(
    Boolean(newMaturityLevel.translations?.FA?.title),
  );
  const [showDescriptionTranslation, setShowDescriptionTranslation] = useState(
    Boolean(newMaturityLevel.translations?.FA?.description),
  );

  return (
    <Box
      mt={1.5}
      p={1.5}
      sx={{
        backgroundColor: "#F3F5F6",
        borderRadius: "8px",
        border: "0.3px solid #73808c30",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      {/* Number field */}
      <Box
        sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
        borderRadius="0.5rem"
      >
        <TextField
          required
          id="new-maturity"
          type="number"
          name="value"
          value={newMaturityLevel.value}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          inputProps={{
            "data-testid": "maturity-level-value",
            style: { textAlign: "center", width: "40px" },
          }}
          sx={{
            fontSize: 14,
            background: "#fff",
            "& .MuiInputBase-root": {
              fontSize: 14,
            },
          }}
        />
      </Box>

      {/* Inputs */}
      <Box
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <MultiLangTextField
          label={<Trans i18nKey="title" />}
          name="title"
          value={newMaturityLevel.title}
          onChange={handleInputChange}
          inputProps={{
            "data-testid": "maturity-level-title",
            style: {
              fontFamily: languageDetector(newMaturityLevel.title)
                ? farsiFontFamily
                : primaryFontFamily,
            },
          }}
          translationValue={newMaturityLevel.translations?.FA?.title || ""}
          onTranslationChange={(e) =>
            setNewMaturityLevel((prev) => ({
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
          showTranslation={showTitleTranslation}
          setShowTranslation={setShowTitleTranslation}
        />

        <MultiLangTextField
          label={<Trans i18nKey="description" />}
          name="description"
          value={newMaturityLevel.description}
          onChange={handleInputChange}
          multiline
          minRows={2}
          maxRows={5}
          inputProps={{
            "data-testid": "maturity-level-description",
            style: {
              fontFamily: languageDetector(newMaturityLevel.description)
                ? farsiFontFamily
                : primaryFontFamily,
            },
          }}
          translationValue={
            newMaturityLevel.translations?.FA?.description || ""
          }
          onTranslationChange={(e) =>
            setNewMaturityLevel((prev) => ({
              ...prev,
              translations: {
                ...prev.translations,
                FA: {
                  ...prev.translations?.FA,
                  description: e.target.value,
                },
              },
            }))
          }
          showTranslation={showDescriptionTranslation}
          setShowTranslation={setShowDescriptionTranslation}
        />
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          mt: 0.5,
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={handleSave}
          data-testid="maturity-level-check-icon"
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          size="small"
          color="secondary"
          onClick={handleCancel}
          data-testid="maturity-level-close-icon"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MaturityLevelForm;

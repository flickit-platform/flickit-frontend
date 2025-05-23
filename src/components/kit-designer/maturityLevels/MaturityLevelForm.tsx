import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { useKitDesignerContext } from "@/providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

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
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const { updateTranslation } = useTranslationUpdater(langCode);

  const [showTranslation, setShowTranslation] = useState({
    title: !!newMaturityLevel.translations?.[langCode]?.title,
    description: !!newMaturityLevel.translations?.[langCode]?.description,
  });

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

      <Box
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {(["title", "description"] as const).map((field) => (
          <MultiLangTextField
            key={field}
            name={field}
            label={<Trans i18nKey={field} />}
            value={newMaturityLevel[field]}
            onChange={handleInputChange}
            translationValue={
              langCode
                ? (newMaturityLevel.translations?.[langCode]?.[field] ?? "")
                : ""
            }
            onTranslationChange={updateTranslation(field, setNewMaturityLevel)}
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
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mt: 0.5,
        }}
      >
        <IconButton
          size="small"
          color="success"
          onClick={handleSave}
          data-testid="check-icon-id"
        >
          <CheckRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="secondary"
          onClick={handleCancel}
          data-testid="close-icon-id"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MaturityLevelForm;

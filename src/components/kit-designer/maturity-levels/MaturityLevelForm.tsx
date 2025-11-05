import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { useKitDesignerContext } from "@/providers/kit-provider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { NumberField } from "@/components/common/fields/NumberField";

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
        backgroundColor: "background.container",
        borderRadius: 2,
        border: "0.3px solid #73808c30",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Box
        sx={{ ...styles.centerCVH, bgcolor: "background.container" }}
        borderRadius="0.5rem"
      >
        <NumberField
          required
          name="value"
          label={<Trans i18nKey="common.index" />}
          value={newMaturityLevel.value ?? ""}
          onChange={(next) =>
            setNewMaturityLevel((prev: any) => ({ ...prev, value: next }))
          }
          min={1}
          type="int"
          fullWidth
          inputProps={{
            "data-testid": "value-id",
          }}
          margin="normal"
          sx={{
            backgroundColor: "background.containerLowest",
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
            label={<Trans i18nKey={`common.${field}`} />}
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

      <Box gap={0.5} mt={0.5} sx={{ ...styles.centerV }}>
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

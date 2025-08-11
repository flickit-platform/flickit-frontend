import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styles } from "@/config/styles";
import { MultiLangs } from "@/types";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useState } from "react";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { useKitDesignerContext } from "@/providers/KitProvider";
import { Trans } from "react-i18next";

interface QuestionnairesFormProps {
  newItem: {
    title: string;
    description: string;
    index: number;
    value: number;
    translations: MultiLangs | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewQuestionnaires: any;
}

const QuestionnairesForm = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewQuestionnaires,
}: QuestionnairesFormProps) => {
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const { updateTranslation } = useTranslationUpdater(langCode);

  const [showTranslation, setShowTranslation] = useState({
    title: !!newItem.translations?.[langCode]?.title,
    description: !!newItem.translations?.[langCode]?.description,
  });

  return (
    <Box
      mt={1.5}
      p={1.5}
      sx={{
        backgroundColor: "background.container",
        borderRadius: "8px",
        border: "0.3px solid #73808c30",
        display: "flex",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <Box
        sx={{ ...styles.centerCVH, background: "background.container" }}
        borderRadius="0.5rem"
        mr={2}
        p={0.25}
      >
        <TextField
          required
          id="new-item"
          type="number"
          name="value"
          value={newItem.value}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          inputProps={{
            "data-testid": "value-id",
            style: { textAlign: "center", width: "40px" },
          }}
          sx={{
            fontSize: 14,
            "& .MuiInputBase-root": {
              fontSize: 14,
            },
            background: (theme) => theme.palette.background.containerLowest
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
            value={newItem[field]}
            onChange={handleInputChange}
            translationValue={
              langCode ? (newItem.translations?.[langCode]?.[field] ?? "") : ""
            }
            onTranslationChange={updateTranslation(field, setNewQuestionnaires)}
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
          <IconButton
            size="small"
            color="primary"
            data-testid="check-icon-id"
            onClick={handleSave}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            data-testid="close-icon-id"
            onClick={handleCancel}
          >
            <CloseIcon />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default QuestionnairesForm;

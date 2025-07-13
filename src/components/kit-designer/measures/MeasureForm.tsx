import { ChangeEvent } from "react";
import { Box, IconButton, Link } from "@mui/material";
import { Trans } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useKitDesignerContext } from "@/providers/KitProvider";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

interface MeasureFormProps {
  newMeasure: {
    title: string;
    description: string;
    weight: number;
    index: number;
    value: number;
    translations?: any;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewMeasure: React.Dispatch<React.SetStateAction<any>>;
}

const MeasureForm = ({
  newMeasure,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewMeasure,
}: MeasureFormProps) => {
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
      {/* Value field */}
      <Box
        sx={{
          background: "#F3F5F6",
          borderRadius: "0.5rem",
          px: 1.25,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="input"
          name="value"
          type="number"
          required
          value={newMeasure.value}
          onChange={handleInputChange}
          data-testid="value-id"
          style={{
            textAlign: "center",
            width: "40px",
            height: "40px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#fff",
          }}
        />
      </Box>

      {/* Title & Description with translation */}
      <Box flexGrow={1} display="flex" flexDirection="column" gap={2}>
        <MultiLangTextField
          id="new-item"
          name="title"
          value={newMeasure.title}
          onChange={handleInputChange}
          translationValue={
            langCode ? (newMeasure.translations?.[langCode]?.title ?? "") : ""
          }
          onTranslationChange={updateTranslation("title", setNewMeasure)}
          label={<Trans i18nKey="common.title" />}
        />

        <MultiLangTextField
          name="description"
          value={newMeasure.description}
          onChange={handleInputChange}
          translationValue={
            langCode
              ? (newMeasure.translations?.[langCode]?.description ?? "")
              : ""
          }
          onTranslationChange={updateTranslation("description", setNewMeasure)}
          label={<Trans i18nKey="common.description" />}
          multiline
          minRows={2}
          maxRows={5}
        />
      </Box>

      {/* Action Buttons */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={1.5}
        mt={1}
      >
        <Link
          href="#measure-header"
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
        </Link>
      </Box>
    </Box>
  );
};

export default MeasureForm;

import { useState } from "react";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { styles } from "@/config/styles";
import { useKitDesignerContext } from "@/providers/KitProvider";
import { MultiLangs } from "@/types";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

interface SubjectFormProps {
  newSubject: {
    title: string;
    description: string;
    weight: number;
    index: number;
    value: number;
    translations?: MultiLangs | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewSubject: any;
}

const SubjectForm = ({
  newSubject,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewSubject,
}: SubjectFormProps) => {
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const { updateTranslation } = useTranslationUpdater(langCode);

  const [showTitleTranslation, setShowTitleTranslation] = useState(
    Boolean(newSubject.translations?.[langCode]?.title),
  );
  const [showDescriptionTranslation, setShowDescriptionTranslation] = useState(
    Boolean(newSubject.translations?.[langCode]?.description),
  );

  const renderNumericField = (
    name: "value" | "weight",
    value: number,
    testId?: string,
    label?: string,
  ) => (
    <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
      {label && (
        <Typography variant="caption" color="textSecondary">
          <Trans i18nKey={label} />
        </Typography>
      )}
      <TextField
        name={name}
        type="number"
        value={value}
        onChange={handleInputChange}
        size="small"
        variant="outlined"
        inputProps={{
          style: { textAlign: "center", width: 40 },
          ...(testId ? { "data-testid": testId } : {}),
        }}
        sx={{
          background: (theme) => theme.palette.background.containerLowest,
          borderRadius: "8px",
        }}
      />
    </Box>
  );

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
        gap: 2,
      }}
    >
      {/* Index Number */}
      <Box
        sx={{ ...styles.centerCVH, background: "background.container" }}
        borderRadius="0.5rem"
      >
        {renderNumericField("value", newSubject.value, "value-id")}
      </Box>

      {/* Multilingual Texts */}
      <Box
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <MultiLangTextField
          id="new-item"
          label={<Trans i18nKey="title" />}
          name="title"
          value={newSubject.title}
          onChange={handleInputChange}
          translationValue={
            langCode ? (newSubject.translations?.[langCode]?.title ?? "") : ""
          }
          onTranslationChange={updateTranslation("title", setNewSubject)}
          showTranslation={showTitleTranslation}
          setShowTranslation={setShowTitleTranslation}
        />

        <MultiLangTextField
          label={<Trans i18nKey="common.description" />}
          name="description"
          value={newSubject.description}
          onChange={handleInputChange}
          multiline
          minRows={2}
          maxRows={5}
          translationValue={
            langCode
              ? (newSubject.translations?.[langCode]?.description ?? "")
              : ""
          }
          onTranslationChange={updateTranslation("description", setNewSubject)}
          showTranslation={showDescriptionTranslation}
          setShowTranslation={setShowDescriptionTranslation}
        />
      </Box>

      {/* Save, Cancel, and Weight */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        gap={1.5}
        mt={0.5}
      >
        <Box display="flex">
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
        {renderNumericField("weight", newSubject.weight, undefined, "weight")}
      </Box>
    </Box>
  );
};

export default SubjectForm;

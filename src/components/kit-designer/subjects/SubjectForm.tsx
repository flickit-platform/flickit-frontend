import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { styles } from "@/config/styles";
import { useKitDesignerContext } from "@/providers/kit-provider";
import { MultiLangs } from "@/types";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { NumberField } from "@/components/common/fields/NumberField";

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
        sx={{ ...styles.centerCVH, bgcolor: "background.container" }}
        borderRadius="0.5rem"
      >
        <NumberField
          type="int"
          value={newSubject.value}
          label={<Trans i18nKey="common.index" />}
          onChange={(next) =>
            setNewSubject((prev: any) => ({ ...prev, value: next }))
          }
          min={1}
          size="small"
          variant="outlined"
          inputProps={{
            "data-testid": "value-id",
          }}
          sx={{
            bgcolor: "background.containerLowest",
            borderRadius: "8px",
          }}
        />
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
        justifyContent="flex-start"
        gap={1.5}
        mt={0.5}
        sx={{ ...styles.centerCH }}
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
        <NumberField
          type="int"
          value={newSubject.weight}
          label={<Trans i18nKey="common.weight" />}
          onChange={(next) =>
            setNewSubject((prev: any) => ({ ...prev, weight: next }))
          }
          min={0}
          size="small"
          variant="outlined"
          inputProps={{
            "data-testid": "weight-id",
          }}
          sx={{
            bgcolor: "background.containerLowest",
            borderRadius: "8px",
          }}
        />
      </Box>
    </Box>
  );
};

export default SubjectForm;

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useKitDesignerContext } from "@/providers/kit-provider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { styles } from "@styles";
import { NumberField } from "@/components/common/fields/NumberField";

interface OptionFormProps {
  newItem: {
    title: string;
    translations: any;
    index: number;
    value: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewOptions: any;
}

const OptionForm = ({
  newItem,
  setNewOptions,
  handleInputChange,
  handleSave,
  handleCancel,
}: OptionFormProps) => {
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code;

  const { updateTranslation } = useTranslationUpdater(langCode);

  return (
    <Box
      p={1.5}
      bgcolor="background.container"
      borderRadius="0px 0px 8px 8px"
      border="0.3px solid #73808c30"
      display="flex"
      alignItems="flex-start"
      position="relative"
    >
      <Box width={{ xs: "65%", md: "70%" }} mx={1}>
        <MultiLangTextField
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
          translationValue={
            langCode ? (newItem.translations?.[langCode]?.title ?? "") : ""
          }
          onTranslationChange={updateTranslation("title", setNewOptions)}
          label={<Trans i18nKey="common.title" />}
        />
      </Box>
      <Box width={{ xs: "20%", md: "10%" }}>
        <NumberField
          required
          label={<Trans i18nKey="common.score" />}
          name="value"
          value={newItem.value ?? ""}
          onChange={(next) =>
            setNewOptions((prev: any) => ({ ...prev, value: next }))
          }
          min={0}
          max={1}
          type="float"
          fullWidth
          inputProps={{
            "data-testid": "title-id",
            style: { width: 40, textAlign: "center" },
          }}
          margin="normal"
        />
      </Box>
      {/* Check and Close Buttons */}
      <Box marginLeft="auto" gap="20px" sx={{ ...styles.centerCH }}>
        <Link
          href="#subject-header"
          sx={{
            ...styles.centerV,
            textDecoration: "none",
            opacity: 0.9,
            fontWeight: "bold",
            gap: "20px",
          }}
        >
          {" "}
          <IconButton
            size="small"
            color="primary"
            data-testid="answer-range-check-icon"
            onClick={handleSave}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            data-testid="answer-option-close-icon"
            onClick={handleCancel}
          >
            <CloseIcon />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default OptionForm;

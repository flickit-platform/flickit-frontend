import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { styles } from "@styles";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { Text } from "@/components/common/Text";
import { NumberField } from "@/components/common/fields/NumberField";

interface AttributeFormProps {
  newAttribute: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  langCode: string;
  setNewAttribute: any;
  updateTranslation: any;
}

const AttributeForm = ({
  newAttribute,
  handleInputChange,
  handleSave,
  handleCancel,
  langCode,
  setNewAttribute,
  updateTranslation,
}: AttributeFormProps) => {
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
        width: "100%",
      }}
    >
      {/* Index Number */}
      <Box
        sx={{ ...styles.centerCVH, bgcolor: "background.container" }}
        borderRadius="0.5rem"
      >
        <Box
          sx={{
            ...styles.centerVH,
            bgcolor: "background.container",
            width: { xs: "40px" },
            justifyContent: "space-around",
          }}
          borderRadius="0.5rem"
          mr={2}
          px={1.5}
        >
          <Text variant="semiBoldLarge">{1}</Text>
          <IconButton
            disableRipple
            disableFocusRipple
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
                color: "inherit",
              },
            }}
            size="small"
          >
            <SwapVertRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Multilingual Texts */}
      <Box
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <MultiLangTextField
          id="new-item"
          label={<Trans i18nKey="common.title" />}
          name="title"
          value={newAttribute.title}
          onChange={handleInputChange}
          translationValue={
            langCode ? (newAttribute.translations?.[langCode]?.title ?? "") : ""
          }
          onTranslationChange={updateTranslation("title", setNewAttribute)}
        />

        <MultiLangTextField
          label={<Trans i18nKey="common.description" />}
          name="description"
          value={newAttribute.description}
          onChange={handleInputChange}
          translationValue={
            langCode
              ? (newAttribute.translations?.[langCode]?.description ?? "")
              : ""
          }
          onTranslationChange={updateTranslation(
            "description",
            setNewAttribute,
          )}
          multiline
        />
      </Box>

      {/* Save, Cancel, and Weight */}
      <Box
        justifyContent="flex-start"
        gap={0.6}
        mt={0.5}
        sx={{ ...styles.centerCH }}
      >
        <Box display="flex">
          <IconButton
            size="small"
            color="primary"
            onClick={handleSave}
            data-testid="attribute-save-icon"
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={handleCancel}
            data-testid="attribute-close-icon"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box gap={0.5} sx={{ ...styles.centerCH }}>
          <NumberField
            type="int"
            value={newAttribute.weight}
            label={<Trans i18nKey="common.weight" />}
            onChange={(next) =>
              setNewAttribute((prev: any) => ({ ...prev, weight: next }))
            }
            min={0}
            size="small"
            variant="outlined"
            inputProps={{
              "data-testid": "weight-id",
              style: { textAlign: "center", width: 40 },
            }}
            sx={{
              bgcolor: "background.containerLowest",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AttributeForm;

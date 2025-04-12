import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styles } from "@/config/styles";
import { t } from "i18next";
import {farsiFontFamily, primaryFontFamily} from "@config/theme";
import languageDetector from "@utils/languageDetector";

interface QuestionnairesFormProps {
  newItem: {
    title: string;
    description: string;
    index: number;
    value: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const renderTextField = (
  label: string,
  name: string,
  value: string | number,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  required = true,
  multiline = false,
  inputProps?: any,
) => (
  <TextField
    required={required}
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    fullWidth
    margin="normal"
    multiline={multiline}
    minRows={multiline ? 2 : 1}
    inputProps={inputProps}
    sx={{
      mt: 1,
      fontSize: 14,
      "& .MuiInputBase-root": {
        fontSize: 14,
        overflow: multiline ? "auto" : "unset",
        height: multiline ? "unset" : 40,
      },
      "& .MuiFormLabel-root": {
        fontSize: 14,
      },
      background: "#fff",
      width: { xs: "100%", md: name === "description" ? "85%" : "60%" },
    }}
  />
);

const QuestionnairesForm = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
}: QuestionnairesFormProps) => (
  <Box
    mt={1.5}
    p={1.5}
    sx={{
      backgroundColor: "#F3F5F6",
      borderRadius: "8px",
      border: "0.3px solid #73808c30",
      display: "flex",
      alignItems: "flex-start",
      position: "relative",
    }}
  >
    <Box
      sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
      borderRadius="0.5rem"
      mr={2}
      p={0.25}
    >
      <TextField
        required
        id="new-maturity"
        type="number"
        name="value"
        value={newItem.value}
        onChange={handleInputChange}
        variant="outlined"
        size="small"
        inputProps={{
          "data-testid": "questionnaires-value",
          style: { textAlign: "center", width: "40px" },
        }}
        sx={{
          fontSize: 14,
          "& .MuiInputBase-root": {
            fontSize: 14,
          },
          background: "#fff",
        }}
      />
    </Box>

    <Box width="100%" mx={1}>
      {renderTextField(
        t("title"),
        "title",
        newItem.title,
        handleInputChange,
        true,
        false,
        { "data-testid": "questionnaires-title",style: {fontFamily: languageDetector(newItem.title) ? farsiFontFamily : primaryFontFamily } },
      )}

      {renderTextField(
        t("description"),
        "description",
        newItem.description,
        handleInputChange,
        true,
        true,
        { "data-testid": "questionnaires-description", style: {fontFamily: languageDetector(newItem.title) ? farsiFontFamily : primaryFontFamily } },
      )}
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
          data-testid="questionnaires-check-icon"
          onClick={handleSave}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          size="small"
          color="secondary"
          data-testid="questionnaires-close-icon"
          onClick={handleCancel}
        >
          <CloseIcon />
        </IconButton>
      </Link>
    </Box>
  </Box>
);

export default QuestionnairesForm;

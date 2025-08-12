import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";

interface QuestionFormProps {
  newItem: {
    title: string;
    index: number;
    value: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const QuestionForm = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
}: QuestionFormProps) => (
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
      sx={{ ...styles.centerCVH, bgcolor: "background.container " }}
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
          "data-testid": "question-value",
          style: { textAlign: "center", width: "40px" },
        }}
        sx={{
          fontSize: 14,
          "& .MuiInputBase-root": {
            fontSize: 14,
          },
          bgcolor: "background.containerLowest",
        }}
      />
    </Box>

    <Box width="100%" mx={1}>
      <TextField
        required
        label={<Trans i18nKey="common.title" />}
        name="title"
        value={newItem.title}
        onChange={handleInputChange}
        fullWidth
        inputProps={{
          "data-testid": "question-title",
          style: {
            fontFamily: languageDetector(newItem.title)
              ? farsiFontFamily
              : primaryFontFamily,
          },
        }}
        margin="normal"
        sx={{
          mt: 0.3,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 36,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
          bgcolor: "background.containerLowest",
        }}
      />
    </Box>

    {/* Check and Close Buttons */}
    <Box gap="20px" sx={{ ...styles.centerCH }}>
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

export default QuestionForm;

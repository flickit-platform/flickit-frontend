import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import Typography from "@mui/material/Typography";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import languageDetector from "@utils/languageDetector";

interface MeasureFormProps {
  newMeasure: {
    title: string;
    description: string;
    weight: number;
    index: number;
    value: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const sharedTextFieldSx = {
  fontSize: 14,
  background: "#fff",
  "& .MuiInputBase-root": {
    fontSize: 14,
  },
  "& .MuiFormLabel-root": {
    fontSize: 14,
  },
};

const MeasureForm = ({
  newMeasure,
  handleInputChange,
  handleSave,
  handleCancel,
}: MeasureFormProps) => (
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
    {/* Value field */}
    <Box
      sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
      borderRadius="0.5rem"
      mr={2}
      p={0.25}
    >
      <TextField
        required
        name="value"
        type="number"
        value={newMeasure.value}
        onChange={handleInputChange}
        size="small"
        inputProps={{
          "data-testid": "measure-value",
          style: { textAlign: "center", width: "40px" },
        }}
        sx={sharedTextFieldSx}
      />
    </Box>

    {/* Title & Description */}
    <Box width="100%" mx={1}>
      <TextField
        required
        label={<Trans i18nKey="title" />}
        name="title"
        value={newMeasure.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        inputProps={{
          "data-testid": "measure-title",
          style: {
            fontFamily: languageDetector(newMeasure.title)
              ? farsiFontFamily
              : primaryFontFamily,
          },
        }}
        sx={{
          ...sharedTextFieldSx,
          mt: 0,
          "& .MuiInputBase-root": {
            height: 40,
          },
          width: { xs: "100%", md: "60%" },
        }}
      />

      <TextField
        label={<Trans i18nKey="description" />}
        name="description"
        value={newMeasure.description}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        multiline
        minRows={2}
        maxRows={3}
        inputProps={{
          "data-testid": "measure-description",
          style: {
            fontFamily: languageDetector(newMeasure.description)
              ? farsiFontFamily
              : primaryFontFamily,
          },
        }}
        sx={{
          ...sharedTextFieldSx,
          mt: 1,
          width: { xs: "100%", md: "85%" },
        }}
      />
    </Box>

    {/* Action buttons + weight */}
    <Box display="flex" alignItems="center" flexDirection="column" gap="20px">
      <Link
        href="#Measure-header"
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
          data-testid="measure-check-icon"
          onClick={handleSave}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          size="small"
          color="secondary"
          data-testid="measure-close-icon"
          onClick={handleCancel}
        >
          <CloseIcon />
        </IconButton>
      </Link>

      <Box
        sx={{
          width: "fit-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          flexDirection: "column",
          gap: "0.5rem",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            ...theme.typography.labelCondensed,
            color: "#6C8093",
            width: "100%",
          }}
        >
          <Trans i18nKey="weight" />
        </Typography>

        <TextField
          required
          value={newMeasure.weight}
          onChange={handleInputChange}
          name="weight"
          type="number"
          fullWidth
          size="small"
          margin="normal"
          inputProps={{
            style: { textAlign: "center", width: "40px" },
          }}
          sx={{
            ...sharedTextFieldSx,
            mb: 1,
            mt: 1,
            borderRadius: "8px",
          }}
        />
      </Box>
    </Box>
  </Box>
);

export default MeasureForm;

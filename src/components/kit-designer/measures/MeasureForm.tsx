import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";

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
        id="new-maturity"
        required
        name="value"
        type="number"
        value={newMeasure.value}
        onChange={handleInputChange}
        size="small"
        inputProps={{
          "data-testid": "value-id",
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
          "data-testid": "title-id",
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
        maxRows={5}
        inputProps={{
          "data-testid": "description-id",
        }}
        sx={{
          ...sharedTextFieldSx,
          mt: 1,
          "& .MuiInputBase-root": {
            overflow: "hidden",
          },
          width: { xs: "100%", md: "100%" },
        }}
      />
    </Box>

    {/* Action buttons + weight */}
    <Box display="flex" alignItems="center" flexDirection="column" gap="20px">
      <Link
        href="#header"
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

export default MeasureForm;

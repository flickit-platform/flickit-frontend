import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";

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
          background:"#fff",
        }}
      />
    </Box>

    <Box width="100%" mx={1}>
      <TextField
        required
        label={<Trans i18nKey="title" />}
        name="title"
        value={newItem.title}
        onChange={handleInputChange}
        fullWidth
        inputProps={{
            "data-testid": "questionnaires-title",
        }}
        margin="normal"
        sx={{
          mt: 0,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 32,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
            background:"#fff",
            width:{xs:"100%",md:"60%"},
        }}
      />

      <TextField
        label={<Trans i18nKey="description" />}
        name="description"
        required
        value={newItem.description}
        onChange={handleInputChange}
        inputProps={{
            "data-testid": "questionnaires-description",
        }}
        fullWidth
        margin="normal"
        multiline
        minRows={2}
        maxRows={3}
        sx={{
          mt: 1,
          fontSize: 14,
          "& .MuiInputBase-root": {
            fontSize: 14,
            overflow: "auto",
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
            background:"#fff",
            width:{xs:"100%",md:"85%"},
        }}
      />
    </Box>

    {/* Check and Close Buttons */}
    <Box display="flex" alignItems="center" flexDirection={"column"} gap={"20px"}>
      <Link
        href="#subject-header"
        sx={{
          textDecoration: "none",
          opacity: 0.9,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap:"20px"
        }}
      >
        {" "}
        <IconButton size="small" color="primary" data-testid="questionnaires-check-icon" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton size="small" color="secondary" data-testid="questionnaires-close-icon" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Link>
    </Box>
  </Box>
);

export default QuestionnairesForm;

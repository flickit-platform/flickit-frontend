import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import Link from "@mui/material/Link";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import SwapVertRounded from "@mui/icons-material/SwapVertRounded";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { ChangeEvent } from "react";

interface AttributeFormProps {
  newAttribute: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  langCode: string,
  setNewAttribute: any,
  updateTranslation: any,
}

const AttributeForm = ({
  newAttribute,
  handleInputChange,
  handleSave,
  handleCancel,
  langCode,
  setNewAttribute,
  updateTranslation
}: AttributeFormProps) => (
  <TableRow id="new-item" sx={{ background: "#F9F9F9" }}>
    <TableCell>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: "0.5rem",
          width: { xs: "50px", md: "64px" },
          justifyContent: "space-around",
          px: 1.5,
        }}
      >
        <Typography variant="semiBoldLarge">{1}</Typography>
        <IconButton disableRipple disableFocusRipple size="small">
          <SwapVertRounded fontSize="small" />
        </IconButton>
      </Box>
    </TableCell>
    <TableCell sx={{ width: "30%" }}>
      <MultiLangTextField
        id="title-id"
        label={<Trans i18nKey="title" />}
        name="title"
        value={newAttribute.title}
        onChange={handleInputChange}
        translationValue={
          langCode ? (newAttribute.translations?.[langCode]?.title ?? "") : ""
        }
        onTranslationChange={updateTranslation("title", setNewAttribute)}
      />
    </TableCell>
    <TableCell sx={{ width: "50%" }}>
      <MultiLangTextField
        id="description-id"
        label={<Trans i18nKey="description" />}
        name="description"
        value={newAttribute.description}
        onChange={handleInputChange}
        translationValue={
          langCode ? (newAttribute.translations?.[langCode]?.description ?? "") : ""
        }
        onTranslationChange={updateTranslation("description", setNewAttribute)}
      />
    </TableCell>
    <TableCell sx={{ width: "20%" }}>
      <TextField
        required
        label={<Trans i18nKey="weight" />}
        name="weight"
        type="number"
        value={newAttribute.weight}
        inputProps={{
          "data-testid": "weight-id",
        }}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        sx={{
          mt: 1,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 40,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
          background: "#fff",
        }}
      />
    </TableCell>
    <TableCell sx={{ display: "flex", mt: "16px" }}>
      <Link
        href="#maturity-header"
        sx={{
          textDecoration: "none",
          opacity: 0.9,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          color="primary"
          data-testid={"attribute-save-icon"}
          onClick={handleSave}
        >
          <CheckIcon />
        </IconButton>
        <IconButton
          color="secondary"
          data-testid={"attribute-close-icon"}
          onClick={handleCancel}
        >
          <CloseIcon />
        </IconButton>
      </Link>
    </TableCell>
  </TableRow>
);

export default AttributeForm;

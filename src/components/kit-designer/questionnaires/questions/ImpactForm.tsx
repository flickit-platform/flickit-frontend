import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import uniqueId from "@/utils/uniqueId";
import { v3Tokens } from "@/config/tokens";
import { styles } from "@styles";

interface ImpactFormProps {
  newItem: Record<string, any>;
  handleInputChange: (field: string, value: any) => void;
  handleSave: () => void;
  handleCancel: () => void;
  fields: {
    name: string;
    label: string;
    options?: Array<{ id: number; title: string }>;
  }[];
}

export const dropdownStyle = {
  fullWidth: true,
  displayEmpty: true,
  backgroundColor: v3Tokens.surface.containerLowest,
  fontSize: "14px",
};

const ImpactForm: React.FC<ImpactFormProps> = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
  fields,
}) => {
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  return (
    <Box
      mt={1.5}
      p={1.5}
      borderRadius="8px"
      border="0.3px solid #73808c30"
      bgcolor="background.container"
      gap={2}
      sx={{ ...styles.centerV }}
    >
      {fields.map((field, idx) => (
        <Select
          key={uniqueId()}
          name={field.name}
          value={newItem[field.name] ?? ""}
          onChange={handleSelectChange}
          sx={{ ...dropdownStyle, fontFamily: farsiFontFamily }}
          size="small"
          fullWidth
          displayEmpty
        >
          <MenuItem value="" disabled>
            <Trans i18nKey={`select${field.label.replace(" ", "")}`} />
          </MenuItem>
          {field.options?.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}
              sx={{
                fontFamily: languageDetector(option.title)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {option.title}
            </MenuItem>
          ))}
        </Select>
      ))}

      <TextField
        required
        name="weight"
        label={<Trans i18nKey="common.weight" />}
        value={newItem.weight}
        onChange={handleTextFieldChange}
        fullWidth
        type="number"
        size="small"
        sx={{
          mx: 1,
          backgroundColor: "background.containerLowest",
          textFieldStyle,
          width: "50%",
        }}
      />

      <Box sx={{ ...styles.centerV }}>
        <IconButton size="small" color="primary" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton size="small" color="secondary" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const textFieldStyle = {
  fontSize: 14,
  ml: 2,
  "& .MuiInputBase-root": { fontSize: 14, overflow: "auto" },
  "& .MuiFormLabel-root": { fontSize: 14 },
};

export default ImpactForm;

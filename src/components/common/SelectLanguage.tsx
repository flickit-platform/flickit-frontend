import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SelectLanguage = (props: any) => {
  const { mainLanguage, handleChange, languages, editable } = props;

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        disabled={editable === undefined ? false : !editable}
        size="small"
        labelId={`language-name-label`}
        value={mainLanguage.value}
        IconComponent={KeyboardArrowDownIcon}
        displayEmpty
        required={true}
        onChange={(e) => handleChange(e.target.value)}
        sx={{
          fontSize: "14px",
          bgcolor: "inherit",
          px: "0px",
          height: "40px",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            padding: "12px !important",
          },
        }}
      >
        {languages?.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectLanguage;

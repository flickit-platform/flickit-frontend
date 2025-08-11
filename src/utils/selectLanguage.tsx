import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { Trans } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SelectLanguage = (props: any) => {
  const { mainLanguage, handleChange, languages, editable } = props;

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="language-name-label">
        {" "}
        <Trans i18nKey="common.language" />
      </InputLabel>
      <Select
        disabled={editable != undefined ? !editable : false}
        size="small"
        labelId={`language-name-label`}
        value={mainLanguage.title}
        IconComponent={KeyboardArrowDownIcon}
        displayEmpty
        required={true}
        input={<OutlinedInput label="common.language" />}
        onChange={(e) => handleChange(e)}
        sx={{
          fontSize: "14px",
          background: (theme) => theme.palette.background.containerLowest,
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
          <MenuItem key={option} value={option.title}>
            <Trans i18nKey={option.title} />
          </MenuItem>
        ))}
      </Select>
    </FormControl >
  );
};

export default SelectLanguage;

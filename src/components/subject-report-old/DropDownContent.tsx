import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { t } from "i18next";
import { OutlinedInput, InputLabel, FormControl } from "@mui/material";
import { theme } from "@/config/theme";

const sortOptions = [
  { value: "weight", label: t("impact") },
  { value: "gainedScoreLowToHigh", label: `${t("gainedScore")} (${t("ascending")})` },
  { value: "gainedScoreHighToLow", label: `${t("gainedScore")} (${t("descending")})` },
  { value: "missedScoreLowToHigh", label: `${t("missedScore")} (${t("ascending")})` },
  { value: "missedScoreHighToLow", label: `${t("missedScore")} (${t("descending")})` },
];

const DropdownContent = ({
  onSortChange,
  sortBy,
  sortOrder,
}: {
  onSortChange: (sortBy: string, sortOrder: string) => void;
  sortBy: any;
  sortOrder: any;
}) => {
  const isRTL = theme.direction === "rtl";

  const getSelectedValue = () => {
    if (sortBy === "gained_score" && sortOrder === "desc") return "gainedScoreHighToLow";
    if (sortBy === "gained_score" && sortOrder === "asc") return "gainedScoreLowToHigh";
    if (sortBy === "missed_score" && sortOrder === "desc") return "missedScoreHighToLow";
    if (sortBy === "missed_score" && sortOrder === "asc") return "missedScoreLowToHigh";
    if (sortBy === "weight" && sortOrder === "desc") return "weight";
    return "";
  };

  const handleSortChange = (event: any) => {
    const value = event.target.value;
    if (value === "gainedScoreHighToLow") onSortChange("gained_score", "desc");
    else if (value === "gainedScoreLowToHigh") onSortChange("gained_score", "asc");
    else if (value === "missedScoreHighToLow") onSortChange("missed_score", "desc");
    else if (value === "missedScoreLowToHigh") onSortChange("missed_score", "asc");
    else if (value === "weight") onSortChange("weight", "desc");
  };

  return (
    <Box px={2} py={1} dir={isRTL ? "rtl" : "ltr"}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="sort-select-label"
          sx={{ textAlign: isRTL ? "right" : "left" }}
        >
          {t("orderBy")}
        </InputLabel>
        <Select
          labelId="sort-select-label"
          value={getSelectedValue()}
          onChange={handleSortChange}
          input={<OutlinedInput label={t("orderBy")} />}
          displayEmpty
          renderValue={(selected) => {
            const selectedOption = sortOptions.find(
              (opt) => opt.value === selected
            );
            return selectedOption ? selectedOption.label : "";
          }}
          sx={{
            textAlign: isRTL ? "right" : "left",
            direction: isRTL ? "rtl" : "ltr",
            "& .MuiSelect-icon": {
              left: isRTL ? 7 : "unset",
              right: isRTL ? "unset" : 7,
            },
          }}
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ textAlign: isRTL ? "right" : "left" }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DropdownContent;

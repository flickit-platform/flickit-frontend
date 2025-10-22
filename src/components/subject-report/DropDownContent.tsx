import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { t } from "i18next";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useTheme } from "@mui/material";

const sortOptions = [
  { value: "impact_percentage", label: t("common.impact") },
  {
    value: "gainedScoreLowToHigh",
    label: `${t("subject.gainedScore")} (${t("common.ascending")})`,
  },
  {
    value: "gainedScoreHighToLow",
    label: `${t("subject.gainedScore")} (${t("common.descending")})`,
  },
  {
    value: "missedScoreLowToHigh",
    label: `${t("subject.missedScore")} (${t("common.ascending")})`,
  },
  {
    value: "missedScoreHighToLow",
    label: `${t("subject.missedScore")} (${t("common.descending")})`,
  },
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
  const theme = useTheme();
  const isRTL = theme.direction === "rtl";

  const getSelectedValue = () => {
    if (sortBy === "gained_score" && sortOrder === "desc")
      return "gainedScoreHighToLow";
    if (sortBy === "gained_score" && sortOrder === "asc")
      return "gainedScoreLowToHigh";
    if (sortBy === "missed_score" && sortOrder === "desc")
      return "missedScoreHighToLow";
    if (sortBy === "missed_score" && sortOrder === "asc")
      return "missedScoreLowToHigh";
    if (sortBy === "impact_percentage" && sortOrder === "desc")
      return "impact_percentage";
    return "";
  };

  const handleSortChange = (event: any) => {
    const value = event.target.value;
    if (value === "gainedScoreHighToLow") onSortChange("gained_score", "desc");
    else if (value === "gainedScoreLowToHigh")
      onSortChange("gained_score", "asc");
    else if (value === "missedScoreHighToLow")
      onSortChange("missed_score", "desc");
    else if (value === "missedScoreLowToHigh")
      onSortChange("missed_score", "asc");
    else if (value === "impact_percentage")
      onSortChange("impact_percentage", "desc");
  };

  return (
    <Box mt={3} dir={isRTL ? "rtl" : "ltr"}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="sort-select-label"
          sx={{
            textAlign: isRTL ? "right" : "left",
            ...theme.typography.bodySmall,
          }}
        >
          {t("common.orderBy")}
        </InputLabel>
        <Select
          labelId="sort-select-label"
          value={getSelectedValue()}
          onChange={handleSortChange}
          input={<OutlinedInput label={t("common.orderBy")} />}
          renderValue={(selected) => {
            const selectedOption = sortOptions.find(
              (opt) => opt.value === selected,
            );
            return selectedOption ? selectedOption.label : "";
          }}
          sx={{
            textAlign: isRTL ? "right" : "left",
            direction: isRTL ? "rtl" : "ltr",
            ...theme.typography.bodySmall,

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
              sx={{
                textAlign: isRTL ? "right" : "left",
                ...theme.typography.bodySmall,
              }}
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

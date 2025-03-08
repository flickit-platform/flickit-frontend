import React from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { Trans } from "react-i18next";
import { t } from "i18next";

const PopoverContent = ({
  onSortChange,
  sortBy,
  sortOrder,
}: {
  onSortChange: (sortBy: string, sortOrder: string) => void;
  sortBy: string | null;
  sortOrder: string | null | undefined;
}) => {
  const getSelectedValue = () => {
    if (sortBy === "gainedScore" && sortOrder === "desc") {
      return "gainedScoreHighToLow";
    } else if (sortBy === "gainedScore" && sortOrder === "asc") {
      return "gainedScoreLowToHigh";
    } else if (sortBy === "missedScore" && sortOrder === "desc") {
      return "missedScoreHighToLow";
    } else if (sortBy === "missedScore" && sortOrder === "asc") {
      return "missedScoreLowToHigh";
    }
    return "";
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "gainedScoreHighToLow") {
      onSortChange("gained_score", "desc");
    } else if (value === "gainedScoreLowToHigh") {
      onSortChange("gained_score", "asc");
    } else if (value === "missedScoreHighToLow") {
      onSortChange("missed_score", "desc");
    } else if (value === "missedScoreLowToHigh") {
      onSortChange("missed_score", "asc");
    }
  };

  return (
    <Box px={2} py={1}>
      <Typography variant="bodySmall" sx={{ mb: 1 }}>
        <Trans i18nKey="orderBy" />
      </Typography>
      <RadioGroup value={getSelectedValue()} onChange={handleSortChange}>
        <FormControlLabel
          value="gainedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="labelSmall">
              {t("gainedScore")} ({t("highToLow")})
            </Typography>
          }
        />
        <FormControlLabel
          value="gainedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="labelSmall">
              {t("gainedScore")} ({t("lowToHigh")})
            </Typography>
          }
        />
        <Divider sx={{ my: 1 }} />
        <FormControlLabel
          value="missedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="labelSmall">
              {t("missedScore")} ({t("highToLow")})
            </Typography>
          }
        />
        <FormControlLabel
          value="missedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="labelSmall">
              {t("missedScore")} ({t("lowToHigh")})
            </Typography>
          }
        />
      </RadioGroup>
    </Box>
  );
};
export default PopoverContent;

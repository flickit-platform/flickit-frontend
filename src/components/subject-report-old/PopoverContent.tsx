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
  sortBy: any;
  sortOrder: any;
}) => {
  const getSelectedValue = () => {
    if (sortBy === "gained_score" && sortOrder === "desc") {
      return "gainedScoreHighToLow";
    } else if (sortBy === "gained_score" && sortOrder === "asc") {
      return "gainedScoreLowToHigh";
    } else if (sortBy === "missed_score" && sortOrder === "desc") {
      return "missedScoreHighToLow";
    } else if (sortBy === "missed_score" && sortOrder === "asc") {
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
      <Typography variant="bodySmall" sx={{ mb: 1 }} color="#6C8093">
        <Trans i18nKey="orderBy" />
      </Typography>
      <RadioGroup value={getSelectedValue()} onChange={handleSortChange}>
        <FormControlLabel
          value="gainedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("gainedScore")} ({t("highToLow")})
            </Typography>
          }
        />
        <FormControlLabel
          value="gainedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("gainedScore")} ({t("lowToHigh")})
            </Typography>
          }
        />
        <Divider sx={{ my: 1 }} />
        <FormControlLabel
          value="missedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("missedScore")} ({t("highToLow")})
            </Typography>
          }
        />
        <FormControlLabel
          value="missedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("missedScore")} ({t("lowToHigh")})
            </Typography>
          }
        />
      </RadioGroup>
    </Box>
  );
};
export default PopoverContent;

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
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
    } else if(sortBy === "weight" && sortOrder === "desc"){
      return "weight";

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
    } else if (value==="weight"){
      onSortChange("weight", "desc");

    }
  };

  return (
    <Box px={2} py={1}>
      <Typography variant="bodySmall" sx={{ mb: 1 }} color="#6C8093">
        <Trans i18nKey="orderBy" />
      </Typography>
      <RadioGroup value={getSelectedValue()} onChange={handleSortChange}>
        <FormControlLabel
          value="weight"
          control={<Radio sx={{ padding: "4px" }} />}
          label={<Typography variant="bodySmall">{t("impact")}</Typography>}
        />
        <Divider sx={{ my: 1 }} />

        <FormControlLabel
          value="gainedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("gainedScore")} ({t("ascending")})
            </Typography>
          }
        />
        <FormControlLabel
          value="gainedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("gainedScore")} ({t("descending")})
            </Typography>
          }
        />
        <Divider sx={{ my: 1 }} />
        <FormControlLabel
          value="missedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("missedScore")} ({t("ascending")})
            </Typography>
          }
        />
        <FormControlLabel
          value="missedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Typography variant="bodySmall">
              {t("missedScore")} ({t("descending")})
            </Typography>
          }
        />
      </RadioGroup>
    </Box>
  );
};
export default PopoverContent;

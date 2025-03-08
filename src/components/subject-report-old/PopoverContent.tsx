import React from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import { Trans } from "react-i18next";
import { t } from "i18next";

const PopoverContent = () => {
  return (
    <Box px={2} py={1}>
      <Typography variant="bodySmall" sx={{ mb: 1 }}>
        <Trans i18nKey="orderBy" />
      </Typography>
      <RadioGroup>
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
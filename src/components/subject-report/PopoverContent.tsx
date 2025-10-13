import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { Text } from "../common/Text";

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
      <Text variant="bodySmall" sx={{ mb: 1 }} color="background.onVariant">
        <Trans i18nKey="common.orderBy" />
      </Text>
      <RadioGroup value={getSelectedValue()} onChange={handleSortChange}>
        <FormControlLabel
          value="weight"
          control={<Radio sx={{ padding: "4px" }} />}
          label={<Text variant="bodySmall">{t("impact")}</Text>}
        />
        <Divider sx={{ my: 1 }} />

        <FormControlLabel
          value="gainedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Text variant="bodySmall">
              {t("subject.gainedScore")} ({t("common.ascending")})
            </Text>
          }
        />
        <FormControlLabel
          value="gainedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Text variant="bodySmall">
              {t("subject.gainedScore")} ({t("common.descending")})
            </Text>
          }
        />
        <Divider sx={{ my: 1 }} />
        <FormControlLabel
          value="missedScoreLowToHigh"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Text variant="bodySmall">
              {t("subject.missedScore")} ({t("common.ascending")})
            </Text>
          }
        />
        <FormControlLabel
          value="missedScoreHighToLow"
          control={<Radio sx={{ padding: "4px" }} />}
          label={
            <Text variant="bodySmall">
              {t("subject.missedScore")} ({t("common.descending")})
            </Text>
          }
        />
      </RadioGroup>
    </Box>
  );
};
export default PopoverContent;

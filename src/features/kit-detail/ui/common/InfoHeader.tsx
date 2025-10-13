import { Box } from "@mui/material";
import { styles } from "@styles";
import Chip from "@mui/material/Chip";
import { Text } from "@common/Text";

export const InfoHeader = ({
  title,
  translations,
  sectionName,
  questionLabel,
  weightLabel,
}: {
  title: string;
  translations: any;
  sectionName: string;
  questionLabel: string;
  weightLabel: string;
}) => {

  const ChipStyle = {
    ".MuiChip-label": {
      px: "12px",
      py: "4px",
    },
  };

  return (
    <Box sx={{ ...styles.centerV, justifyContent: "space-between", gap: 2 }}>
      <Box sx={{ ...styles.centerV, gap: 2 }}>
        <Chip
          sx={{
            ...ChipStyle,
            background: "#6680991f",
          }}
          label={
            <Text variant={"bodyMedium"} color={"background.secondaryDark"}>
              {sectionName}
            </Text>
          }
        />
        <Text variant={"bodyLarge"} color={"primary.main"}>
          {title}
        </Text>
        <Text variant={"bodyLarge"} color={"background.secondaryDark"}>
          {translations}
        </Text>
      </Box>
      <Box sx={{ ...styles.centerV, gap: 2 }}>
        <Chip
          sx={{
            ...ChipStyle,
            background: "#2466A80A",
          }}
          label={
            <Text variant={"bodyMedium"} color={"primary.main"}>
              {questionLabel}
            </Text>
          }
        />
        <Chip
          sx={{
            ...ChipStyle,
            background: "#2466A80A",
          }}
          label={
            <Text variant={"bodyMedium"} color={"primary.main"}>
              {weightLabel}
            </Text>
          }
        />
      </Box>
    </Box>
  );
};
import { Box } from "@mui/material";
import { styles } from "@styles";
import Chip from "@mui/material/Chip";
import { Text } from "@common/Text";

export const InfoHeader = ({
  title,
  translations,
  sectionName,
  firstTag,
  secondTag,
}: {
  title: string;
  translations: any;
  sectionName: string;
  firstTag: string;
  secondTag?: string;
}) => {
  const ChipStyle = {
    ".MuiChip-label": {
      px: "12px",
      py: "4px",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Chip
          sx={{
            ...ChipStyle,
            background: "#6680991f",
          }}
          label={
            <Text variant="semiBoldMedium" color={"background.secondaryDark"}>
              {sectionName}
            </Text>
          }
        />
        <Text variant="semiBoldXLarge" color={"primary.main"}>
          {title}
        </Text>
        <Text variant="semiBoldXLarge" color={"background.secondaryDark"}>
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
            <Text variant="semiBoldMedium" color={"primary.main"}>
              {firstTag}
            </Text>
          }
        />
        {secondTag && (
          <Chip
            sx={{
              ...ChipStyle,
              background: "#2466A80A",
            }}
            label={
              <Text variant="semiBoldMedium" color={"primary.main"}>
                {secondTag}
              </Text>
            }
          />
        )}
      </Box>
    </Box>
  );
};

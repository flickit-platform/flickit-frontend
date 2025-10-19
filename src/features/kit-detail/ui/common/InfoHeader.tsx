import { Box } from "@mui/material";
import { styles } from "@styles";
import Chip from "@mui/material/Chip";
import { Text } from "@common/Text";

const ChipStyle = {
  ".MuiChip-label": {
    px: "12px",
    py: "4px",
  },
};
export const InfoHeader = ({
  title,
  translations,
  sectionName,
  tags,
}: {
  title: string;
  translations: any;
  sectionName: string;
  tags?: string[];
}) => {
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
            bgcolor: "background.states.selected",
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
        {tags?.map((tag) => {
          return (
            <Chip
              sx={{
                ...ChipStyle,
                bgcolor: "primary.states.selected",
              }}
              label={
                <Text variant="semiBoldMedium" color={"primary.main"}>
                  {tag}
                </Text>
              }
            />
          );
        })}
      </Box>
    </Box>
  );
};

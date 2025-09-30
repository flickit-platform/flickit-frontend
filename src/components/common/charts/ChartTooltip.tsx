import { Box, useTheme } from "@mui/material";
import languageDetector from "@/utils/language-detector";
import { styles } from "@styles";
import { Text } from "../Text";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  getPrimary: (id: any) => string;
  getSecondary: (id: any) => string;
}

const ChartTooltip = ({
  active,
  payload,
  getPrimary,
  getSecondary,
}: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const primary = getPrimary(data);
  const secondary = getSecondary(data);
  const isFarsi = languageDetector(primary + secondary);
  const theme = useTheme();

  return (
    <Box
      bgcolor="rgba(97, 97, 97, 0.92)"
      color="background.containerLowest"
      p="4px 8px"
      borderRadius="4px"
      maxWidth="300px"
      boxShadow={theme.shadows[1]}
      sx={{ ...styles.rtlStyle(isFarsi) }}
    >
      {primary && (
        <Text
          variant="labelSmall"
          whiteSpace="pre-wrap"
          sx={{
            textAlign: isFarsi ? "right" : "left",
            whiteSpace: "pre-wrap",
          }}
          component="div"
        >
          {primary}
        </Text>
      )}
      {secondary && (
        <Text
          variant="labelSmall"
          whiteSpace="pre-wrap"
          mt={primary ? 0.5 : 0}
          sx={{
            textAlign: isFarsi ? "right" : "left",
          }}
        >
          {secondary}
        </Text>
      )}
    </Box>
  );
};

export default ChartTooltip;

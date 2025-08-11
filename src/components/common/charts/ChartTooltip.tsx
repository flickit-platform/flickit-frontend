import { Box, Typography, useTheme } from "@mui/material";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { styles } from "@styles";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  getPrimary: (id: any) => string;
  getSecondary: (id: any) => string;
}

const ChartTooltip = ({ active, payload, getPrimary, getSecondary }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const primary = getPrimary(data);
  const secondary = getSecondary(data);
  const isFarsi = languageDetector(primary + secondary);
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "rgba(97, 97, 97, 0.92)",
        color: theme.palette.background.containerLowest,
        p: "4px 8px",
        borderRadius: "4px",
        maxWidth: "300px",
        boxShadow: theme.shadows[1],
        ...styles.rtlStyle(isFarsi),
      }}
    >
      {primary && (
        <Typography
          variant="labelSmall"
          sx={{
            fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
            textAlign: isFarsi ? "right" : "left",
            whiteSpace: "pre-wrap",
          }}
          component="div"
        >
          {primary}
        </Typography>
      )}
      {secondary && (
        <Typography
          variant="labelSmall"
          sx={{
            mt: primary ? 0.5 : 0,
            fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
            textAlign: isFarsi ? "right" : "left",
            whiteSpace: "pre-wrap",
          }}
        >
          {secondary}
        </Typography>
      )}
    </Box>
  );
};

export default ChartTooltip;

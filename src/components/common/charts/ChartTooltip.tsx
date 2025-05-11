import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { Box, Typography } from "@mui/material";
import { styles } from "@styles";

const ChartTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    const text = data.description;
    const isFarsi = languageDetector(text);

    return (
      <Box
        sx={{
          backgroundColor: "rgba(97, 97, 97, 0.92)",
          color: "#fff",
          p: "4px 8px",
          borderRadius: "4px",
          maxWidth: "300px",
          margin: "2px",
          boxShadow: theme.shadows[1],
          ...styles.rtlStyle(isFarsi),
        }}
      >
        <Typography
          sx={{
            textAlign: isFarsi ? "right" : "left",
            whiteSpace: "pre-wrap",
            fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
          }}
          variant="labelSmall"
        >
          {text}
        </Typography>
      </Box>
    );
  }

  return null;
};

export default ChartTooltip;

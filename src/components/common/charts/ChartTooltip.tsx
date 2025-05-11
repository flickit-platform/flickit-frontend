import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { Box, Typography } from "@mui/material";

const ChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const text = data.description;
    const isFarsi = languageDetector(text);

    return (
      <Box
        sx={{
          backgroundColor: "#616161",
          color: "#fff",
          px: 1,
          py: 0.5,
          fontSize: 12,
          borderRadius: "4px",
          maxWidth: 250,
          direction: isFarsi ? "rtl" : "ltr",
          fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
          boxShadow: theme.shadows[1],
        }}
      >
        <Typography
          sx={{
            fontSize: "0.75rem",
            lineHeight: 1.4,
            textAlign: isFarsi ? "right" : "left",
            whiteSpace: "pre-wrap",
            fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
          }}
        >
          {text}
        </Typography>
      </Box>
    );
  }

  return null;
};

export default ChartTooltip;

import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { Box, Typography } from "@mui/material";
import { styles } from "@styles";

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
          borderRadius: "4px",
          maxWidth: 250,
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
          variant="semiBoldSmall"
        >
          {text}
        </Typography>
      </Box>
    );
  }

  return null;
};

export default ChartTooltip;

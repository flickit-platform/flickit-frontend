import React from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "@styles";
import { t } from "i18next";

const FlatGaugeComponent = ({
  levels,
  levelValue,
  lng,
  lightColors,
  darkColors,
  height = 50,
  position="H",
  guideText
}: Readonly<{
  levels: number;
  levelValue: number;
  lng?: string;
  lightColors: string[];
  darkColors: string[];
  height?: number;
  position?: "H" | "V";
  guideText: boolean;
}>) => {
  const order = [...Array(levels).keys()].reverse();
  const LEGEND_WIDTH = 150;
  console.log(levelValue,"levelValue")
  return (
    <Box
      width={LEGEND_WIDTH}
      sx={{
        ...styles[position === "V" ? "centerCH" : "centerH"],
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {guideText && <Typography
          variant="caption"
          color="success.dark"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(lng === "fa") }}
      >
        {t("common.best", { lng })}
      </Typography>}

      <Box sx={{display: "flex", justifyContent: "center"}} width={"100%"} borderRadius={0.5} overflow="hidden">
        {order.map((i) => (
          <Box
            key={i}
            width={"100%"}
            height={height - 20}
            bgcolor={lightColors[i]}
            boxShadow={`inset 0 0 0 1px ${darkColors[i]}20`}
          />
        ))}
      </Box>

      {guideText && <Typography
          variant="caption"
          color="error.main"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(lng === "fa") }}
      >
        {t("common.worst", { lng })}
      </Typography>}
    </Box>
  );
};

export default FlatGaugeComponent;

import React, {useMemo} from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "@styles";
import { t } from "i18next";


enum pos {
    horizontal = "horizontal",
    vertical = "vertical",
}

interface Props {
  levels: number;
  levelValue: number | null;
  lng?: string;
  lightColors: string[];
  darkColors: string[];
  position: "horizontal" | "vertical";
  guideText?: boolean;
  pointer?: boolean;
}
interface IArrow {
  position: string;
  markerColor: string;
}

const Arrow = (props: IArrow) => {
  const { position, markerColor } = props;
  return position === pos.horizontal ? (
    <Box
      sx={{
        width: 0,
        height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: `8px solid ${markerColor}`,
      }}
    />
  ) : (
    <Box
      sx={{
        width: 0,
        height: 0,
        borderTop: "6px solid transparent",
        borderBottom: "6px solid transparent",
        borderLeft: `8px solid ${markerColor}`,
      }}
    />
  );
};

const FlatGaugeComponent: React.FC<Props> = ({
  levels,
  levelValue,
  lng,
  lightColors,
  darkColors,
  position= pos.horizontal,
  pointer,
  guideText = false,
}) => {
  const LEGEND_WIDTH = position ===  pos.horizontal ? 150 : 30;

  const idx = levelValue
    ? Math.max(0, Math.min(levels - 1, levelValue - 1))
    : 0;
  const idxInverse = levels - 1 - idx;

  const segPct = 100 / levels;

  const ArrowDir = useMemo(()=>{
      if(position ===  pos.horizontal && lng == "fa"){
          return idxInverse
      }if(position ===  pos.horizontal && lng != "fa"){
          return idx
      }else {
         return  idxInverse
      }
  },[lng,position,levelValue])


  const activeIdx = ArrowDir;
  const centerPct = (activeIdx + 0.5) * segPct;

  const markerColor = darkColors[idx] ?? "#000";

  const order = [...Array(levels).keys()];

  return (
    <Box
      width={LEGEND_WIDTH}
      sx={{
        ...styles[position ===  pos.vertical ? "centerCH" : "centerH"],
        userSelect: "none",
        pointerEvents: "none",
        direction: lng === "fa" ? "rtl" : "ltr",
      }}
    >
      {guideText && (
        <Typography
          variant="caption"
          color="success.dark"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(lng === "fa") }}
        >
          {t("common.best", { lng })}
        </Typography>
      )}

      <Box sx={{ position: "relative", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: position ===  pos.horizontal ? "row" : "column-reverse",
            borderRadius: 0.5,
            overflow: "hidden",
            width: "100%",
          }}
        >
          {order.map((i) => (
            <Box
              key={i}
              width={position === pos.horizontal ? `${100 / levels}%` : "100%"}
              height={25}
              bgcolor={lightColors[i]}
              boxShadow={`inset 0 0 0 1px ${darkColors[i]}20`}
            />
          ))}
        </Box>

        {pointer && levelValue && (
          <Box
            sx={{
              position: "absolute",
              ...(position ===  pos.horizontal
                ? {
                    left: `${centerPct}%`,
                    top: -10,
                    transform: "translateX(-50%)",
                  }
                : {
                    top: `${centerPct}%`,
                    left: -10,
                    transform: "translateY(-50%)",
                  }),
            }}
          >
            <Arrow position={position} markerColor={markerColor} />
          </Box>
        )}
      </Box>

      {guideText && (
        <Typography
          variant="caption"
          color="error.main"
          mt={0.5}
          fontWeight={600}
          sx={{ ...styles.rtlStyle(lng === "fa") }}
        >
          {t("common.worst", { lng })}
        </Typography>
      )}
    </Box>
  );
};

export default FlatGaugeComponent;

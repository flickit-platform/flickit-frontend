import { keyframes, SxProps, Theme } from "@mui/material";
import { TStatus } from "@types";
import hasStatus from "@utils/hasStatus";
import tinycolor from "tinycolor2";
import { farsiFontFamily, primaryFontFamily } from "./theme";

const style = (style: SxProps<Theme>): SxProps<Theme> => style;

const commonStyles = {
  customizeFarsiFont: style({
    direction: true ? "rtl" : "ltr",
    fontFamily: true ? farsiFontFamily : primaryFontFamily,
    textAlign: true ? "right" : "left",
  }),
  centerVH: style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  centerV: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
  centerH: style({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  }),
  centerCVH: style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }),
  centerCV: style({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  }),
  centerCH: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
  formGrid: style({
    marginTop: (theme) => `${theme.spacing(2)}`,
  }),
  activeNavbarLink: style({
    "&.active": {
      color: (theme) => theme.palette.primary.dark,
    },
  }),
  circularProgressBackgroundStroke: style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [`& .MuiCircularProgress-circle`]: {
      strokeLinecap: "round",
    },
    boxShadow: "0 0 4px #bbb7b7 inset",
    borderRadius: "100%",
  }),
  ellipsis: style({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
};

const cards = {
  auth: style({
    ...commonStyles.centerCH,
    px: { xs: 2, sm: 4 },
    py: { xs: 3, sm: 4 },
    flex: 1,
    m: 1,
    maxWidth: "460px",
  }),
};

const auth = {
  authLayout: style({
    background: (theme) =>
      `radial-gradient(${theme.palette.background.secondary},${theme.palette.background.secondaryDark})`,
    minHeight: "100vh",
    ...commonStyles.centerCH,
  }),
};

const buttons = {
  compareButton: style({
    position: { xs: "fixed", md: "absolute" },
    borderRadius: { xs: 0, sm: "100%" },
    transform: {
      xs: "translate(0,0)",
      md: "translate(50%,calc(50% + 24px))",
    },
    right: { xs: 0, sm: "26px", md: "50%" },
    bottom: { xs: 0, sm: "26px", md: "50%" },
    width: { xs: "100%", sm: "96px" },
    height: { xs: "40px", sm: "96px" },
    zIndex: 2,
  }),
  compareButtonBg: style({
    position: { xs: "fixed", md: "absolute" },
    borderRadius: { xs: 0, sm: "100%" },
    right: { xs: 0, sm: "19px", md: "50%" },
    bottom: { xs: 0, sm: "19px", md: "50%" },
    background: "white",
    transform: {
      xs: "translate(0,0)",
      md: "translate(50%,calc(50% + 24px))",
    },
    width: { xs: "100%", sm: "110px" },
    height: { xs: "46px", sm: "110px" },
    zIndex: 1,
  }),
};

const compare = {
  compareResultBorder: style({
    "&:not(:last-of-type) > div": {
      borderRight: { md: "1px solid #e7e7e7", sm: "transparent" },
      borderBottom: { md: "transparent", sm: "", xs: "1px solid #e7e7e7" },
    },
  }),
};

export const styles = {
  ...commonStyles,
  ...auth,
  ...buttons,
  ...compare,
  cards,
};

export const statusColorMap: Record<NonNullable<TStatus>, string> = {
  WEAK: "#da7930",
  RISKY: "#da7930",
  NORMAL: "#faee56",
  GOOD: "#60a349",
  OPTIMIZED: "#107e3e",
  ELEMENTARY: "#ab2317",
  MODERATE: "#faee56",
  GREAT: "#ceb04e",

  "Not Calculated": "#b7b7b7",
};

export const C1 = "#B71515";
export const C2 = "#D73027";
export const C3 = "#F46D43";
export const C4 = "#FFBC00";
export const C5 = "#E9D60C";
export const C6 = "#BCC20A";
export const C7 = "#99CB34";
export const C8 = "#4FB34C";
export const C9 = "#168345";
export const C10 = "#0A5C25";

export const C1BG = "#B7151533";
export const C2BG = "#D7302733";
export const C3BG = "#F46D4333";
export const C4BG = "#FFBC0033";
export const C5BG = "#E9D60C33";
export const C6BG = "#BCC20A33";
export const C7BG = "#99CB3433";
export const C8BG = "#4FB34C33";
export const C9BG = "#16834533";
export const C10BG = "#0A5C2533";

export const maturityLevelColorMap: any = {
  ML2: [C1, C10],
  ML3: [C1, C6, C10],
  ML4: [C1, C5, C7, C10],
  ML5: [C1, C4, C6, C8, C10],
  ML6: [C1, C3, C5, C7, C8, C10],
  ML7: [C1, C2, C4, C6, C7, C8, C10],
  ML8: [C1, C2, C4, C5, C7, C8, C9, C10],
  ML9: [C1, C2, C3, C4, C6, C7, C8, C9, C10],
  ML10: [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10],
};
export const getMaturityLevelColors = (maturity_level_number: number) => {
  switch (maturity_level_number) {
    case 2:
      return maturityLevelColorMap.ML2;
    case 3:
      return maturityLevelColorMap.ML3;
    case 4:
      return maturityLevelColorMap.ML4;
    case 5:
      return maturityLevelColorMap.ML5;
    case 6:
      return maturityLevelColorMap.ML6;
    case 7:
      return maturityLevelColorMap.ML7;
    case 8:
      return maturityLevelColorMap.ML8;
    case 9:
      return maturityLevelColorMap.ML9;
    case 10:
      return maturityLevelColorMap.ML10;
  }
};

export const generateColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // DJB2 hash function
  }
  // Select a chip based on hash
  const chipIndex = (Math.abs(hash) % Object.keys(chipColorPalette).length) + 1;
  return chipColorPalette[`chip${chipIndex}`];
};

export const getTransparentColor = (color: string) => {
  const transparentColor =
    tinycolor(color).getBrightness() > 180
      ? tinycolor(color).lighten(35).toRgbString()
      : tinycolor(color).getBrightness() > 160
        ? tinycolor(color).lighten(40).toRgbString()
        : tinycolor(color).getBrightness() > 80
          ? tinycolor(color).lighten(50).toRgbString()
          : tinycolor(color).lighten(60).toRgbString();
  return transparentColor;
};

export const chipColorPalette: any = {
  chip1: {
    backgroundColor: "rgba(25, 229, 220, 0.1)",
    color: "rgba(0, 153, 145, 1)",
  },
  chip2: {
    backgroundColor: "rgba(0, 153, 0, 0.1)",
    color: "rgba(0, 153, 0, 1)",
  },
  chip3: {
    backgroundColor: "rgba(0, 102, 42, 0.1)",
    color: "rgba(0, 102, 43, 1)",
  },
  chip4: {
    backgroundColor: "rgba(0, 26, 51, 0.1)",
    color: "rgba(0, 26, 51, 1)",
  },
  chip5: {
    backgroundColor: "rgba(204, 0, 68, 0.1)",
    color: "rgba(204, 0, 68, 1)",
  },
  chip6: {
    backgroundColor: "rgba(255, 157, 0, 0.1)",
    color: "rgba(255, 157, 0, 1)",
  },
  chip7: {
    backgroundColor: "rgba(0, 102, 204, 0.1)",
    color: "rgba(0, 102, 204, 1)",
  },
  chip8: {
    backgroundColor: "rgba(167, 204, 0, 0.1)",
    color: "rgba(112, 153, 0, 1)",
  },
  chip9: {
    backgroundColor: "rgba(136, 0, 204, 0.1)",
    color: "rgba(102, 0, 153, 1)",
  },
  chip10: {
    backgroundColor: "rgba(0, 102, 153, 0.1)",
    color: "rgba(0, 102, 153, 1)",
  },
  chip11: {
    backgroundColor: "rgba(184, 20, 167, 0.1)",
    color: "rgba(184, 20, 167, 1)",
  },
  chip12: {
    backgroundColor: "rgba(20, 184, 129, 0.1)",
    color: "rgba(20, 184, 129, 1)",
  },
  chip13: {
    backgroundColor: "rgba(153, 94, 0, 0.1)",
    color: "rgba(153, 94, 0, 1)",
  },
};

export const getColorOfStatus = (
  status: TStatus,
  fallBackColor: string = "#b7b7b7",
) => {
  if (hasStatus(status)) {
    return statusColorMap[status as NonNullable<TStatus>];
  }
  return fallBackColor;
};

const pomp = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;
const noPomp = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

export const animations = {
  pomp,
  noPomp,
};

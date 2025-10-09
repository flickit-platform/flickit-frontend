import { keyframes, SxProps, Theme } from "@mui/material/styles";
import { farsiFontFamily, primaryFontFamily } from "./theme";
import i18next from "i18next";
import { v3Tokens } from "./tokens";

const style = (style: SxProps<Theme>): SxProps<Theme> => style;

const commonStyles = {
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
      color: v3Tokens.surface.containerLowest,
    },
    "&.active::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      height: "2px",
      backgroundColor: v3Tokens.surface.containerLowest,
      borderRadius: 1,
    },
  }),
  ellipsis: style({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  rtlStyle: (isRTL = true) => ({
    direction: isRTL ? "rtl" : "ltr",
    fontFamily: isRTL ? farsiFontFamily : primaryFontFamily,
    letterSpacing: isRTL ? 0 : "inherit",
  }),
  iconDirectionStyle: (lng?: string) => {
    const isCurrentLang = lng === i18next.language.toLowerCase();
    return {
      marginInlineStart: isCurrentLang ? "initial" : -1,
      marginInlineEnd: isCurrentLang ? "initial" : 1,
    };
  },
};

const sharedChipStyles = {
  chip: {
    fontWeight: 200,
    border: `1px solid rgba(36, 102, 168, 0.5)`,
    borderRadius: "8px",
    gap: "4px",
  },
};

const auth = {
  authLayout: style({
    background: "radial-gradient(#F3F5F6, #2B333B)",
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
    height: { xs: "46px", sm: "100px" },
    zIndex: 1,
  }),
  fixedIconButtonStyle: style({
    width: "2rem",
    height: "2rem",
    flexShrink: 0,
  }),
};

const box = {
  shadowStyle: style({
    background: v3Tokens.surface.containerLowest,
    borderRadius: "12px",
    width: "100%",
    backgroundColor: v3Tokens.surface.containerLowest,
    boxShadow: "0 0 8px 0 #0A234240",
    mb: { xs: "10px", sm: "40px" },
  }),
  boxStyle: style({
    background: v3Tokens.surface.containerLowest,
    borderRadius: "12px",
    width: "100%",
    backgroundColor: v3Tokens.surface.containerLowest,
    boxShadow: "0 0 8px 0 #0A234240",
    mb: { xs: "10px", sm: "40px" },
    p: { xs: 3, sm: 4 },
  }),
};

const carouselStyle = {
  carousel: style({
    position: "relative",
    width: "100%",
    overflow: "hidden",
    cursor: "pointer",
  }),
  carouselInner: style({
    display: "flex",
    width: "100%",
    height: "100%",
    transition: "transform 0.5s ease-in-out",
  }),
  carouselImage: style({
    width: "100%",
    height: "100%",
    objectFit: "fill",
    flexShrink: 0,
  }),
  arrow: style({
    position: "absolute",
    top: { xs: "20%", sm: "40%" },
    transform: "translateY(-50%)",
    fontSize: { xs: "8px", sm: "24px" },
    backgroundColor: "transparent",
    border: "none",
    padding: { xs: 0.2, sm: 1.5 },
    cursor: "pointer",
    zIndex: 2,
    borderRadius: "50%",
  }),

  arrowLeft: style({
    left: { xs: "8px", sm: "15px" },
    transform: "rotate(90deg)",
  }),

  arrowRight: style({
    right: { xs: "8px", sm: "15px" },
    transform: "rotate(-90deg)",
  }),

  dots: style({
    display: { xs: "none", sm: "flex" },

    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    gap: { xs: "6px", sm: "10px" },
    zIndex: 3,
  }),

  dot: style({
    width: { xs: "4px", sm: "16px" },
    height: { xs: "4px", sm: "16px" },
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.3s ease",
    opacity: 0.7,
  }),

  dotActive: style({
    width: { xs: "10px", sm: "32px" },
    height: { xs: "5px", sm: "16px" },
    borderRadius: "20px",
    transform: "scale(1.3)",
    opacity: 1,
  }),
};

export const styles = {
  ...commonStyles,
  ...buttons,
  ...sharedChipStyles,
  ...box,
  ...carouselStyle,
};

export const chipColorPalette: any = {
  chip1: {
    backgroundColor: "rgba(221, 239, 239, 1)",
    color: "rgba(0, 153, 145, 1)",
  },
  chip2: {
    backgroundColor: "rgba(218, 230, 220, 1)",
    color: "rgba(0, 153, 0, 1)",
  },
  chip3: {
    backgroundColor: "rgba(215, 225, 222, 1)",
    color: "rgba(0, 102, 43, 1)",
  },
  chip4: {
    backgroundColor: "rgba(212, 217, 223, 1)",
    color: "rgba(0, 26, 51, 1)",
  },
  chip5: {
    backgroundColor: "rgba(235, 218, 224, 1)",
    color: "rgba(204, 0, 68, 1)",
  },
  chip6: {
    backgroundColor: "rgba(238, 231, 221, 1)",
    color: "rgba(255, 157, 0, 1)",
  },
  chip7: {
    backgroundColor: "rgba(215, 225, 238, 1)",
    color: "rgba(0, 102, 204, 1)",
  },
  chip8: {
    backgroundColor: "rgba(230, 235, 222, 1)",
    color: "rgba(112, 153, 0, 1)",
  },
  chip9: {
    backgroundColor: "rgba(227, 217, 238, 1)",
    color: "rgba(102, 0, 153, 1)",
  },
  chip10: {
    backgroundColor: "rgba(215, 225, 233, 1)",
    color: "rgba(0, 102, 153, 1)",
  },
  chip11: {
    backgroundColor: "rgba(232, 219, 234, 1)",
    color: "rgba(184, 20, 167, 1)",
  },
  chip12: {
    backgroundColor: "rgba(218, 233, 230, 1)",
    color: "rgba(20, 184, 129, 1)",
  },
  chip13: {
    backgroundColor: "rgba(228, 224, 220, 1)",
    color: "rgba(153, 94, 0, 1)",
  },
};

export const generateColorFromString = (
  str: string,
  palette: Record<
    string,
    { backgroundColor: string; color: string }
  > = chipColorPalette,
) => {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const keys = Object.keys(palette);
  const chipIndex = Math.abs(hash) % keys.length;

  return palette[keys[chipIndex]];
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

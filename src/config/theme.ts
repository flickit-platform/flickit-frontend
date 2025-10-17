import { createTheme } from "@mui/material/styles";
import { v3Tokens } from "./tokens";
import { gray, grayBlue, orange } from "./colors";
const fontSize = ["12px", "14px", "14px", "16px", "16px"];
export const primaryFontFamily = "OpenSans";
export const farsiFontFamily = "'Sahel','Arial','sans-serif'";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    secondary?: string;
    secondaryDark?: string;
    variant: string;
    onVariant: string;
    inverse: string;
    onInverse: string;
    containerLowest: string;
    containerLow: string;
    container: string;
    containerHigh: string;
    containerHighest: string;
  }
  interface PaletteOptions {
    grayBlue?: any;
    gray?: any;
    disabled?: { main: string; on: string };
    outline?: { outline: string; variant: string };
    semantics?: Record<string, any>;
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
    tertiary: PaletteColorOptions;
  }
}

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}
declare module "@mui/material/styles" {
  interface TypographyVariants {
    headlineSmall: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    displaySmall: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displayLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleLarge: React.CSSProperties;
    bodySmall: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    labelSmall: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelLarge: React.CSSProperties;
    labelCondensed: React.CSSProperties;
    subSmall: React.CSSProperties;
    subMedium: React.CSSProperties;
    subLarge: React.CSSProperties;
    semiBoldXLarge: React.CSSProperties;
    semiBoldLarge: React.CSSProperties;
    semiBoldMedium: React.CSSProperties;
    semiBoldSmall: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headlineSmall?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displayLarge?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
    labelCondensed?: React.CSSProperties;
    subSmall?: React.CSSProperties;
    subMedium?: React.CSSProperties;
    subLarge?: React.CSSProperties;
    semiBoldXLarge?: React.CSSProperties;
    semiBoldLarge?: React.CSSProperties;
    semiBoldMedium?: React.CSSProperties;
    semiBoldSmall?: React.CSSProperties;
  }

  interface Palette {
    grayBlue: any;
    gray: any;
    disabled?: { main: string; on: string };
    outline?: { outline: string; variant: string };
    semantics?: Record<string, any>;
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
    tertiary: PaletteColorOptions;
  }

  interface PaletteColor {
    states: {
      base: string;
      hover: string;
      selected: string;
      focus: string;
      focusVisible: string;
      outlineBorder: string;
    };
    bgVariant: string;
    bg: string;
  }
  interface PaletteColorOptions {
    main: string;
    dark?: string;
    light: string;
    contrastText: string;
    bgVariant?: string;
    bg?: string;
    states?: {
      hover: string;
      selected: string;
      focus: string;
      focusVisible: string;
      outlineBorder: string;
    };
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    headlineSmall?: true;
    headlineMedium?: true;
    headlineLarge?: true;
    displaySmall?: true;
    displayMedium?: true;
    displayLarge?: true;
    titleSmall?: true;
    titleMedium?: true;
    titleLarge?: true;
    bodySmall?: true;
    bodyMedium?: true;
    bodyLarge?: true;
    labelSmall?: true;
    labelMedium?: true;
    labelLarge?: true;
    labelCondensed?: true;
    subSmall?: true;
    subMedium?: true;
    subLarge?: true;
    semiBoldXLarge?: true;
    semiBoldLarge?: true;
    semiBoldMedium?: true;
    semiBoldSmall?: true;
  }
}

const makeStates = (base: string) => {
  const bg = v3Tokens.surface.containerLowest;
  return {
    hover: base + "0A",
    selected: base + "14",
    focus: base + "1F",
    focusVisible: base + "4D",
    outlineBorder: base + "80",
  };
};

export const getTheme = (lang: any) => {
  const is_farsi = lang === "fa";
  return createTheme({
    direction: is_farsi ? "rtl" : "ltr",
    palette: {
      ml: { primary: "#6035A1" },
      cl: { primary: "#3596A1" },
      primary: {
        main: v3Tokens.primary.main,
        dark: v3Tokens.primary.dark,
        light: v3Tokens.primary.light,
        contrastText: v3Tokens.primary.on,
        bgVariant: v3Tokens.primary.bgVar,
        bg: v3Tokens.primary.bg,
        states: makeStates(v3Tokens.primary.main),
      },
      secondary: {
        main: v3Tokens.secondary.main,
        dark: v3Tokens.secondary.dark,
        light: v3Tokens.secondary.light,
        contrastText: v3Tokens.secondary.on,
        bgVariant: v3Tokens.secondary.bgVar,
        bg: v3Tokens.secondary.bg,
        states: makeStates(v3Tokens.secondary.main),
      },
      tertiary: {
        main: v3Tokens.tertiary.main,
        dark: v3Tokens.tertiary.dark,
        light: v3Tokens.tertiary.light,
        contrastText: v3Tokens.tertiary.on,
        bgVariant: v3Tokens.tertiary.bgVar,
        bg: v3Tokens.tertiary.bg,
        states: makeStates(v3Tokens.tertiary.main),
      },
      error: {
        main: v3Tokens.error.main,
        dark: v3Tokens.error.dark,
        light: v3Tokens.error.light,
        contrastText: v3Tokens.error.on,
        bgVariant: v3Tokens.error.bgVar,
        bg: v3Tokens.error.bg,
        states: makeStates(v3Tokens.error.main),
      },
      success: {
        main: v3Tokens.success.main,
        dark: v3Tokens.success.dark,
        light: v3Tokens.success.light,
        contrastText: v3Tokens.success.on,
        bgVariant: v3Tokens.success.bgVar,
        bg: v3Tokens.success.bg,
        states: makeStates(v3Tokens.success.main),
      },
      warning: {
        main: orange[40],
        light: orange[95],
        contrastText: orange[100],
        states: makeStates(orange[40]),
      },
      info: {
        main: grayBlue[50],
        light: v3Tokens.surface.surface,
        contrastText: grayBlue[100],
        states: makeStates(grayBlue[50]),
      },

      background: {
        default: v3Tokens.surface.surface,
        paper: v3Tokens.surface.containerLowest,
        secondary: v3Tokens.primary.bg,
        secondaryDark: grayBlue[20],
        variant: v3Tokens.surface.variant,
        onVariant: v3Tokens.surface.onVariant,
        inverse: v3Tokens.surface.inverse,
        onInverse: v3Tokens.surface.onInverse,
        containerLowest: v3Tokens.surface.containerLowest,
        containerLow: v3Tokens.surface.containerLow,
        container: v3Tokens.surface.container,
        containerHigh: v3Tokens.surface.containerHigh,
        containerHighest: v3Tokens.surface.containerHighest,
      },

      text: { primary: v3Tokens.surface.on, secondary: grayBlue[50] },

      disabled: { main: gray[40], on: gray[60] },
      outline: {
        outline: v3Tokens.outline.outline,
        variant: v3Tokens.outline.variant,
      },
      semantics: v3Tokens.semantics,
      grayBlue,
      gray,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1620,
        xxl: 1900,
      },
    },
    typography: {
      fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
      subSmall: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 500,
        letterSpacing: is_farsi ? "0px" : "0.09em",
        textTransform: "none",
        color: "GrayText",
      },
      subMedium: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 500,
        letterSpacing: is_farsi ? "0px" : "0.09em",
        color: "GrayText",
      },
      subLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 500,
        letterSpacing: is_farsi ? "0px" : "0.09em",
        color: "GrayText",
      },
      headlineSmall: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "bold",
        fontSize: "1.5rem",
        letterSpacing: is_farsi ? "0px" : "-3%",
      },
      headlineMedium: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "bold",
        fontSize: "2rem",
        letterSpacing: is_farsi ? "0px" : "0",
      },
      headlineLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "bold",
        fontSize: "2.5rem",
        letterSpacing: is_farsi ? "0px" : "0",
      },
      displaySmall: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontSize: "1rem",
        fontWeight: "normal",
        letterSpacing: is_farsi ? "0px" : "0",
      },
      displayMedium: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontSize: "1.75rem",
        fontWeight: "bold",
        letterSpacing: is_farsi ? "0px" : "0",
      },
      displayLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontSize: "4rem",
        fontWeight: "bold",
        letterSpacing: is_farsi ? "0px" : "0",
      },
      titleSmall: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "bold",
        fontSize: "1rem",
        letterSpacing: is_farsi ? "0px" : ".1px",
      },
      titleMedium: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "bold",
        fontSize: "1rem",
        letterSpacing: is_farsi ? "0px" : ".15px",
      },
      titleLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "bold",
        fontSize: "1.375rem",
        letterSpacing: is_farsi ? "0px" : "0",
      },
      bodySmall: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "400",
        fontSize: "13px",
        letterSpacing: is_farsi ? "0px" : "0.4px",
      },
      bodyMedium: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 400,
        fontSize: "16px",
        letterSpacing: is_farsi ? "0px" : "0.25px",
      },
      bodyLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 400,
        fontSize: "18px",
        letterSpacing: is_farsi ? "0px" : "0.5px",
      },
      labelSmall: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "400",
        fontSize: "11px",
        letterSpacing: "0px",
      },
      labelMedium: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 500,
        fontSize: "13px",
        letterSpacing: is_farsi ? "0px" : "0.5px",
      },
      labelLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: "bold",
        fontSize: "15px",
        letterSpacing: is_farsi ? "0px" : "0.1px",
      },
      labelCondensed: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 500,
        fontSize: "12px",
        letterSpacing: "0.5px",
      },
      semiBoldSmall: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 400,
        fontSize: "13px",
        letterSpacing: is_farsi ? "0px" : "0.5px",
      },
      semiBoldMedium: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 400,
        fontSize: "16px",
        letterSpacing: is_farsi ? "0px" : "0.1px",
      },
      semiBoldLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 400,
        fontSize: "18px",
        letterSpacing: is_farsi ? "0px" : "0.15px",
      },
      semiBoldXLarge: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        fontWeight: 400,
        fontSize: "1.375rem",
        letterSpacing: "0px",
      },
      button: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        letterSpacing: is_farsi ? "0px" : ".05em",
      },
      h3: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
      },
      h4: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        opacity: 0.9,
      },
      h5: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        opacity: 0.85,
      },
      h6: {
        fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
        opacity: 0.85,
      },
    },
    components: {
      MuiBackdrop: {
        styleOverrides: {
          root: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1299,
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            paperContainer: {
              backgroundColor: v3Tokens.surface.containerLowest,
              borderRadius: "8px",
              padding: "16px",
            },
          },
        },
      },

      MuiCssBaseline: {
        styleOverrides: `
        .top-nav-bar-ZwZd20 {
          display: none !important
        }
        html {
          scroll-behavior: smooth;
          font-display: swap;
          font-size: ${fontSize[4]};
        }
        @media (max-width: 1600px) {
          html {
            font-size: ${fontSize[3]};
          }
        }
        @media (max-width: 1280px) {
          html {
            font-size: ${fontSize[2]};
          }
        }
        @media (max-width: 960px) {
          html {
            font-size: ${fontSize[1]};
          }
        }
        @media (max-width: 600px) {
          html {
            font-size: ${fontSize[0]};
          }
          .css-1wscs19 {
            width: 340px !important
          }
        }
        body {
          background: #EDEFF1;
          direction:${is_farsi ? "rtl" : "ltr"};
        }
        .nc-footer {
          display: none;
        }
        .nc-layout-wrapper {
          background: ${v3Tokens.surface.surface};
          padding: 0;
        }
        .nc-header {
          font-family: ${is_farsi ? farsiFontFamily : primaryFontFamily};
          direction:${is_farsi ? "rtl" : "ltr"};
          background: ${v3Tokens.surface.containerHighest};
          border-radius: 7px 7px 0px 0px;
          box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);
        }
        .nc-header-title {
          font-family: ${is_farsi ? farsiFontFamily : primaryFontFamily};
        }
        .nc-header-mark-as-read {
          font-family: ${is_farsi ? farsiFontFamily : primaryFontFamily};
        }
        .mantine-1avyp1d {
          stroke: rgba(0, 54, 92, 1);
        }
        .mantine-1dbkl0m {
          background: ${v3Tokens.secondary.main};
          width: 20px
        }
        ::-webkit-scrollbar {
          width: 15px;
          height: 12px; 
        }

        ::-webkit-scrollbar-track {
          background: #f0f0f0;
        }

        ::-webkit-scrollbar-thumb {
          background-color: rgba(136, 136, 136, 0.58); 
          border-radius: 6px; 
          border: 3px solid #f0f0f0;
          min-height: 100px
        }

        ::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }

        scrollbar-width: thin; 
        scrollbar-color: #888 #f0f0f0;

      `,
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: "8px",
            background: grayBlue[96],
          },
        },
      },
      MuiDialogTitle: {
        defaultProps: {
          bgcolor: "primary.main",
          color: "primary.contrastText",
          fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
          marginBottom: "8px",
        },
        styleOverrides: {
          root: {
            opacity: "1",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            "& > :not(:first-of-type)": {
              marginLeft: is_farsi ? "-24px" : "8px",
            },
          },
        },
      },
      MuiButtonGroup: {
        defaultProps: {
          color: "primary",
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
          startIcon: {
            marginRight: is_farsi ? "-2px !important" : "8px !important",
            marginLeft: !is_farsi ? "-2px !important" : "8px !important",
          },
          endIcon: {
            marginRight: !is_farsi ? "-2px !important" : "8px !important",
            marginLeft: is_farsi ? "-2px !important" : "8px !important",
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            subSmall: "h6",
            subMedium: "h6",
            subLarge: "h6",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
            overflow: "auto",
            padding: "0px 8px",
            borderBottom: "1px solid #d3d3d3",
          },
          indicator: {
            backgroundColor: "secondary.main",
            borderRadius: 1,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: "40px",
            transition: "background-color .1s ease, color .1s ease",
            color: "rgba(0, 0, 0, 0.6)", // Default text color
            "&.Mui-selected": {
              color: "secondary.main",
              fontWeight: "bold",
            },
            "&.MuiTabs-indicator": {
              backgroundColor: "primary.main",
            },
          },
        },
      },

      MuiFormLabel: {
        styleOverrides: {
          root: {
            "&.MuiInputLabel-root": {
              textAlign: "right",
              left: !is_farsi ? "unset" : "0",
              right: is_farsi ? "0" : "unset",
              transform: !is_farsi
                ? "translate(16px, 9px) scale(1)"
                : "translate(-6px, 9px) scale(1)",
              "&.Mui-focused, &.MuiInputLabel-shrink": {
                transform: !is_farsi
                  ? "translate(12px, -9px) scale(0.71)"
                  : "translate(-12px, -9px) scale(0.71)",
                transformOrigin: !is_farsi ? "top left" : "top right",
              },
              maxWidth: "fit-content",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            ".MuiChip-label": {
              unicodeBidi: "plaintext",
            },
            ".MuiChip-deleteIcon": {
              marginLeft: is_farsi ? "4px" : "-4px",
              marginRight: is_farsi ? "-4px" : "4px",
            },
            ".MuiChip-icon": {
              marginLeft: is_farsi ? "-10px" : "0",
              marginRight: is_farsi ? "0" : "-10px",
            },
          },
        },
      },

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            textAlign: is_farsi ? "right" : "left",
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            textAlign: is_farsi ? "right" : "left",
            left: 0,
            right: 0,
          },
          root: {
            "& .MuiAutocomplete-endAdornment": {
              left: is_farsi ? "9px !important" : "unset !important",
              right: !is_farsi ? "9px !important" : "unset !important",
            },
          },
        },
      },

      MuiInputAdornment: {
        styleOverrides: {
          root: {
            marginRight: is_farsi ? "8px" : "unset",
            marginLeft: is_farsi ? "unset" : "8px",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            textAlign: is_farsi ? "right" : "left",
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          avatar: {
            marginRight: !is_farsi ? "16px" : "unset",
            marginLeft: is_farsi ? "16px" : "unset",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          action: {
            marginLeft: !is_farsi ? "auto" : "-8px",
            marginRight: is_farsi ? "auto" : "-8px",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontFamily: "Sahel !important",
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            textAlign: is_farsi ? "right" : "left",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: v3Tokens.surface.containerLowest,
            backgroundColor: "#576675E6",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          inputRoot: {
            paddingRight: !is_farsi ? "42px !important" : "8px !important",
            paddingLeft: is_farsi ? "42px !important" : "8px !important",
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginLeft: "-10px",
            marginRight: "-10px",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            right: !is_farsi ? "7px" : "unset",
            left: is_farsi ? "7px" : "unset",
          },
          select: {
            paddingLeft: is_farsi ? "32px" : "10px",
            paddingRight: !is_farsi ? "32px !important" : "10px !important",
            display: "flex",
            alignItems: "center",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            fontSize: "16px",
          },
          root: {
            fontSize: "16px",
          },
        },
      },

      MuiSlider: {
        styleOverrides: {
          valueLabel: {
            fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
          },
          thumb: {
            height: "13px !important",
            width: "16px !important",
            borderRadius: "2px",
            zIndex: 3,
          },
        },
      },
      //@ts-expect-error
      MuiTabPanel: {
        styleOverrides: {
          root: {
            padding: "4px 2px",
          },
        },
      },
    },
    customStyles: {
      borderLine: {
        border: "1px solid primary.bgVariant",
      },
    },
  });
};

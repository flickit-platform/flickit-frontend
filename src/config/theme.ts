import createPalette from "@mui/material/styles/createPalette";
import { createTheme } from "@mui/material/styles";
const fontSize = ["12px", "14px", "14px", "16px", "16px"];
export const primaryFontFamily = "NotoSans";
export const secondaryFontFamily = "OpenSans";
export const farsiFontFamily = "'Sahel','Arial','sans-serif'";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    secondary: string;
    secondaryDark: string;
  }
  interface PaletteOptions {
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
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
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
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

const palette = createPalette({
  primary: {
    main: "#2466A8",
    contrastText: "#FFFFFF",
    light: "#EDF3F8",
    dark: "#1B4D7E",
  },
  secondary: {
    main: "#B8144B",
    contrastText: "#FFFFFF",
    light: "#E51A5E",
    dark: "#8A0F38",
  },
  background: { secondary: "#EDF4FC", secondaryDark: "#121d33" },
  ml: { primary: "#6035A1" },
  cl: { primary: "#3596A1" },
  error: {
    main: "#8A0F24",
    contrastText: "#FAD1D8",
    dark: "#5C0A18",
    light: "#F6ECED",
  },
  success: {
    main: "#3D8F3D",
    contrastText: "#fff",
    dark: "#2E6B2E",
    light: "#EFF6EF",
  },
  info: {
    main: "#6C8093",
    contrastText: "#fff",
    dark: "#6C8093",
    light: "#F3F5F6",
  },
  warning: { main: "#CC7400", contrastText: "#fff", light: "#F4E7D7" },
});
const is_farsi = Boolean(localStorage.getItem("lang") === "fa");
export const theme = createTheme({
  direction: is_farsi ? "rtl" : "ltr",
  palette,
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
      lineHeight: 1.57,
      letterSpacing: is_farsi ? "0px" : "0.09em",
      textTransform: "none",
      color: "GrayText",
    },
    subMedium: {
      fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: is_farsi ? "0px" : "0.09em",
      color: "GrayText",
    },
    subLarge: {
      fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: is_farsi ? "0px" : "0.09em",
      color: "GrayText",
    },
    headlineSmall: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "bold",
      fontSize: "1.5rem",
      lineHeight: "2rem",
      letterSpacing: is_farsi ? "0px" : "-3%",
    },
    headlineMedium: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "bold",
      fontSize: "2rem",
      lineHeight: "2.25rem",
      letterSpacing: is_farsi ? "0px" : "0",
    },
    headlineLarge: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "bold",
      fontSize: "2.5rem",
      lineHeight: "2.7rem",
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
      lineHeight: "2.25rem",
      letterSpacing: is_farsi ? "0px" : "0",
    },
    displayLarge: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontSize: "4rem",
      fontWeight: "bold",
      lineHeight: "5.75rem",
      letterSpacing: is_farsi ? "0px" : "0",
    },
    titleSmall: {
      fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
      fontWeight: "bold",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
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
      lineHeight: "1.75rem",
      letterSpacing: is_farsi ? "0px" : "0",
    },
    bodySmall: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "400",
      fontSize: "0.75rem",
      letterSpacing: is_farsi ? "0px" : "0.4px",
    },
    bodyMedium: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: "1.5rem",
      letterSpacing: is_farsi ? "0px" : "0.25px",
    },
    bodyLarge: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: 400,
      fontSize: "1rem",
      letterSpacing: is_farsi ? "0px" : "0.5px",
    },
    labelSmall: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "400",
      fontSize: "0.68rem",
      lineHeight: "1rem",
      letterSpacing: "0px",
    },
    labelMedium: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: "1rem",
      letterSpacing: is_farsi ? "0px" : "0.5px",
    },
    labelLarge: {
      fontFamily: is_farsi ? farsiFontFamily : primaryFontFamily,
      fontWeight: "bold",
      fontSize: "0.875rem",
      lineHeight: "1.125rem",
      letterSpacing: is_farsi ? "0px" : "0.1px",
    },
    labelCondensed: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: "0.75rem",
      letterSpacing: "0.5px",
    },
    semiBoldSmall: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "500",
      fontSize: "0.75rem",
      lineHeight: "1rem",
      letterSpacing: is_farsi ? "0px" : "0.5px",
    },
    semiBoldLarge: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "500",
      fontSize: "1rem",
      letterSpacing: is_farsi ? "0px" : "0.15px",
    },
    semiBoldMedium: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "500",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      letterSpacing: is_farsi ? "0px" : "0.1px",
    },
    semiBoldXLarge: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      fontWeight: "500",
      fontSize: "1.375rem",
      lineHeight: "1.75rem",
      letterSpacing: "0px",
    },
    button: {
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
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
      fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
      lineHeight: 1.6,
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
            backgroundColor: "#fff",
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
          background: #F9FAFB;
          padding: 0;
        }
        .nc-header {
          font-family: ${is_farsi ? farsiFontFamily : primaryFontFamily};
          direction:${is_farsi ? "rtl" : "ltr"};
          background: #E8EBEE;
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
          background: #B8144B;
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
    MuiDialogTitle: {
      defaultProps: {
        bgcolor: palette.primary.main,
        color: palette.primary.contrastText,
        fontFamily: is_farsi ? farsiFontFamily : secondaryFontFamily,
        marginBottom: "8px",
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
          backgroundColor: palette.secondary.main,
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
            color: palette.secondary.main,
            fontWeight: "bold",
          },
          "&.MuiTabs-indicator": {
            backgroundColor: "#2466A8",
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
          color: "#FFFFFF",
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
          paddingLeft: is_farsi ? "32px" : "16px",
          paddingRight: !is_farsi ? "32px !important" : "16px !important",
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
      border: "1px solid #D5E5F6",
    },
  },
});

import React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import { Link as RLink, To } from "react-router-dom";
import Link from "@mui/material/Link";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeIcon from "@mui/icons-material/Home";
import AnchorRoundedIcon from "@mui/icons-material/AnchorRounded";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import i18next from "i18next";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@utils/languageDetector";

type TitleSize = "small" | "medium" | "large";

interface ITitle extends Omit<TypographyProps, "borderBottom"> {
  sup?: React.ReactNode;
  sub?: React.ReactNode;
  borderBottom?: string | boolean;
  toolbar?: React.ReactNode;
  backLink?: To;
  backIconProps?: SvgIconProps;
  size?: TitleSize;
  wrapperProps?: BoxProps;
  toolbarProps?: BoxProps;
  inPageLink?: string;
  avatar?: React.ReactNode;
  titleProps?: TypographyProps;
  subProps?: TypographyProps;
  appTitle?: string; // i18n key
}

const isHomePath = (to?: To) =>
  typeof to === "string" &&
  (to === "/" || to === "/spaces" || to === "/assessment-kits");

const pickFontFamily = (content: React.ReactNode) => {
  const lang = i18next.language || "";
  if (typeof content === "string") {
    const isFaByContent = Boolean(languageDetector(content));
    const isFaByLang = lang.startsWith("fa");
    return isFaByContent || isFaByLang ? farsiFontFamily : primaryFontFamily;
  }
  return lang.startsWith("fa") ? farsiFontFamily : primaryFontFamily;
};

const Title: React.FC<ITitle> = ({
  sup,
  children,
  sub,
  borderBottom,
  toolbar,
  size = "medium",
  backLink,
  backIconProps = {},
  wrapperProps,
  toolbarProps,
  titleProps,
  subProps,
  inPageLink,
  avatar,
  appTitle,
  // بقیه‌ی TypographyProps مثل variant/color/sx...
  ...typoRest
}) => {
  // sx برای wrapper
  const wrapperSx = {
    paddingBottom: "2px",
    "&:hover a.title-hash-link": { opacity: 1 },
    borderBottom:
      typeof borderBottom === "boolean"
        ? (theme: any) =>
            borderBottom ? `1px solid ${theme.palette.grey[300]}` : "none"
        : borderBottom,
    ...(wrapperProps?.sx || {}),
  };

  const titleVariant: TypographyProps["variant"] =
    size === "small" ? "h6" : size === "large" ? "headlineLarge" : "h5";
  const subVariant: TypographyProps["variant"] =
    size === "small" ? "subSmall" : size === "large" ? "subLarge" : "subMedium";

  const fontFamily = pickFontFamily(children);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      {...wrapperProps}
      sx={wrapperSx}
    >
      {avatar && (
        <Box alignSelf="center" sx={{ ...styles.centerV }}>
          {avatar}
        </Box>
      )}

      <Box
        flex={1}
        width="100%"
        alignItems="start"
        display="flex"
        flexDirection="column"
      >
        {backLink ? (
          <Box display="flex" justifyContent="flex-start">
            <Box
              minWidth="40px"
              mt="0.5rem"
              sx={{ ...styles.centerV, textDecoration: "none" }}
            >
              <Box
                component={RLink}
                to={backLink}
                display="flex"
                sx={{ textDecoration: "none", color: "inherit" }}
                aria-label="Back"
              >
                {isHomePath(backLink) ? (
                  <HomeIcon
                    sx={{ fontSize: 22, color: "#9DA7B3" }}
                    {...backIconProps}
                  />
                ) : (
                  <ArrowBackRoundedIcon
                    fontSize="small"
                    sx={{ opacity: 0.85, color: "disabled.main", mr: 0.5 }}
                    {...backIconProps}
                  />
                )}
                <Box component="span" sx={{ mx: 1 }} aria-hidden>
                  /
                </Box>
              </Box>
              {sup && (
                <Typography
                  textTransform="uppercase"
                  variant="bodyLarge"
                  lineHeight={0}
                >
                  {sup}
                </Typography>
              )}
            </Box>
          </Box>
        ) : sup ? (
          <Typography
            textTransform="uppercase"
            variant="bodyLarge"
            {...subProps}
          >
            {sup}
          </Typography>
        ) : null}

        {appTitle && (
          <Typography
            color="#CED3D9"
            fontWeight={500}
            variant="subtitle1"
            {...titleProps}
            sx={{
              ...styles.centerV,
              display: { xs: "block", sm: "flex" },
              ...(titleProps?.sx as any),
            }}
          >
            <Trans i18nKey={appTitle} />
          </Typography>
        )}

        <Typography
          textTransform={size === "large" ? "inherit" : "uppercase"}
          fontWeight="bold"
          variant={titleVariant}
          color={size === "large" ? "#2466A8" : "inherit"}
          {...typoRest}
          {...titleProps}
          sx={{
            ...styles.centerV,
            display: { xs: "block", sm: "flex" },
            fontFamily,
            ...(typoRest.sx as any),
            ...(titleProps?.sx as any),
          }}
        >
          {children}

          {inPageLink && (
            <Link
              href={`#${inPageLink}`}
              className="title-hash-link"
              sx={{
                ...styles.centerV,
                opacity: 0,
                ml: 1,
                transition: "opacity .1s ease",
                position: "relative",
              }}
              aria-label="Anchor link"
            >
              <AnchorRoundedIcon fontSize="small" />
              <Box id={inPageLink} position="absolute" top="-84px" />
            </Link>
          )}
        </Typography>

        {sub && <Typography variant={subVariant}>{sub}</Typography>}
      </Box>

      <Box ml="auto" {...toolbarProps}>
        {toolbar}
      </Box>
    </Box>
  );
};

export default Title;

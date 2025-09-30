import { TypographyProps } from "@mui/material/Typography";
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
import languageDetector from "@/utils/language-detector";
import { Text } from "./Text";

type TitleSize = "small" | "medium" | "large";

interface TitleProps extends Omit<TypographyProps, "borderBottom"> {
  sup?: React.ReactNode;
  sub?: React.ReactNode;
  borderBottom?: string | boolean;
  toolbar?: React.ReactNode;
  backLink?: To | -1;
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

const isHomePath = (to?: To  | -1) =>
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

const Title: React.FC<TitleProps> = ({
  sup,
  children,
  sub,
  borderBottom,
  toolbar,
  size = "medium",
  backLink,
  backIconProps = {},
  wrapperProps = {},
  toolbarProps = {},
  titleProps = {},
  subProps = {},
  inPageLink,
  avatar,
  appTitle,
  ...typoRest
}: any) => {
  let titleVariant: TypographyProps["variant"];
  let subVariant: TypographyProps["variant"];
  
  if (size === "small") {
    titleVariant = "h6";
    subVariant = "subSmall";
  } else if (size === "large") {
    titleVariant = "headlineLarge";
    subVariant = "subLarge";
  } else {
    titleVariant = "h5";
    subVariant = "subMedium";
  }  

  const fontFamily = pickFontFamily(children);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems={backLink ? "flex-end" : "center"}
      paddingBottom="2px"
      {...wrapperProps}
      sx={{
        "&:hover a.title-hash-link": { opacity: 1 },
        borderBottom:
          typeof borderBottom === "boolean" && borderBottom
            ? (theme) => `1px solid ${theme.palette.grey[300]}`
            : (borderBottom as string),
        paddingBlockEnd: borderBottom ? "32px" : 0,
        ...(wrapperProps?.sx || {}),
        width: "100%"
      }}

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
        {...typoRest}
      >
        {backLink ? (
          <Box display="flex" justifyContent="flex-start">
            <Box
              minWidth="40px"
              mt="0.5rem"
              ml={sup ? { xs: 0, md: 0 } : "-4px"}
              sx={{ ...styles.centerV, textDecoration: "none" }}
            >
              <Box
                component={RLink}
                to={backLink as To}
                display="flex"
                sx={{ textDecoration: "none", color: "inherit" }}
                aria-label="Back"
              >
                {typeof backLink !== "number" && isHomePath(backLink) ? (
                  <HomeIcon
                    sx={{ fontSize: 22, color: "#9DA7B3" }}
                    {...backIconProps}
                  />
                ) : (
                  <ArrowBackRoundedIcon
                    fontSize="small"
                    sx={{
                      opacity: 0.85,
                      color: "disabled.main",
                      marginInlineEnd: 0.5,
                      marginInlineStart: "unset",
                    }}
                    {...backIconProps}
                  />
                )}
                <Box component="span" sx={{ mx: 1 }} aria-hidden>
                  /
                </Box>
              </Box>
              {sup && (
                <Text
                  textTransform="uppercase"
                  variant={subVariant}
                  lineHeight={0}
                  {...subProps}
                >
                  {sup}
                </Text>
              )}
            </Box>
          </Box>
        ) : sup ? (
          <Text
            textTransform="uppercase"
            variant={subVariant}
            {...subProps}
          >
            {sup}
          </Text>
        ) : null}

        {appTitle && (
          <Text
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
          </Text>
        )}

        <Text
          textTransform={size === "large" ? "inherit" : "uppercase"}
          fontWeight="bold"
          variant={titleVariant}
          color={size === "large" ? "primary" : "inherit"}
          {...titleProps}
          sx={{
            ...styles.centerV,
            display: { xs: "block", sm: "flex" },
            fontFamily,
            ...(titleProps?.sx as any),
            ...(typoRest.sx as any),
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
        </Text>

        {sub && <Text variant={subVariant}>{sub}</Text>}
      </Box>

      <Box
        ml="auto"
        marginInlineStart="auto"
        marginInlineEnd="unset"
        {...toolbarProps}
      >
        {toolbar}
      </Box>
    </Box>
  );
};

export default Title;

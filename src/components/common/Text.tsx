import * as React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import i18next from "i18next";

type ExtraProps = {
  text?: React.ReactNode;
  detectLang?: boolean;
  lines?: number;
  sx?: SxProps<Theme>;
  component?: React.ElementType;
  to?: string;
  href?: string;
  target?: string;
};

type Props = TypographyProps & ExtraProps;

export const Text = React.forwardRef<any, Props>(function Text(
  {
    text,
    children,
    variant = "bodyMedium",
    color,
    detectLang = true,
    lines,
    sx,
    component,
    ...rest
  },
  ref,
) {
  const content = children ?? text;

  const contentDetector = content ?? rest?.dangerouslySetInnerHTML?.__html;

  const isFa = detectLang
    ? languageDetector(contentDetector as string)
    : (i18next.language || "").toLowerCase().startsWith("fa");

  const clampSx: SxProps<Theme> =
    lines && lines > 0
      ? {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: lines,
          overflow: "hidden",
        }
      : {};

  return (
    <Typography
      ref={ref}
      {...(component ? { component } : {})}
      variant={variant}
      color={color}
      sx={{
        display: "inline-block",
        fontFamily: isFa ? farsiFontFamily : primaryFontFamily,
        ...clampSx,
        ...sx,
      }}
      {...rest}
    >
      {content}
    </Typography>
  );
});

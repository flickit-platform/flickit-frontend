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

export function hasNoFaOrEnLetters(input: unknown): boolean {
  const s =
    typeof input === "string" ? input : input == null ? "" : String(input);
  const sanitized = s.replace(/[%\u066A]/g, ""); // % و ٪
  const letters = /[\p{Script=Latin}\p{Script=Arabic}]/u;
  return !letters.test(sanitized);
}

function stripHtml(html: string): string {
  const withoutTags = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ");
  return withoutTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractText(node: React.ReactNode): string | undefined {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(extractText).filter(Boolean) as string[];
    return parts.length ? parts.join(" ") : undefined;
  }
  if (React.isValidElement(node)) {
    const anyProps: any = node.props ?? {};

    const hasI18nKey = typeof anyProps.i18nKey === "string";
    if (hasI18nKey) {
      const key = anyProps.i18nKey as string;
      const values = anyProps.values || {};
      const ns = anyProps.ns;
      const defaults = anyProps.defaults;
      return i18next.t(key, { ...values, ns, defaultValue: defaults });
    }

    return extractText(anyProps.children);
  }
  return undefined;
}

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

  const htmlText =
    typeof (rest as any)?.dangerouslySetInnerHTML?.__html === "string"
      ? stripHtml((rest as any).dangerouslySetInnerHTML.__html)
      : undefined;

  const sourceForDetection =
    extractText(children) ??
    (typeof text === "string" ? text : extractText(text)) ??
    htmlText;

  const isFa =
    detectLang && sourceForDetection
      ? languageDetector(sourceForDetection)
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
        fontFamily:
          isFa ||
          (hasNoFaOrEnLetters(content as string) && i18next.language === "fa")
            ? farsiFontFamily
            : primaryFontFamily,
        ...clampSx,
        ...sx,
      }}
      {...rest}
    >
      {content}
    </Typography>
  );
});

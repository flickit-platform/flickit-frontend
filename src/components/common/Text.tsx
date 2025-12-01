import Typography, { TypographyProps } from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import i18next from "i18next";
import { forwardRef, isValidElement } from "react";

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
  let string: string;
  if (typeof input === "string") string = input;
  else if (input == null) string = "";
  else string = String(input);

  const sanitized = string.replaceAll(/[%\u066A]/g, "");
  const letters = /[\p{Script=Latin}\p{Script=Arabic}]/u;
  return !letters.test(sanitized);
}

function stripHtml(html: string): string {
  return html
    .replaceAll(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replaceAll(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replaceAll(/<br\s*\/?>/gi, "\n")
    .replaceAll(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .trim();
}

function extractText(node: React.ReactNode): string | undefined {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(extractText).filter(Boolean) as string[];
    return parts.length ? parts.join(" ") : undefined;
  }
  if (isValidElement(node)) {
    const anyProps: any = node.props ?? {};

    const hasI18nKey = typeof anyProps.i18nKey === "string";
    if (hasI18nKey) {
      const key = anyProps.i18nKey as string;
      const values = anyProps.values || {};
      const ns = anyProps.ns;
      const defaults = anyProps.defaults;

      const translationResult = i18next.t(key, {
        ...values,
        ns,
        defaultValue: defaults,
      });
      return typeof translationResult === "string"
        ? translationResult
        : String(translationResult);
    }
    return extractText(anyProps.children);
  }
  return undefined;
}

function renderTooltipContent(
  raw: React.ReactNode,
  isFa: boolean,
  fallback?: string,
) {
  const text =
    (typeof raw === "string" ? raw : extractText(raw)) ??
    (typeof fallback === "string" ? fallback : "") ??
    "";

  return (
    <Box
      sx={{
        whiteSpace: "pre-line",
        direction: isFa ? "rtl" : "ltr",
        fontFamily: isFa ? farsiFontFamily : primaryFontFamily,
        lineHeight: 1.6,
      }}
    >
      {text}
    </Box>
  );
}

export const Text = forwardRef<any, Props>(function Text(
  {
    text,
    children,
    variant = "bodyMedium",
    color,
    detectLang = true,
    lines,
    sx,
    component,
    title: _nativeTitle,
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
    typeof lines === "number"
      ? lines <= 0
        ? {}
        : lines === 1
          ? {
              display: "block",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              minWidth: 0,
            }
          : {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: lines,
              overflow: "hidden",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }
      : {};

  const typo = (
    <Typography
      ref={ref}
      {...(component ? { component } : {})}
      variant={variant}
      color={color}
      sx={{
        display:
          component === "li"
            ? "list-item"
            : component === "div"
              ? "block"
              : "inline-block",
        ...(component === "li"
          ? {
              listStylePosition: "outside",
              marginInline: i18next.language === "fa" ? 4 : 0,
            }
          : {}),
        fontFamily:
          isFa ||
          (hasNoFaOrEnLetters(content as string) && i18next.language === "fa")
            ? farsiFontFamily
            : primaryFontFamily,
        ...clampSx,
        ...sx,
      }}
      {...((): Omit<TypographyProps, "title"> => {
        const { title, ...restNoTitle } = rest as any;
        return restNoTitle;
      })()}
    >
      {content}
    </Typography>
  );

  const shouldShowTooltip =
    typeof lines === "number" && lines > 0 && !!sourceForDetection;

  return shouldShowTooltip ? (
    <Tooltip
      title={renderTooltipContent(content, isFa, htmlText)}
      arrow
      disableInteractive
      componentsProps={{
        tooltip: {
          sx: {
            maxWidth: 600,
            p: 1,
          },
        },
      }}
    >
      {typo}
    </Tooltip>
  ) : (
    typo
  );
});

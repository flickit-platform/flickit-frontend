import { Box, Typography } from "@mui/material";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";

interface TitleWithTranslationProps {
  title: string;
  translation?: string;
  variant?: any;
  multiline?: boolean;
}

const TitleWithTranslation = ({
  title,
  translation,
  variant = "h6",
  multiline = false,
}: TitleWithTranslationProps) => {
  const isFarsiTitle = languageDetector(title);
  const isFarsiTranslation = translation
    ? languageDetector(translation)
    : false;

  const renderText = ({
    text,
    isFarsi,
    color,
    variantOverride,
  }: {
    text: string;
    isFarsi: boolean;
    color?: string;
    variantOverride?: any;
  }) => {
    const baseProps = {
      component: "div" as const,
      variant: variantOverride ?? variant,
      sx: {
        mt: !multiline ? 0.5 : 0,
        color: color ?? "inherit",
        fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
        textAlign: multiline ? "justify" : "unset",
      },
    };

    return multiline ? (
      <Typography {...baseProps} dangerouslySetInnerHTML={{ __html: text }} />
    ) : (
      <Typography {...baseProps}>{text}</Typography>
    );
  };

  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      {renderText({ text: title, isFarsi: isFarsiTitle })}
      {translation &&
        renderText({
          text: translation,
          isFarsi: isFarsiTranslation,
          color: "#6C8093",
          variantOverride: "body2",
        })}
    </Box>
  );
};

export default TitleWithTranslation;

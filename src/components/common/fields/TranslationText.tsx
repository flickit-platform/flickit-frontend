import { SxProps, Theme } from "@mui/material/styles";
import { Box, Divider, IconButton, useTheme } from "@mui/material";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/language-detector";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { t } from "i18next";
import { Text } from "../Text";

interface TitleWithTranslationProps {
  title: string;
  translation?: string | null;
  variant?: any;
  multiline?: boolean;
  showCopyIcon?: boolean;
  titleSx?: SxProps<Theme>;
  translationSx?: SxProps<Theme>;
}

const RenderText = ({
  text,
  isFarsi,
  color,
  variantOverride,
  variant,
  multiline,
  showCopyIcon,
  sx
}: {
  text: string;
  isFarsi: boolean;
  color?: string;
  variantOverride?: any;
  variant?: string;
  multiline?: boolean;
  showCopyIcon?: boolean;
  sx?: any
}) => {
  const theme = useTheme();

  const baseProps = {
    component: "div" as const,
    variant: variant ?? variantOverride,
    sx: {
      mt: !multiline ? 0.5 : 0,
      color: color ?? "inherit",
      fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
      textAlign: multiline ? "justify" : "unset",
      width: "fit-content",
      ...sx,
    },
  };
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };
  const handelMouseOut = () => {
    setIsHovered(false);
  };

  return multiline ? (
    <Text {...baseProps} dangerouslySetInnerHTML={{ __html: text }} />
  ) : (
    <Text
      onClick={(e) => {
        if (showCopyIcon) {
          e.stopPropagation();
          navigator.clipboard.writeText(text).then(() => {
            toast("copied", { type: "success" });
          });
        }
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handelMouseOut}
      {...baseProps}
    >
      {text}{" "}
      {isHovered && showCopyIcon && (
        <Tooltip title={t("common.copy")}>
          <IconButton
            size="small"
            sx={{
              float: [theme.direction == "rtl" ? "left" : "right"],
              marginInlineStart: "10px",
            }}
          >
            <ContentCopyIcon sx={{ fontSize: "14px" }} />
          </IconButton>
        </Tooltip>
      )}
    </Text>
  );
};

const TitleWithTranslation = ({
  title,
  translation = "",
  titleSx,
  translationSx,
  ...rest
}: TitleWithTranslationProps) => {
  const theme = useTheme();
  const isFarsiTitle = languageDetector(title);
  const isFarsiTranslation = translation
    ? languageDetector(translation)
    : false;
  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <RenderText
        text={title}
        isFarsi={isFarsiTitle}
        sx={titleSx}
        {...rest}
        variantOverride="bodyMedium"
      />
      {translation && (
        <>
          <Divider
            sx={{
              marginBlockStart: rest.multiline ? -1 : 1,
              marginBlockEnd: rest.multiline ? -1 : 0,
            }}
          />

          <RenderText
            text={translation}
            isFarsi={isFarsiTranslation}
            color={theme.palette.background.onVariant}
            sx={translationSx}
            variantOverride="bodyMedium"
            {...rest}
          />
        </>
      )}
    </Box>
  );
};

export default TitleWithTranslation;

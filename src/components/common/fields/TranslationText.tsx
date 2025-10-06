import { Box, IconButton, useTheme } from "@mui/material";
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
  translation?: string;
  variant?: any;
  multiline?: boolean;
  showCopyIcon?: boolean;
}

const RenderText = ({
  text,
  isFarsi,
  color,
  variantOverride,
  variant,
  multiline,
  showCopyIcon,
}: {
  text: string;
  isFarsi: boolean;
  color?: string;
  variantOverride?: any;
  variant?: string;
  multiline?: boolean;
  showCopyIcon?: boolean;
}) => {
  const theme = useTheme();

  const baseProps = {
    component: "div" as const,
    variant: variantOverride ?? variant,
    sx: {
      mt: !multiline ? 0.5 : 0,
      color: color ?? "inherit",
      fontFamily: isFarsi ? farsiFontFamily : primaryFontFamily,
      textAlign: multiline ? "justify" : "unset",
      width: "fit-content",
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
  translation= "",
  ...rest
}: TitleWithTranslationProps) => {
  const theme = useTheme()
  const isFarsiTitle = languageDetector(title);
  const isFarsiTranslation = translation
    ? languageDetector(translation)
    : false;
  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <RenderText text={title} isFarsi={isFarsiTitle} {...rest} variantOverride="bodyMedium"/>
      {translation && (
        <RenderText
          text={translation}
          isFarsi={isFarsiTranslation}
          color={theme.palette.background.onVariant}
          variantOverride="bodyMedium"
          {...rest}
        />
      )}
    </Box>
  );
};

export default TitleWithTranslation;

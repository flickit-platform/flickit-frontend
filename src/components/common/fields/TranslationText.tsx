import { Box, IconButton, Typography } from "@mui/material";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

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
    <Typography {...baseProps} dangerouslySetInnerHTML={{ __html: text }} />
  ) : (
    <Typography
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
        <Tooltip title={"copy"}>
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
    </Typography>
  );
};

const TitleWithTranslation = ({
  title,
  translation,
  ...rest
}: TitleWithTranslationProps) => {
  const isFarsiTitle = languageDetector(title);
  const isFarsiTranslation = translation
    ? languageDetector(translation)
    : false;

  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <RenderText text={title} isFarsi={isFarsiTitle} {...rest} />
      {translation && (
        <RenderText
          text={translation}
          isFarsi={isFarsiTranslation}
          color={theme.palette.surface.contrastTextVariant}
          variantOverride={"body2"}
          {...rest}
        />
      )}
    </Box>
  );
};

export default TitleWithTranslation;

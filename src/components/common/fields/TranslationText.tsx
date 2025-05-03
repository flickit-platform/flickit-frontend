import { Box, Typography } from "@mui/material";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import languageDetector from "@/utils/languageDetector";
import { useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from "react-toastify";
import { theme } from "@/config/theme";
import Tooltip from "@mui/material/Tooltip";

interface TitleWithTranslationProps {
  title: string;
  translation?: string;
  variant?: any;
  multiline?: boolean;
  showCopyIcon?: boolean | undefined;
}

const TitleWithTranslation = ({
  title,
  translation,
  variant = "h6",
  multiline = false,
  showCopyIcon= false
}: TitleWithTranslationProps) => {
  const isFarsiTitle = languageDetector(title);
  const isFarsiTranslation = translation
    ? languageDetector(translation)
    : false;

  const RenderText = ({
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
        width: "fit-content",
      },
    };
    const [show,setShow] = useState(false)

    const handleMouseOver = () => {
     setShow(true)
    };
    const handelMouseOut = () => {
      setShow(false)
    };
    const handleCopyClick = () => {
      navigator.clipboard.writeText(text).then(() => {
        toast("copied",{type: 'success'})
      });
    };

    return multiline ? (
      <Typography {...baseProps} dangerouslySetInnerHTML={{ __html: text }} />
    ) : (
      <Typography
        onClick={handleCopyClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handelMouseOut}
        {...baseProps}
      >
        {text}{" "}
        {show && showCopyIcon && (
          <Tooltip title={"copy"} >
            <ContentCopyIcon sx={{ float:[theme.direction == "rtl" ? "left" :  "right"], marginInlineStart: "10px" }} fontSize={"small"} />
          </Tooltip>
        )}
      </Typography>
    );
  };

  return (
    <Box display="flex" flexDirection="column" flexGrow={1}>
      <RenderText text={title} isFarsi={isFarsiTitle} />
      {translation &&
        <RenderText text={translation} isFarsi={isFarsiTranslation} color={"#6C8093"} variantOverride={"body2"} />}
    </Box>
  );
};

export default TitleWithTranslation;

import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import RichEditor from "@common/rich-editor/RichEditor";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { t } from "i18next";

const AssessmentKitAbout = (props: any) => {
  const { about } = props;
  const paragraphRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (paragraphRef.current) {
      const isOverflowing =
        paragraphRef.current.scrollHeight > paragraphRef.current.clientHeight;
      setShowBtn(isOverflowing);
    }
  }, [about]);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <Grid item xs={12} md={9} >
  <Typography sx={{ ...theme.typography.titleLarge, color: "#2B333B" }}>
    <Trans i18nKey={"aboutThisKit"} />
  </Typography>
  <Typography
    sx={{
      color: "#2B333B",
      minHeight: "50px",
      display: "-webkit-box",
      WebkitLineClamp: showMore ? "unset" : 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
    ref={paragraphRef}
  >
    <RichEditor content={about} />
  </Typography>
  {showBtn && (
    <Button
      variant="text"
      onClick={toggleShowMore}
      sx={{ textTransform: "none" }}
    >
      {showMore ? t("showLess") : t("showMore")}
    </Button>
  )}

</Grid>


  );
};

export default AssessmentKitAbout;

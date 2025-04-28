import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { t } from "i18next";

const AssessmentKitAbout = (props: any) => {
  const { about } = props;
  const paragraphRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current && paragraphRef.current) {
      const parentHeight = containerRef.current.clientHeight;
      const paragraphHeight = paragraphRef.current.scrollHeight;

      const calculatedMaxHeight = parentHeight - 40;

      setMaxHeight(calculatedMaxHeight > 0 ? calculatedMaxHeight : 200);
      setShowBtn(paragraphHeight > calculatedMaxHeight);
    }
  }, [about]);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography
        ref={paragraphRef}
        sx={{
          color: "#2B333B",
          overflow: "hidden",
          maxHeight: !showMore ? `${maxHeight}px` : "none",
          transition: "max-height 0.3s ease",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
        }}
        dangerouslySetInnerHTML={{ __html: about }}
      />

      {showBtn && (
        <Button
          variant="text"
          onClick={toggleShowMore}
          sx={{
            textTransform: "none",
            mt: 1,
            alignSelf: "flex-start",
            minWidth: "auto",
            paddingX: 0,
          }}
        >
          {showMore ? t("showLess") : t("showMore")}...
        </Button>
      )}
    </div>
  );
};

export default AssessmentKitAbout;

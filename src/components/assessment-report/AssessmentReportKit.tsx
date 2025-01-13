import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { IAssessmentKitReportModel } from "@types";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useEffect, useRef, useState } from "react";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
interface IAssessmentReportKit {
  assessmentKit: IAssessmentKitReportModel;
}

export const AssessmentReportKit = (props: IAssessmentReportKit) => {
  const { assessmentKit } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const element: any = contentRef.current;
    if (element) {
      const computedStyle = window.getComputedStyle(element);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const elementHeight = element.offsetHeight;
      setIsOverflowing(elementHeight > lineHeight);
    }
  }, [assessmentKit.summary]);
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      textAlign="left"
      maxHeight="100%"
      height={"100%"}
      gap={3}
      py={2}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        px: { xs: 2, sm: 3.75 },
      }}
    >
      <Box
        sx={{ ...styles.centerCVH, textAlign: "center" }}
        width="100%"
        height="100%"
        gap={3}
      >
        <Typography variant="titleMedium" fontWeight={400} color="#243342">
          <Trans i18nKey="thisAssessmentIsUsing" />{" "}
          <Typography
            variant="titleLarge"
            component={Link}
            to={`/assessment-kits/${assessmentKit?.id}`}
            sx={{
              textDecoration: "none",
              color: "#8B0035",
              fontSize: "inherit",
              fontFamily: languageDetector(assessmentKit.title)
                ? farsiFontFamily
                : primaryFontFamily,
              mx: 0.5,
            }}
          >
            {assessmentKit.title}
          </Typography>
          <Trans i18nKey="thisAssessmentIsUsingSecondPart" />.
        </Typography>

        <Typography
          color="#73808C"
          variant="titleMedium"
          fontStyle="italic"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          <Trans i18nKey="providedBy" />
        </Typography>
        <Avatar
          component={Link}
          to={`/user/expert-groups/${assessmentKit?.expertGroup.id}`}
          src={assessmentKit.expertGroup.picture}
          sx={{ cursor: "pointer" }}
        />
        <Typography
          component={Link}
          to={`/user/expert-groups/${assessmentKit?.expertGroup.id}`}
          color="#8B0035"
          variant="titleLarge"
          sx={{
            textDecoration: "none",
            fontFamily: languageDetector(assessmentKit.expertGroup.title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {assessmentKit.expertGroup.title}
        </Typography>
        <Typography
          color="#243342"
          variant="titleMedium"
          fontWeight={400}
          width="100%"
          sx={{
            fontFamily: languageDetector(assessmentKit.summary)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {assessmentKit.summary}
        </Typography>
      </Box>
    </Box>
  );
};

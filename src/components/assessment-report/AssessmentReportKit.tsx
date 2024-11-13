import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { IAssessmentKitReportModel } from "@types";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useEffect, useRef, useState } from "react";
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
      gap={3}
      py={2}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        px: { xs: 2, sm: 3.75 },
      }}
    >
      <Box sx={{ ...styles.centerCVH }} width="100%" gap={1}>
        <Box
          display="flex"
          flexDirection={{
            xl:
              assessmentKit.title.length +
                assessmentKit.expertGroup.title.length >
              80
                ? "column"
                : "row",
            lg:
              assessmentKit.title.length +
                assessmentKit.expertGroup.title.length >
              60
                ? "column"
                : "row",
            md:
              assessmentKit.title.length +
                assessmentKit.expertGroup.title.length >
              40
                ? "column"
                : "row",
            xs: "column",
            sm: "column",
          }}
          gap={1}
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="titleMedium" fontWeight={400} color="#243342">
            <Trans i18nKey="thisAssessmentIsUsing" />{" "}
            <Box
              component={Link}
              to={`/assessment-kits/${assessmentKit?.id}`}
              sx={{
                textDecoration: "none",
                color: "#8B0035",
                fontSize: "inherit",
                fontWeight: 500,
              }}
            >
              <Typography variant="titleLarge">
                {assessmentKit.title}
              </Typography>
            </Box>{" "}
            <Trans i18nKey="thisAssessmentIsUsingSecondPart" />.
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap="8px"
            justifyContent="flex-end"
          >
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
              }}
            >
              {assessmentKit.expertGroup.title}
            </Typography>
          </Box>
        </Box>

        {isOverflowing ? (
          <Box display="flex" flexDirection="column" width="100%" mb={1}>
            <Typography
              color="#243342"
              variant="titleSmall"
              fontWeight={500}
              width="100%"
              textAlign="start"
              sx={{
                whiteSpace: "pre-wrap",
                overflow: isExpanded ? "visible" : "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: isExpanded ? "none" : 1,
              }}
              ref={contentRef}
            >
              {assessmentKit.summary}
            </Typography>
            <Typography
              variant="titleSmall"
              fontWeight={500}
              color="#246297"
              sx={{ cursor: "pointer" }}
              onClick={toggleExpanded}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Typography>
          </Box>
        ) : (
          <Box display="flex" width="100%" mb={1}>
            <Typography
              color="#243342"
              variant="titleMedium"
              fontWeight={400}
              width="100%"
              textAlign="start"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
              }}
              ref={contentRef}
            >
              {assessmentKit.summary}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

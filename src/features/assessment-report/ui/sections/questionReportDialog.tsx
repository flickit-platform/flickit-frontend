import React, { useState, useCallback } from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import i18next, { t } from "i18next";
import { styles } from "@styles";
import { useQuestionReportDialog } from "@/features/assessment-report/model/hooks/useQuestionReportDialog";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link } from "react-router-dom";
import { useParams } from "react-router";

const accordionBaseStyle = {
  background: "inherit",
  boxShadow: "none",
  borderRadius: 2,
  border: ".5px solid #66809980",
  mb: 1,
};

const accordionSummaryStyle = {
  flexDirection: "row-reverse",
  px: 2,
  minHeight: "unset",
  borderRadius: 2,
  border: ".5px solid #66809980",
  background: "#66809914",
  height: 40,
  "&.Mui-expanded": { margin: 0, minHeight: "unset" },
  "& .MuiAccordionSummary-content": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    paddingInlineEnd: "10px",
  },
};

const InnerAccordion = ({
  title,
  data,
  expanded,
  onChange,
  lng,
  measureId,
  assessmentId,
}: any) => (
  <Accordion
    expanded={expanded}
    onChange={onChange}
    TransitionProps={{ timeout: 600 }}
    sx={accordionBaseStyle}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
      sx={accordionSummaryStyle}
    >
      <Typography variant="titleSmall">
        {t(`assessmentReport.${title}`, {})}
      </Typography>
      <Typography variant="bodyMedium">
        ({data?.length} {t("common.questions")})
      </Typography>
    </AccordionSummary>

    <AccordionDetails sx={{ direction: lng === "fa" ? "rtl" : "ltr" }}>
      {data?.map((item: any, index: number) => (
        <Box key={item?.question?.id || index} sx={{ px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: lng === "fa" ? "row" : "row-reverse",
              }}
            >
              <Typography variant="bodyMedium" fontWeight="bold">
                Q
              </Typography>
              <Typography variant="bodyMedium" fontWeight="bold">
                .{index + 1}
              </Typography>
            </Box>
            <Typography variant="bodySmall">{item.question.title}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingInlineStart: "40px",
            }}
          >
            {!!item.answer.title ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 5,
                  gap: 1.2,
                  borderRadius: 1,
                  border: ".25px solid #6C8093",
                  p: "4px 8px",
                }}
              >
                <CheckBoxIcon sx={{ color: "#6C8093" }} />
                <Typography variant="bodySmall">{item.answer.title}</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 5,
                  gap: 1.2,
                  borderRadius: 1,
                  border: ".25px solid error.main",
                  p: "4px 8px",
                }}
              >
                <ErrorOutlineIcon sx={{ color: "error.main" }} />
                <Typography variant="bodySmall" color={"error.main"}>
                  {t("subject.noQuestionHasBeenAnswered", {lng})}
                </Typography>
              </Box>
            )}

            <Typography
              component={Link}
              to={`./../../1/${assessmentId}/questionnaires/${measureId}/${item?.question?.index}`}
              variant="bodyMedium"
              color="primary.main"
              sx={{
                textDecoration: "none",
              }}
            >
              {t("assessmentReport.goToQuestion", {lng})}
            </Typography>
          </Box>

          {index !== data.length - 1 && <Divider sx={{ my: 1 }} />}
        </Box>
      ))}
    </AccordionDetails>
  </Accordion>
);

const AccordionSkeleton = () => (
  <Box sx={{ mb: 2 }}>
    <Skeleton
      variant="rectangular"
      height={40}
      sx={{ borderRadius: 1, mb: 1 }}
    />
    {[...Array(3)].map((_, i) => (
      <Box key={i} sx={{ px: 2, py: 1 }}>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={20} />
        {i !== 2 && <Divider sx={{ my: 1 }} />}
      </Box>
    ))}
  </Box>
);

const QuestionReportDialog = (props: any) => {
  const { onClose, lng, context, ...rest } = props;
  const { assessmentId } = useParams();
  const { measureId, attributeId } = context?.data ?? {};
  const { data, loading } = useQuestionReportDialog(measureId, attributeId);
  const { highScores = [], lowScores = [] } = data ?? {};

  const [expanded, setExpanded] = useState<string | false>(false);
  const isRTL = lng === "fa" || (!lng && i18next.language === "fa");

  const handleAccordionChange = useCallback(
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    [],
  );

  return (
    <Box sx={{ direction: isRTL ? "rtl" : "ltr" }}>
      <CEDialog
        {...rest}
        closeDialog={onClose}
        title={
          <Typography variant="semiBoldXLarge" fontFamily="inherit">
            {t("assessmentReport.viewCodeQualityMeasure")}
          </Typography>
        }
        contentStyle={{ p: "40px 32px !important" }}
        titleStyle={{ mb: 0 }}
      >
        {loading ? (
          <>
            <AccordionSkeleton />
            <AccordionSkeleton />
          </>
        ) : (
          <Box>
            {lowScores.length > 0 && (
              <InnerAccordion
                title="lowScoringQuestions"
                data={lowScores}
                expanded={expanded === "low"}
                onChange={handleAccordionChange("low")}
                lng={lng}
                measureId={measureId}
                assessmentId={assessmentId}
              />
            )}
            {highScores.length > 0 && (
              <InnerAccordion
                title="highScoringQuestions"
                data={highScores}
                expanded={expanded === "high"}
                onChange={handleAccordionChange("high")}
                lng={lng}
                measureId={measureId}
                assessmentId={assessmentId}
              />
            )}
          </Box>
        )}
        <CEDialogActions
          cancelLabel={t("common.close", { lng })}
          hideSubmitButton={true}
          cancelType={"contained"}
          onClose={onClose}
          sx={{
            flexDirection: { xs: "column-reverse", sm: "row" },
            gap: 2,
            ...styles.rtlStyle(isRTL),
          }}
        />
      </CEDialog>
    </Box>
  );
};

export default QuestionReportDialog;

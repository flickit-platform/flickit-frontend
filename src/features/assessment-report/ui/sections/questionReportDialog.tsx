import React, { useState, useCallback } from "react";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { t } from "i18next";
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
import { IDialogContext, TId } from "@/types";
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

interface IQuestionReportDialog {
  context: IDialogContext | undefined;
  lng: string;
  onClose: () => void;
  open: boolean;
  openDialog: (context: any) => void;
}

interface IInnerAccordion {
  title: string;
  data: any;
  expanded: boolean;
  onChange: any;
  lng: string;
  measureId: TId;
  assessmentId: TId;
}

const accordionBaseStyle = {
  background: "inherit",
  boxShadow: "none",
  borderRadius: "8px !important",
  border: ".5px solid #66809980",
  mb: 1,
  "&:before": {
    display: "none",
  },
};

const accordionSummaryStyle = {
  flexDirection: "row-reverse",
  px: 2,
  minHeight: "unset",
  borderRadius: 2,
  border: ".5px solid #66809980",
  background: `rgba(102, 128, 153, 0.08)`,
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
}: IInnerAccordion) => (
  <Accordion
    expanded={expanded}
    onChange={onChange}
    TransitionProps={{ timeout: 600 }}
    sx={accordionBaseStyle}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: "surface.onVariant" }} />}
      sx={accordionSummaryStyle}
    >
      <Typography
        variant="titleSmall"
        color={"surface.inverse"}
        sx={{
          ...styles.rtlStyle(lng == "fa"),
        }}
      >
        {t(`assessmentReport.${title}`, { lng })}
      </Typography>
      <Typography
        variant="bodyMedium"
        color={"surface.onVariant"}
        sx={{
          ...styles.rtlStyle(lng == "fa"),
        }}
      >
        ({data?.length} {t((lng == "fa" || data?.length == 1) ? "common.question" : "common.questions", { lng })})
      </Typography>
    </AccordionSummary>

    <AccordionDetails
      sx={{
        direction: lng === "fa" ? "rtl" : "ltr",
        background: `rgba(102, 128, 153, 0.04)`,
      }}
    >
      {data?.map((item: any, index: number) => (
        <Box key={item?.question?.id || index} sx={{ px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Typography variant="bodyMedium" fontWeight="bold">
                Q
              </Typography>
              <Typography variant="bodyMedium" fontWeight="bold">
                .{item.question.index}
              </Typography>
            </Box>
            <Typography variant="bodySmall"
            sx={{
              ...styles.rtlStyle(lng == "fa")
            }}
            >{item.question.title}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingInlineStart: "40px",
            }}
          >
            {item.answer.title ? (
              <Box
                sx={{
                  ...styles.centerV,
                  gap: 1.2,
                  borderRadius: 1,
                  border: ".25px solid #6C8093",
                  p: "4px 8px",
                }}
              >
                <CheckBoxIcon sx={{ color: "#6C8093" }} />
                <Typography variant="bodySmall"
                sx={{
                  ...styles.rtlStyle(lng == "fa")
                }}
                >{item.answer.title}</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  ...styles.centerV,
                  gap: 1.2,
                  borderRadius: 1,
                  boxShadow: "inset 0 0 0 0.5px rgba(138, 15, 36, 0.5)",
                  p: "4px 8px",
                }}
              >
                <ErrorOutlineIcon sx={{ color: "error.main" }} />
                <Typography variant="bodySmall" color={"error.main"}
                sx={{
                  ...styles.rtlStyle(lng == "fa")
                }}
                >
                  {t("subject.noQuestionHasBeenAnswered", { lng })}
                </Typography>
              </Box>
            )}

            <Typography
              component={Link}
              to={`./../../1/${assessmentId}/questionnaires/${measureId}/${item?.question?.index}`}
              target={"_blank"}
              variant="bodyMedium"
              color="primary.main"
              sx={{
                textDecoration: "none",
                ...styles.rtlStyle(lng == "fa")
              }}
            >
              {t("assessmentReport.goToQuestion", { lng })}
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
  </Box>
);

const QuestionReportDialog = (props: IQuestionReportDialog) => {

  const { onClose, lng, context, ...rest } = props;
  const { assessmentId = "" } = useParams();
  const { measureId, attributeId } = context?.data ?? {};
  const { data, loading } = useQuestionReportDialog(
    measureId,
    attributeId,
    assessmentId,
  );
  const { highScores = [], lowScores = [] } = data ?? {};

  const [expanded, setExpanded] = useState<string | false>(false);
  const isRTL = lng === "fa";

  const handleAccordionChange = useCallback(
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    [],
  );

  return (
    <CEDialog
      {...rest}
      closeDialog={onClose}
      title={
      <Box sx={{ ...styles.centerV, gap: 0.7 }}>
      <StickyNote2Icon fontSize={"small"} />
        <Typography
          variant="semiBoldXLarge"
          sx={{
            ...styles.rtlStyle(lng == "fa"),
          }}
        >
          {t("assessmentReport.viewCodeQualityMeasure", { lng })}
        </Typography>
      </Box>
      }
      sx={{ direction: isRTL ? "rtl" : "ltr" }}
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
  );
};

export default QuestionReportDialog;

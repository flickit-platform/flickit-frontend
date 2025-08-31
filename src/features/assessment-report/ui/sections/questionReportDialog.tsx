import React from "react";
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

const QuestionReportDialog = (props: any) => {
  const { onClose, lng, context, ...rest } = props;
  const { measureId, attributeId } = context?.data ?? {};
  const { data } = useQuestionReportDialog(measureId, attributeId);
  const { highScores, lowScores } = data ?? [];
  const isRTL = lng === "fa" || (!lng && i18next.language === "fa");
  const close = () => {
    onClose();
  };
  return (
    <Box sx={{ direction: lng === "fa" ? "rtl" : "ltr" }}>
      <CEDialog
        {...rest}
        closeDialog={close}
        title={
          <Typography variant="semiBoldXLarge" fontFamily="inherit">
            {t("assessmentReport.viewCodeQualityMeasure")}
          </Typography>
        }
      >
        <Accordion
          sx={{
            background: "inherit",
            boxShadow: "none",
            borderRadius: 2,
            border: ".5px solid #66809980",
          }}
        >
          <AccordionSummary
            sx={{
              flexDirection: "row-reverse",
              my: 0,
              minHeight: "unset",
              px: 2,
              borderRadius: 2,
              border: ".5px solid #66809980",
              background: "#66809914",
              height: "40px",
              "& .MuiAccordionSummary-root": {
                minHeight: "40px",
              },
              "&.Mui-expanded": {
                margin: "0px !important",
                minHeight: "unset",
              },
              "& .MuiAccordionSummary-expandIconWrapper": {
                paddingInlineEnd: "10px",
              },
              "& .MuiAccordionSummary-content": {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
          >
            <Typography variant={"titleSmall"}>
              {t("lowScoringQuestions")}
            </Typography>
            <Typography variant={"bodyMedium"}>
              ({highScores?.length}
              {"  "}
              {t("common.questions")})
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              py: 2,
              direction: lng === "fa" ? "rtl" : "ltr",
            }}
          >
            {highScores?.map((item: any, index: number) => {
              return (
                <>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: lng == "fa" ? "row" : "row-reverse",
                      }}
                    >
                      <Typography>{`Q`}</Typography>
                      <Typography>{`.${index + 1}`}</Typography>
                    </Box>
                    <Typography variant={"bodySmall"}>
                      {item.question.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingInlineStart: "40px",
                    }}
                  >
                    <CheckBoxIcon />
                    <Typography variant={"bodySmall"}>
                      {item.answer.title}
                    </Typography>
                  </Box>
                </>
              );
            })}
          </AccordionDetails>
        </Accordion>
        <CEDialogActions
          cancelLabel={t("common.cancel", { lng })}
          submitButtonLabel={t("common.confirm", { lng })}
          onClose={close}
          onSubmit={() => {}}
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

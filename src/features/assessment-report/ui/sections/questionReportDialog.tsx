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

const InnerAccordion = ({ title, data, expanded, onChange, lng }: any) => (
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
        {t(`assessmentReport.${title}`)}
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

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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

            <Typography variant="bodyMedium" color="primary.main">
              {t("assessmentReport.goToQuestion")}
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
        contentStyle={{ mt: 5, p: "40px 32px" }}
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
              />
            )}
            {highScores.length > 0 && (
              <InnerAccordion
                title="highScoringQuestions"
                data={highScores}
                expanded={expanded === "high"}
                onChange={handleAccordionChange("high")}
                lng={lng}
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

// import React, {useState} from "react";
// import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import i18next, { t } from "i18next";
// import { styles } from "@styles";
// import { useQuestionReportDialog } from "@/features/assessment-report/model/hooks/useQuestionReportDialog";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import Divider from "@mui/material/Divider";
//
// const QuestionReportDialog = (props: any) => {
//   const { onClose, lng, context, ...rest } = props;
//   const { measureId, attributeId } = context?.data ?? {};
//   const { data, loading } = useQuestionReportDialog(measureId, attributeId);
//   const { highScores, lowScores } = data ?? [];
//   const [expended,setExpended] = useState(true)
//   const isRTL = lng === "fa" || (!lng && i18next.language === "fa");
//   const close = () => {
//     onClose();
//   };
//
//   const handeChangeExpended = () =>{
//       setExpended(!expended)
//   }
//   const InnerAccoridon = (props: any) => {
//     const { title, data } = props;
//     return (
//         <Accordion
//             sx={{
//                 background: "inherit",
//                 boxShadow: "none",
//                 borderRadius: 2,
//                 border: ".5px solid #66809980",
//                 mb: "8px"
//             }}
//             expanded={expended}
//             onChange={handeChangeExpended}
//         >
//         <AccordionSummary
//           sx={{
//             flexDirection: "row-reverse",
//             my: 0,
//             minHeight: "unset",
//             px: 2,
//             borderRadius: 2,
//             border: ".5px solid #66809980",
//             background: "#66809914",
//             height: "40px",
//             "& .MuiAccordionSummary-root": {
//               minHeight: "40px",
//             },
//             "&.Mui-expanded": {
//               margin: "0px !important",
//               minHeight: "unset",
//             },
//             "& .MuiAccordionSummary-expandIconWrapper": {
//               paddingInlineEnd: "10px",
//             },
//             "& .MuiAccordionSummary-content": {
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             },
//           }}
//           expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
//         >
//           <Typography variant={"titleSmall"}>
//             {t(`assessmentReport.${title}`)}
//           </Typography>
//           <Typography variant={"bodyMedium"}>
//             ({data?.length}
//             {"  "}
//             {t("common.questions")})
//           </Typography>
//         </AccordionSummary>
//         <AccordionDetails
//           sx={{
//             direction: lng === "fa" ? "rtl" : "ltr",
//           }}
//         >
//           {data?.map((item: any, index: number) => {
//             return (
//               <Box sx={{ px: "16px" }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     mb: "8px",
//                     gap: "7px",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: lng == "fa" ? "row" : "row-reverse",
//                     }}
//                   >
//                     <Typography
//                       variant={"bodyMedium"}
//                       fontWeight={"bold"}
//                     >{`Q`}</Typography>
//                     <Typography
//                       variant={"bodyMedium"}
//                       fontWeight={"bold"}
//                     >{`.${index + 1}`}</Typography>
//                   </Box>
//                   <Typography variant={"bodySmall"}>
//                     {item.question.title}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginInlineStart: "40px",
//                       gap: "10px",
//                       borderRadius: "4px",
//                       border: ".25px solid #6C8093",
//                       p: "4px 8px",
//                     }}
//                   >
//                     <CheckBoxIcon sx={{ color: "#6C8093" }} />
//                     <Typography variant={"bodySmall"}>
//                       {item.answer.title}
//                     </Typography>
//                   </Box>
//                   <Typography variant={"bodyMedium"} color={"primary.main"}>
//                     {t("assessmentReport.goToQuestion")}
//                   </Typography>
//                 </Box>
//                 <Divider
//                   sx={{
//                     bgcolor: ".5px solid #66809980",
//                     my: "8px",
//                   }}
//                 />
//               </Box>
//             );
//           })}
//         </AccordionDetails>
//         </Accordion>
//     );
//   };
//
//   return (
//     <Box sx={{ direction: lng === "fa" ? "rtl" : "ltr" }}>
//       <CEDialog
//         {...rest}
//         closeDialog={close}
//         title={
//           <Typography variant="semiBoldXLarge" fontFamily="inherit">
//             {t("assessmentReport.viewCodeQualityMeasure")}
//           </Typography>
//         }
//         contentStyle={{
//           mt: "40px",
//           p: "40px 32px",
//         }}
//         titleStyle={{
//           mb: 0,
//         }}
//       >
//         {loading ? (
//           <>
//             <>loading</>
//           </>
//         ) : (
//           <Box
//           >
//             {lowScores?.length >= 1 && (
//
//                 <InnerAccoridon
//                   title={"lowScoringQuestions"}
//                   data={lowScores}
//                 />
//             )}
//             {highScores?.length >= 1 && (
//
//                 <InnerAccoridon
//                   title={"highScoringQuestions"}
//                   data={highScores}
//                 />
//             )}
//           </Box>
//         )}
//
//         <CEDialogActions
//           cancelLabel={t("common.cancel", { lng })}
//           submitButtonLabel={t("common.confirm", { lng })}
//           onClose={close}
//           onSubmit={() => {}}
//           sx={{
//             flexDirection: { xs: "column-reverse", sm: "row" },
//             gap: 2,
//             ...styles.rtlStyle(isRTL),
//           }}
//         />
//       </CEDialog>
//     </Box>
//   );
// };
//
// export default QuestionReportDialog;

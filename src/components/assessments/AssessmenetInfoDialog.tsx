import React, { useMemo } from "react";
import { CEDialog } from "@common/dialogs/CEDialog";
import { theme } from "@config/theme";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AssessmentError from "@/assets/svg/AssessmentError.svg";
import Button from "@mui/material/Button";
import { DialogProps } from "@mui/material/Dialog";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
  titleStyle?: any;
  contentStyle?: any;
}

const AssessmenetInfoDialog = (props: IAssessmentCEFromDialogProps) => {
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;

  const abortController = useMemo(() => new AbortController(), [rest.open]);

  const close = () => {
    abortController.abort();
    closeDialog();
  };
  const listOfText = [
    "assessment.reachedNumberOfAssessments",
    "common.youCan",
    "assessment.deleteExistingAssessments",
    "spaces.upgradeToPremiumSpace",
  ];

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <img
            style={{ marginInlineEnd: "6px" }}
            src={AssessmentError}
            alt={"AssessmentError"}
          />
          <Typography sx={{ ...theme.typography.semiBoldXLarge }}>
            <Trans i18nKey="assessment.assessmentLimitExceeded" />
          </Typography>
        </>
      }
    >
      <Box sx={{ p: 4 }}>
        {listOfText.map((text: string, index: number) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                listStyleType: "disc",
                fontSize: "1.2rem",
                gap: "2px",
                color: "#2B333B",
              }}
            >
              <Typography
                component={index >= 2 ? "li" : "p"}
                variant="semiBoldLarge"
              >
                {text == "spaces.upgradeToPremiumSpace" &&
                  theme.direction == "rtl" && (
                    <Typography variant="semiBoldLarge">
                      (<Trans i18nKey={"common.comingSoon"} />
                      !)
                    </Typography>
                  )}
                <Trans i18nKey={text} />
                {text == "common.youCan" && ":"}
              </Typography>
              {text == "spaces.upgradeToPremiumSpace" && theme.direction == "ltr" && (
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey={"common.comingSoon"} />.
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          p: 2,
        }}
      >
        <Button onClick={close} variant="contained">
          <Trans i18nKey="common.okGotIt" />
        </Button>
      </Box>
    </CEDialog>
  );
};

export default AssessmenetInfoDialog;

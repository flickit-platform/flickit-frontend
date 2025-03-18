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
    "reachedNumberOfAssessments",
    "youCanT",
    "deleteExistingAssessments",
    "upgradeToPremiumSpace",
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
            <Trans i18nKey="assessmentLimitExceeded" />
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
                color: "#2B333B"
              }}
            >
              <Typography
                component={index >= 2 ? "li" : "p"}
                sx={{ ...theme.typography.bodyLarge, fontWeight: "semi-bold" }}
              >
                {text == "upgradeToPremiumSpace" && theme.direction == "rtl"  &&(
                    <Typography sx={{ ...theme.typography.semiBoldLarge,fontWeight: "bold", display: "inline-block", marginInlineEnd: "2px" }}>
                      (<Trans i18nKey={"comingSoon"} />!)
                    </Typography>
                )}
                <Trans i18nKey={text} />{text == "youCanT" && ":" }
              </Typography>
              {text == "upgradeToPremiumSpace" && theme.direction == "ltr"  &&(
                <Typography sx={{ ...theme.typography.bodyLarge, fontWeight: "semi-bold" }}>
                  (<Trans i18nKey={"comingSoon"} />).
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
          <Trans i18nKey="okGotIt" />
        </Button>
      </Box>
    </CEDialog>
  );
};

export default AssessmenetInfoDialog;

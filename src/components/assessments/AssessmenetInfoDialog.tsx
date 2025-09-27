import { useMemo } from "react";
import { CEDialog } from "@common/dialogs/CEDialog";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AssessmentLimitExceeded from "@/assets/svg/assessment-limit-exceeded.svg";
import Button from "@mui/material/Button";
import { DialogProps } from "@mui/material/Dialog";
import { useTheme } from "@mui/material";
import { styles } from "@styles";
import uniqueId from "@/utils/unique-id";

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
  const theme = useTheme();

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
            src={AssessmentLimitExceeded}
            alt={"AssessmentLimitExceeded"}
          />
          <Typography variant="semiBoldXLarge">
            <Trans i18nKey="assessment.assessmentLimitExceeded" />
          </Typography>
        </>
      }
    >
      <Box p={4}>
        {listOfText.map((text: string, index: number) => {
          return (
            <Box
              key={uniqueId()}
              justifyContent="flex-start"
              color="text.primary"
              gap="2px"
              fontSize="1.2rem"
              sx={{ listStyleType: "disc", ...styles.centerV }}
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
              {text == "spaces.upgradeToPremiumSpace" &&
                theme.direction == "ltr" && (
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey={"common.comingSoon"} />.
                  </Typography>
                )}
            </Box>
          );
        })}
      </Box>
      <Box justifyContent="flex-end" p={2} sx={{ ...styles.centerV }}>
        <Button onClick={close} variant="contained">
          <Trans i18nKey="common.okGotIt" />
        </Button>
      </Box>
    </CEDialog>
  );
};

export default AssessmenetInfoDialog;

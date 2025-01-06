import { useEffect, useMemo } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { Trans } from "react-i18next";
import { CEDialog } from "@common/dialogs/CEDialog";
import { Chip, Typography } from "@mui/material";
import { generateColorFromString } from "@/config/styles";
import { CircleRating } from "./MaturityLevelTable";

interface IQuestionDetailsDialogDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const QuestionDetailsDialog = (props: IQuestionDetailsDialogDialogProps) => {
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { data = {} } = context;
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const close = () => {
    abortController.abort();
    closeDialog();
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <Trans i18nKey="question" />
        </>
      }
    >
      <Chip
        label={data?.questionnaire}
        style={{
          backgroundColor: generateColorFromString(data?.questionnaire)
            .backgroundColor,
          color: generateColorFromString(data?.questionnaire).color,
        }}
      />
      <Typography>{data?.question?.title}</Typography>
      <Typography>{data?.question?.hint}</Typography>
      <Typography>{data?.answer?.title}</Typography>
      <CircleRating value={data?.answer?.confidenceLevel} />
    </CEDialog>
  );
};

export default QuestionDetailsDialog;

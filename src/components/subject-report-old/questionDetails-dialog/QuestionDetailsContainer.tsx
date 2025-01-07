import { useEffect, useMemo } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { Trans } from "react-i18next";
import { CEDialog } from "@common/dialogs/CEDialog";
import { Chip, Typography } from "@mui/material";
import { generateColorFromString } from "@styles";
import { CircleRating } from "../MaturityLevelTable";
import NavigationQuestion from "@components/subject-report-old/questionDetails-dialog/NavigationQuestion";
import QuestionSection from "@components/subject-report-old/questionDetails-dialog/questionSection";

interface IQuestionDetailsDialogDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const QuestionDetailsContainer = (props: IQuestionDetailsDialogDialogProps) => {
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
      style={{padding: "32px"}}
      title={
        <>
          <Trans i18nKey="questionDetails" />
        </>
      }
    >
      <NavigationQuestion />
      <QuestionSection data={data} />
    </CEDialog>
  );
};

export default QuestionDetailsContainer;

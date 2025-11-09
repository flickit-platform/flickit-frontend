import { useState, useEffect, useMemo } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";
import {
  Box,
  Divider,
  IconButton,
  Rating,
  ToggleButton,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  RadioButtonCheckedRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material";
import { styles } from "@styles";
import { useQuestionNavigator } from "../model/sidebar/useQuestionNavigator";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";
import { useAnswerSubmit } from "../model/useAnswerSubmit";
import FooterTabs from "@/features/questions/ui/footer/FooterTabs";

const QuestionView = () => {
  useDocumentTitle();
  const { t } = useTranslation();
  const {
    selectedQuestion: activeQuestion,
    questions = [],
    filteredQuestions,
  } = useQuestionContext();

  const { isAtStart, isAtEnd, goPrevious, goNext } = useQuestionNavigator(
    questions,
    filteredQuestions,
    activeQuestion,
  );

  const { isAdvanced } = useAssessmentMode();
  const { submit, isLoading, approve } = useAnswerSubmit();

  const answer = activeQuestion?.answer;

  const prevSelectedId = answer?.selectedOption?.id ?? null;
  const prevConfidenceId = answer?.confidenceLevel?.id ?? null;

  const initialSelected = useMemo(
    () =>
      answer?.selectedOption ??
      activeQuestion?.options?.find((o: any) => o?.isSelected) ??
      null,
    [answer?.selectedOption, activeQuestion],
  );

  const [selectedOption, setSelectedOption] = useState<any>(initialSelected);
  const [confidence, setConfidence] = useState<number | null>(prevConfidenceId);
  const [notApplicable, setNotApplicable] = useState<boolean>(
    !!answer?.isNotApplicable,
  );
  const [autoNext, setAutoNext] = useState<boolean>(true);

  useEffect(() => {
    setSelectedOption(
      answer?.selectedOption ??
        activeQuestion?.options?.find((o: any) => o?.isSelected) ??
        null,
    );
    setConfidence(answer?.confidenceLevel?.id ?? null);
    setNotApplicable(!!answer?.isNotApplicable);
  }, [
    activeQuestion?.id,
    answer?.selectedOption,
    answer?.confidenceLevel?.id,
    answer?.isNotApplicable,
    activeQuestion,
  ]);

  const onSelectOption = async (option: any) => {
    const isAlreadySelected = isAdvanced
      ? selectedOption?.id === option?.id
      : activeQuestion?.answer?.selectedOption?.id === option?.id;

    if (isAdvanced) {
      setNotApplicable(false);
      setSelectedOption(isAlreadySelected ? null : option);
      return;
    }

    if (isAlreadySelected) {
      await submit({
        value: null,
        notApplicable: false,
        confidenceLevelId: null,
        submitOnAnswerSelection: true,
      });
      return;
    }

    await submit({
      value: option,
      notApplicable: false,
      confidenceLevelId: 3,
      submitOnAnswerSelection: true,
    });
    goNext();
  };

  const onSubmit = async () => {
    await submit({
      value: notApplicable ? null : (selectedOption ?? null),
      notApplicable,
      confidenceLevelId: confidence ?? null,
      submitOnAnswerSelection: false,
    });
    if (autoNext) goNext();
  };

  const selectedIdForRender = isAdvanced
    ? (selectedOption?.id ?? null)
    : (activeQuestion?.answer?.selectedOption?.id ?? null);

  // --- Confidence rating icon logic ---
  const current = Number(confidence) || 0;
  const prev = Number(prevConfidenceId) || 0;

  const ConfidenceIconContainer = (props: any) => {
    const { value, ...other } = props;
    const isFilled = value <= current;
    const shouldBorder = !isFilled && value <= prev;
    return (
      <span {...other}>
        {isFilled ? (
          <RadioButtonCheckedRounded color="primary" />
        ) : shouldBorder ? (
          <RadioButtonUncheckedRounded sx={{ color: "primary.main" }} />
        ) : (
          <RadioButtonUncheckedRounded sx={{ color: "action.disabled" }} />
        )}
      </span>
    );
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={3}>
      <Box
        bgcolor="background.background"
        borderRadius="12px"
        boxShadow="0 0 0 1px rgba(0,0,0,0.04), 0 8px 8px -8px rgba(0,0,0,0.16)"
      >
        {/* Header */}
        <Box padding="16px 24px" sx={{ ...styles.centerCV }} gap="10px">
          <Text
            variant="semiBoldMedium"
            color="background.contrastText"
            textAlign="justify"
          >
            {activeQuestion?.index}. {activeQuestion?.title}
            {activeQuestion?.hint && (
              <Text
                variant="semiBoldSmall"
                color="primary.main"
                p={0.5}
                marginInlineStart={0.5}
              >
                {t("common.hint")}
              </Text>
            )}
          </Text>
          {activeQuestion?.hint && (
            <Text variant="bodySmall" color="text.primary" textAlign="justify">
              {activeQuestion?.hint}
            </Text>
          )}
        </Box>

        <Divider sx={{ width: "100%" }} />

        {/* Options */}
        <Box display="flex" padding="16px 24px" flexDirection="column">
          <Box>
            {activeQuestion?.options?.map((option: any) => {
              const { index: displayIndex, title, id } = option ?? {};
              const isSelectedNow =
                !notApplicable && selectedIdForRender === id;
              const wasSelectedBefore =
                !notApplicable && !isSelectedNow && prevSelectedId === id;

              const hasUnapproved =
                activeQuestion?.issues?.hasUnapprovedAnswer === true;

              const showApproveButton = hasUnapproved && prevSelectedId === id;

              const borderColor = showApproveButton
                ? "tertiary.main"
                : isSelectedNow || wasSelectedBefore
                  ? "primary.main"
                  : "outline.variant";

              const bgColor = showApproveButton ? "tertiary.bg" : "transparent";
              const selectedBgColor = showApproveButton
                ? "tertiary.bg"
                : "primary.states.selected";

              return (
                <Box
                  display="flex"
                  key={id}
                  mb={1}
                  gap={1}
                  sx={{ ...styles.centerV }}
                >
                  <ToggleButton
                    data-cy="answer-option"
                    color="primary"
                    size="large"
                    value={id}
                    selected={isSelectedNow}
                    onClick={() => onSelectOption(option)}
                    sx={{
                      p: 0,
                      paddingInlineStart: "4px",
                      paddingInlineEnd: "12px",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor,
                      justifyContent: "flex-start",
                      height: 36,
                      bgcolor: bgColor,
                      "&.Mui-selected": {
                        bgcolor: selectedBgColor,
                      },
                    }}
                    disabled={notApplicable}
                  >
                    <Checkbox
                      checked={isSelectedNow}
                      size="small"
                      color={showApproveButton ? "warning" : "primary"}
                    />
                    <Text
                      variant="bodyMedium"
                      textTransform="initial"
                      color="text.primary"
                    >
                      {displayIndex}. {title}
                    </Text>
                  </ToggleButton>
                  {showApproveButton && (
                    <LoadingButton
                      size="small"
                      variant="contained"
                      sx={{ bgcolor: "tertiary.main", height: 28 }}
                      onClick={approve}
                    >
                      {t("common.approve")}
                    </LoadingButton>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Not applicable + Submit row */}
          <Box
            mt={1.5}
            display="flex"
            alignItems="center"
            justifyContent={
              activeQuestion?.mayNotBeApplicable ? "space-between" : "flex-end"
            }
          >
            {activeQuestion?.mayNotBeApplicable && (
              <FormControlLabel
                control={
                  <Switch
                    checked={notApplicable}
                    onChange={(_, checked) => {
                      setNotApplicable(checked);
                      if (checked) setSelectedOption(null);
                    }}
                  />
                }
                label={t("questions_temp.notApplicable") as string}
              />
            )}

            {isAdvanced && (
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={onSubmit}
                loading={isLoading}
                disabled={selectedOption && confidence == null}
              >
                {t("common.submit")}
              </LoadingButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ width: "100%" }} />

        {/* Footer */}
        <Box
          display="flex"
          padding="16px 24px"
          sx={{ ...styles.centerV }}
          justifyContent="space-between"
        >
          <Box display="flex" gap={2} alignItems="center">
            {isAdvanced && (
              <>
                <Text variant="bodyMedium">{t("common.confidenceLevel")}</Text>

                <Rating
                  value={current}
                  onChange={(_, v) => setConfidence(v ?? null)}
                  size="medium"
                  IconContainerComponent={ConfidenceIconContainer}
                />
              </>
            )}
          </Box>

          <Box display="flex" gap={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoNext}
                  onChange={(_, checked) => setAutoNext(checked)}
                  size="small"
                  sx={{ p: 0, px: 0.5 }}
                />
              }
              label={
                <Text variant="bodySmall">
                  {t("questions_temp.quickAnswer")}
                </Text>
              }
            />
            <Box display="flex" gap={1}>
              <IconButton
                aria-label={t("common.prev") as string}
                color="primary"
                disabled={isAtStart}
                onClick={goPrevious}
                sx={{
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: "primary.main",
                  p: 0,
                }}
              >
                <KeyboardArrowUpRounded fontSize="large" />
              </IconButton>
              <IconButton
                aria-label={t("common.next") as string}
                color="primary"
                disabled={isAtEnd}
                onClick={goNext}
                sx={{
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: "primary.main",
                  p: 0,
                }}
              >
                <KeyboardArrowDownRounded fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      {isAdvanced && <FooterTabs />}
    </Box>
  );
};

export default QuestionView;

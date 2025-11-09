import { useState, useEffect, useMemo } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useQuestionContext } from "../context";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  Rating,
  ToggleButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import {
  InfoOutline,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  RadioButtonCheckedRounded,
} from "@mui/icons-material";
import { styles } from "@styles";
import { useQuestionNavigator } from "../model/sidebar/useQuestionNavigator";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";
import { useAnswerSubmit } from "../model/useAnswerSubmit";

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
    { enablePagingShortcuts: true },
  );

  const { isAdvanced } = useAssessmentMode();
  const { submit, isSubmitting } = useAnswerSubmit();

  const answer = activeQuestion?.answer;

  const initialSelected = useMemo(
    () =>
      answer?.selectedOption ??
      activeQuestion?.options?.find((o: any) => o?.isSelected) ??
      null,
    [answer?.selectedOption, activeQuestion],
  );

  const [selectedOption, setSelectedOption] = useState<any>(initialSelected);
  const [confidence, setConfidence] = useState<number | null>(
    answer?.confidenceLevel?.id ?? null,
  );
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

  // انتخاب/حذف پاسخ با کلیک روی گزینه
  const onSelectOption = async (option: any) => {
    const isAlreadySelected = isAdvanced
      ? selectedOption?.id === option?.id
      : activeQuestion?.answer?.selectedOption?.id === option?.id;

    if (isAdvanced) {
      // در حالت Advanced فقط لوکالی toggle؛ ارسال با Submit
      setSelectedOption(isAlreadySelected ? null : option);
      return;
    }

    // حالت سریع (Non-Advanced): کلیک مجدد روی گزینه انتخاب‌شده ⇒ حذف پاسخ
    if (isAlreadySelected) {
      await submit({
        value: null,
        notApplicable: false,
        confidenceLevelId: null,
        submitOnAnswerSelection: true,
      });
      return; // روی همین سؤال بمان
    }

    // انتخاب معمولی: ارسال و رفتن به سؤال بعد
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
      value: selectedOption ?? null,
      notApplicable,
      confidenceLevelId: confidence ?? null,
      submitOnAnswerSelection: false,
    });
    if (autoNext) goNext();
  };

  // منبع حقیقت برای نمایش انتخاب‌شدن در UI
  const selectedIdForRender = isAdvanced
    ? selectedOption?.id ?? null
    : activeQuestion?.answer?.selectedOption?.id ?? null;

  return (
    <Box width="100%">
      <Box bgcolor="background.background" borderRadius="12px">
        {/* Header */}
        <Box
          display="flex"
          padding="16px 24px"
          sx={{ ...styles.centerV }}
          justifyContent="space-between"
        >
          <Text
            variant="semiBoldMedium"
            color="background.contrastText"
            textAlign="justify"
          >
            {activeQuestion?.index}. {activeQuestion?.title}
          </Text>

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

        <Divider sx={{ width: "100%" }} />

        {/* Content */}
        <Box display="flex" padding="16px 24px" flexDirection="column" gap={4}>
          {activeQuestion?.hint && (
            <Box sx={{ ...styles.centerCV }} gap={1} width="100%">
              <Box sx={{ ...styles.centerV }} gap={0.5}>
                <InfoOutline fontSize="small" sx={{ color: "info.main" }} />
                <Text variant="semiBoldMedium" color="info.main">
                  {t("common.hint")}
                </Text>
              </Box>
              <Text
                width="100%"
                variant="bodySmall"
                color="info.main"
                border="1px dashed"
                borderColor="info.main"
                borderRadius="8px"
                padding="8px 24px"
              >
                {activeQuestion?.hint}
              </Text>
            </Box>
          )}

          {/* Options */}
          <Box>
            {activeQuestion?.options?.map((option: any) => {
              const { index: displayIndex, title } = option ?? {};
              const selected = selectedIdForRender === option?.id;

              return (
                <Box key={option?.id} mb={2} mr={2}>
                  <ToggleButton
                    data-cy="answer-option"
                    color="primary"
                    size="large"
                    value={option?.id}
                    selected={selected}
                    onClick={() => onSelectOption(option)}
                    sx={{
                      p: 0,
                      px: "12px",
                      borderRadius: "8px",
                      borderColor: "outline.variant",
                      justifyContent: "flex-start",
                      gap: 1,
                      height: 44,
                      textAlign: "right",
                    }}
                  >
                    <Checkbox disableRipple checked={selected} size="small" />
                    <Text
                      variant="bodyMedium"
                      textTransform="initial"
                      color="text.primary"
                    >
                      {displayIndex}. {title}
                    </Text>
                  </ToggleButton>
                </Box>
              );
            })}
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
          <Box display="flex" gap={3} alignItems="center">
            {isAdvanced && (
              <>
                <Text variant="bodyMedium">{t("common.confidenceLevel")}</Text>
                <Rating
                  value={Number(confidence) || 0}
                  onChange={(_, v) => setConfidence(v ?? null)}
                  size="medium"
                  icon={<RadioButtonCheckedRounded />}
                  emptyIcon={<RadioButtonCheckedRounded />}
                />
              </>
            )}
          </Box>

          <Box display="flex" gap={3} alignItems="center">
            {isAdvanced ? (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    size="small"
                    disableRipple
                    sx={{ p: 0 }}
                    checked={notApplicable}
                    onChange={(e) => setNotApplicable(e.target.checked)}
                  />
                  <Text variant="bodySmall" color="text.primary">
                    {t("common.notApplicable")}
                  </Text>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    size="small"
                    disableRipple
                    sx={{ p: 0 }}
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                  />
                  <Text variant="bodySmall" color="text.primary">
                    {t("common.goNextAfterSubmit")}
                  </Text>
                </Box>

                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  loading={isSubmitting}
                  disabled={!selectedOption && !notApplicable && confidence == null}
                >
                  {t("common.submit")}
                </LoadingButton>
              </>
            ) : (
              <Box display="flex" alignItems="center" gap={1}>
                <Text variant="bodySmall" color="text.primary">
                  {t("common.answer")}
                </Text>
                <InfoOutline fontSize="small" sx={{ color: "info.main" }} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionView;

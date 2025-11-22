import { useState, useEffect, useMemo } from "react";
import { useQuestionContext } from "../../context";
import {
  Box,
  Divider,
  IconButton,
  Rating,
  ToggleButton,
  FormControlLabel,
  Switch,
  Checkbox,
  Tooltip,
  Collapse,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import {
  InfoOutlineRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  RadioButtonCheckedRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material";
import { styles } from "@styles";
import { useQuestionNavigator } from "../../model/sidebar/useQuestionNavigator";
import { useAssessmentMode } from "@/hooks/useAssessmentMode";
import { useAnswerSubmit } from "../../model/question/useAnswerSubmit";
import useDialog from "@/hooks/useDialog";
import MoreActions from "@common/MoreActions";
import useMenu from "@/hooks/useMenu";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import languageDetector from "@/utils/language-detector";
import ReportDialog from "./ReportDialog";
import { IPermissions } from "@/types";

const Body = (props: Readonly<{ permissions: IPermissions }>) => {
  const { permissions }: { permissions: IPermissions } = props;

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
  const dialogProps = useDialog();
  const answer = activeQuestion?.answer;
  const menu = useMenu();

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
  const [showHint, setShowHint] = useState<boolean>(false);

  const isTitleRTL = useMemo(
    () => languageDetector(activeQuestion?.title),
    [activeQuestion?.title],
  );

  useEffect(() => {
    setSelectedOption(
      answer?.selectedOption ??
        activeQuestion?.options?.find((o: any) => o?.isSelected) ??
        null,
    );
    setConfidence(answer?.confidenceLevel?.id ?? null);
    setNotApplicable(!!answer?.isNotApplicable);
    setShowHint(false);
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
      goNext();

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
    <Box
      bgcolor="background.background"
      borderRadius="12px"
      boxShadow="0 0 0 1px rgba(0,0,0,0.04), 0 8px 8px -8px rgba(0,0,0,0.16)"
    >
      {/* Header */}
      <Box
        sx={{ ...styles.centerCV, direction: isTitleRTL ? "rtl" : "ltr" }}
        gap="10px"
      >
        <Box
          sx={{
            ...styles.centerVH,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }} padding="16px 24px">
            <Text
              variant="semiBoldMedium"
              color="background.contrastText"
              textAlign="justify"
            >
              {activeQuestion?.index}. {activeQuestion?.title}
              {activeQuestion?.hint && (
                <Text
                  component="span"
                  variant="semiBoldSmall"
                  color="primary.main"
                  p={0.5}
                  marginInlineStart={0.5}
                  sx={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint((prev) => !prev);
                  }}
                >
                  {t("common.hint")}
                </Text>
              )}
            </Text>

            {activeQuestion?.hint && (
              <Collapse in={showHint}>
                <Text
                  variant="bodySmall"
                  color="text.primary"
                  textAlign="justify"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {activeQuestion?.hint}
                </Text>
              </Collapse>
            )}
          </Box>

          {isAdvanced && (
            <MoreActions
              {...menu}
              boxProps={{
                sx: {
                  p: 1,
                },
              }}
              items={[
                {
                  icon: (
                    <ReportGmailerrorredIcon fontSize="small" color="error" />
                  ),
                  text: (
                    <Text
                      color="error.main"
                      variant={"bodySmall"}
                      display="flex"
                    >
                      {t("questions_temp.reportQuestionTitle")}
                    </Text>
                  ),
                  onClick: () =>
                    dialogProps.openDialog({
                      type: "create",
                      data: { questionId: activeQuestion?.id },
                    }),
                },
              ]}
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ width: "100%" }} />

      {/* Options */}
      <Box
        display="flex"
        padding="16px 24px"
        flexDirection="column"
        sx={{ direction: isTitleRTL ? "rtl" : "ltr" }}
      >
        <Box>
          {activeQuestion?.options?.map((option: any) => {
            const { index: displayIndex, title, id } = option ?? {};
            const isSelectedNow = !notApplicable && selectedIdForRender === id;
            const wasSelectedBefore =
              !notApplicable && !isSelectedNow && prevSelectedId === id;

            const hasUnapproved =
              activeQuestion?.issues?.hasUnapprovedAnswer === true;

            const showApproveButton =
              hasUnapproved &&
              prevSelectedId === id &&
              permissions.approveAnswer;

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
                  disableRipple
                  value={id}
                  selected={isSelectedNow}
                  onClick={() => onSelectOption(option)}
                  sx={{
                    p: 0,
                    gap: "8px",
                    paddingInlineStart: "4px",
                    paddingInlineEnd: "12px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor,
                    justifyContent: "flex-start",
                    bgcolor: bgColor,
                    "&.Mui-selected": {
                      bgcolor: selectedBgColor,
                    },
                    "&.Mui-disabled": {
                      bgcolor: "background.container",
                      color: "outline.variant",
                    },
                  }}
                  disabled={notApplicable || !permissions.answerQuestion}
                >
                  <Checkbox
                    checked={isSelectedNow}
                    size="small"
                    color={showApproveButton ? "warning" : "primary"}
                    sx={{ p: "6.5px" }}
                    disableRipple
                  />
                  <Text
                    variant="bodyMedium"
                    textTransform="initial"
                    color={"text.primary"}
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
              label={
                <Box color="info.main" sx={{ ...styles.centerV }} gap="6px">
                  <Text variant="bodySmall" color="text.primary">
                    {t("questions_temp.notApplicableLabel")}
                  </Text>
                  <Tooltip title={t("questions_temp.notApplicableDescription")}>
                    <InfoOutlineRounded fontSize="small" />
                  </Tooltip>
                </Box>
              }
            />
          )}

          {isAdvanced && (
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={onSubmit}
              loading={isLoading}
              disabled={
                (selectedOption && confidence == null) ||
                !permissions.answerQuestion
              }
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
        <Box>
          {isAdvanced ? (
            <Box
              sx={{
                ...styles.centerV,
                bgcolor:
                  !confidence && selectedOption
                    ? "error.states.hover"
                    : "transparent",
                border: "1px solid",
                borderColor:
                  !confidence && selectedOption ? "error.main" : "transparent",
                borderRadius: "4px",
              }}
              gap={3}
              p="8px"
            >
              <Text variant="bodyMedium">{t("common.confidenceLevel")}</Text>

              <Rating
                disabled={!permissions.answerQuestion}
                value={current}
                onChange={(_, v) => setConfidence(v ?? null)}
                size="medium"
                IconContainerComponent={ConfidenceIconContainer}
              />
            </Box>
          ) : (
            <Box
              onClick={() =>
                dialogProps.openDialog({
                  type: "create",
                  data: { questionId: activeQuestion?.id },
                })
              }
              sx={{
                ...styles.centerVH,
                color: "error.main",
                cursor: "pointer",
                gap: 1,
              }}
            >
              <ReportGmailerrorredIcon fontSize="small" />
              <Text variant={"bodySmall"}>
                {t("questions_temp.reportQuestionTitle")}
              </Text>
            </Box>
          )}
        </Box>

        <Box display="flex" gap={3}>
          {isAdvanced && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoNext}
                  onChange={(_, checked) => setAutoNext(checked)}
                  size="small"
                  sx={{ p: 0, px: 0.5 }}
                  disabled={!permissions.answerQuestion}
                />
              }
              label={
                <Box color="info.main" sx={{ ...styles.centerV }} gap="6px">
                  <Text variant="bodySmall" color="text.primary">
                    {t("questions_temp.autoAdvanceToggleLabel")}
                  </Text>
                  <Tooltip title={t("questions_temp.autoAdvanceToggleDescription")}>
                    <InfoOutlineRounded fontSize="small" />
                  </Tooltip>
                </Box>
              }
            />
          )}
          <Box display="flex" gap={1}>
            <Tooltip title={t("common.previous")}>
              <IconButton
                aria-label={t("common.preivous")}
                color="primary"
                disabled={isAtStart}
                onClick={goPrevious}
                sx={{
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: isAtStart ? "" : "primary.main",
                  p: 0,
                }}
              >
                <KeyboardArrowUpRounded fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("common.next")}>
              <IconButton
                aria-label={t("common.next")}
                color="primary"
                disabled={isAtEnd}
                onClick={goNext}
                sx={{
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: isAtEnd ? "" : "primary.main",
                  p: 0,
                }}
              >
                <KeyboardArrowDownRounded fontSize="large" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      {dialogProps.open && <ReportDialog {...dialogProps} />}
    </Box>
  );
};

export default Body;

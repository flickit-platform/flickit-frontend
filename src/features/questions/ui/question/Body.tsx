import { useState, useEffect, useMemo } from "react";
import {
  setSelectedConfidence,
  setSelectedQuestion,
  useQuestionContext,
  useQuestionDispatch,
} from "../../context";
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
import QueryData from "@/components/common/QueryData";
import { LoadingSkeleton } from "@/components/common/loadings/LoadingSkeleton";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";

const Body = (props: Readonly<{ permissions: IPermissions }>) => {
  const { permissions }: { permissions: IPermissions } = props;
  const { selectedQuestion, confidenceLevels } = useQuestionContext();

  const { assessmentId } = useParams();
  const { service } = useServiceContext();
  const dispatch = useQuestionDispatch();

  const { t } = useTranslation();
  const {
    selectedQuestion: activeQuestion,
    questions = [],
    filteredQuestions,
    selectedConfidence,
  } = useQuestionContext();

  const { isAtStart, isAtEnd, goPrevious, goNext } = useQuestionNavigator(
    questions,
    filteredQuestions,
    activeQuestion,
  );

  const fetchQuestion = useQuery({
    service: (args, config) =>
      service.assessments.questionnaire.getQuestion(args, config),
    runOnMount: false,
  });

  const { isAdvanced } = useAssessmentMode();
  const { submit, isLoading, approve, isLoadingApprove } = useAnswerSubmit();
  const dialogProps = useDialog();
  const answer = activeQuestion?.answer;
  const menu = useMenu();

  const [prevSelectedId, setPrevSelectedId] = useState<number | null>(
    selectedQuestion?.answer?.selectedOption?.id ?? null,
  );
  const [prevConfidenceId, setPrevConfidenceId] = useState<number | null>(
    selectedQuestion?.answer?.confidenceLevel?.id ?? null,
  );

  const initialSelected = useMemo(
    () =>
      answer?.selectedOption ??
      activeQuestion?.options?.find((o: any) => o?.isSelected) ??
      null,
    [answer?.selectedOption, activeQuestion],
  );

  const [selectedOption, setSelectedOption] = useState<any>(initialSelected);
  const [confidence, setConfidence] = useState<number | null>(
    prevConfidenceId ?? selectedConfidence,
  );
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
    setConfidence(answer?.confidenceLevel?.id ?? selectedConfidence);
    setNotApplicable(!!answer?.isNotApplicable);
    setShowHint(false);
  }, [
    activeQuestion?.id,
    answer?.selectedOption,
    answer?.isNotApplicable,
  ]);

  const onSelectOption = async (option: any) => {
    const isAlreadySelected = isAdvanced
      ? selectedOption?.id === option?.id
      : activeQuestion?.answer?.selectedOption?.id === option?.id;

    if (isAdvanced) {
      setNotApplicable(false);
      setSelectedOption(isAlreadySelected ? null : option);

      const updatedItem = {
        ...selectedQuestion,
        answer: {
          ...selectedQuestion?.answer,
          selectedOption: isAlreadySelected
            ? null
            : {
                ...selectedQuestion?.answer?.selectedOption,
                ...option,
              },
          confidenceLevel: { id: confidence },
        },
      };

      dispatch(setSelectedQuestion(updatedItem));
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
    dispatch(setSelectedConfidence(confidence));

    if (autoNext) goNext();
  };

  const onApprove = async () => {
    await approve();
    dispatch(setSelectedConfidence(confidence));

    if (autoNext || !isAdvanced) goNext();
  };

  const selectedIdForRender = isAdvanced
    ? (selectedOption?.id ?? null)
    : (activeQuestion?.answer?.selectedOption?.id ?? null);

  const hasUnapprovedFromServer =
    activeQuestion?.issues?.hasUnapprovedAnswer === true &&
    permissions.approveAnswer;

  const showUnapprovedBanner =
    hasUnapprovedFromServer &&
    prevSelectedId != null &&
    selectedIdForRender === prevSelectedId &&
    confidence == prevConfidenceId;

  const currentSelectedId = selectedOption?.id ?? null;
  const currentConfidenceId = confidence ?? null;

  const hasAnswerChanged =
    (prevSelectedId !== null || prevConfidenceId !== null) &&
    (prevSelectedId !== currentSelectedId ||
      prevConfidenceId !== currentConfidenceId);

  const hasNewAnswerOnEmptyPrev =
    prevSelectedId === null &&
    prevConfidenceId === null &&
    currentSelectedId !== null &&
    currentConfidenceId !== null;

  const isIncompleteCurrentAnswer =
    currentSelectedId !== null && currentConfidenceId === null;

  const shouldShowSubmit =
    isAdvanced &&
    permissions.answerQuestion &&
    !isIncompleteCurrentAnswer &&
    (hasAnswerChanged || hasNewAnswerOnEmptyPrev);

  const current = Number(confidence) || 0;
  const prev = Number(prevConfidenceId) || 0;

  const ConfidenceIconContainer = (props: any) => {
    const { value, ...other } = props;
    const isFilled = value <= current;
    const shouldBorder = !isFilled && value <= prev;
    return (
      <span {...other}>
        {isFilled ? (
          <RadioButtonCheckedRounded
            color={
              hasUnapprovedFromServer && confidence === prevConfidenceId
                ? "warning"
                : "primary"
            }
          />
        ) : shouldBorder ? (
          <RadioButtonUncheckedRounded
            sx={{
              color:
                hasUnapprovedFromServer && confidence !== prevConfidenceId
                  ? "tertiary.main"
                  : "primary.main",
            }}
          />
        ) : (
          <RadioButtonUncheckedRounded sx={{ color: "action.disabled" }} />
        )}
      </span>
    );
  };

  useEffect(() => {
    if (activeQuestion?.id) {
      fetchQuestion
        .query({ assessmentId, questionId: activeQuestion.id })
        .then((res: any) => {
          dispatch(setSelectedQuestion(res));
          setPrevSelectedId(res?.answer?.selectedOption?.id ?? null);
          setPrevConfidenceId(res?.answer?.confidenceLevel?.id ?? null);
        });
    }
  }, [activeQuestion?.id]);

  return (
    <QueryData
      {...fetchQuestion}
      renderLoading={() => <LoadingSkeleton height={420} />}
      render={() => {
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      flexWrap: "wrap",
                      textAlign: "justify",
                    }}
                  >
                    <Text
                      variant="semiBoldMedium"
                      color="background.contrastText"
                      sx={{
                        display: "inline",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {activeQuestion?.index}. {activeQuestion?.title}
                      {activeQuestion?.hint && (
                        <Box
                          component="span"
                          sx={{
                            paddingInlineStart: 1,
                            display: "inline-flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint((prev) => !prev);
                          }}
                        >
                          <Text
                            component="span"
                            variant="semiBoldSmall"
                            color="primary.main"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {t("common.hint")}
                            <InfoOutlineRounded sx={{ fontSize: 16 }} />
                          </Text>
                        </Box>
                      )}
                    </Text>
                  </Box>
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
                        py: 1,
                        paddingInlineStart: 0,
                      },
                    }}
                    items={[
                      {
                        icon: (
                          <ReportGmailerrorredIcon
                            fontSize="small"
                            color="error"
                          />
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
                  const isSelectedNow =
                    !notApplicable && selectedIdForRender === id;
                  const wasSelectedBefore =
                    !notApplicable && !isSelectedNow && prevSelectedId === id;

                  const isPrevUnapprovedOption =
                    hasUnapprovedFromServer && prevSelectedId === id;

                  const showApproveButton =
                    showUnapprovedBanner && isPrevUnapprovedOption;

                  const borderColor = isPrevUnapprovedOption
                    ? "tertiary.main"
                    : isSelectedNow || wasSelectedBefore
                      ? "primary.main"
                      : "outline.variant";

                  const selectedBgColor = showUnapprovedBanner
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
                          "&.Mui-selected": {
                            bgcolor: selectedBgColor,
                          },
                          "&.Mui-disabled": {
                            bgcolor: "background.container",
                            color: "outline.variant",
                          },
                        }}
                        disabled={notApplicable || !permissions?.answerQuestion}
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
                          textAlign="start"
                        >
                          {displayIndex}. {title}
                        </Text>
                      </ToggleButton>
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
                  activeQuestion?.mayNotBeApplicable
                    ? "space-between"
                    : "flex-end"
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
                      <Box
                        color="info.main"
                        sx={{ ...styles.centerV }}
                        gap="6px"
                      >
                        <Text
                          variant="bodySmall"
                          color="text.primary"
                          width="max-content"
                        >
                          {t("questions_temp.notApplicableLabel")}
                        </Text>
                        <Tooltip
                          title={t("questions_temp.notApplicableDescription")}
                        >
                          <InfoOutlineRounded fontSize="small" />
                        </Tooltip>
                      </Box>
                    }
                  />
                )}
                <Box display="flex" justifyContent={"flex-end"} width="100%">
                  {showUnapprovedBanner ? (
                    <Box
                      display="flex"
                      justifySelf="flex-end"
                      gap={3}
                      bgcolor="tertiary.main"
                      px={2}
                      py={1}
                      sx={{ ...styles.centerV }}
                      borderRadius={1}
                    >
                      <Text
                        color="tertiary.contrastText"
                        variant="semiBoldSmall"
                      >
                        {t("questions.answerNeedApprove")}
                      </Text>
                      <LoadingButton
                        size="small"
                        variant="contained"
                        sx={{
                          bgcolor: "tertiary.contrastText",
                          color: "tertiary.main",
                          height: 28,
                        }}
                        onClick={onApprove}
                        loading={isLoadingApprove}
                      >
                        {t("common.approve")}
                      </LoadingButton>
                    </Box>
                  ) : (
                    <>
                      {shouldShowSubmit && (
                        <LoadingButton
                          variant="contained"
                          color="primary"
                          onClick={onSubmit}
                          loading={isLoading}
                        >
                          {t("common.submit")}
                        </LoadingButton>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ width: "100%" }} />

            {/* Footer */}
            <Box
              display="flex"
              padding="16px 24px"
              sx={{
                display: "flex",
                flexDirection: { sm: "row", xs: "column" },
              }}
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
                        !confidence && selectedOption
                          ? "error.main"
                          : "transparent",
                      borderRadius: "4px",
                      px: { xs: 0, sm: "8px" },
                      py: "8px",
                    }}
                    gap={3}
                  >
                    <Text variant="bodyMedium">
                      {t("common.confidenceLevel")}
                    </Text>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating
                        disabled={!permissions?.answerQuestion}
                        value={current}
                        max={confidenceLevels.length}
                        onChange={(_, v) => {
                          setConfidence(v ?? null);

                          const updatedItem = {
                            ...selectedQuestion,
                            answer: {
                              ...selectedQuestion.answer,
                              confidenceLevel: v ? { id: v } : null,
                            },
                          };

                          dispatch(setSelectedQuestion(updatedItem));
                        }}
                        size="medium"
                        IconContainerComponent={ConfidenceIconContainer}
                        getLabelText={(value) =>
                          confidenceLevels.find((l) => l.id === value)?.title
                        }
                      />

                      {(current || confidence) && (
                        <Text variant="semiBoldMedium">
                          {
                            confidenceLevels.find(
                              (l) => l.id === current || l.id === confidence,
                            )?.title
                          }
                        </Text>
                      )}
                    </Box>
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

              <Box display="flex" gap={3} justifyContent="space-between">
                {isAdvanced && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={autoNext}
                        onChange={(_, checked) => setAutoNext(checked)}
                        size="small"
                        sx={{ p: 0, px: 0.5 }}
                        disabled={!permissions?.answerQuestion}
                      />
                    }
                    label={
                      <Box
                        color="info.main"
                        sx={{ ...styles.centerV }}
                        gap="6px"
                      >
                        <Text variant="bodySmall" color="text.primary">
                          {t("questions_temp.autoAdvanceToggleLabel")}
                        </Text>
                        <Tooltip
                          title={t(
                            "questions_temp.autoAdvanceToggleDescription",
                          )}
                        >
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
                      onClick={() => {
                        goNext();
                        dispatch(setSelectedConfidence(confidence));
                      }}
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
      }}
    />
  );
};

export default Body;

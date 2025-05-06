import React, { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@styles";
import { KitDesignListItems, MultiLangs, TId } from "@/types/index";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import QuestionContainer from "@components/kit-designer/questionnaires/questions/QuestionContainer";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";
import debounce from "lodash/debounce";
import EmptyStateQuestion from "@components/kit-designer/questionnaires/questions/EmptyStateQuestion";
import Add from "@mui/icons-material/Add";
import QuestionForm from "./questions/QuestionForm";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { kitActions, useKitDesignerContext } from "@/providers/KitProvider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";

interface ListOfItemsProps {
  items: Array<KitDesignListItems>;
  onEdit: (id: any) => void;
  onReorder: (reorderedItems: KitDesignListItems[]) => void;
  fetchQuery?: any;
  setOpenDeleteDialog?: any;
}
interface ITempValues {
  title: string;
  description: string;
  weight?: number;
  question?: number;
  translations: MultiLangs | null;
}
interface IQuestion {
  advisable: boolean;
  hint: any;
  id: number;
  index: number;
  mayNotBeApplicable: boolean;
  title: string;
}

const ListOfItems = ({
  items,
  fetchQuery,
  onEdit,
  onReorder,
  setOpenDeleteDialog,
}: ListOfItemsProps) => {
  const { kitState, dispatch } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const { updateTranslation } = useTranslationUpdater(langCode);

  const fetchQuestionListKit = useQuery({
    service: (args, config) =>
      service.kitVersions.questionnaires.getQuestions(args, config),
    runOnMount: false,
  });
  const postQuestionsKit = useQuery({
    service: (args, config) =>
      service.kitVersions.questions.create(args, config),
    runOnMount: false,
  });

  const [showNewQuestionForm, setShowNewQuestionForm] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedId, setExpandedId] = useState<TId | null>(null);
  const [reorderedItems, setReorderedItems] = useState(items);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<ITempValues>({
    title: "",
    description: "",
    translations: null,
    weight: 0,
    question: 0,
  });
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);

    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };
  const handleEditClick = (e: any, item: KitDesignListItems) => {
    e.stopPropagation();
    setEditMode(Number(item.id));
    setTempValues({
      title: item.title,
      description: item.description,
      translations: item.translations,
      weight: item.weight,
      question: item.questionsCount,
    });
  };

  const handleSaveClick = (e: any, item: KitDesignListItems) => {
    e.stopPropagation();
    onEdit({
      ...item,
      title: tempValues.title,
      description: tempValues.description,
      weight: tempValues?.weight,
      translations: tempValues?.translations,
    });
    setEditMode(null);
  };

  const handleCancelClick = (e: any) => {
    e.stopPropagation();
    setEditMode(null);
    setTempValues({
      title: "",
      description: "",
      translations: null,
      weight: 0,
      question: 0,
    });
  };

  const handelChange = (e: any) => {
    const { name, value } = e.target;
    setTempValues({
      ...tempValues,
      [name]: value,
    });
  };

  const handelChangeAccordion =
    ({ id }: { id: TId }) =>
    async (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedId(id);
      setQuestionnaireId(id as any);
      try {
        if (isExpanded) {
          const data = await fetchQuestionListKit.query({
            kitVersionId,
            questionnaireId: id,
          });
          setNewQuestion({
            title: "",
            index: (data?.items.length ?? 0) + 1,
            value: (data?.items.length ?? 0) + 1,
            id: null,
          });
          dispatch(kitActions.setQuestions(data?.items));
        } else {
          setExpandedId(null);
          handleCancel(id);
        }
      } catch (e) {
        const err = e as ICustomError;
        toastError(err);
      }
    };

  const debouncedHandleReorder = debounce(async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        questionId: item.id,
        index: idx + 1,
      }));

      await service.kitVersions.questions.reorder(
        { kitVersionId },
        { questionOrders: orders, questionnaireId: questionnaireId },
      );
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  }, 2000);

  const handleReorder = (newOrder: any[]) => {
    debouncedHandleReorder(newOrder);
  };
  const handleQuestionDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedQuestions = Array.from(kitState.questions);
    const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);
    updatedQuestions.splice(result.destination.index, 0, movedQuestion);

    const reorderedQuestions = updatedQuestions.map((question, idx) => ({
      ...question,
      index: idx + 1,
    }));
    handleReorder(reorderedQuestions);
    dispatch(kitActions.setQuestions(reorderedQuestions));
  };

  const handleAddNewQuestionClick = (id: any) => {
    setShowNewQuestionForm((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    index: 1,
    value: 1,
    id: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSave = async (id: TId) => {
    try {
      const data = {
        kitVersionId,
        index: newQuestion.index,
        value: newQuestion.value,
        title: newQuestion.title,
        advisable: false,
        mayNotBeApplicable: false,
        questionnaireId: id,
      };
      handleCancel(id);

      await postQuestionsKit
        .query({ kitVersionId, data })
        .then(async (response) => {
          if (response?.questionId) {
            setNewQuestion({
              title: "",
              index: (newQuestion.index ?? 0) + 1,
              value: (newQuestion.index ?? 0) + 1,
              id: null,
            });
            const newData = await fetchQuestionListKit.query({
              kitVersionId,
              questionnaireId: id,
            });

            dispatch(kitActions.setQuestions(newData?.items));
          }
        });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = (id: TId) => {
    setShowNewQuestionForm((prev) => ({
      ...prev,
      [id]: false,
    }));
    setNewQuestion({
      ...newQuestion,
      title: "",
      id: null,
    });
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="subjects">
        {(provided: any) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems?.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item?.id?.toString()}
                index={index}
                isDragDisabled={expandedId !== null}
              >
                {(provided: any) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    mt={1.5}
                    sx={{
                      backgroundColor:
                        editMode === item.id
                          ? theme.palette.surface.container
                          : theme.palette.surface.containerLowest,
                      borderRadius: "8px",
                      border: "0.3px solid #73808c30",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Accordion
                      onChange={handelChangeAccordion(item)}
                      expanded={expandedId === item.id}
                      sx={{
                        boxShadow: "none",
                        "&:before": {
                          display: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          backgroundColor:
                            editMode === item.id
                              ? theme.palette.surface.container
                              : item.questionsCount == 0
                                ? alpha(theme.palette.error.main, 0.04)
                                : theme.palette.surface.containerLowest,
                          borderRadius:
                            kitState.questions.length != 0
                              ? "8px"
                              : "8px 8px 0 0",
                          border: "0.3px solid #73808c30",
                          display: "flex",
                          position: "relative",
                          margin: 0,
                          padding: 0,
                          "&.Mui-expanded": {
                            backgroundColor:
                              item.questionsCount == 0
                                ? alpha(theme.palette.error.main, 0.08)
                                : theme.palette.surface.container,
                          },
                          "& .MuiAccordionSummary-content": {
                            margin: 0,
                          },
                          "& .MuiAccordionSummary-content.Mui-expanded": {
                            margin: 0,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            position: "relative",
                            pb: "1rem",
                            width: "100%",
                          }}
                          pt={1.5}
                          px={1.5}
                        >
                          <Box
                            sx={{
                              ...styles.centerVH,
                              background:
                                item.questionsCount == 0
                                  ? alpha(theme.palette.error.main, 0.12)
                                  : theme.palette.surface.container,
                              width: { xs: "50px", md: "64px" },
                              justifyContent: "space-around",
                            }}
                            borderRadius="0.5rem"
                            mr={2}
                            px={1.5}
                          >
                            <Typography variant="semiBoldLarge">
                              {index + 1}
                            </Typography>

                            <IconButton
                              disableRipple
                              disableFocusRipple
                              sx={{
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  color: "inherit",
                                },
                              }}
                              size="small"
                            >
                              <SwapVertRoundedIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Box
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                flexDirection: "row",
                                gap: 1,
                              }}
                            >
                              <Box sx={{ flexGrow: 1 }}>
                                {editMode === item.id ? (
                                  <MultiLangTextField
                                    name="title"
                                    value={tempValues.title}
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>,
                                    ) => handelChange(e)}
                                    translationValue={
                                      langCode
                                        ? (tempValues.translations?.[langCode]
                                            ?.title ?? "")
                                        : ""
                                    }
                                    onTranslationChange={updateTranslation(
                                      "title",
                                      setTempValues,
                                    )}
                                    label={<Trans i18nKey="title" />}
                                  />
                                ) : (
                                  <TitleWithTranslation
                                    title={item.title}
                                    translation={
                                      langCode
                                        ? item.translations?.[langCode]?.title
                                        : ""
                                    }
                                    variant="semiBoldMedium"
                                    showCopyIcon
                                  />
                                )}
                              </Box>
                              {/* Icons (Edit/Delete or Check/Close) */}
                              {editMode === item.id ? (
                                <Box
                                  sx={{
                                    mr:
                                      theme.direction == "rtl"
                                        ? "auto"
                                        : "unset",
                                    ml:
                                      theme.direction == "ltr"
                                        ? "auto"
                                        : "unset",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleSaveClick(e, item)}
                                    sx={{ mx: 1 }}
                                    color="success"
                                    data-testid="items-check-icon"
                                  >
                                    <CheckRoundedIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={handleCancelClick}
                                    sx={{ mx: 1 }}
                                    color="secondary"
                                  >
                                    <CloseRoundedIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              ) : (
                                <>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleEditClick(e, item)}
                                    sx={{ mx: 1 }}
                                    color={
                                      item.questionsCount == 0
                                        ? "error"
                                        : "success"
                                    }
                                    data-testid="items-edit-icon"
                                  >
                                    <EditRoundedIcon fontSize="small" />
                                  </IconButton>
                                  {setOpenDeleteDialog && (
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        setOpenDeleteDialog({
                                          status: true,
                                          id: item.id,
                                        })
                                      }
                                      sx={{ mx: 1 }}
                                      color="secondary"
                                      data-testid="items-delete-icon"
                                    >
                                      <DeleteRoundedIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </>
                              )}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              {editMode === item.id ? (
                                <MultiLangTextField
                                  name="description"
                                  value={tempValues.description}
                                  onChange={(e) =>
                                    setTempValues((prev) => ({
                                      ...prev,
                                      description: e.target.value,
                                    }))
                                  }
                                  translationValue={
                                    langCode
                                      ? (tempValues.translations?.[langCode]
                                          ?.description ?? "")
                                      : ""
                                  }
                                  onTranslationChange={updateTranslation(
                                    "description",
                                    setTempValues,
                                  )}
                                  label={<Trans i18nKey="description" />}
                                  multiline
                                  minRows={2}
                                  maxRows={5}
                                />
                              ) : (
                                <TitleWithTranslation
                                  title={item.description}
                                  translation={
                                    langCode
                                      ? item.translations?.[langCode]
                                          ?.description
                                      : ""
                                  }
                                  variant="bodyMedium"
                                  showCopyIcon
                                />
                              )}
                              <Box
                                sx={{
                                  width: "fit-content",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "flex-end",
                                  flexDirection: "column",
                                  gap: "0.5rem",
                                  textAlign: editMode ? "end" : "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    width: "100%",
                                  }}
                                  color={
                                    theme.palette.surface.contrastTextVariant
                                  }
                                  variant="labelCondensed"
                                >
                                  <Trans i18nKey={"questions"} />
                                </Typography>
                                <Box
                                  aria-label="questionnaires"
                                  sx={{ ...styles.centerVH }}
                                  style={{
                                    width: "3.75rem",
                                    height: "3.75rem",
                                    borderRadius: "50%",
                                    backgroundColor:
                                      item.questionsCount == 0
                                        ? theme.palette.error.main
                                        : theme.palette.surface.variant,
                                    color:
                                      item.questionsCount == 0
                                        ? theme.palette.error.bgVariant
                                        : theme.palette.surface.contrastText,
                                  }}
                                >
                                  {item.questionsCount}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          margin: 0,
                          padding: 0,
                          py: kitState.questions.length != 0 ? "20px" : "unset",
                        }}
                      >
                        {fetchQuestionListKit.loading ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              py: 2,
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        ) : (
                          <>
                            {kitState.questions.length >= 1 ? (
                              <>
                                <DragDropContext
                                  onDragEnd={handleQuestionDragEnd}
                                >
                                  <Droppable
                                    droppableId={`questions-${item.id}`}
                                  >
                                    {(provided) => (
                                      <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {kitState.questions?.map(
                                          (question: any, index: number) => (
                                            <Draggable
                                              key={question.id}
                                              draggableId={question?.id?.toString()}
                                              index={index}
                                            >
                                              {(provided) => (
                                                <Box
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  sx={{ marginBottom: 1 }}
                                                >
                                                  <QuestionContainer
                                                    key={question.id}
                                                    index={index}
                                                  />
                                                </Box>
                                              )}
                                            </Draggable>
                                          ),
                                        )}
                                        {provided.placeholder}
                                      </Box>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                {!showNewQuestionForm[item.id] && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      mt: 2,
                                    }}
                                  >
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                      onClick={() =>
                                        handleAddNewQuestionClick(item.id)
                                      }
                                    >
                                      <Add fontSize="small" />
                                      <Trans i18nKey="newQuestion" />
                                    </Button>
                                  </Box>
                                )}
                              </>
                            ) : (
                              <>
                                {!showNewQuestionForm[item.id] && (
                                  <EmptyStateQuestion
                                    btnTitle={"addFirstQuestion"}
                                    title={"noQuestionHere"}
                                    SubTitle={"noQuestionAtTheMoment"}
                                    onAddNewRow={() =>
                                      handleAddNewQuestionClick(item.id)
                                    }
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                        {showNewQuestionForm[item.id] && (
                          <Box sx={{ mt: 2 }}>
                            <QuestionForm
                              newItem={newQuestion}
                              handleInputChange={handleInputChange}
                              handleSave={() => handleSave(item.id)}
                              handleCancel={() => handleCancel(item.id)}
                            />
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListOfItems;

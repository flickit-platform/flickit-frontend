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
import QuestionContainer from "@components/kit-designer/questionnaires/questions/QuestionContainer";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { ICustomError } from "@utils/CustomError";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha, useTheme } from "@mui/material/styles";
import debounce from "lodash/debounce";
import EmptyStateQuestion from "@components/kit-designer/questionnaires/questions/EmptyStateQuestion";
import Add from "@mui/icons-material/Add";
import QuestionForm from "./questions/QuestionForm";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { kitActions, useKitDesignerContext } from "@/providers/KitProvider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import showToast from "@utils/toastError";

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

const useQuestionnaireLogic = () => {
  const { kitVersionId = '' } = useParams();
  const { service } = useServiceContext();
  const { kitState, dispatch } = useKitDesignerContext();

  const fetchQuestionListKit = useQuery({
    service: (args, config) => service.kitVersions.questionnaires.getQuestions(args, config),
    runOnMount: false,
  });

  const postQuestionsKit = useQuery({
    service: (args, config) => service.kitVersions.questions.create(args, config),
    runOnMount: false,
  });

  const debouncedHandleReorder = debounce(async (newOrder: any[], questionnaireId: TId) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        questionId: item.id,
        index: idx + 1,
      }));
      await service.kitVersions.questions.reorder(
        { kitVersionId },
        { questionOrders: orders, questionnaireId },
      );
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  }, 2000);

  const handleReorder = (newOrder: any[], questionnaireId: TId) => {
    debouncedHandleReorder(newOrder, questionnaireId);
  };

  return {
    kitVersionId,
    fetchQuestionListKit,
    postQuestionsKit,
    handleReorder,
    kitState,
    dispatch,
  };
};

const ListOfItems = ({
                       items,
                       onEdit,
                       onReorder,
                       setOpenDeleteDialog,
                     }: ListOfItemsProps) => {
  const theme = useTheme();
  const { kitState, dispatch } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? '';
  const { updateTranslation } = useTranslationUpdater(langCode);

  const [reorderedItems, setReorderedItems] = useState(items);
  const [expandedId, setExpandedId] = useState<TId | null>(null);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState<{ [key: string]: boolean }>({});

  const questionnaireLogic = useQuestionnaireLogic();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);

    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };

  const handleAccordionChange = (item: KitDesignListItems) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedId(isExpanded ? item.id : null);
    if (isExpanded) {
      try {
        const data = await questionnaireLogic.fetchQuestionListKit.query({
          kitVersionId: questionnaireLogic.kitVersionId,
          questionnaireId: item.id,
        });
        dispatch(kitActions.setQuestions(data?.items || []));
      } catch (e) {
        const err = e as ICustomError;
        showToast(err);
      }
    } else {
      dispatch(kitActions.setQuestions([]));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="subjects">
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems.map((item, index) => (
              <ItemAccordion
                key={item.id}
                item={item}
                index={index}
                expandedId={expandedId}
                onAccordionChange={handleAccordionChange}
                onEdit={onEdit}
                setOpenDeleteDialog={setOpenDeleteDialog}
                showNewQuestionForm={showNewQuestionForm}
                setShowNewQuestionForm={setShowNewQuestionForm}
                langCode={langCode}
                updateTranslation={updateTranslation}
                theme={theme}
                questionnaireLogic={questionnaireLogic}
                isDragDisabled={expandedId !== null}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const ItemAccordion = ({
                         item,
                         index,
                         expandedId,
                         onAccordionChange,
                         onEdit,
                         setOpenDeleteDialog,
                         showNewQuestionForm,
                         setShowNewQuestionForm,
                         langCode,
                         updateTranslation,
                         theme,
                         questionnaireLogic,
                         isDragDisabled,
                       }: {
  item: KitDesignListItems;
  index: number;
  expandedId: TId | null;
  onAccordionChange: (item: KitDesignListItems) => (event: React.SyntheticEvent, isExpanded: boolean) => Promise<void>;
  onEdit: (item: KitDesignListItems) => void;
  setOpenDeleteDialog?: (dialog: { status: boolean; id: TId }) => void;
  showNewQuestionForm: { [key: string]: boolean };
  setShowNewQuestionForm: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  langCode: string;
  updateTranslation: any;
  theme: any;
  questionnaireLogic: ReturnType<typeof useQuestionnaireLogic>;
  isDragDisabled: boolean;
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempValues, setTempValues] = useState<ITempValues>({
    title: item.title,
    description: item.description,
    translations: item.translations,
    weight: item.weight || 0,
    question: item.questionsCount,
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(true);
    setTempValues({
      title: item.title,
      description: item.description,
      translations: item.translations,
      weight: item.weight || 0,
      question: item.questionsCount,
    });
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit({
      ...item,
      title: tempValues.title,
      description: tempValues.description,
      weight: tempValues.weight,
      translations: tempValues.translations,
    });
    setEditMode(false);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(false);
    setTempValues({
      title: '',
      description: '',
      translations: null,
      weight: 0,
      question: 0,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAccordionBgColor = () => {
    if (editMode) return "background.container";
    if (item.questionsCount === 0) return alpha(theme.palette.error.main, 0.04);
    return "background.containerLowest";
  };

  return (
    <Draggable
      key={item.id}
      draggableId={item.id.toString()}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {({innerRef, draggableProps, dragHandleProps}) => (
        <Box
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          mt={1.5}
          sx={{
            backgroundColor: editMode ? "background.container" : "background.containerLowest",
            borderRadius: '8px',
            border: '0.3px solid #73808c30',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Accordion
            expanded={expandedId === item.id}
            onChange={onAccordionChange(item)}
            sx={{
              boxShadow: 'none',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              sx={{
                backgroundColor: getAccordionBgColor(),
                borderRadius: questionnaireLogic.kitState.questions.length !== 0 ? '8px' : '8px 8px 0 0',
                border: '0.3px solid #73808c30',
                display: 'flex',
                position: 'relative',
                margin: 0,
                padding: 0,
                '&.Mui-expanded': {
                  backgroundColor: item.questionsCount === 0 ? alpha(theme.palette.error.main, 0.08) : 'background.container',
                },
                '& .MuiAccordionSummary-content': { margin: 0 },
                '& .MuiAccordionSummary-content.Mui-expanded': { margin: 0 },
              }}
            >
              <SummaryContent
                item={item}
                index={index}
                editMode={editMode}
                tempValues={tempValues}
                handleChange={handleChange}
                langCode={langCode}
                updateTranslation={updateTranslation}
                theme={theme}
                handleEditClick={handleEditClick}
                handleSaveClick={handleSaveClick}
                handleCancelClick={handleCancelClick}
                setOpenDeleteDialog={setOpenDeleteDialog}
                setTempValues={setTempValues}
              />
            </AccordionSummary>
            <AccordionDetails
              sx={{
                margin: 0,
                padding: 0,
                py: questionnaireLogic.kitState.questions.length !== 0 ? '20px' : 'unset',
              }}
            >
              <QuestionsSection
                item={item}
                questionnaireLogic={questionnaireLogic}
                showNewQuestionForm={showNewQuestionForm}
                setShowNewQuestionForm={setShowNewQuestionForm}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Draggable>
  );
};

const IndexBox = ({ index, item, theme }: { index: number; item: KitDesignListItems; theme: any }) => (
  <Box
    sx={{
      ...styles.centerVH,
      background: item.questionsCount === 0 ? alpha(theme.palette.error.main, 0.12) : 'background.container',
      width: { xs: '50px', md: '64px' },
      justifyContent: 'space-around',
    }}
    borderRadius="0.5rem"
    mr={2}
    px={1.5}
  >
    <Typography variant="semiBoldLarge">{index + 1}</Typography>
    <IconButton
      disableRipple
      disableFocusRipple
      sx={{ '&:hover': { backgroundColor: 'transparent', color: 'inherit' } }}
      size="small"
    >
      <SwapVertRoundedIcon fontSize="small" />
    </IconButton>
  </Box>
);

const TitleSection = ({
                        editMode,
                        item,
                        tempValues,
                        handleChange,
                        langCode,
                        updateTranslation,
                        setTempValues
                      }: any) =>
  editMode ? (
    <MultiLangTextField
      name="title"
      value={tempValues.title}
      onChange={handleChange}
      translationValue={langCode ? (tempValues.translations?.[langCode]?.title ?? '') : ''}
      onTranslationChange={updateTranslation('title', setTempValues)}
      label={<Trans i18nKey="common.title" />}
    />
  ) : (
    <TitleWithTranslation
      title={item.title}
      translation={langCode ? item.translations?.[langCode]?.title : ''}
      variant="semiBoldMedium"
      showCopyIcon
    />
  );

const DescriptionSection = ({
                              editMode,
                              item,
                              tempValues,
                              handleChange,
                              langCode,
                              updateTranslation,
                              setTempValues
                            }: any) =>
  editMode ? (
    <MultiLangTextField
      name="description"
      value={tempValues.description}
      onChange={handleChange}
      translationValue={langCode ? (tempValues.translations?.[langCode]?.description ?? '') : ''}
      onTranslationChange={updateTranslation('description', setTempValues)}
      label={<Trans i18nKey="common.description" />}
      multiline
      minRows={2}
      maxRows={5}
    />
  ) : (
    <TitleWithTranslation
      title={item.description}
      translation={langCode ? item.translations?.[langCode]?.description : ''}
      variant="bodyMedium"
      showCopyIcon
    />
  );

const ActionButtons = ({
                         editMode,
                         handleEditClick,
                         handleSaveClick,
                         handleCancelClick,
                         item,
                         setOpenDeleteDialog,
                         theme
                       }: any) =>
  editMode ? (
    <Box sx={{ mr: theme.direction === 'rtl' ? 'auto' : 'unset', ml: theme.direction === 'ltr' ? 'auto' : 'unset' }}>
      <IconButton size="small" onClick={handleSaveClick} sx={{ mx: 1 }} color="success" data-testid="items-check-icon">
        <CheckRoundedIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={handleCancelClick} sx={{ mx: 1 }} color="secondary">
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  ) : (
    <>
      <IconButton
        size="small"
        onClick={handleEditClick}
        sx={{ mx: 1 }}
        color={item.questionsCount === 0 ? 'error' : 'success'}
        data-testid="items-edit-icon"
      >
        <EditRoundedIcon fontSize="small" />
      </IconButton>
      {setOpenDeleteDialog && (
        <IconButton
          size="small"
          onClick={() => setOpenDeleteDialog({ status: true, id: item.id })}
          sx={{ mx: 1 }}
          color="secondary"
          data-testid="items-delete-icon"
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );

const QuestionsCount = ({ item, theme }: { item: KitDesignListItems; theme: any }) => (
  <Box
    sx={{
      width: 'fit-content',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexDirection: 'column',
      gap: '0.5rem',
      textAlign: 'center',
    }}
  >
    <Typography
      color="background.onVariant"
      sx={{ ...theme.typography.labelCondensed, width: '100%' }}>
      <Trans i18nKey="common.questions" />
    </Typography>
    <Box
      aria-label="questionnaires"
      sx={{
        width: '3.75rem',
        height: '3.75rem',
        borderRadius: '50%',
        backgroundColor: item.questionsCount === 0 ? "error.main" : "background.variant",
        color: item.questionsCount === 0 ? "error.contrastText" : "text.primary",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {item.questionsCount}
    </Box>
  </Box>
);

const SummaryContent = (props: any) => {
  const { item, index, editMode, tempValues, handleChange, langCode, updateTranslation, theme, handleEditClick, handleSaveClick, handleCancelClick, setOpenDeleteDialog, setTempValues } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        pb: '1rem',
        width: '100%',
      }}
      pt={1.5}
      px={1.5}
    >
      <IndexBox index={index} item={item} theme={theme} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row', gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <TitleSection {...{ editMode, item, tempValues, handleChange, langCode, updateTranslation, setTempValues }} />
          </Box>
          <ActionButtons {...{ editMode, handleEditClick, handleSaveClick, handleCancelClick, item, setOpenDeleteDialog, theme }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DescriptionSection {...{ editMode, item, tempValues, handleChange, langCode, updateTranslation, setTempValues }} />
          <QuestionsCount item={item} theme={theme} />
        </Box>
      </Box>
    </Box>
  );
};


const QuestionsSection = ({
                            item,
                            questionnaireLogic,
                            showNewQuestionForm,
                            setShowNewQuestionForm,
                          }: {
  item: KitDesignListItems;
  questionnaireLogic: ReturnType<typeof useQuestionnaireLogic>;
  showNewQuestionForm: { [key: string]: boolean };
  setShowNewQuestionForm: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}) => {
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    index: questionnaireLogic.kitState.questions.length + 1,
    value: questionnaireLogic.kitState.questions.length + 1,
    id: null,
  });

  const handleQuestionDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedQuestions = Array.from(questionnaireLogic.kitState.questions);
    const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);
    updatedQuestions.splice(result.destination.index, 0, movedQuestion);

    const reorderedQuestions = updatedQuestions.map((question, idx) => ({
      ...question,
      index: idx + 1,
    }));
    questionnaireLogic.handleReorder(reorderedQuestions, item.id);
    questionnaireLogic.dispatch(kitActions.setQuestions(reorderedQuestions));
  };

  const handleAddNewQuestionClick = () => {
    setShowNewQuestionForm((prev) => ({ ...prev, [item.id]: true }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'value' ? parseInt(value) || 1 : value;
    setNewQuestion((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId: questionnaireLogic.kitVersionId,
        index: newQuestion.index,
        value: newQuestion.value,
        title: newQuestion.title,
        advisable: false,
        mayNotBeApplicable: false,
        questionnaireId: item.id,
      };
      await questionnaireLogic.postQuestionsKit.query({ kitVersionId: questionnaireLogic.kitVersionId, data });
      const newData = await questionnaireLogic.fetchQuestionListKit.query({
        kitVersionId: questionnaireLogic.kitVersionId,
        questionnaireId: item.id,
      });
      questionnaireLogic.dispatch(kitActions.setQuestions(newData?.items || []));
      setNewQuestion({
        title: '',
        index: (newQuestion.index ?? 0) + 1,
        value: (newQuestion.index ?? 0) + 1,
        id: null,
      });
      setShowNewQuestionForm((prev) => ({ ...prev, [item.id]: false }));
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleCancel = () => {
    setShowNewQuestionForm((prev) => ({ ...prev, [item.id]: false }));
    setNewQuestion({ ...newQuestion, title: '', id: null });
  };

  return (
    <>
      {questionnaireLogic.fetchQuestionListKit.loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {questionnaireLogic.kitState.questions.length >= 1 ? (
            <>
              <DragDropContext onDragEnd={handleQuestionDragEnd}>
                <Droppable droppableId={`questions-${item.id}`}>
                  {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                      {questionnaireLogic.kitState.questions.map((question: any, index: number) => (
                        <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                          {(provided) => (
                            <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ marginBottom: 1 }}>
                              <QuestionContainer key={question.id} index={index} />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
              {!showNewQuestionForm[item.id] && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button size="small" variant="outlined" color="primary" onClick={handleAddNewQuestionClick}>
                    <Add fontSize="small" />
                    <Trans i18nKey="kitDesigner.newQuestion" />
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <>
              {!showNewQuestionForm[item.id] && (
                <EmptyStateQuestion
                  btnTitle="questions.addFirstQuestion"
                  title="kitDesigner.noQuestionHere"
                  SubTitle="questions.noQuestionAtTheMoment"
                  onAddNewRow={handleAddNewQuestionClick}
                />
              )}
            </>
          )}
        </>
      )}
      {showNewQuestionForm[item.id] && (
        <Box sx={{ mt: 2 }}>
          <QuestionForm newItem={newQuestion} handleInputChange={handleInputChange} handleSave={handleSave} handleCancel={handleCancel} />
        </Box>
      )}
    </>
  );
};

export default ListOfItems;

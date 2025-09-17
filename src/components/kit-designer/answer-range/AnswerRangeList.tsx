import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { KitDesignListItems, MultiLangs, TId } from "@/types/index";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/custom-error";
import Button from "@mui/material/Button";
import { alpha, useTheme } from "@mui/material/styles";
import Add from "@mui/icons-material/Add";
import EmptyStateOptions from "@/components/kit-designer/answer-range/options/OptionsEmptyState";
import Divider from "@mui/material/Divider";
import OptionContain from "@/components/kit-designer/answer-range/options/OptionsContainer";
import Chip from "@mui/material/Chip";
import { t } from "i18next";
import OptionForm from "@/components/kit-designer/answer-range/options/OptionsForm";
import languageDetector from "@/utils/language-detector";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useKitDesignerContext } from "@/providers/kit-provider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import showToast from "@/utils/toast-error";

interface ListOfItemsProps {
  items: any;
  onEdit: (id: any) => void;
  onDelete?: (id: any) => void;
  onReorder: any;
  fetchQuery?: any;
  setChangeData: any;
}
interface ITempValues {
  title: string;
  translations?: MultiLangs | null;
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
  onDelete,
  setChangeData,
}: ListOfItemsProps) => {
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code;

  const { updateTranslation } = useTranslationUpdater(langCode);

  const postOptionsKit = useQuery({
    service: (args, config) =>
      service.kitVersions.answerOptions.createRangeOption(args, config),
    runOnMount: false,
  });

  const [showNewAnswerRangeForm, setShowNewAnswerRangeForm] = useState<{
    [key: string]: boolean;
  }>({});
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<ITempValues>({
    title: "",
    translations: null,
  });
  const [newOptions, setNewOptions] = useState({
    title: "",
    translations: null,
    index: 1,
    value: 1,
    id: null,
  });
  const [questionData, setQuestionData] = useState<IQuestion[]>([]);
  const [expanded, setExpanded] = useState<TId | null>(null);
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const handleEditClick = (e: any, item: any) => {
    e.stopPropagation();
    setEditMode(Number(item.id));
    setTempValues({
      title: item.title,
      translations: item.translations,
    });
  };

  const handleSaveClick = (e: any, item: KitDesignListItems) => {
    e.stopPropagation();
    onEdit({
      ...item,
      title: tempValues.title,
      translations: tempValues.translations,
    });
    setEditMode(null);
  };

  const handleCancelClick = (e: any) => {
    e.stopPropagation();
    setEditMode(null);
    setTempValues({ title: "", translations: null });
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
      setExpanded(isExpanded ? id : null);
      try {
        if (isExpanded) {
          setNewOptions({
            title: "",
            translations: null,
            index:
              items.find((item: any) => item.id === id).answerOptions.length +
              1,
            value: 1,
            id: null,
          });
        } else {
          handleCancel(id);
        }
      } catch (e) {
        const err = e as ICustomError;
        showToast(err);
      }
    };

  const handleQuestionDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedQuestions = Array.from(questionData);
    const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);
    updatedQuestions.splice(result.destination.index, 0, movedQuestion);

    const reorderedQuestions = updatedQuestions.map((question, idx) => ({
      ...question,
      index: idx + 1,
    }));
    setQuestionData(reorderedQuestions);
  };

  const handleAddNewOptionClick = (id: any) => {
    setShowNewAnswerRangeForm((prev) => ({
      ...prev,
      [id]: true,
    }));
    setNewOptions({
      title: "",
      translations: null,
      index: items.find((item: any) => item.id === id).answerOptions.length + 1,
      value: 1,
      id: null,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (id: TId) => {
    try {
      const data = {
        kitVersionId,
        index: newOptions.index,
        value: newOptions.value,
        title: newOptions.title,
        translations: newOptions.translations,
        answerRangeId: id,
      };
      handleCancel(id);

      await postOptionsKit.query({ kitVersionId, data }).then(() => {
        setChangeData((prev: any) => !prev);
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleCancel = (id: TId) => {
    setShowNewAnswerRangeForm((prev) => ({
      ...prev,
      [id]: false,
    }));
    setNewOptions({
      title: "",
      translations: null,
      index: 1,
      value: 1,
      id: null,
    });
  };

  const theme = useTheme();

  const multiStyles : Record<string, any> = {
    summaryBg: (isEditing: boolean, hasNoQuestions: boolean)=>{
      if (isEditing) return "#F3F5F6";
      if (hasNoQuestions) return alpha(theme.palette.error.main, 0.04);
      return "#fff";
    },
    expandedBg: (hasNoQuestions: boolean)=>{
      if (hasNoQuestions) return alpha(theme.palette.error.main, 0.08);
      return "background.container";
    },
    getDetailsPy: ()=>{
      if(questionData.length != 0) return "20px";
      return "unset";
    },
    borderRadius: ()=>{
      if(questionData.length != 0) return "8px";
      return "8px 8px 0 0";
    },
    accordionBg: (isEditing: boolean)=>{
      if(isEditing) return "background.container";
      return "background.containerLowest";
    },
    fontFamilyDetect: (text: string) => {
      if(languageDetector(text)) return farsiFontFamily;
      return primaryFontFamily
    }
  }

  return (
    <>
      {items?.map((item: any, index: number) => {
        const isEditing = editMode === item.id;
        const hasNoQuestions = item.questionsCount == 0;
        const summaryBg = multiStyles["summaryBg"]?.(isEditing, hasNoQuestions);
        const expandedBg = multiStyles["expandedBg"]?.(hasNoQuestions);
        const borderRadius = multiStyles["borderRadius"]?.();
        const detailsPy = multiStyles["getDetailsPy"]?.();
        const accordionBg = multiStyles["accordionBg"]?.(isEditing);
        const hasOptions = item?.answerOptions?.length >= 1;
        const showForm = showNewAnswerRangeForm[item.id];

        const titleElement = isEditing ? (
          <MultiLangTextField
            name="title"
            value={tempValues.title}
            onChange={(e) => handelChange(e)}
            inputProps={{
              style: {
                fontFamily: multiStyles["fontFamilyDetect"]?.(tempValues?.title)
              },
            }}
            translationValue={
              langCode && (tempValues.translations?.[langCode]?.title ?? "")
            }
            onTranslationChange={updateTranslation(
              "title",
              setTempValues,
            )}
            label={<Trans i18nKey="common.title" />}
          />
        ) : (
          <TitleWithTranslation
            title={item.title}
            translation={
              langCode && item.translations?.[langCode]?.title
            }
            variant="semiBoldMedium"
            showCopyIcon
          />
        );

        const iconsElement = isEditing ? (
          <Box
            sx={{
              display: "flex",
              mr: theme.direction == "rtl" ? "auto" : "unset",
              ml: theme.direction == "ltr" ? "auto" : "unset",
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => handleSaveClick(e, item)}
              sx={{ mx: 1 }}
              color="success"
              data-testid="check-icon-id"
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
              color={hasNoQuestions ? "error" : "success"}
              data-testid="edit-icon-id"
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(item.id)}
                sx={{ mx: 1 }}
                color="secondary"
                data-testid="delete-icon-id"
              >
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </>
        );

        const headerElement = hasOptions && (
          <Box
            sx={{
              width: "100%",
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              px: "1rem",
              color: "background.onVariant",
              ...theme.typography.semiBoldMedium,
            }}
          >
            <Box
              sx={{
                width: { xs: "65px", md: "95px" },
                textAlign: "center",
              }}
              mr={2}
              px={0.2}
            >
              <Trans i18nKey="common.index" />
            </Box>
            <Box sx={{ width: { xs: "50%", md: "60%" } }}>
              <Trans i18nKey="common.title" />
            </Box>
            <Box
              sx={{
                width: { xs: "20%", md: "10%" },
                textAlign: "center",
              }}
            >
              <Trans i18nKey="common.value" />
            </Box>
          </Box>
        );

        const optionsList = (
          <DragDropContext onDragEnd={handleQuestionDragEnd}>
            <Droppable droppableId={`questions-${item.id}`}>
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {item.answerOptions?.map(
                    (answerOption: any, index: number) => (
                      <Draggable
                        key={answerOption.id}
                        draggableId={answerOption.id.toString()}
                        index={index}
                        isDragDisabled={true}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ marginBottom: 1 }}
                          >
                            <OptionContain
                              fetchQuery={fetchQuery}
                              key={answerOption.id}
                              answerOption={answerOption}
                              setChangeData={setChangeData}
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
        );

        const addButton = !showForm && (
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
              onClick={() => handleAddNewOptionClick(item.id)}
            >
              <Add fontSize="small" />
              <Trans i18nKey="kitDesigner.newOption" />
            </Button>
          </Box>
        );

        const emptyState = !showForm && (
          <EmptyStateOptions
            btnTitle="kitDesigner.addFirstOption"
            title="kitDesigner.noOptionHere"
            SubTitle="kitDesigner.noOptionAtTheMoment"
            onAddNewRow={() => handleAddNewOptionClick(item.id)}
          />
        );

        const contentElement = hasOptions ? (
          <>
            {optionsList}
            {addButton}
          </>
        ) : (
          emptyState
        );

        const newFormElement = showForm && (
          <Box>
            <OptionForm
              newItem={newOptions}
              handleInputChange={handleInputChange}
              setNewOptions={setNewOptions}
              handleSave={() => handleSave(item.id)}
              handleCancel={() => handleCancel(item.id)}
            />
          </Box>
        );

        return (
          <Box
            key={index}
            mt={1.5}
            sx={{
              backgroundColor: accordionBg,
              borderRadius: "8px",
              border: "0.3px solid #73808c30",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Accordion
              onChange={handelChangeAccordion(item)}
              expanded={expanded === item?.id}
              sx={{
                boxShadow: "none",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                data-testid="accordion-summary-answer-range"
                sx={{
                  backgroundColor: summaryBg,
                  borderRadius: borderRadius,
                  border: "0.3px solid #73808c30",
                  display: "flex",
                  position: "relative",
                  margin: 0,
                  padding: 0,
                  "&.Mui-expanded": {
                    backgroundColor: expandedBg,
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
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {titleElement}
                      <Box sx={{ width: "60%", px: 3 }}>
                        <Chip
                          label={
                            t("common.options") + " " + item.answerOptions.length
                          }
                          size="small"
                          sx={{
                            backgroundColor: "primary.bg",
                            fontSize: 14,
                            py: 1.4,
                          }}
                        />
                      </Box>
                      {iconsElement}
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails
                data-testid="accordion-details-answer-range"
                sx={{
                  margin: 0,
                  padding: 0,
                  py: detailsPy,
                }}
              >
                {headerElement}
                <Divider />
                {contentElement}
                {newFormElement}
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      })}
    </>
  );
};

export default ListOfItems;

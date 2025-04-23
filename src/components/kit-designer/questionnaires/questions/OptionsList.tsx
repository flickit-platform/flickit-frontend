import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IOption } from "@/types/index";
import { Trans } from "react-i18next";
import { t } from "i18next";
import OptionForm from "./OptionForm";
import Add from "@mui/icons-material/Add";
import { useKitLanguageContext } from "@providers/KitProvider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";

interface OptionListProps {
  Options: Array<IOption>;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
  onReorder: (reorderedItems: IOption[]) => void;
  onAdd: (newOption: IOption) => void;
  isAddingNew: boolean;
  setIsAddingNew: any;
  disableAddOption: boolean;
}

const OptionList = (props: OptionListProps) => {
  const {
    Options,
    onEdit,
    onReorder,
    onAdd,
    isAddingNew,
    setIsAddingNew,
    disableAddOption,
  } = props;

  const [reorderedItems, setReorderedItems] = useState(Options);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState({
    title: "",
    translations: null,
    value: 1,
    index: reorderedItems?.length + 1,
  });

  const { kitState } = useKitLanguageContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);

    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };

  const handleSaveClick = (item: IOption) => {
    onEdit({
      ...item,
      title: tempValues.title,
      value: tempValues.value,
      translations: tempValues.translations,
    });
    setEditMode(null);
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({
      title: "",
      translations: null,
      value: 1,
      index: reorderedItems?.length + 1,
    });
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setTempValues({
      title: "",
      translations: null,
      value: 1,
      index: reorderedItems?.length + 1,
    });
  };

  const handleSaveNewOption = () => {
    onAdd({
      index: reorderedItems?.length + 1,
      id: reorderedItems?.length + 1,
      title: tempValues.title,
      value: tempValues.value,
      translations: tempValues.translations,
    });
  };

  useEffect(() => {
    if (isAddingNew === false) {
      setTempValues({
        title: "",
        translations: null,
        value: 1,
        index: reorderedItems?.length + 1,
      });
      setIsAddingNew(false);
    }
  }, [isAddingNew]);

  useEffect(() => {
    setReorderedItems(Options);
  }, [Options]);

  const handleCancelNewOption = () => {
    setIsAddingNew(false);
    setTempValues({
      title: "",
      translations: null,
      value: 1,
      index: reorderedItems?.length + 1,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="Options">
        {(provided: any) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            paddingX={2}
            maxHeight={220}
            overflow="auto"
          >
            {reorderedItems?.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided: any) => (
                  <>
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexGrow: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            ml: 1,
                            paddingInlineEnd: 1.5,
                            backgroundColor: "#F3F5F6",
                            borderRadius: "8px",
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{ display: "inline-flex", mr: 0.5 }}
                          >
                            <SwapVertRoundedIcon fontSize="small" />
                          </IconButton>
                          {`${t("option")} ${index + 1}:`}
                        </Typography>
                        {editMode === item.id ? (
                          <TextField
                            required
                            value={tempValues.title}
                            onChange={(e) =>
                              setTempValues({
                                ...tempValues,
                                title: e.target.value,
                              })
                            }
                            variant="outlined"
                            fullWidth
                            size="small"
                            sx={{
                              marginInline: 2,
                              fontSize: 14,
                              ml: 2,
                              "& .MuiInputBase-root": {
                                fontSize: 14,
                                overflow: "auto",
                              },
                              "& .MuiFormLabel-root": { fontSize: 14 },
                            }}
                            label={<Trans i18nKey="title" />}
                          />
                        ) : (
                          <Box sx={{ display: "flex", flexGrow: 1 }}>
                            <TitleWithTranslation
                              title={item.title}
                              translation={
                                langCode
                                  ? item.translations?.[langCode]?.title
                                  : ""
                              }
                              variant="semiBoldMedium"
                            />
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {editMode === item.id ? (
                          <TextField
                            type="number"
                            required
                            value={tempValues?.value}
                            onChange={(e) =>
                              setTempValues({
                                ...tempValues,
                                value: Number(e.target.value),
                              })
                            }
                            variant="outlined"
                            size="small"
                            label={<Trans i18nKey="value" />}
                            sx={{
                              fontSize: 14,
                              "& .MuiInputBase-root": {
                                fontSize: 14,
                                overflow: "auto",
                              },
                              "& .MuiFormLabel-root": { fontSize: 14 },
                            }}
                          />
                        ) : (
                          <Chip
                            label={t("value") + ": " + item.value}
                            color="primary"
                            size="small"
                            sx={{ ml: 2, fontSize: 12 }}
                          />
                        )}

                        {editMode === item.id ? (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleSaveClick(item)}
                              sx={{ ml: 1 }}
                              color="success"
                            >
                              <CheckRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleCancelClick}
                              sx={{ ml: 1 }}
                              color="secondary"
                            >
                              <CloseRoundedIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Box>
                    <Divider />
                  </>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      {isAddingNew ? (
        <OptionForm
          newItem={tempValues}
          setNewItem={setTempValues}
          handleInputChange={(e) =>
            setTempValues({
              ...tempValues,
              [e.target.name]: e.target.value,
            })
          }
          handleSave={handleSaveNewOption}
          handleCancel={handleCancelNewOption}
        />
      ) : (
        <Box
          sx={{
            display: disableAddOption ? "none" : "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            onClick={handleAddNewClick}
            variant="outlined"
            color="primary"
            size="small"
          >
            <Add fontSize="small" />
            <Trans i18nKey="newOption" />
          </Button>
        </Box>
      )}
    </DragDropContext>
  );
};

export default OptionList;

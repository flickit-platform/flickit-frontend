import { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@styles";
import { KitDesignListItems } from "@/types/index";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import languageDetector from "@utils/languageDetector";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { useKitLanguageContext } from "@/providers/KitProvider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";

interface ListOfItemsProps {
  items: Array<KitDesignListItems>;
  onEdit: (id: any) => void;
  onReorder: (reorderedItems: KitDesignListItems[]) => void;
  setOpenDeleteDialog?: any;
  editableFieldKey?: keyof KitDesignListItems;
  editable?: boolean;
}

interface ITempValues {
  title: string;
  description: string;
  weight?: number;
  question?: number;
  translations?: any;
  [key: string]: any;
}

const ListOfItems = ({
  items,
  onEdit,
  onReorder,
  setOpenDeleteDialog,
  editableFieldKey,
  editable = true,
}: ListOfItemsProps) => {
  const { kitState } = useKitLanguageContext();
  const langCode = kitState.translatedLanguage?.code;

  const { updateTranslation } = useTranslationUpdater(langCode);

  const [reorderedItems, setReorderedItems] = useState(items);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<ITempValues>({
    title: "",
    description: "",
    weight: 0,
    question: 0,
    translations: null,
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newReorderedItems = Array.from(reorderedItems);
    const [movedItem] = newReorderedItems.splice(result.source.index, 1);
    newReorderedItems.splice(result.destination.index, 0, movedItem);
    setReorderedItems(newReorderedItems);
    onReorder(newReorderedItems);
  };

  const handleEditClick = (item: KitDesignListItems) => {
    setEditMode(Number(item.id));
    setTempValues({
      title: item.title,
      description: item.description,
      weight: item.weight,
      question: item.questionsCount,
      translations: item.translations,
    });
  };

  const handleSaveClick = (item: KitDesignListItems) => {
    onEdit({
      ...item,
      title: tempValues.title,
      description: tempValues.description,
      weight: tempValues?.weight,
      translations: langCode
        ? {
            [langCode]: {
              title: tempValues.translations?.[langCode]?.title,
              description: tempValues.translations?.[langCode]?.description,
            },
          }
        : undefined,
    });
    setEditMode(null);
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({
      title: "",
      description: "",
      weight: 0,
      question: 0,
      translations: null,
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTempValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const isRTL = theme.direction === "rtl";
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="subjects">
        {(provided: any) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems?.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided: any) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    mt={1.5}
                    p={1.5}
                    sx={{
                      backgroundColor:
                        editMode === item.id ? "#F3F5F6" : "#fff",
                      borderRadius: "8px",
                      border: "0.3px solid #73808c30",
                      display: "flex",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        ...styles.centerVH,
                        background: "#F3F5F6",
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
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleChange(e)
                              }
                              inputProps={{
                                style: {
                                  fontFamily: languageDetector(tempValues.title)
                                    ? farsiFontFamily
                                    : primaryFontFamily,
                                },
                              }}
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
                            />
                          )}
                        </Box>
                        {editMode === item.id ? (
                          <Box
                            sx={{
                              mr: theme.direction == "rtl" ? "auto" : "unset",
                              ml: theme.direction == "ltr" ? "auto" : "unset",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleSaveClick(item)}
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
                              onClick={() => handleEditClick(item)}
                              sx={{ mx: 1 }}
                              color="success"
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
                          gap: 3,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
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
                              inputProps={{
                                style: {
                                  fontFamily: languageDetector(
                                    tempValues.description,
                                  )
                                    ? farsiFontFamily
                                    : primaryFontFamily,
                                },
                              }}
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
                                  ? item.translations?.[langCode]?.description
                                  : ""
                              }
                              variant="bodyMedium"
                            />
                          )}
                        </Box>
                        {editableFieldKey &&
                          typeof item[editableFieldKey] === "number" && (
                            <Box
                              sx={{
                                width: "fit-content",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "flex-end",
                                flexDirection: "column",
                                gap: "0.5rem",
                                textAlign: editable
                                  ? editMode === item.id
                                    ? "end"
                                    : "center"
                                  : "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  ...theme.typography.labelCondensed,
                                  color: "#6C8093",
                                  width: "100%",
                                }}
                              >
                                <Trans i18nKey={editableFieldKey} />
                              </Typography>

                              {editable && editMode === item.id ? (
                                <TextField
                                  required
                                  value={
                                    tempValues?.[editableFieldKey] as number
                                  }
                                  onChange={(e) =>
                                    setTempValues?.({
                                      ...tempValues,
                                      [editableFieldKey]: Number(
                                        e.target.value,
                                      ),
                                    })
                                  }
                                  name={editableFieldKey}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="normal"
                                  type="number"
                                  inputProps={{
                                    style: {
                                      textAlign: "center",
                                      width: "40px",
                                    },
                                  }}
                                  sx={{
                                    mb: 1,
                                    mt: 1,
                                    fontSize: 14,
                                    "& .MuiInputBase-root": {
                                      fontSize: 14,
                                      overflow: "auto",
                                    },
                                    "& .MuiFormLabel-root": {
                                      fontSize: 14,
                                    },
                                    background: "#fff",
                                    borderRadius: "8px",
                                  }}
                                />
                              ) : (
                                <Box
                                  aria-label={editableFieldKey}
                                  sx={{
                                    width: "3.75rem",
                                    height: "3.75rem",
                                    borderRadius: "50%",
                                    backgroundColor: "#E2E5E9",
                                    color: "#2B333B",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {item[editableFieldKey]}
                                </Box>
                              )}
                            </Box>
                          )}
                      </Box>
                    </Box>
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

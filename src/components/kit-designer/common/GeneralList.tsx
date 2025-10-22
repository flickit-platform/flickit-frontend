import { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@styles";
import { KitDesignListItems } from "@/types/index";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import languageDetector from "@/utils/language-detector";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { useKitDesignerContext } from "@/providers/kit-provider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { Text } from "@/components/common/Text";
import { Divider } from "@mui/material";
import { SwapVertRounded } from "@mui/icons-material";

interface ListOfItemsProps {
  items: Array<KitDesignListItems>;
  onEdit: (id: any) => void;
  onReorder: (reorderedItems: KitDesignListItems[]) => void;
  setOpenDeleteDialog?: any;
  editableFieldKey?: keyof KitDesignListItems;
  editableFieldLabel?: any;
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
  editableFieldLabel,
  editable = true,
}: ListOfItemsProps) => {
  const { kitState } = useKitDesignerContext();
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
                    gap={1}
                    borderRadius="8px"
                    display="flex"
                    alignItems="flex-start"
                    position="relative"
                    border="0.3px solid #73808c30"
                    bgcolor={
                      editMode === item.id
                        ? "background.container"
                        : "background.containerLowest"
                    }
                  >
                    <Box
                      sx={{
                        ...styles.centerCVH,
                        bgcolor: "background.container",
                      }}
                      borderRadius="0.5rem"
                      mr={2}
                      p={0.25}
                    >
                      <Text variant="semiBoldLarge">{index + 1}</Text>
                      <Divider
                        orientation="horizontal"
                        flexItem
                        sx={{ mx: 1 }}
                      />
                      <IconButton size="small">
                        <SwapVertRounded fontSize="small" />
                      </IconButton>
                    </Box>{" "}
                    <Box
                      flexGrow={1}
                      display="flex"
                      flexDirection="column"
                      gap={2}
                    >
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Box flex={1}>
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
                              showCopyIcon
                            />
                          )}
                        </Box>
                        {editMode === item.id ? (
                          <Box
                            sx={{
                              marginInlineStart: "auto",
                              marginInlineEnd: "unset",
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
                              data-testid="items-edit-icon"
                              color="primary"
                            >
                              <EditOutlinedIcon fontSize="small" />
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
                                data-testid="items-delete-icon"
                              >
                                <DeleteOutlinedIcon fontSize="small" />
                              </IconButton>
                            )}
                          </>
                        )}
                      </Box>

                      <Box
                        justifyContent="space-between"
                        gap={3}
                        sx={{ ...styles.centerV }}
                      >
                        <Box flexGrow={1}>
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
                              showCopyIcon
                            />
                          )}
                        </Box>
                        {editableFieldKey &&
                          typeof item[editableFieldKey] === "number" && (
                            <Box
                              width="fit-content"
                              alignItems="flex-end"
                              gap="0.5rem"
                              textAlign={
                                editable
                                  ? editMode === item.id
                                    ? "end"
                                    : "center"
                                  : "center"
                              }
                              sx={{ ...styles.centerCV }}
                            >
                              <Text
                                variant="labelCondensed"
                                color="background.onVariant"
                                sx={{
                                  width: "100%",
                                }}
                              >
                                {editableFieldLabel}
                              </Text>

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
                                    bgcolor: "background.containerLowest",
                                    borderRadius: "8px",
                                  }}
                                />
                              ) : (
                                <Box
                                  width="3.75rem"
                                  height="3.75rem"
                                  borderRadius="50%"
                                  bgcolor="background.variant"
                                  color="text.primary"
                                  aria-label={editableFieldKey}
                                  sx={{ ...styles.centerVH }}
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

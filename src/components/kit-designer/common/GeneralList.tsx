import { ChangeEvent, useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import {
  EditRounded,
  DeleteRounded,
  CheckRounded,
  CloseRounded,
  SwapVertRounded,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@styles";
import { KitDesignListItems, TId } from "@/types/index";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import languageDetector from "@utils/languageDetector";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import { useKitLanguageContext } from "@/providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";

interface ListOfItemsProps {
  items: Array<KitDesignListItems>;
  onEdit: (item: KitDesignListItems) => void;
  onReorder: (reorderedItems: KitDesignListItems[]) => void;
  setOpenDeleteDialog?: (val: { status: boolean; id: TId }) => void;
  editableFieldKey?: keyof KitDesignListItems;
  editable?: boolean;
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
  const [tempValues, setTempValues] = useState<Partial<KitDesignListItems>>({});

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = [...reorderedItems];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setReorderedItems(reordered);
    onReorder(reordered);
  };

  const handleEditClick = (item: KitDesignListItems) => {
    setEditMode(Number(item.id));
    setTempValues(item);
  };

  const handleSaveClick = (item: KitDesignListItems) => {
    onEdit({
      ...item,
      ...tempValues,
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
    setTempValues({});
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({});
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempValues((prev) => ({ ...prev, [name]: value }));
  };

  const isRTL = theme.direction === "rtl";

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="kit-items">
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems.map((item, index) => {
              const isEditing = editMode === item.id;
              return (
                <Draggable
                  key={item.id}
                  draggableId={String(item.id)}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      mt={1.5}
                      p={1.5}
                      sx={{
                        backgroundColor: isEditing ? "#F3F5F6" : "#fff",
                        borderRadius: "8px",
                        border: "0.3px solid #73808c30",
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      {/* Index and Drag Icon */}
                      <Box
                        sx={{
                          ...styles.centerVH,
                          background: "#F3F5F6",
                          width: { xs: "50px", md: "64px" },
                          justifyContent: "space-around",
                        }}
                        borderRadius="0.5rem"
                        px={1.5}
                      >
                        <Typography variant="semiBoldLarge">
                          {index + 1}
                        </Typography>
                        <IconButton size="small" disableRipple>
                          <SwapVertRounded fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Main Content */}
                      <Box
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {/* Title + Actions */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: isRTL ? "row-reverse" : "row",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            {isEditing ? (
                              <MultiLangTextField
                                name="title"
                                value={tempValues.title ?? ""}
                                onChange={handleChange}
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
                              <Typography
                                variant="h6"
                                sx={{
                                  fontFamily: languageDetector(item.title)
                                    ? farsiFontFamily
                                    : primaryFontFamily,
                                }}
                              >
                                {item.title}
                              </Typography>
                            )}
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            {isEditing ? (
                              <>
                                <IconButton
                                  onClick={() => handleSaveClick(item)}
                                  color="success"
                                  data-testid="items-check-icon"
                                >
                                  <CheckRounded />
                                </IconButton>
                                <IconButton
                                  onClick={handleCancelClick}
                                  color="secondary"
                                >
                                  <CloseRounded />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  onClick={() => handleEditClick(item)}
                                  color="success"
                                  data-testid="items-edit-icon"
                                >
                                  <EditRounded />
                                </IconButton>
                                {setOpenDeleteDialog && (
                                  <IconButton
                                    onClick={() =>
                                      setOpenDeleteDialog({
                                        status: true,
                                        id: item.id,
                                      })
                                    }
                                    color="secondary"
                                    data-testid="items-delete-icon"
                                  >
                                    <DeleteRounded />
                                  </IconButton>
                                )}
                              </>
                            )}
                          </Box>
                        </Box>

                        {/* Description */}
                        <Box>
                          {isEditing ? (
                            <MultiLangTextField
                              name="description"
                              value={tempValues.description ?? ""}
                              onChange={handleChange}
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
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: languageDetector(item.description)
                                  ? farsiFontFamily
                                  : primaryFontFamily,
                              }}
                            >
                              {item.description}
                            </Typography>
                          )}
                        </Box>

                        {/* Editable Field like weight */}
                        {editableFieldKey &&
                          typeof item[editableFieldKey] === "number" && (
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Typography variant="caption">
                                <Trans i18nKey={editableFieldKey} />
                              </Typography>
                              {isEditing ? (
                                <TextField
                                  name={editableFieldKey}
                                  type="number"
                                  size="small"
                                  value={tempValues?.[editableFieldKey] ?? ""}
                                  onChange={handleChange}
                                  sx={{ width: "60px", mt: 1 }}
                                  inputProps={{
                                    style: { textAlign: "center" },
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    backgroundColor: "#E2E5E9",
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
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListOfItems;

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@/config/styles";
import { IMaturityLevel, TId } from "@/types/index";
import { Trans } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { useKitLanguageContext } from "@/providers/KitProvider";

interface MaturityLevelListProps {
  maturityLevels: Array<IMaturityLevel>;
  onEdit: (id: any) => void;
  onReorder: (reorderedItems: IMaturityLevel[]) => void;
  setOpenDeleteDialog: any;
}

const renderEditableTextField = (
  fieldName: "title" | "description",
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  translationValue: string,
  onTranslationChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isMultiline = false,
) => (
  <MultiLangTextField
    name={fieldName}
    value={value}
    onChange={onChange}
    inputProps={{
      style: {
        fontFamily: languageDetector(value)
          ? farsiFontFamily
          : primaryFontFamily,
      },
    }}
    translationValue={translationValue}
    onTranslationChange={onTranslationChange}
    label={<Trans i18nKey={fieldName} />}
    multiline={isMultiline}
    minRows={isMultiline ? 2 : undefined}
    maxRows={isMultiline ? 5 : undefined}
  />
);

const MaturityLevelList = ({
  maturityLevels,
  onEdit,
  onReorder,
  setOpenDeleteDialog,
}: MaturityLevelListProps) => {
  const { kitState } = useKitLanguageContext();
  const [reorderedItems, setReorderedItems] = useState(maturityLevels);
  const [editMode, setEditMode] = useState<TId | null | undefined>(null);
  const [tempValues, setTempValues] = useState<IMaturityLevel>({
    id: null,
    title: "",
    description: "",
    value: 1,
    index: 1,
    translations: null,
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(reorderedItems);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setReorderedItems(items);
    onReorder(items);
  };

  const handleEditClick = (item: IMaturityLevel) => {
    setEditMode(item.id);
    setTempValues(item);
  };

  const handleSaveClick = (item: IMaturityLevel) => {
    const langCode = kitState.translatedLanguage?.code;
    const translations = langCode
      ? {
          [langCode]: {
            title:
              tempValues.translations?.[langCode]?.title === ""
                ? undefined
                : tempValues.translations?.[langCode]?.title,
            description:
              tempValues.translations?.[langCode]?.description === ""
                ? undefined
                : tempValues.translations?.[langCode]?.description,
          },
        }
      : undefined;

    onEdit({
      ...item,
      title: tempValues.title,
      description: tempValues.description,
      translations,
    });
    setEditMode(null);
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setTempValues({
      id: null,
      title: "",
      description: "",
      value: 1,
      index: 1,
      translations: null,
    });
  };

  const isRTL = theme.direction === "rtl";

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="maturityLevels">
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems.map((item, index) => {
              const isEditing = editMode === item.id;
              const langCode = kitState.translatedLanguage?.code ?? "";

              return (
                <Draggable
                  key={item.id}
                  draggableId={item.id!.toString()}
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
                        alignItems: "flex-start",
                        gap: 2,
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
                        borderRadius="0.5rem"
                        mr={2}
                        p={0.25}
                      >
                        <Typography variant="semiBoldLarge">
                          {index + 1}
                        </Typography>
                        <Divider
                          orientation="horizontal"
                          flexItem
                          sx={{ mx: 1 }}
                        />
                        <IconButton size="small">
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
                            justifyContent: "space-between",
                            flexDirection: isRTL ? "row-reverse" : "row",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            {isEditing ? (
                              renderEditableTextField(
                                "title",
                                tempValues.title,
                                (e) =>
                                  setTempValues((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  })),
                                tempValues.translations?.[langCode]?.title,
                                (e) => {
                                  if (!langCode) return;
                                  setTempValues((prev) => ({
                                    ...prev,
                                    translations: {
                                      ...prev.translations,
                                      [langCode]: {
                                        ...prev.translations?.[langCode],
                                        title: e.target.value,
                                      },
                                    },
                                  }));
                                },
                              )
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
                          <Box display="flex" gap={1} mt={0.5}>
                            {isEditing ? (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() => handleSaveClick(item)}
                                  color="success"
                                  data-testid="check-icon-id"
                                  sx={{
                                    ...styles.fixedIconButtonStyle,
                                  }}
                                >
                                  <CheckRoundedIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={handleCancelClick}
                                  color="secondary"
                                  data-testid="close-icon-id"
                                  sx={{
                                    ...styles.fixedIconButtonStyle,
                                  }}
                                >
                                  <CloseRoundedIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(item)}
                                  color="success"
                                  data-testid="edit-icon-id"
                                >
                                  <EditRoundedIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setOpenDeleteDialog({
                                      status: true,
                                      id: item.id,
                                    })
                                  }
                                  color="secondary"
                                  data-testid="delete-icon-id"
                                >
                                  <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                          </Box>
                        </Box>

                        {isEditing ? (
                          renderEditableTextField(
                            "description",
                            tempValues.description,
                            (e) =>
                              setTempValues((prev) => ({
                                ...prev,
                                description: e.target.value,
                              })),
                            tempValues.translations?.[langCode]?.description,
                            (e) => {
                              if (!langCode) return;
                              setTempValues((prev) => ({
                                ...prev,
                                translations: {
                                  ...prev.translations,
                                  [langCode]: {
                                    ...prev.translations?.[langCode],
                                    description: e.target.value,
                                  },
                                },
                              }));
                            },
                            true,
                          )
                        ) : (
                          <Typography
                            variant="body2"
                            mt={1}
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

export default MaturityLevelList;

import { useState } from "react";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import SwapVertRounded from "@mui/icons-material/SwapVertRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styles } from "@/config/styles";
import { IMaturityLevel, TId } from "@/types/index";
import { Trans } from "react-i18next";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";
import { useKitLanguageContext } from "@/providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import TitleWithTranslation from "@/components/common/fields/TranslationText";

interface MaturityLevelListProps {
  maturityLevels: Array<IMaturityLevel>;
  onEdit: (item: IMaturityLevel) => void;
  onReorder: (reorderedItems: IMaturityLevel[]) => void;
  setOpenDeleteDialog: (val: { status: boolean; id: any }) => void;
}

const MaturityLevelList = ({
  maturityLevels,
  onEdit,
  onReorder,
  setOpenDeleteDialog,
}: MaturityLevelListProps) => {
  const { kitState } = useKitLanguageContext();
  const langCode = kitState.translatedLanguage?.code ?? "";
  const { updateTranslation } = useTranslationUpdater(langCode);

  const [editMode, setEditMode] = useState<TId | null | undefined>(null);
  const [tempValues, setTempValues] = useState<IMaturityLevel>({
    id: null,
    title: "",
    description: "",
    value: 1,
    index: 1,
    translations: null,
  });
  const [reorderedItems, setReorderedItems] = useState(maturityLevels);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(reorderedItems);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setReorderedItems(items);
    onReorder(items);
  };

  const handleEdit = (item: IMaturityLevel) => {
    setEditMode(item.id);
    setTempValues(item);
  };

  const handleSave = (item: IMaturityLevel) => {
    const translations = langCode
      ? {
          [langCode]: {
            title: tempValues.translations?.[langCode]?.title,
            description: tempValues.translations?.[langCode]?.description,
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

  const handleCancel = () => {
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

  const renderItem = (item: IMaturityLevel, index: number) => {
    const isEditing = editMode === item.id;

    return (
      <Draggable key={item.id} draggableId={item.id!.toString()} index={index}>
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
              <Typography variant="semiBoldLarge">{index + 1}</Typography>
              <Divider orientation="horizontal" flexItem sx={{ mx: 1 }} />
              <IconButton size="small">
                <SwapVertRounded fontSize="small" />
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
              {/* Title + Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection:  "row",
                  gap: 1,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  {isEditing ? (
                    <MultiLangTextField
                      name="title"
                      value={tempValues.title}
                      onChange={(e) =>
                        setTempValues((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      translationValue={
                        tempValues.translations?.[langCode]?.title ?? ""
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
                        langCode ? item.translations?.[langCode]?.title : ""
                      }
                      variant="semiBoldMedium"
                    />
                  )}
                </Box>

                <Box display="flex" gap={1} mt={0.5}>
                  {isEditing ? (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => handleSave(item)}
                        color="success"
                        sx={{ ...styles.fixedIconButtonStyle }}
                        data-testid="check-icon-id"
                      >
                        <CheckRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleCancel}
                        color="secondary"
                        sx={{ ...styles.fixedIconButtonStyle }}
                        data-testid="close-icon-id"
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(item)}
                        color="success"
                        data-testid="edit-icon-id"
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setOpenDeleteDialog({ status: true, id: item.id })
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

              {/* Description */}
              <Box>
                {isEditing ? (
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
                      tempValues.translations?.[langCode]?.description ?? ""
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
                      langCode ? item.translations?.[langCode]?.description : ""
                    }
                    variant="bodyMedium"
                  />
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="maturityLevels">
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems.map(renderItem)}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MaturityLevelList;

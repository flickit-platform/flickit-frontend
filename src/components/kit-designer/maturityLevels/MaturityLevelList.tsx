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
import { IMaturityLevel } from "@/types/index";
import { Trans } from "react-i18next";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import MultiLangTextField from "@/components/common/fields/MultiLangTextField";

interface MaturityLevelListProps {
  maturityLevels: Array<IMaturityLevel>;
  onEdit: (id: any) => void;
  onReorder: (reorderedItems: IMaturityLevel[]) => void;
  setOpenDeleteDialog: any;
}

const MaturityLevelList = ({
  maturityLevels,
  onEdit,
  onReorder,
  setOpenDeleteDialog,
}: MaturityLevelListProps) => {
  const [reorderedItems, setReorderedItems] = useState(maturityLevels);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<IMaturityLevel>({
    id: null,
    title: "",
    description: "",
    value: 1,
    index: 1,
    translations: { FA: { title: "", description: "" } },
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newItems = Array.from(reorderedItems);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setReorderedItems(newItems);
    onReorder(newItems);
  };

  const handleEditClick = (item: IMaturityLevel) => {
    setEditMode(item.id as number);
    setTempValues({
      ...item,
      translations: item.translations ?? { FA: { title: "", description: "" } },
    });
  };

  const handleSaveClick = (item: IMaturityLevel) => {
    const payload = {
      ...item,
      title: tempValues.title,
      description: tempValues.description,
      translations: {
        FA: {
          title: tempValues.translations?.FA?.title ?? "",
          description: tempValues.translations?.FA?.description ?? "",
        },
      },
    };
    onEdit(payload);
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
      translations: { FA: { title: "", description: "" } },
    });
  };

  const isRTL = theme.direction === "rtl";

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="maturityLevels">
        {(provided: any) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {reorderedItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id!.toString()} index={index}>
                {(provided: any) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    mt={1.5}
                    p={1.5}
                    sx={{
                      backgroundColor: editMode === item.id ? "#F3F5F6" : "#fff",
                      borderRadius: "8px",
                      border: "0.3px solid #73808c30",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      position: "relative",
                    }}
                  >
                    <Box sx={{ ...styles.centerCVH, background: "#F3F5F6" }} borderRadius="0.5rem" mr={2} p={0.25}>
                      <Typography variant="semiBoldLarge">{index + 1}</Typography>
                      <Divider orientation="horizontal" flexItem sx={{ mx: 1 }} />
                      <IconButton size="small">
                        <SwapVertRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                      {/* Title with Actions */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          flexDirection: isRTL ? "row-reverse" : "row",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          {editMode === item.id ? (
                            <MultiLangTextField
                              name="title"
                              value={tempValues.title}
                              onChange={(e) =>
                                setTempValues((prev) => ({ ...prev, title: e.target.value }))
                              }
                              translationValue={tempValues.translations?.FA?.title ?? ""}
                              onTranslationChange={(e) =>
                                setTempValues((prev) => ({
                                  ...prev,
                                  translations: {
                                    ...prev.translations,
                                    FA: {
                                      ...prev.translations?.FA,
                                      title: e.target.value,
                                    },
                                  },
                                }))
                              }
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

                        <Box display="flex" gap={1} mt={0.5}>
                          {editMode === item.id ? (
                            <>
                              <IconButton size="small" onClick={() => handleSaveClick(item)} color="success">
                                <CheckRoundedIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={handleCancelClick} color="secondary">
                                <CloseRoundedIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton size="small" onClick={() => handleEditClick(item)} color="success">
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => setOpenDeleteDialog({ status: true, id: item.id })}
                                color="secondary"
                              >
                                <DeleteRoundedIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </Box>

                      {/* Description */}
                      {editMode === item.id ? (
                        <MultiLangTextField
                          name="description"
                          value={tempValues.description}
                          onChange={(e) =>
                            setTempValues((prev) => ({ ...prev, description: e.target.value }))
                          }
                          translationValue={tempValues.translations?.FA?.description ?? ""}
                          onTranslationChange={(e) =>
                            setTempValues((prev) => ({
                              ...prev,
                              translations: {
                                ...prev.translations,
                                FA: {
                                  ...prev.translations?.FA,
                                  description: e.target.value,
                                },
                              },
                            }))
                          }
                          label={<Trans i18nKey="description" />}
                          multiline
                          minRows={2}
                          maxRows={5}
                        />
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
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MaturityLevelList;

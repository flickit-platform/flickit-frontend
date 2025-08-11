import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditIcon from "@mui/icons-material/Edit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AttributeForm from "./AttributeForm";
import { Trans } from "react-i18next";
import languageDetector from "@utils/languageDetector";

import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import { useKitDesignerContext } from "@providers/KitProvider";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { MultiLangs } from "@/types";
import TitleWithTranslation from "@common/fields/TranslationText";

interface Attribute {
  id: string | number;
  title: string;
  description: string;
  subject: {
    id: number;
    title: string;
  };
  weight: number;
  index: number;
  isEditing?: boolean;
  translations: MultiLangs | null
}

interface Subject {
  id: string | number;
  title: string;
  description: string;
  weight: number;
  translations?: any;
}

interface SubjectTableProps {
  subjects: Subject[];
  initialAttributes: Attribute[];
  onAddAttribute: any;
  onReorder: (newOrder: Attribute[], subjectId: number) => void;
  handleCancel: any;
  handleSave: any;
  setNewAttribute: any;
  newAttribute: any;
  showNewAttributeForm: boolean;
  handleEdit: any;
}

const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  initialAttributes,
  onReorder,
  handleCancel,
  handleSave,
  setNewAttribute,
  newAttribute,
  showNewAttributeForm,
  handleEdit,
}) => {

  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const [targetSubjectId, setTargetSubjectId] = useState<number | null>(null);
  const [editAttributeId, setEditAttributeId] = useState<string | null>(null);
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  const { updateTranslation } = useTranslationUpdater(langCode);


  useEffect(() => {
    setAttributes(initialAttributes);
  }, [initialAttributes]);
  useEffect(() => {
    setTargetSubjectId(Number(subjects[subjects?.length - 1]?.id));
  }, [subjects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "weight" ? parseInt(value) || 1 : value;
    setNewAttribute((prev: any) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setEditAttributeId(String(attribute.id));
    setNewAttribute(attribute);
  };

  const handleSaveEdit = () => {
    handleEdit(newAttribute);
    setEditAttributeId(null);
  };

  const handleCancelEdit = () => {
    setEditAttributeId(null);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceSubjectId = result.source.droppableId;
    const destinationSubjectId = result.destination.droppableId;

    if (result.draggableId === "new-attr") {
      setTargetSubjectId(Number(destinationSubjectId));
    } else {
      const movedAttributeId = result.draggableId.split("-")[1];
      const movedAttribute = attributes.find(
        (attr) => String(attr.id) === movedAttributeId,
      );

      if (!movedAttribute) return;

      const updatedAttributes = [
        ...attributes.filter((attr) => attr.id !== movedAttribute.id),
      ];
      const attributesBySubject = updatedAttributes.reduce(
        (acc, attr) => {
          if (!acc[attr.subject.id]) acc[attr.subject.id] = [];
          acc[attr.subject.id].push(attr);
          return acc;
        },
        {} as Record<number, Attribute[]>,
      );

      if (!attributesBySubject[destinationSubjectId]) {
        attributesBySubject[destinationSubjectId] = [];
      }

      attributesBySubject[destinationSubjectId].splice(
        result.destination.index,
        0,
        {
          ...movedAttribute,
        },
      );

      Object.keys(attributesBySubject).forEach((subjectId) => {
        attributesBySubject[Number(subjectId)].forEach((attr, index) => {
          attr.index = index;
        });
      });

      const reorderedAttributes = Object.values(attributesBySubject).flat();

      if (sourceSubjectId !== destinationSubjectId) {
        movedAttribute.subject = {
          id: Number(destinationSubjectId),
          title: "",
        };
        const destAttrLength = attributes.filter(
          (attr) => Number(destinationSubjectId) === attr.subject.id,
        ).length;
        movedAttribute.index = destAttrLength + 1;
        handleEdit(movedAttribute);
      }
      setAttributes(reorderedAttributes);
      onReorder(attributesBySubject[destinationSubjectId], sourceSubjectId);
    }
  };

  return (
    <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "10%" }}>
                <Trans i18nKey="common.order" />
              </TableCell>
              <TableCell sx={{ width: "30%" }}>
                <Trans i18nKey="common.title" />
              </TableCell>
              <TableCell sx={{ width: "50%" }}>
                <Trans i18nKey="common.description" />
              </TableCell>
              <TableCell sx={{ width: "10%" }}>
                <Trans i18nKey="common.weight" />
              </TableCell>
              <TableCell sx={{ width: "10%" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects?.map((subject, index) => (
              <React.Fragment key={subject.id}>
                <TableRow
                  sx={{ background: "#F9F9F9", borderRadius: "0.5rem", mb: 1 }}
                >
                  <TableCell>
                    <Typography variant="semiBoldLarge">{index + 1}</Typography>
                  </TableCell>
                  <TableCell>
                    <TitleWithTranslation
                      title={subject.title}
                      translation={
                        langCode ? subject.translations?.[langCode]?.title : ""
                      }
                      variant="semiBoldMedium"
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <TitleWithTranslation
                      title={subject.description}
                      translation={
                        langCode
                          ? subject.translations?.[langCode]?.description
                          : ""
                      }
                      variant="semiBoldMedium"
                    />
                  </TableCell>
                  <TableCell>{subject.weight}</TableCell>
                  <TableCell />
                </TableRow>

                <Droppable droppableId={String(subject.id)} type="attribute">
                  {(provided) => (
                    <TableRow
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <TableCell colSpan={5}>
                        <Box>
                          {attributes
                            .filter((attr) => attr.subject.id === subject.id)
                            .map((attribute, attrIndex) => (
                              <Draggable
                                key={attribute.id}
                                draggableId={`attr-${attribute.id}`}
                                index={attrIndex}
                              >
                                {(provided) => (
                                  <TableRow
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      borderRadius: "0.5rem",
                                      mb: 1,
                                      display: "flex",
                                    }}
                                  >
                                    {/* Conditionally render editable fields */}
                                    {editAttributeId ===
                                      String(attribute.id) ? (
                                      <TableCell sx={{ width: "100%" }}>
                                        <AttributeForm
                                          newAttribute={newAttribute}
                                          handleCancel={handleCancelEdit}
                                          handleSave={handleSaveEdit}
                                          handleInputChange={handleInputChange}
                                          langCode={langCode}
                                          setNewAttribute={setNewAttribute}
                                          updateTranslation={updateTranslation}
                                        />
                                      </TableCell>
                                    ) : (
                                      <>
                                        <TableCell sx={{ alignContent: "center", }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              background: "background.container",
                                              borderRadius: "0.5rem",
                                              width: { xs: "50px", md: "64px" },
                                              justifyContent: "space-around",
                                              px: 1.5,

                                            }}
                                          >
                                            <Typography variant="semiBoldLarge">
                                              {attrIndex + 1}
                                            </Typography>
                                            <IconButton
                                              disableRipple
                                              disableFocusRipple
                                              size="small"
                                            >
                                              <SwapVertRoundedIcon fontSize="small" />
                                            </IconButton>
                                          </Box>
                                        </TableCell>
                                        <TableCell
                                          sx={{

                                            width: "100%",
                                            flexGrow: 1,
                                            mt: 0.5,
                                            fontFamily: languageDetector(
                                              attribute.title,
                                            )
                                              ? farsiFontFamily
                                              : primaryFontFamily,
                                          }}
                                          data-testid="display-attribute-title"
                                        >
                                          <TitleWithTranslation
                                            title={attribute.title}
                                            translation={
                                              langCode ? attribute.translations?.[langCode]?.title : ""
                                            }
                                            variant="semiBoldMedium"
                                            showCopyIcon
                                          />
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            width: "100%",
                                            flexGrow: 1,
                                            mt: 0.5,
                                            fontFamily: languageDetector(
                                              attribute.description,
                                            )
                                              ? farsiFontFamily
                                              : primaryFontFamily,
                                          }}
                                          data-testid="display-attribute-description"
                                        >
                                          <TitleWithTranslation
                                            title={attribute.description}
                                            translation={
                                              langCode ? attribute.translations?.[langCode]?.description : ""
                                            }
                                            variant="semiBoldMedium"
                                            showCopyIcon
                                          />
                                        </TableCell>
                                        <TableCell sx={{ alignContent: "center" }} data-testid="display-attribute-weight">
                                          {attribute.weight}
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            display: "flex",
                                            alignContent: "center"
                                          }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              handleEditAttribute(attribute)
                                            }
                                            size="small"
                                            color="success"
                                          >
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        </TableCell>
                                      </>
                                    )}
                                  </TableRow>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}

                          {/* Render the new attribute form based on targetSubjectId */}
                          {targetSubjectId === subject.id &&
                            showNewAttributeForm && (
                              <Draggable
                                draggableId={`new-attr`}
                                index={
                                  attributes.filter(
                                    (attr) => attr.subject.id === subject.id,
                                  ).length
                                } // Place it after existing attributes
                              >
                                {(provided) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      background: "#F9F9F9",
                                      borderColor: "white",
                                      borderRadius: "0.5rem",
                                      mb: 1,
                                      width: "100%"
                                    }}
                                  >
                                    <AttributeForm
                                      newAttribute={newAttribute}
                                      handleInputChange={handleInputChange}
                                      handleSave={() =>
                                        handleSave(subject.id)
                                      } // Pass the subject ID to add
                                      handleCancel={handleCancel}
                                      langCode={langCode}
                                      setNewAttribute={setNewAttribute}
                                      updateTranslation={updateTranslation}
                                    />
                                  </Box>
                                )}
                              </Draggable>
                            )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Droppable>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </DragDropContext>
    </TableContainer>
  );
};

export default SubjectTable;

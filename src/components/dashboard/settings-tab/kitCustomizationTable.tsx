import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { useKitDesignerContext } from "@/providers/KitProvider";

interface Attribute {
  id: string | number;
  title: string;
  index: number;
  weight: {
    defaultValue: number;
    customValue: any;
  };
  translations: any;
}

interface Subject {
  id: string | number;
  title: string;
  index: number;
  weight: {
    defaultValue: number;
    customValue: any;
  };
  attributes: Attribute[];
  translations: any;
}

interface SubjectTableProps {
  subjects: Subject[];
  setInputData: any;
  inputData: any;
}
const KitCustomizationTable: React.FC<SubjectTableProps> = ({
  subjects,
  inputData,
  setInputData,
}) => {
  const [editAttributeIds, setEditAttributeIds] = useState<
    Array<string | number>
  >([]);
  const [tempInputData, setTempInputData] = useState({
    title: "",
    customData: {
      subjects: [],
      attributes: [],
    },
  });
  const { kitState } = useKitDesignerContext();
  const langCode = kitState.mainLanguage?.code;

  useEffect(() => {
    setTempInputData(JSON.parse(JSON.stringify(inputData)));
  }, [inputData]);

  const toggleEdit = (id: string | number) => {
    setEditAttributeIds((prev) =>
      prev.includes(id)
        ? prev.filter((editId) => editId !== id)
        : [...prev, id],
    );

    if (!editAttributeIds.includes(id)) {
      // Deep copy current inputData when starting an edit
      setTempInputData(JSON.parse(JSON.stringify(inputData)));
    }
  };

  const handleSaveEdit = (id: string | number) => {
    // Merge changes from tempInputData into inputData
    setInputData(tempInputData);
    toggleEdit(id); // Exit edit mode
  };

  const handleCancelEdit = (id: string | number) => {
    // Revert tempInputData to match inputData
    setTempInputData(JSON.parse(JSON.stringify(inputData)));
    toggleEdit(id); // Exit edit mode
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string | number,
    type: "subject" | "attribute",
  ) => {
    const { name, value } = event.target;

    setTempInputData((prevData: any) => {
      const updatedData = { ...prevData };
      const targetArray =
        updatedData.customData?.[
          type === "subject" ? "subjects" : "attributes"
        ] ?? [];
      const targetIndex = targetArray.findIndex((item: any) => item.id === id);

      if (targetIndex >= 0) {
        targetArray[targetIndex] = {
          ...targetArray[targetIndex],
          [name]: value,
        };
      } else {
        targetArray.push({ id, [name]: value });
      }

      updatedData.customData[type === "subject" ? "subjects" : "attributes"] =
        targetArray;
      return updatedData;
    });
  };

  const renderEditableTextField = (
    type: "subject" | "attribute",
    id: string | number,
    value?: number | string,
  ) => {
    const inputValue =
      (
        tempInputData?.customData?.[
          type === "subject" ? "subjects" : "attributes"
        ]?.find((item: any) => item.id === id) as any
      )?.weight ?? value;

    return (
      <TextField
        required
        label={<Trans i18nKey="weight" />}
        name="weight"
        type="number"
        value={inputValue ?? ""}
        onChange={(e: any) => handleInputChange(e, id, type)}
        fullWidth
        margin="normal"
        sx={{
          mt: 1,
          fontSize: 14,
          "& .MuiInputBase-root": {
            height: 40,
            fontSize: 14,
          },
          "& .MuiFormLabel-root": {
            fontSize: 14,
          },
          background: "#fff",
        }}
      />
    );
  };

  return (
    <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "10%" }}>
              <Trans i18nKey="index" />
            </TableCell>
            <TableCell sx={{ width: "75%" }}>
              <Trans i18nKey="title" />
            </TableCell>
            <TableCell sx={{ width: "15%", textAlign: "center" }}>
              <Trans i18nKey="weight" />
            </TableCell>
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
                  {" "}
                  <TitleWithTranslation
                    title={
                      langCode
                        ? (subject.translations?.[langCode]?.title ??
                          subject.title)
                        : subject.title
                    }
                    translation={""}
                    variant="semiBoldMedium"
                  />{" "}
                </TableCell>
                <TableCell>
                  {editAttributeIds.includes(subject.id) ? (
                    renderEditableTextField(
                      "subject",
                      subject.id,
                      subject.weight.customValue ?? subject.weight.defaultValue,
                    )
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Typography>
                        <Trans i18nKey={"weight"} />:
                      </Typography>
                      {inputData?.customData?.["subjects"]?.find(
                        (item: any) => item.id === subject.id,
                      )?.weight ||
                        subject.weight.customValue ||
                        subject.weight.defaultValue}
                      {!inputData?.customData?.["subjects"]?.find(
                        (item: any) => item.id === subject.id,
                      )?.weight &&
                        !subject.weight.customValue && (
                          <Box>
                            (<Trans i18nKey={"default"} />)
                          </Box>
                        )}
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ display: "flex", mt: "16px" }}>
                  {editAttributeIds.includes(subject.id) ? (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleSaveEdit(subject.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleCancelEdit(subject.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => toggleEdit(subject.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
              {subject.attributes.map((attribute, attrIndex) => (
                <TableRow key={attribute.id}>
                  <TableCell>{attrIndex + 1}</TableCell>
                  <TableCell>
                    <TitleWithTranslation
                      title={
                        langCode
                          ? (attribute.translations?.[langCode]?.title ??
                            attribute.title)
                          : attribute.title
                      }
                      translation={""}
                      variant="semiBoldMedium"
                    />{" "}
                  </TableCell>
                  <TableCell>
                    {editAttributeIds.includes(attribute.id) ? (
                      renderEditableTextField(
                        "attribute",
                        attribute.id,
                        attribute.weight.customValue ??
                          attribute.weight.defaultValue,
                      )
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography>
                          <Trans i18nKey={"weight"} />:
                        </Typography>
                        {inputData?.customData?.["attributes"]?.find(
                          (item: any) => item.id === attribute.id,
                        )?.weight ||
                          attribute.weight.customValue ||
                          attribute.weight.defaultValue}
                        {!inputData?.customData?.["attributes"]?.find(
                          (item: any) => item.id === attribute.id,
                        )?.weight &&
                          !attribute.weight.customValue && (
                            <Box>
                              (<Trans i18nKey={"default"} />)
                            </Box>
                          )}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {editAttributeIds.includes(attribute.id) ? (
                      <Box display="flex">
                        <IconButton
                          color="primary"
                          onClick={() => handleSaveEdit(attribute.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleCancelEdit(attribute.id)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => toggleEdit(attribute.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KitCustomizationTable;

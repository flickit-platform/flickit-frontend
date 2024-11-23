import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    Typography,
} from "@mui/material";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditIcon from "@mui/icons-material/Edit";
import { Trans } from "react-i18next";

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
}

interface Subject {
    id: string | number;
    title: string;
    description: string;
    weight: number;
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
    setOpenDeleteDialog: any;
}

const KitCustomizationTable: React.FC<SubjectTableProps> = ({
                                                       subjects,
                                                       initialAttributes,
                                                       onReorder,
                                                       handleCancel,
                                                       handleSave,
                                                       setNewAttribute,
                                                       newAttribute,
                                                       showNewAttributeForm,
                                                       handleEdit,
                                                       setOpenDeleteDialog
                                                   }) => {
    const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
    const [targetSubjectId, setTargetSubjectId] = useState<number | null>(null);
    const [editAttributeId, setEditAttributeId] = useState<string | null>(null);

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


    return (
        <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "10%" }}>
                                <Trans i18nKey="order" />
                            </TableCell>
                            <TableCell sx={{ width: "30%" }}>
                                <Trans i18nKey="title" />
                            </TableCell>
                            <TableCell sx={{ width: "50%" }}>
                                <Trans i18nKey="description" />
                            </TableCell>
                            <TableCell sx={{ width: "10%" }}>
                                <Trans i18nKey="weight" />
                            </TableCell>
                            <TableCell sx={{ width: "10%" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((subject, index) => (
                            <React.Fragment key={subject.id}>
                                <TableRow
                                    sx={{ background: "#F9F9F9", borderRadius: "0.5rem", mb: 1 }}
                                >
                                    <TableCell>
                                        <Typography variant="semiBoldLarge">{index + 1}</Typography>
                                    </TableCell>
                                    <TableCell>{subject.title}</TableCell>
                                    <TableCell>{subject.description}</TableCell>
                                    <TableCell>{subject.weight}</TableCell>
                                    <TableCell />
                                </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <Box>
                                                    {attributes
                                                        .filter((attr) => attr.subject.id === subject.id)
                                                        .map((attribute, attrIndex) => (

                                                                    <TableRow
                                                                        sx={{
                                                                            borderRadius: "0.5rem",
                                                                            mb: 1,
                                                                            display: "flex",
                                                                        }}
                                                                    >
                                                                        {/* Conditionally render editable fields */}
                                                                                <TableCell>
                                                                                    <Box
                                                                                        sx={{
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            background: "#F3F5F6",
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
                                                                                    }}
                                                                                    data-testid = "display-attribute-title"
                                                                                >
                                                                                    {attribute.title}
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                        flexGrow: 1,
                                                                                        mt: 0.5,
                                                                                    }}
                                                                                    data-testid = "display-attribute-description"
                                                                                >
                                                                                    {attribute.description}
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    data-testid = "display-attribute-weight"
                                                                                >
                                                                                    {attribute.weight}
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        alignItems: "flex-start",
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
                                                                                    {/* <IconButton
                                            onClick={() => setOpenDeleteDialog({status:true,id:attribute.id})}
                                            size="small"
                                            color="secondary"
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton> */}
                                                                                </TableCell>
                                                                    </TableRow>
                                                        ))}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
        </TableContainer>
    );
};

export default KitCustomizationTable;

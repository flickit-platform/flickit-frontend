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
    index: number;
    weight: {
        defaultValue: number;
        customValue: any;
    };
}

interface Subject {
    id: string | number;
    title: string;
    index: number;
    weight: {
        defaultValue: number,
        customValue: any
    }
    attributes : Attribute[]
}

interface SubjectTableProps {
    subjects: Subject[];
    // initialAttributes: Attribute[];
    onAddAttribute?: any;
    onReorder?: (newOrder: Attribute[], subjectId: number) => void;
    handleCancel?: any;
    handleSave?: any;
    setNewAttribute?: any;
    newAttribute?: any;
    showNewAttributeForm?: boolean;
    handleEdit?: any;
    setOpenDeleteDialog?: any;
}

const KitCustomizationTable: React.FC<SubjectTableProps> = ({
                                                       subjects,
                                                       // initialAttributes,
                                                       onReorder,
                                                       handleCancel,
                                                       handleSave,
                                                       setNewAttribute,
                                                       newAttribute,
                                                       showNewAttributeForm,
                                                       handleEdit,
                                                       setOpenDeleteDialog
                                                   }) => {
    // const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
    const [targetSubjectId, setTargetSubjectId] = useState<number | null>(null);
    const [editAttributeId, setEditAttributeId] = useState<string | null>(null);

    // useEffect(() => {
    //     setAttributes(initialAttributes);
    // }, [initialAttributes]);

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
                            <TableCell sx={{width:"10%"}} >
                                <Trans i18nKey="index" />
                            </TableCell>
                            <TableCell sx={{width:"75%"}} >
                                <Trans i18nKey="title" />
                            </TableCell>
                            {/*<TableCell sx={{ width: "50%" }}>*/}
                                {/*<Trans i18nKey="description" />*/}
                            {/*</TableCell>*/}
                            <TableCell sx={{width:"15%", textAlign:"center"}} >
                                <Trans i18nKey="weight" />
                            </TableCell>
                            {/*<TableCell sx={{ width: "10%" }}></TableCell>*/}
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
                                    {/*<TableCell></TableCell>*/}
                                    <TableCell>
                                        <Box sx={{display:"flex", gap:1}}>
                                            <Typography>
                                                <Trans i18nKey={"weight"} />:
                                            </Typography>
                                            {subject.weight.customValue || subject.weight.defaultValue}
                                            {!subject.weight.customValue && <Box>(<Trans i18nKey={"default"} />)</Box>}
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <IconButton
                                            // onClick={() =>
                                            //     handleEditAttribute(attribute)
                                            // }
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
                                        <TableRow >
                                            <TableCell sx={{pb:"0px", borderBottom:"none"}} colSpan={4}>
                                                <Box>
                                                    {subject.attributes
                                                        // .filter((attr) => attr.subject.id === subject.id)
                                                        .map((attribute, attrIndex) => (

                                                                    <TableRow
                                                                        sx={{
                                                                            borderRadius: "0.5rem",
                                                                            mb: 1,
                                                                            display: "flex",
                                                                        }}
                                                                    >
                                                                        {/* Conditionally render editable fields */}
                                                                                <TableCell sx={subject?.attributes?.length == attrIndex + 1 ? {borderBottom: "none"}:{}} >
                                                                                    <Box
                                                                                        sx={{
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            background: "#F3F5F6",
                                                                                            borderRadius: "0.5rem",
                                                                                            width: { xs: "35px", md: "45px" },
                                                                                            justifyContent: "space-around",
                                                                                            px: 1.5,
                                                                                        }}
                                                                                    >
                                                                                        <Typography variant="semiBoldLarge">
                                                                                            {attrIndex + 1}
                                                                                        </Typography>
                                                                                        {/*<IconButton*/}
                                                                                        {/*    disableRipple*/}
                                                                                        {/*    disableFocusRipple*/}
                                                                                        {/*    size="small"*/}
                                                                                        {/*>*/}
                                                                                        {/*    <SwapVertRoundedIcon fontSize="small" />*/}
                                                                                        {/*</IconButton>*/}
                                                                                    </Box>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                        flexGrow: 1,
                                                                                        mt: 0.5,
                                                                                    }}
                                                                                    style={subject?.attributes?.length == attrIndex + 1 ? {borderBottom: "none"}:{}}
                                                                                >
                                                                                    {attribute.title}
                                                                                </TableCell>
                                                                                {/*<TableCell*/}
                                                                                {/*    sx={{*/}
                                                                                {/*        width: "100%",*/}
                                                                                {/*        flexGrow: 1,*/}
                                                                                {/*        mt: 0.5,*/}
                                                                                {/*    }}*/}
                                                                                {/*>*/}
                                                                                {/*    /!*{attribute.description}*!/*/}
                                                                                {/*</TableCell>*/}
                                                                                <TableCell
                                                                                    style={subject?.attributes?.length == attrIndex + 1 ? {borderBottom: "none"}:{}}
                                                                                >
                                                                                    <Box sx={{display:"flex", gap:1}}>
                                                                                        <Typography>
                                                                                            <Trans i18nKey={"weight"} />:
                                                                                        </Typography>
                                                                                        {attribute.weight.customValue || attribute.weight.defaultValue}
                                                                                        {!attribute.weight.customValue && <Box>(<Trans i18nKey={"default"} />)</Box>}
                                                                                    </Box>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        alignItems: "flex-start",
                                                                                    }}
                                                                                    style={subject?.attributes?.length == attrIndex + 1 ? {borderBottom: "none"}:{}}
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

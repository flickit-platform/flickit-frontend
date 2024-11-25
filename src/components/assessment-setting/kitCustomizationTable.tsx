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
    Typography, Link,
} from "@mui/material";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import EditIcon from "@mui/icons-material/Edit";
import { Trans } from "react-i18next";
import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

    const [data, setData] = useState<any>({
        customData: {
            subjects: [{id: 0, weight: 0}],
            attributes: [{id: 0, weight: 0}],
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>,subjectId: any) => {
        const { name, value } = e.target;
        const parsedValue =  parseInt(value);

        setData((prevData: any)=>{
            let updatedType = prevData.customData[name]
            // console.log(updatedType,"updatedType")
             let test =  updatedType.map((item: any) => {
                  if(item.id == subjectId){

                      item.weight = parsedValue
                      return item
                  }else{
                      let copy = [...updatedType]
                          copy.push({id:subjectId, weight: parsedValue})
                          return copy
                  }
                })

                return {
                    ...prevData,
                    customData: {
                        ...prevData.customData,
                        [name]: [...test]
                    },
                };
        })



        // setData((prevData: any)=>{
        //     let updatedType = prevData.customData[name]
        //     console.log(updatedType,"oooo")
        //   let test =  updatedType.map((item: any) => {
        //       return   item.id == subjectId ? {...item,weight:parsedValue} : {id:subjectId, weight: parsedValue}
        //     })
        //     console.log(test,"ttttt")
        //     return {
        //         ...prevData,
        //         customData: {
        //             ...prevData.customData,
        //             [name]: [...prevData.customData[name],test],
        //         },
        //     };
        // })



        // setData((prevData: any) => {
        //    let updatedType = prevData.customData[name]
        //    let o  = updatedType.map((item : any) => item.id == subjectId ?
        //         {...item, weight : parsedValue}
        //         : {id:subjectId , weight: parsedValue}
        //     )
        //     console.log(o,"uuuuu")
        //     // if(updatedType.length == 0){
        //     //     updatedType.push({
        //     //         weight: parsedValue,
        //     //         id: subjectId
        //     //     })
        //     // }else{
        //     //   updatedType =  updatedType.map((item : any) => {
        //     //         item.id === subjectId ? {...item,parsedValue} : item
        //     //     })
        //     // }
        //     console.log(updatedType,"oooo")
        //     return {
        //         ...prevData,
        //         customData: {
        //             ...prevData.customData,
        //             [name]: updatedType,
        //         },
        //     };
        // });



        const object =
            {
                "title": "test kit custom",
                "customData": {
                    "subjects": [
                        {
                            "id": 1000,
                            "weight": 1
                        }
                    ],
                    "attributes": [
                        {
                            "id": 200,
                            "weight": 2
                        }
                    ]
                }
            }
        // setNewAttribute((prev: any) => ({
        //     ...prev,
        //     [name]: parsedValue,
        // }));
    };

    const handleEditAttribute = (item: Attribute) => {
        setEditAttributeId(String(item.id));
        setNewAttribute(item);
    };

    const handleSaveEdit = () => {
        handleEdit(newAttribute);
        setEditAttributeId(null);
    };

    const handleCancelEdit = () => {
        setEditAttributeId(null);
    };
    console.log(data,"iiiii")

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
                                    {editAttributeId == subject.id ?
                                        <TableCell sx={{ width: "20%" }}>
                                            <TextField
                                                required
                                                label={<Trans i18nKey="weight" />}
                                                name="subjects"
                                                type="number"
                                                value={data?.customData?.subjects[index]?.weight}
                                                onChange={(e:any)=> handleInputChange(e,subject.id)}
                                                // onChange={(e:any)=> {
                                                //     const {name,value} = e.target
                                                //     setData((prevData: any) => ({
                                                //         ...prevData,
                                                //        customData:{
                                                //            ...prevData.customData,
                                                //            subjects:[...prevData.customData.subjects,{id: subject?.id,weight: value}]
                                                //        }
                                                //     }))}
                                                // }
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
                                                        py:"0px"
                                                    },
                                                    background: "#fff",
                                                }}
                                            />
                                        </TableCell>
                                        :
                                        <TableCell>
                                            <Box sx={{display:"flex", gap:1}}>
                                                <Typography>
                                                    <Trans i18nKey={"weight"} />:
                                                </Typography>
                                                {subject.weight.customValue || subject.weight.defaultValue}
                                                {!subject.weight.customValue && <Box>(<Trans i18nKey={"default"} />)</Box>}
                                            </Box>
                                        </TableCell>
                                    }
                                    {editAttributeId == subject.id ?
                                    <TableCell sx={{ display: "flex", mt: "16px" }}>
                                        <Link
                                            href="#"
                                            sx={{
                                                textDecoration: "none",
                                                opacity: 0.9,
                                                fontWeight: "bold",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <IconButton color="primary" data-testid={"attribute-save-icon"} onClick={handleSave}>
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton color="secondary" data-testid={"attribute-close-icon"} onClick={handleCancelEdit}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                        :
                                    <TableCell
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <IconButton
                                            onClick={() =>
                                                handleEditAttribute(subject)
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
                                    }
                                </TableRow>
                                        <TableRow >
                                            <TableCell sx={{p:"0px", borderBottom:"none"}} colSpan={4}>
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
                                                                        {editAttributeId == attribute.id
                                                                            ?
                                                                            <TableCell sx={{ width: "20%"}}>
                                                                                <TextField
                                                                                    required
                                                                                    label={<Trans i18nKey="weight" />}
                                                                                    name="attributes"
                                                                                    type="number"
                                                                                    value={data?.customData?.attributes[index]?.weight}
                                                                                    onChange={(e:any)=>handleInputChange(e,attribute.id)}
                                                                                    fullWidth
                                                                                    margin="normal"
                                                                                    sx={{
                                                                                        mt: 1,
                                                                                        p:0,
                                                                                        fontSize: 14,
                                                                                        "& .MuiInputBase-root": {
                                                                                            height: 40,
                                                                                            fontSize: 14,
                                                                                        },
                                                                                        "& .MuiFormLabel-root": {
                                                                                            fontSize: 14,
                                                                                            py:"0px"
                                                                                        },
                                                                                        background: "#fff",
                                                                                    }}
                                                                                />
                                                                            </TableCell>
                                                                            :
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
                                                                        }
                                                                         {editAttributeId == attribute.id

                                                                             ?
                                                                             <TableCell sx={{ display: "flex",
                                                                                 // mt: "16px"
                                                                                 // borderBottom: "none"
                                                                             }}>
                                                                                 <Link
                                                                                     href="#"
                                                                                     sx={{
                                                                                         textDecoration: "none",
                                                                                         opacity: 0.9,
                                                                                         fontWeight: "bold",
                                                                                         display: "flex",
                                                                                         alignItems: "center",
                                                                                     }}
                                                                                 >
                                                                                     <IconButton color="primary" data-testid={"attribute-save-icon"} onClick={handleSave}>
                                                                                         <CheckIcon />
                                                                                     </IconButton>
                                                                                     <IconButton color="secondary" data-testid={"attribute-close-icon"} onClick={handleCancelEdit}>
                                                                                         <CloseIcon />
                                                                                     </IconButton>
                                                                                 </Link>
                                                                             </TableCell>
                                                                             :
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
                                                                         }
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

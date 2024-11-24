import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Trans} from "react-i18next";
import React, {useState} from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import {useParams} from "react-router";
import {useServiceContext} from "@providers/ServiceProvider";
import {useQuery} from "@utils/useQuery";
import {toast} from "react-toastify";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import firstCharDetector from "@utils/firstCharDetector";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {useForm} from "react-hook-form";
import {theme} from "@config/theme";
import QueryBatchData from "@common/QueryBatchData";
import {LoadingSkeletonKitCard} from "@common/loadings/LoadingSkeletonKitCard";
import KitCustomizationTable from "@components/assessment-setting/kitCustomizationTable";

const KitCustomization = (props:any) => {

    const formMethods = useForm({ shouldUnregister: true });
    const {kitData} = props




    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                px: { xs: "15px", sm: "51px" },
                textAlign:"left"
            }}
            gap={2}
            textAlign="center"
            height={"auto"}
            minHeight={"350px"}
            width={"100%"}
            bgcolor={"#FFF"}
            borderRadius={"8px"}
            py={"32px"}
        >
            <Box height={"100%"} width={"100%"}>
                <Typography color="#000" variant="headlineMedium">
                    <Trans i18nKey={`${"kitCustomization"}`} />
                </Typography>
                <Divider
                    sx={{
                        width: "100%",
                        marginTop: "24px",
                        marginBottom: "10px !important",
                    }}
                />
                <Grid sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid
                        item
                        xs={12}
                        // sm={12}
                        // md={8}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            color="#9DA7B3"
                            fontWeight={500}
                            sx={{
                                fontSize: { xs: "1rem", sm: "1.375rem" },
                                whiteSpace: { xs: "wrap", sm: "nowrap" },
                            }}
                            lineHeight={"normal"}
                        >
                            <Trans i18nKey="assessmentTitle" />:
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: { md: "350px" },
                            }}
                        >
                            <OnHoverInputTitleSetting
                                formMethods={formMethods}
                                data={"AssessmentTitle"}
                                // infoQuery={fetchPathInfo}
                                // AssessmentInfoQuery={AssessmentInfoQuery}
                                editable={true}
                                // color={color}
                                type={"title"}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Divider
                    sx={{
                        width: "100%",
                        marginTop: "24px",
                        marginBottom: "10px !important",
                    }}
                />
                <Box sx={{mb:2}}>
                    <Typography
                    sx={{...theme.typography.headlineSmall,color:"#000",mb:1}}
                    ><Trans i18nKey={"customizingSubjectAndAttributes"} /></Typography>
                    <Typography
                    sx={{...theme.typography.bodyMedium,color:"#2B333B"}}
                    ><Trans i18nKey={"viewTheWeightAndSubject"} /></Typography>
                </Box>
                {/*<QueryBatchData*/}
                {/*    queryBatchData={[fetchAttributeKit]}*/}
                {/*    renderLoading={() => <LoadingSkeletonKitCard />}*/}
                {/*    render={([AttributeData]) => (*/}
                {/*        <>*/}
                                <Box>
                                    <KitCustomizationTable
                                        subjects={kitData}
                                        // initialAttributes={AttributeData?.items}
                                        // onAddAttribute={handleAddNewRow}
                                        // onReorder={handleReorder}
                                        // showNewAttributeForm={showNewAttributeForm}
                                        // handleCancel={handleCancel}
                                        // handleSave={handleSave}
                                        // newAttribute={newAttribute}
                                        // setNewAttribute={setNewAttribute}
                                        // handleEdit={handleEdit}
                                        // setOpenDeleteDialog={setOpenDeleteDialog}
                                    />
                                </Box>
                {/*            )}*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*/>*/}
            </Box>
        </Box>
    );
};

const OnHoverInputTitleSetting = (props: any) => {
    const [show, setShow] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        editable && setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };
    const {
        data,
        shortTitle,
        type,
        editable,
        infoQuery,
        color,
        AssessmentInfoQuery,
        displayEdit,
    } = props;
    const [hasError, setHasError] = useState<boolean>(false);
    const [inputData, setInputData] = useState<string>(data);
    const [inputDataShortTitle, setInputDataShortTitle] =
        useState<string>(shortTitle);
    const handleCancel = () => {
        setShow(false);
        setInputData(data);
        setHasError(false);
    };
    const { assessmentId } = useParams();
    const { service } = useServiceContext();
    const updateAssessmentQuery = useQuery({
        service: (
            args = {
                id: assessmentId,
                data: {
                    title: inputData,
                    shortTitle: inputDataShortTitle === "" ? null : inputDataShortTitle,
                    colorId: color?.id || 6,
                },
            },
            config,
        ) => service.updateAssessment(args, config),
        runOnMount: false,
        // toastError: true,
    });
    const updateAssessmentTitle = async () => {
        try {
            const res = await updateAssessmentQuery.query();
            res.message && toast.success(res.message);
            await infoQuery();
            await AssessmentInfoQuery();
        } catch (e) {
            const err = e as ICustomError;
            setHasError(true);
            if (Array.isArray(err.response?.data?.message)) {
                toastError(err.response?.data?.message[0]);
            } else if (
                err.response?.data &&
                err.response?.data.hasOwnProperty("message")
            ) {
                toastError(err.response?.data?.message);
            }
        }
    };
    const inputProps: React.HTMLProps<HTMLInputElement> = {
        style: {
            textAlign:
                type == "title"
                    ? firstCharDetector(inputData)
                        ? "right"
                        : "left"
                    : type == "shortTitle"
                        ? firstCharDetector(inputDataShortTitle)
                            ? "right"
                            : "left"
                        : "left",
        },
    };

    return (
        <Box>
            <Box
                my={1.5}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    cursor: "pointer",
                }}
                width="100%"
            >
                {editable && show ? (
                    <Box
                        sx={{ display: "flex", flexDirection: "column", width: "100% " }}
                    >
                        <OutlinedInput
                            inputProps={inputProps}
                            error={hasError}
                            fullWidth
                            // name={title}
                            defaultValue={
                                type == "title" ? inputData : inputDataShortTitle || ""
                            }
                            onChange={(e) =>
                                type == "title"
                                    ? setInputData(e.target.value)
                                    : setInputDataShortTitle(e.target.value)
                            }
                            value={type == "title" ? inputData : inputDataShortTitle}
                            required={true}
                            multiline={true}
                            sx={{
                                minHeight: "38px",
                                borderRadius: "4px",
                                paddingRight: "12px;",
                                fontWeight: "700",
                                fontSize: "0.875rem",
                                "&.MuiOutlinedInput-notchedOutline": { border: 0 },
                                "&.MuiOutlinedInput-root:hover": {
                                    border: 0,
                                    outline: "none",
                                },
                                "& .MuiOutlinedInput-input:focused": {
                                    border: 0,
                                    outline: "none",
                                },
                                "&.MuiOutlinedInput-root.Mui-selected": {
                                    border: 0,
                                    outline: "none",
                                },
                                "&:hover": { border: "1px solid #79747E" },
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        title="Submit Edit"
                                        edge="end"
                                        sx={{
                                            background: "#49CED0",
                                            borderRadius: "2px",
                                            height: { xs: "26px", sm: "36px" },
                                            width: { xs: "26px", sm: "36px" },
                                            margin: "3px",
                                        }}
                                        onClick={updateAssessmentTitle}
                                    >
                                        <DoneIcon sx={{ color: "#fff" }} />
                                    </IconButton>
                                    <IconButton
                                        title="Cancel Edit"
                                        edge="end"
                                        sx={{
                                            background: "#E04B7C",
                                            borderRadius: "2px",
                                            height: { xs: "26px", sm: "36px" },
                                            width: { xs: "26px", sm: "36px" },
                                        }}
                                        onClick={handleCancel}
                                    >
                                        <CloseIcon sx={{ color: "#fff" }} />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {/*{hasError && (*/}
                        {/*    <Typography color="#ba000d" variant="caption">*/}
                        {/*        {error?.data}*/}
                        {/*    </Typography>*/}
                        {/*)}*/}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            minHeight: "38px",
                            borderRadius: "4px",
                            paddingLeft: "8px;",
                            paddingRight: "12px;",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            wordBreak: "break-word",
                            // "&:hover": {border: "1px solid #79747E"},
                        }}
                        onClick={() => setShow(!show)}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <Typography
                            color="#004F83"
                            fontWeight={500}
                            sx={{ fontSize: { xs: "1rem", sm: "1.375rem" } }}
                            lineHeight={"normal"}
                        >
                            {type == "title" && data?.replace(/<\/?p>/g, "")}
                            {type == "shortTitle" && shortTitle?.replace(/<\/?p>/g, "")}
                        </Typography>
                        {(isHovering || displayEdit) && (
                            <EditRoundedIcon
                                sx={{ color: "#9DA7B3", position: "absolute", right: -10 }}
                                fontSize="small"
                                width={"32px"}
                                height={"32px"}
                                onClick={() => setShow(!show)}
                            />
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};


export default KitCustomization;
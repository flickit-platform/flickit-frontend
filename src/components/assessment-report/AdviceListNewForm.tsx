import Box from "@mui/material/Box";
import {styles} from "@styles";
import TextField from "@mui/material/TextField";
import {Trans} from "react-i18next";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {MenuItem, Select, Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InputAdornment from "@mui/material/InputAdornment";
import Impact from "@assets/svg/Impact.svg"
import Grid from "@mui/material/Grid";
import RichEditorFieldAssessment from "./RichEditorFieldAssessment";
import FormProviderWithForm from "@common/FormProviderWithForm";
import {useForm} from "react-hook-form";
import {theme} from "@config/theme";
import {useQuery} from "@utils/useQuery";
import {useServiceContext} from "@providers/ServiceProvider";
import {useEffect, useState} from "react";
import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

interface IAdviceListProps {
    newAdvice: {
        assessmentId: string;
        title: string;
        description: string;
        priority: string;
        cost: string;
        impact: string;
    } | any;
    handleInputChange: (e: any) => void;
    handleSave: () => void;
    handleCancel: () => void;
    setNewAdvice: any;
    removeDescriptionAdvice: any;
}
const AdviceListNewForm = ({newAdvice, handleInputChange, handleSave, handleCancel, setNewAdvice,removeDescriptionAdvice}: IAdviceListProps) => {
    const formMethods = useForm({ shouldUnregister: true });
    const selectAdvice = ["priority","cost","impact"]
    const { service } = useServiceContext();
    const [adviceOption,setAdviceOption] = useState<any>({impact:[],priority:[],cost:[]})

    const fetchAdviceImpactList = useQuery<any>({
        service: (args, config) =>
            service.fetchAdviceImpactList(args, config),
        runOnMount: false
    });
    const fetchAdvicePriorityList = useQuery<any>({
        service: (args, config) =>
            service.fetchAdvicePriorityList(args, config),
        runOnMount: false
    });
    const fetchCostList = useQuery<any>({
        service: (args, config) =>
            service.fetchCostList(args, config),
        runOnMount: false
    });

    useEffect(()=>{
       const fetchAdviceOptions = async () =>{
            try {
                const [impactRes, priorityRes, costRes] = await Promise.all([
                    fetchAdviceImpactList.query(),
                    fetchAdvicePriorityList.query(),
                    fetchCostList.query(),
                ]);
                setAdviceOption({impact:impactRes.levels,cost:costRes.levels,priority: priorityRes.levels})
            }catch (e){
                const err = e as ICustomError;
                toastError(err);
            }
        }
        fetchAdviceOptions();
    },[])

    return  <Box
        mt={1.5}
        p={1.5}
        sx={{
            backgroundColor: "#F3F5F6",
            borderRadius: "8px",
            border: "0.3px solid #73808c30",
            display: "flex",
            alignItems: "flex-start",
            position: "relative",
            width:"100%"
        }}
    >
        <Box
            sx={{...styles.centerVH,justifyContent:"space-evenly", background: "#F3F5F6",width:"100%"}}
            borderRadius={2}
            mr={2}
            p={0.25}
        >
            <Box sx={{width:{xs:"95%", sm:"80%"}}} mx={1}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            label={<Trans i18nKey="title"/>}
                            name="title"
                            value={newAdvice.title}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            sx={{
                                mt: 0,
                                fontSize: 14,
                                "& .MuiInputBase-root": {
                                    height: 32,
                                    fontSize: 14,
                                },
                                "& .MuiFormLabel-root": {
                                    fontSize: 14,
                                },
                                background: "#fff",
                            }}
                        />
                    </Grid>
                   <Grid item xs={12} md={6}
                         sx={{display:"flex",justifyContent:"space-between",
                             "& .MuiGrid-root > .MuiGrid-item" : {
                             paddingTop: "0px"
                         }
                         }}
                   >
                       {selectAdvice.map((item:any,index) =>{
                           return (
                               <FormControl key={index} sx={{width:"30%"}}>
                                   <Select
                                       labelId={`${item}-select-label`}
                                       id={`${item}-select`}
                                       value={newAdvice[item]}
                                       IconComponent={KeyboardArrowDownIcon}
                                       name={item}
                                       displayEmpty
                                       startAdornment={!newAdvice[item] && item != "priority" && <InputAdornment position="start">
                                           <Typography sx={{...theme.typography.labelMedium,color:"#2466A8",display:"flex" ,alignItems:"center"}}>
                                               { item == "cost" &&  <AttachMoneyOutlinedIcon fontSize={"small"} />}
                                               { item == "impact" &&  <img style={{marginRight:"2px"}}  src={Impact} alt={"impactIcon"}/> }
                                               <Trans i18nKey={item} />
                                           </Typography>
                                       </InputAdornment>}
                                       onChange={(e)=>handleInputChange(e)}
                                       sx={{
                                           height: "32px",
                                           fontSize: "14px",
                                           background: "#fff",
                                           px:"0px"
                                       }}
                                   >
                                       {item === "priority" &&
                                           <MenuItem disabled value="">
                                                    <Typography sx={{...theme.typography.labelMedium,color:"#2466A8",display:"flex" ,alignItems:"center"}}>
                                                        <Trans i18nKey={item} />
                                                    </Typography>
                                           </MenuItem>
                                       }
                                       {adviceOption[item].map((option:any,index:number) => (
                                           <MenuItem key={option.code} value={option.code}>
                                               <Trans i18nKey={option.title} />
                                           </MenuItem>
                                       ))}
                                   </Select>
                               </FormControl>
                           )
                       })}
                   </Grid>
                </Grid>
                <FormProviderWithForm formMethods={formMethods}>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <RichEditorFieldAssessment
                            name="advice-description"
                            label={<Trans i18nKey="description"/>}
                            disable_label={false}
                            required={true}
                            defaultValue={""}
                            setNewAdvice={setNewAdvice}
                            removeDescriptionAdvice={removeDescriptionAdvice}
                        />
                    </Box>
                </FormProviderWithForm>
            </Box>

            {/* Check and Close Buttons */}
            <Box display="flex" alignSelf="flex-start" flexDirection="column" gap={"20px"}>
                <Link
                    href="#"
                    sx={{
                        textDecoration: "none",
                        opacity: 0.9,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flexDirection:{xs:"column",sm:"row"}
                    }}
                >
                    {" "}
                    <IconButton size="small" color="primary" onClick={handleSave}>
                        <CheckIcon/>
                    </IconButton>
                    <IconButton size="small" color="secondary"  onClick={handleCancel}>
                        <CloseIcon/>
                    </IconButton>
                </Link>
            </Box>
        </Box>
    </Box>
};

export default AdviceListNewForm;
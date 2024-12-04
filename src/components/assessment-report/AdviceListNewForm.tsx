import Box from "@mui/material/Box";
import {styles} from "@styles";
import TextField from "@mui/material/TextField";
import {Trans} from "react-i18next";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {MenuItem, Select} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InputAdornment from "@mui/material/InputAdornment";
import Impact from "@assets/svg/Impact.svg"
import Grid from "@mui/material/Grid";
import RichEditorField from "@common/fields/RichEditorField";
import FormProviderWithForm from "@common/FormProviderWithForm";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import InputLabel from "@mui/material/InputLabel";

interface IAdviceListProps {
    newAdvice: {
        assessmentId: string;
        title: string;
        description: string;
        priority: string;
        cost: string;
        impact: string;
    }
    handleInputChange: (e: any) => void;
    handleSave: () => void;
    handleCancel: () => void;
    setNewAdvice: any;
    removeDescriptionAdvice: any;
}
const options = [{index:0,value:"low"},{index:1,value:"medium"},{index:2,value:"high"}]

const AdviceListNewForm = ({newAdvice, handleInputChange, handleSave, handleCancel, setNewAdvice,removeDescriptionAdvice}: IAdviceListProps) => {
const formMethods = useForm({ shouldUnregister: true });
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
            borderRadius="0.5rem"
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
                                // width: {xs: "60%", md: "40%"},
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
                       <FormControl sx={{width:"30%"}}>
                           <InputLabel sx={{
                                 // "&":{
                                     // transform: 'translate(8px, 5px) scale(1) !important',
                                 // },
                           }} id="priority-select-label"><Trans i18nKey={"priority"} /></InputLabel>
                           <Select
                               labelId="priority-select-label"
                               id="priority-select"
                               value={newAdvice.priority}
                               IconComponent={KeyboardArrowDownIcon}
                               name= "priority"
                               label="priority"
                               onChange={(e)=>handleInputChange(e)}
                               sx={{
                                   height: "32px",
                                   fontSize: "14px",
                                   background: "#fff",
                                   px:"0px"
                               }}
                           >
                               {options.map((option) => (
                                   <MenuItem key={option.index} value={option.value.toUpperCase()}>
                                       <Trans i18nKey={option.value} />
                                   </MenuItem>
                               ))}
                           </Select>
                       </FormControl>
                       <FormControl sx={{width:"30%"}}>
                           <InputLabel sx={{'& .MuiInputLabel-root .MuiInputLabel': {
                                   transform: 'translate(0, 5px) scale(1)',
                               }
                           }} id="cost-select-label"><Trans i18nKey={"price"} /></InputLabel>
                           <Select
                               labelId="cost-select-label"
                               id="cost-select"
                               value={newAdvice.cost}
                               IconComponent={KeyboardArrowDownIcon}
                               startAdornment={!newAdvice.cost && <InputAdornment position="start">$</InputAdornment>}
                               displayEmpty
                               name= "cost"
                               label="price"
                               onChange={(e)=>handleInputChange(e)}
                               sx={{
                                   height: "32px",
                                   fontSize: "14px",
                                   background: "#fff",
                                   px:"0px"
                               }}
                           >
                               {options.map((option) => (
                                   <MenuItem key={option.index} value={option.value.toUpperCase()}>
                                       <Trans i18nKey={option.value} />
                                   </MenuItem>
                               ))}
                           </Select>
                       </FormControl>
                       <FormControl sx={{width:"30%"}}>
                           <InputLabel sx={{'& .MuiInputLabel-root .MuiInputLabel': {
                                   transform: 'translate(0, 5px) scale(1)',
                               }
                           }} id="impact-select-label"><Trans i18nKey={"impact"} /></InputLabel>
                           <Select
                               labelId="impact-select-label"
                               id="impact-select"
                               value={newAdvice.impact}
                               IconComponent={KeyboardArrowDownIcon}
                               startAdornment={!newAdvice.impact && <InputAdornment position="start"><img src={Impact}/></InputAdornment>}
                               label="impact"
                               displayEmpty
                               name= "impact"
                               onChange={(e)=>handleInputChange(e)}
                               sx={{
                                   height: "32px",
                                   fontSize: "14px",
                                   background: "#fff",
                                   px:"0px"
                               }}
                           >
                               {options.map((option) => (
                                   <MenuItem key={option.index} value={option.value.toUpperCase()}>
                                       <Trans i18nKey={option.value} />
                                   </MenuItem>
                               ))}
                           </Select>
                       </FormControl>
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
                        <RichEditorField
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
            <Box display="flex" alignSelf={"flex-start"} flexDirection={"column"} gap={"20px"}>
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
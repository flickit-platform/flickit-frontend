import React, {useEffect, useRef} from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {Trans} from "react-i18next";
import FlatGauge, {confidencePallet} from "@/components/common/charts/flatGauge/FlatGauge"
import {theme} from "@config/theme";
import Grid from "@mui/material/Grid";
import lens from "@assets/svg/lens.svg";
import {styles} from "@styles";

interface IBoxReport {
    title: string;
    description: string;
    analyzation: string;
    confidenceValue: number;
    maturityLevelCount: number;
    maturityLevel:{
        "id": number;
        "title": string;
        "index": number;
        "value": number;
        "description": string;
    }
}

interface ITopBoxReport {
    ConfidenceColor: string;
    title: string;
    description: string;
    maturityLevel: {
        title: string;
        value: number;
    };
    confidenceValue: number;
    maturityLevelCount: number
}
const BoxReportLayout = (props: IBoxReport) => {

    const {confidenceValue,analyzation, ...rest} = props

    const colorRef = useRef("")

    useEffect(()=>{
        if (confidenceValue == 100){
            colorRef.current = confidencePallet[100]
        }else {
            let newNum = Math.floor(confidenceValue / 10) * 10;
            if (confidenceValue < 10){
                colorRef.current =  confidencePallet[10]
            }else{
                colorRef.current =  confidencePallet[newNum]
            }
        }
    },[confidenceValue])

    return (
        <Box sx={{display:"flex", flexDirection:"column", width:"fit-content", height:"fit-content", background:"#F9FAFB", borderRadius:"32px",p:"32px",gap:"32px", border:`1px solid ${colorRef.current}`,mb:4 }}>
            <TopBox ConfidenceColor={colorRef.current} confidenceValue={confidenceValue} {...rest}/>
            <BottomBox analyzation={analyzation}/>
        </Box>
    );
};


const TopBox = (props: ITopBoxReport) =>{
    const {ConfidenceColor, title, description, maturityLevel, confidenceValue, maturityLevelCount} = props
    return (
        <Grid spacing={2} container sx={{display:"flex", justifyContent:"space-evenly"}}>
            <Grid
                xs={12}
                sm={4}
                sx={{...styles.centerCVH, gap:"1rem"}}
                item>
                <Typography sx={{...theme.typography.titleLarge, color:`${ConfidenceColor}`}}><Trans i18nKey={title} /></Typography>
                {/*<Typography sx={{...theme.typography.bodySmall}}><Trans i18nKey={titleEn} /></Typography>*/}
            </Grid>
            <Grid xs={12}  sm={4} item >
                <Typography sx={{...theme.typography.labelLarge, textAlign:"center",width:{xs:"70%",sm:"100%"},m:"0 auto"}} ><Trans i18nKey={description} /></Typography>
            </Grid>
            <Grid display={"flex"} justifyContent={"center"}  xs={12} sm={4} item>
                <FlatGauge
                        maturityLevelNumber={maturityLevelCount}
                        levelValue={maturityLevel.value}
                        text= {maturityLevel.title}
                        textPosition={"top"}
                        confidenceLevelNum={confidenceValue}
                />
            </Grid>
        </Grid>
    )
}

const BottomBox = (props: any) =>{
    const {analyzation} = props
    return (
        <Box sx={{width:"90%", minHeight:"200px", mx:"auto", borderRadius:"1rem", backgroundColor:"#2466A80A", py:"24px",px:"32px",position:"relative"}}>
            <img src={lens} alt={lens} style={{position:"absolute", right:"-20px", top:"-10px", width:"3rem", height:"3rem"}}/>
            <Typography sx={{...theme.typography.labelMedium,color:"#2466A8", fontSize:"1rem",mb:"1rem"}} ><Trans i18nKey={"analysisResults"} /></Typography>
            <Typography sx={{fontSize:".87rem",fontWeight:"light",lineHeight:"1.5rem",color:"#2B333B"}}>{analyzation}</Typography>
        </Box>
    )
}

export default BoxReportLayout;
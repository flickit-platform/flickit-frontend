import React, {useEffect, useRef} from 'react';
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {Trans} from "react-i18next";
import FlatGauge from "@common/flatGauge/FlatGauge"
import {theme} from "@config/theme";
import Grid from "@mui/material/Grid";
import lens from "@assets/svg/lens.svg";

const confidencePallet : any = {
    10: "#A50026",
    20: "#D73027",
    30: "#F46D43",
    40: "#FDAE61",
    50: "#FEE08B",
    60: "#D9EF8B",
    70: "#A6D96A",
    80: "#66BD63",
    90: "#1A9850",
    100: "#006837",
};




const BoxReportLayout = (props: any) => {

    const {confidenceLevelNum} = props

    const colorRef = useRef("")

    useEffect(()=>{
        if (confidenceLevelNum == 100){
            colorRef.current = confidencePallet[100]
        }else {
            let newNum = Math.floor(confidenceLevelNum / 10) * 10;
            if (confidenceLevelNum < 10){
                colorRef.current =  confidencePallet[10]
            }else{
                colorRef.current =  confidencePallet[newNum]
            }
        }
    },[confidenceLevelNum])

    return (
        <Box sx={{display:"flex", flexDirection:"column", width:"fit-content", height:"fit-content", background:"#F9FAFB", borderRadius:"32px",p:"32px",gap:"32px", border:`1px solid ${colorRef.current}` }}>
            <TopBox ConfidenceColor={colorRef.current}/>
            <BottomBox/>
        </Box>
    );
};


const TopBox = (props: any) =>{
    const {ConfidenceColor} = props
    return (
        <Grid spacing={2} container sx={{display:"flex", justifyContent:"space-evenly"}}>
            <Grid
                xs={12}
                sm={4}
                sx={{display:"flex",flexDirection:"column",gap:"1rem",alignItems:"center", justifyContent:"center"}}
                item>
                <Typography sx={{...theme.typography.titleLarge, color:`${ConfidenceColor}`}}><Trans i18nKey={"نگهداشت‌پذیری نرم‌افزار"} /></Typography>
                <Typography sx={{...theme.typography.bodySmall}}><Trans i18nKey={"Software Maintainability"} /></Typography>
            </Grid>
            <Grid xs={12}  sm={4} item >
                <Typography sx={{...theme.typography.labelLarge, textAlign:"center",width:{xs:"70%",sm:"100%"},m:"0 auto"}} ><Trans i18nKey={"میزان آمادگی نرم‌افزار برای تغییرات یه به عبارتی میزان ارزان، سریع و مطمئن بودن توسعه محصول"} /></Typography>
            </Grid>
            <Grid display={"flex"} justifyContent={"center"}  xs={12} sm={4} item>
                <FlatGauge
                        maturityLevelNumber={5}
                        levelValue={2}
                        text= "test"
                        textPosition={"top"}
                        confidenceLevelNum={75}
                />
            </Grid>
        </Grid>
    )
}

const BottomBox = () =>{

    return (
        <Box sx={{width:"90%", minHeight:"200px", mx:"auto", borderRadius:"1rem", backgroundColor:"#2466A80A", py:"24px",px:"32px",position:"relative"}}>
            <img src={lens} alt={lens} style={{position:"absolute", right:"-20px", top:"-10px", width:"3rem", height:"3rem"}}/>
            <Typography sx={{...theme.typography.labelMedium,color:"#2466A8", fontSize:"1rem",mb:"1rem"}} >تحلیل نتایج</Typography>
            <Typography sx={{fontSize:".87rem",fontWeight:"light",lineHeight:"1.5rem",color:"#2B333B"}}>قابلیت نصب روی زیرساخت ابری و کانتینری، امکانات تبادل API با مولفه‌های بیرونی مزیت‌های ستاره در انتقال‌پذیری محسوب می‌شود. در مقابل پشتیبانی از استاندارهای رایج هویت‌شناسی مثل OpenIDC می‌تواند فرایند راه‌اندازی ستاره برای مشتریان متنوع را تسهیل کند. </Typography>
        </Box>
    )
}

export default BoxReportLayout;
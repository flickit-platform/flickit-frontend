import React from 'react';
import Box, {BoxProps} from "@mui/material/Box";
import {theme} from "@config/theme";
import {Trans} from "react-i18next";
import {Typography} from "@mui/material";
import {getMaturityLevelColors} from "@styles";

type TPosition = "top" |"left"

interface IGaugeProps extends BoxProps {
    maturity_level_number: number;
    level_value: number;
    text: string;
    textPosition: TPosition;
    confidenceLevelNum: number
}

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


const FlatGauge = (props:IGaugeProps) => {
    const {
        maturity_level_number = 5,
        level_value = 3,
        text = "template text",
        textPosition= "top",
        confidenceLevelNum = 70
    } = props;

    if (maturity_level_number < level_value) return null

  const checkColor = (num : number) : string =>{
        if (num == 100){
            return confidencePallet[100]
        }else {
         let newNum = Math.floor(num / 10) * 10;
         if (num < 10){
             return confidencePallet[10]
         }else{
             return confidencePallet[newNum]
         }
        }
    }

    const colorPallet = getMaturityLevelColors(maturity_level_number)
    const colorCode = colorPallet[level_value - 1] || colorPallet[0];
    const count = Array.from(Array(maturity_level_number).keys())
    const emptyCell =  level_value - 1

    return (
        <Box sx={{display:"flex", flexDirection:`${textPosition == "top" ? "column" : "row" }`, textAlign: "center", width:"fit-content", gap:"1rem"}}>
            {textPosition == "top" && <Typography sx={{ ...theme.typography.semiBoldLarge, color: colorCode, fontSize:"1.25rem", fontWeight:"bold"}} >{text}</Typography>}
            <Box style={{direction: theme.direction , display:"flex",alignItems:"center" ,gap:"3px",width:"fit-content"}}>
                {
                    count.map((item: any) =>{
                        return (
                            <>
                                {item <= emptyCell
                                    ?
                                    <Box style={{width:"1.3rem", height:".8rem", borderRadius:"1000px",background: colorCode}}/>
                                    :
                                    <Box style={{width:"1.3rem", height:".8rem", borderRadius:"1000px",background: "#C2CCD67F" }}/>
                                }
                            </>
                        )
                    })
                }
                {textPosition == "left" && <Box sx={{
                    mr : theme.direction == "rtl" ? "1.3rem" : "",
                    ml : theme.direction != "rtl" ? "1.3rem" : "",
                    color: colorCode
                }}><Trans i18nKey={`${text}`} /></Box> }
            </Box>
            {confidenceLevelNum && textPosition == "top" &&
                <Typography sx={{display:"flex", gap:"5px"}}>
                    <Trans style={{color: "#9DA7B3", ...theme.typography.labelSmall }} i18nKey={"confidenceLevel"} />: <Typography sx={{color: checkColor(confidenceLevelNum)}} > {confidenceLevelNum}% </Typography>
                </Typography>
            }
        </Box>
    );
};

export default FlatGauge;
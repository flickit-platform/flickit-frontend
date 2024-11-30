import React from 'react';
import Box, {BoxProps} from "@mui/material/Box";
import {MaturityLevelColors} from "@common/flatGauge/style";
import {theme} from "@config/theme";
import {Trans} from "react-i18next";

interface IGaugeProps extends BoxProps {
    maturity_level_number: number;
    level_value: number;
}


const FlatGauge = (props:IGaugeProps) => {
    const {
        maturity_level_number = 5,
        level_value = 3,
    } = props;

    if (maturity_level_number < level_value) return null

    const TextMaturityLevel = (maturity_level_number: number,level_value: number) =>{
     let num = ((level_value * 100) / maturity_level_number) / 10
        if(num <= 2){
            return "unDeveloped"
        }else if(num <= 4){
            return "unprepared"
        }else if(num <= 6){
            return "prepared"
        }else if(num <= 8){
            return "wellEquipped"
        }else if(num <=10){
            return "stateOfArt"
        }
    }

    const textMaturityLevel = TextMaturityLevel(maturity_level_number,level_value)
    const colorPallet = MaturityLevelColors(maturity_level_number)
    const colorCode = colorPallet[level_value - 1] || colorPallet[0];
    const count = Array.from(Array(maturity_level_number).keys())
    const emptyCell =  level_value - 1

    return (
        <Box style={{direction: theme.direction , display:"flex",alignItems:"center" ,gap:"3px",width:"100%"}}>
            {
                count.map((item: any) =>{
                    return (
                    <>
                        {item <= emptyCell
                            ?
                            <Box style={{width:"15px", height:"7px", borderRadius:"1000px",background: colorCode}}/>
                            :
                            <Box style={{width:"15px", height:"7px", borderRadius:"1000px",background: "#C2CCD67F" }}/>
                        }
                    </>)
                })
            }
            <Box sx={{
               mr : theme.direction == "rtl" ? "1.3rem" : "",
               ml : theme.direction != "rtl" ? "1.3rem" : "",
               color: colorCode
            }}><Trans i18nKey={`${textMaturityLevel}`} /></Box>
        </Box>
    );
};

export default FlatGauge;
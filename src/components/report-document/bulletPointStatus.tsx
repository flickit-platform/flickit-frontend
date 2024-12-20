import React from "react";
import Box from "@mui/material/Box";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Typography } from "@mui/material";
import FlatGauge from "@/components/common/charts/flatGauge/FlatGauge";
import {getMaturityLevelColors, styles} from "@styles";

interface IBulletPointStatus {
  titleFa: string;
  maturityLevel: {
    value: number;
    title: string;
  };
  assessmentKit: {
    maturityLevelCount: number;
  };
}
const BulletPointStatus = (props: IBulletPointStatus) => {
  const { titleFa, maturityLevel, assessmentKit } = props;
  const { value, title } = maturityLevel;
  const { maturityLevelCount } = assessmentKit;
  const colorPallet = getMaturityLevelColors(maturityLevelCount);
  const colorCode = colorPallet[value - 1];
  return (
    <Box
      sx={{
        ...styles.centerVH,
        width:"100%",
        gap: 2,
      }}
    >
      <ArrowLeftIcon sx={{ color: colorCode }} fontSize="medium" />
      <Typography>{titleFa}</Typography>
      <FlatGauge
        maturityLevelNumber={maturityLevelCount}
        levelValue={value}
        text={title}
        textPosition="left"
      />
    </Box>
  );
};

export default BulletPointStatus;
import React from "react";
import Box from "@mui/material/Box";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Typography } from "@mui/material";
import FlatGauge from "@common/flatGauge/FlatGauge";

interface IBulletPointStatus {
  titleFa: string;
  titleEn: string;
  maturityLevel: {
    value: number;
    title: string;
  };
  assessmentKit: {
    maturityLevelCount: number;
  };
}
const BulletPointStatus = (props: IBulletPointStatus) => {
  const { titleFa, titleEn, maturityLevel, assessmentKit } = props;
  const { value, title } = maturityLevel;
  const { maturityLevelCount } = assessmentKit;
  return (
    <Box
      sx={{
        width:"100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <ArrowLeftIcon sx={{ color: "red" }} fontSize={"medium"} />
      <Typography>{titleFa}</Typography>
      <FlatGauge
        maturityLevelNumber={5}
        levelValue={4}
        text={title}
        textPosition={"left"}
      />
    </Box>
  );
};

export default BulletPointStatus;
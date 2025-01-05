import Box from "@mui/material/Box";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Typography } from "@mui/material";
import FlatGauge from "@/components/common/charts/flatGauge/FlatGauge";
import { getMaturityLevelColors, styles } from "@styles";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

interface IBulletPointStatus {
  title: string;
  maturityLevel: {
    value: number;
    title: string;
  };
  maturityLevelCount: number;
}
const BulletPointStatus = (props: IBulletPointStatus) => {
  const { title: titleSub, maturityLevel, maturityLevelCount } = props;
  const { value, title } = maturityLevel;
  const colorPallet = getMaturityLevelColors(maturityLevelCount);
  const colorCode = colorPallet[value - 1];
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        width: "100%",
        gap: 1,
      }}
    >
      <Typography
        variant="titleSmall"
        sx={{
          direction: true ? "rtl" : "ltr",
          fontFamily: true ? farsiFontFamily : primaryFontFamily,
          textAlign: true ? "right" : "left",
          ...styles.centerVH,
        }}
      >
        <ArrowLeftIcon sx={{ color: colorCode }} fontSize="medium" />

        {titleSub}
      </Typography>
      <FlatGauge
        maturityLevelNumber={maturityLevelCount}
        levelValue={value}
        text={title}
        textPosition="left"
        sx={{ width: "210px", ml: "20px" }}
      />
    </Box>
  );
};

export default BulletPointStatus;

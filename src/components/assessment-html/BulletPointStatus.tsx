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
      sx={{
        ...styles.centerVH,
        width: "100%",
        gap: 2,
      }}
    >
      <ArrowLeftIcon sx={{ color: colorCode }} fontSize="medium" />
      <Typography
        variant="titleSmall"
        sx={{
          direction: true ? "rtl" : "ltr",
          fontFamily: true ? farsiFontFamily : primaryFontFamily,
          textAlign: true ? "right" : "left",
        }}
      >
        {titleSub}
      </Typography>
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

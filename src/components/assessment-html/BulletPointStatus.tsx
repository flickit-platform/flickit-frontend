import Box from "@mui/material/Box";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Grid, Typography } from "@mui/material";
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
    <Grid container display="flex" alignItems="flex-start">
      <Grid item xs={6} sm={5} display="flex" alignItems="flex-start">
        <Typography
          variant="extraLight"
          fontWeight={400}
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
      </Grid>
      <Grid item xs={6} sm={7} display="flex" alignItems="flex-start">
        <FlatGauge
          maturityLevelNumber={maturityLevelCount}
          levelValue={value}
          text={title}
          textPosition="left"
        />
      </Grid>
    </Grid>
  );
};

export default BulletPointStatus;

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
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
  language: string;
}
const BulletPointStatus = (props: IBulletPointStatus) => {
  const {
    title: titleSub,
    maturityLevel,
    maturityLevelCount,
    language,
  } = props;
  const { value, title } = maturityLevel;
  const colorPallet = getMaturityLevelColors(maturityLevelCount);
  const colorCode = colorPallet[value - 1];
  return (
    <Grid container display="flex" alignItems="flex-start">
      <Grid item xs={6} sm={5} md={3.5} display="flex" alignItems="flex-start">
        <Typography
          variant="bodyMedium"
          fontWeight={400}
          sx={{
            direction: language === "fa" ? "rtl" : "ltr",
            fontFamily: language === "fa" ? farsiFontFamily : primaryFontFamily,
            textAlign: language === "fa" ? "right" : "left",
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

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import FlatGauge from "@/components/common/charts/flatGauge/FlatGauge";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import Grid from "@mui/material/Grid";
import lens from "@assets/svg/lens.svg";
import { getMaturityLevelColors, styles } from "@styles";
import { t } from "i18next";

interface IBoxReport {
  title: string;
  description: string;
  analyzation: string;
  confidenceValue: number;
  maturityLevelCount: number;
  translatedTitle: string;
  maturityLevel: {
    id: number;
    title: string;
    index: number;
    value: number;
    description: string;
  };
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
  maturityLevelCount: number;
  translatedTitle: string;
}
const BoxReportLayout = (props: IBoxReport) => {
  const {
    confidenceValue,
    analyzation,
    maturityLevel,
    maturityLevelCount,
    translatedTitle,
    ...rest
  } = props;

  const colorPallet = getMaturityLevelColors(maturityLevelCount ?? 5);
  const colorCode = colorPallet[maturityLevel.value - 1];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "#F9FAFB",
        borderRadius: "32px",
        paddingY: "32px",
        gap: "24px",
        border: `1px solid ${colorCode}`,
        mb: 4,
        width: "100%",
      }}
    >
      <TopBox
        ConfidenceColor={colorCode}
        confidenceValue={confidenceValue}
        maturityLevel={maturityLevel}
        maturityLevelCount={maturityLevelCount}
        translatedTitle={translatedTitle}
        {...rest}
      />
      <BottomBox analyzation={analyzation} />
    </Box>
  );
};

const TopBox = (props: ITopBoxReport) => {
  const {
    ConfidenceColor,
    title,
    description,
    maturityLevel,
    confidenceValue,
    maturityLevelCount,
    translatedTitle,
  } = props;
  return (
    <Grid
      spacing={2}
      container
      sx={{ display: "flex", justifyContent: "space-evenly" }}
    >
      <Grid
        xs={12}
        sm={4}
        sx={{ ...styles.centerCVH, gap: 1 }}
        item
        component="div"
        id={title}
      >
        <Typography
          sx={{
            ...theme.typography.titleLarge,
            color: `${ConfidenceColor}`,
            direction: true ? "rtl" : "ltr",
            fontFamily: true ? farsiFontFamily : primaryFontFamily,
            textAlign: true ? "right" : "left",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            ...theme.typography.titleSmall,
            color: "rgba(61, 77, 92, 0.5)",
            direction: true ? "rtl" : "ltr",
            fontFamily: true ? farsiFontFamily : primaryFontFamily,
            textAlign: true ? "right" : "left",
          }}
        >
          {translatedTitle}
        </Typography>
      </Grid>
      <Grid
        xs={12}
        sm={4}
        item
        sx={{
          ...theme.typography.labelLarge,
          ...styles.centerVH,
          textAlign: "center",
          direction: true ? "rtl" : "ltr",
          fontFamily: true ? farsiFontFamily : primaryFontFamily,
        }}
      >
        <Typography
          sx={{
            ...theme.typography.extraLight,
            direction: true ? "rtl" : "ltr",
            fontFamily: true ? farsiFontFamily : primaryFontFamily,
          }}
        >
          {t(description, { lng: "fa" })}
        </Typography>
      </Grid>
      <Grid display={"flex"} justifyContent={"center"} xs={12} sm={4} item>
        <FlatGauge
          maturityLevelNumber={maturityLevelCount}
          levelValue={maturityLevel.value}
          text={maturityLevel.title}
          textPosition={"top"}
          confidenceLevelNum={confidenceValue}
          confidenceText={t("confidenceLevel", { lng: "fa" })}
        />
      </Grid>
    </Grid>
  );
};

const BottomBox = (props: any) => {
  const { analyzation } = props;
  return (
    <Box
      sx={{
        width: "90%",
        mx: "auto",
        borderRadius: "1rem",
        backgroundColor: "#2466A80A",
        py: "24px",
        paddingInlineEnd: "24px",
        paddingInlineStart: "32px",
        position: "relative",
      }}
    >
      <img
        src={lens}
        alt={lens}
        style={{
          position: "absolute",
          right: "-20px",
          top: "-10px",
          width: "3rem",
          height: "3rem",
        }}
      />
      <Typography
        sx={{
          ...theme.typography.labelMedium,
          color: "#2466A8",
          fontSize: "1rem",
          direction: true ? "rtl" : "ltr",
          fontFamily: true ? farsiFontFamily : primaryFontFamily,
          textAlign: true ? "right" : "left",
        }}
      >
        {t("analysisResults", { lng: "fa" })}
      </Typography>
      <Typography
        textAlign="justify"
        sx={{
          ...theme.typography.extraLight,
          mt: 1,
          color: "#2B333B",
          direction: true ? "rtl" : "ltr",
          fontFamily: true ? farsiFontFamily : primaryFontFamily,
        }}
      >
        {analyzation}
      </Typography>
    </Box>
  );
};

export default BoxReportLayout;

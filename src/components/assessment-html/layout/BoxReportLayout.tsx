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
  insight: string;
  confidenceValue: number;
  maturityLevelCount: number;
  maturityLevel: {
    id: number;
    title: string;
    index: number;
    value: number;
    description: string;
  };
  language: string;
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
  language: string;
}
const BoxReportLayout = (props: IBoxReport) => {
  const {
    confidenceValue,
    insight,
    maturityLevel,
    maturityLevelCount,
    language,
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
        paddingX: 4,
      }}
    >
      <TopBox
        ConfidenceColor={colorCode}
        confidenceValue={Math.ceil(confidenceValue)}
        maturityLevel={maturityLevel}
        maturityLevelCount={maturityLevelCount}
        language={language}
        {...rest}
      />
      <BottomBox insight={insight} language={language} />
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
    language,
  } = props;
  return (
    <Grid
      spacing={2}
      container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      textAlign="center"
    >
      <Grid xs={12} sm={4} item component="div" id={title}>
        <Typography
          sx={{
            ...theme.typography.titleLarge,
            color: `${ConfidenceColor}`,
            direction: language === "fa" ? "rtl" : "ltr",
            fontFamily: language === "fa" ? farsiFontFamily : primaryFontFamily,
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid xs={12} sm={4.5} item>
        <Typography
          sx={{
            ...theme.typography.extraLight,
            direction: language === "fa" ? "rtl" : "ltr",
            fontFamily: language === "fa" ? farsiFontFamily : primaryFontFamily,
          }}
        >
          {t(description, { lng: language })}
        </Typography>
      </Grid>
      <Grid xs={12} sm={3.5} item>
        <FlatGauge
          maturityLevelNumber={maturityLevelCount}
          levelValue={maturityLevel.value}
          text={maturityLevel.title}
          textPosition={"top"}
          confidenceLevelNum={confidenceValue}
          confidenceText={t("confidenceLevel", { lng: language })}
        />
      </Grid>
    </Grid>
  );
};

const BottomBox = (props: any) => {
  const { insight, language } = props;
  return (
    <Box
      sx={{
        width: "100%",
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
          direction: language === "fa" ? "rtl" : "ltr",
          fontFamily: language === "fa" ? farsiFontFamily : primaryFontFamily,
          textAlign: language === "fa" ? "right" : "left",
        }}
      >
        {t("analysisResults", { lng: language })}
      </Typography>
      <Typography
        component="div"
        textAlign="justify"
        sx={{
          ...theme.typography.extraLight,
          mt: 1,
          color: "#2B333B",
          direction: language === "fa" ? "rtl" : "ltr",
          fontFamily: language === "fa" ? farsiFontFamily : primaryFontFamily,
        }}
        dangerouslySetInnerHTML={{
          __html: insight ?? t("unavailable", { lng: language }),
        }}
      ></Typography>
    </Box>
  );
};

export default BoxReportLayout;

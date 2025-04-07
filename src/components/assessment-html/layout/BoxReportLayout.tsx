import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FlatGauge from "@/components/common/charts/flatGauge/FlatGauge";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import Grid from "@mui/material/Grid";
import lens from "@assets/svg/lens.svg";
import { getMaturityLevelColors } from "@styles";
import { t } from "i18next";
import ScoreImpactBarChart from "@/components/subject-report-old/ScoreImpactBarChart";
import ArrowDropUpRounded from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRounded from "@mui/icons-material/ArrowDropDownRounded";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

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
  attributeMeasures: any;
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
    attributeMeasures,
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
      <BottomBox
        insight={insight}
        language={language}
        attributeMeasures={attributeMeasures}
      />
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
            ...theme.typography.bodyMedium,
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

interface BottomBoxProps {
  insight: string;
  language: string;
  attributeMeasures: any[];
}

const BottomBox = ({
  insight,
  language,
  attributeMeasures,
}: BottomBoxProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isFarsi = language === "fa";
  const fontFamily = isFarsi ? farsiFontFamily : primaryFontFamily;
  const textAlign = isFarsi ? "right" : "left";

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        borderRadius: "1rem",
        backgroundColor: "#2466A80A",
        py: "24px",
        px: { xs: "16px", sm: "32px" },
        position: "relative",
      }}
    >
      <img
        src={lens}
        alt="lens"
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
          direction: isFarsi ? "rtl" : "ltr",
          fontFamily,
          textAlign,
        }}
      >
        {t("analysisResults", { lng: language })}
      </Typography>

      <Typography
        component="div"
        textAlign="justify"
        sx={{
          ...theme.typography.bodyMedium,
          mt: 1,
          color: "#2B333B",
          direction: isFarsi ? "rtl" : "ltr",
          fontFamily,
        }}
        dangerouslySetInnerHTML={{
          __html: insight ?? t("unavailable", { lng: language }),
        }}
      />

      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: isFarsi ? "flex-end" : "flex-start",
        }}
      >
        <Divider
          sx={{ flexGrow: 1, borderColor: theme.palette.primary.main }}
        />

        <IconButton
          onClick={() => setExpanded((prev) => !prev)}
          size="small"
          color="primary"
        >
          {expanded ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
        </IconButton>

        <Typography
          sx={{
            color: "#2466A8",
            fontFamily,
            whiteSpace: "nowrap",
          }}
          variant="labelSmall"
        >
          {t("reportDocument.showMeasures", { lng: language })}
        </Typography>
      </Box>

      {expanded && (
        <Box mt={1} display={{ xs: "none", sm: "block" }}>
          <Typography
            variant="labelSmall"
            sx={{
              color: "#6C8093",
              whiteSpace: "nowrap",
              fontFamily,
            }}
          >
            {t("reportDocument.measureTitle", { lng: language })}
          </Typography>

          <Box mt={-3}>
            <ScoreImpactBarChart
              measures={attributeMeasures}
              language={language}
              compact
            />
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isFarsi ? "flex-end" : "flex-start",
              }}
            >
              <InfoOutlined fontSize="small" color="action" />
              <Typography
                variant="labelSmall"
                sx={{
                  fontFamily,
                  color: "#6C8093",
                  marginInlineStart: "4px",
                }}
              >
                {t("hint", { lng: language })}
              </Typography>
              <IconButton
                onClick={() => setShowGuide((prev) => !prev)}
                size="small"
              >
                {showGuide ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
              </IconButton>
              <Divider sx={{ flexGrow: 1, borderColor: "#D6DEE5" }} />
            </Box>

            {showGuide && (
              <Typography
                mt={1}
                sx={{
                  color: "#4A4A4A",
                  textAlign: "justify",
                  ...theme.typography.bodyMedium,
                  fontFamily,
                }}
              >
                {t("reportDocument.helpDescription", { lng: language })}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BoxReportLayout;

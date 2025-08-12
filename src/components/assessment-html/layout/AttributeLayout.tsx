import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FlatGauge from "@/components/common/charts/flatGauge/FlatGauge";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import Grid from "@mui/material/Grid";
import lens from "@assets/svg/lens.svg";
import { getMaturityLevelColors, styles } from "@styles";
import { t } from "i18next";
import ScoreImpactBarChart from "@/components/subject-report-old/ScoreImpactBarChart";
import ArrowDropUpRounded from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRounded from "@mui/icons-material/ArrowDropDownRounded";
import { useMemo, useState } from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useAssessmentContext } from "@/providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@/utils/enumType";

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
  id: number;
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
const AttributeLayout = (props: IBoxReport) => {
  const {
    confidenceValue,
    insight,
    maturityLevel,
    maturityLevelCount,
    language,
    attributeMeasures,
    id,
    ...rest
  } = props;

  const colorPallet = getMaturityLevelColors(maturityLevelCount ?? 5);
  const colorCode = colorPallet[maturityLevel.value - 1];

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="background.containerLow"
      borderRadius="32px"
      p={4}
      gap={3}
      border={`1px solid ${colorCode}`}
      mb={4}
      width="100%"
      id={`${id}`}
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
  const { assessmentInfo } = useAssessmentContext();

  const isAdvanceMode = useMemo(() => {
    return assessmentInfo?.mode?.code === ASSESSMENT_MODE.ADVANCED;
  }, [assessmentInfo?.mode?.code]);

  return (
    <Grid
      spacing={2}
      container
      justifyContent="space-between"
      sx={{ ...styles.centerV }}
      textAlign="center"
    >
      <Grid xs={12} sm={4} item component="div" id={title}>
        <Typography
          variant="titleLarge"
          color={ConfidenceColor}
          sx={{
            ...styles.rtlStyle(language === "fa"),
          }}
        >
          {title}
        </Typography>
      </Grid>
      <Grid xs={12} sm={4.5} item>
        <Typography
          variant="bodyMedium"
          sx={{
            ...styles.rtlStyle(language === "fa"),
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
          confidenceText={
            isAdvanceMode ? t("common.confidenceLevel", { lng: language }) : ""
          }
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
      width="100%"
      mx="auto"
      borderRadius="16px"
      bgcolor="#2466A80A"
      py={3}
      px={{ xs: "16px", sm: "32px" }}
      position="relative"
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
        variant="semiBoldLarge"
        color="primary.main"
        sx={{
          ...styles.rtlStyle(language === "fa"),
          textAlign,
        }}
      >
        {t("assessment.analysisResults", { lng: language })}
      </Typography>

      <Typography
        component="div"
        textAlign="justify"
        color="text.primary"
        variant="bodyMedium"
        sx={{
          mt: 1,
          ...styles.rtlStyle(language === "fa"),
        }}
        dangerouslySetInnerHTML={{
          __html: insight ?? t("common.unavailable", { lng: language }),
        }}
      />

      <Box
        display={{ xs: "none", sm: "flex" }}
        alignItems="center"
        justifyContent={isFarsi ? "flex-end" : "flex-start"}
        onClick={() => setExpanded((prev) => !prev)}
        sx={{ cursor: "pointer" }}
      >
        <Divider sx={{ flexGrow: 1, borderColor: "primary.main" }} />

        <IconButton size="small" color="primary">
          {expanded ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
        </IconButton>

        <Typography
          color="primary.main"
          sx={{
            fontFamily,
            whiteSpace: "nowrap",
          }}
          variant="labelSmall"
        >
          {t("assessmentReport.measureStatus", { lng: language })}
        </Typography>
      </Box>

      {expanded && (
        <Box mt={1} display={{ xs: "none", sm: "block" }}>
          <Typography
            variant="labelSmall"
            color="background.onVariant"
            whiteSpace="nowrap"
            sx={{ fontFamily }}
          >
            {t("assessmentReport.measureTitle", { lng: language })}
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
              onClick={() => setShowGuide((prev) => !prev)}
              justifyContent={isFarsi ? "flex-end" : "flex-start"}
              sx={{
                ...styles.centerV,
                cursor: "pointer",
              }}
            >
              <InfoOutlined fontSize="small" color="action" />
              <Typography
                variant="labelSmall"
                color="background.onVariant"
                marginInlineStart="4px"
                sx={{ fontFamily }}
              >
                {t("common.hint", { lng: language })}
              </Typography>
              <IconButton size="small">
                {showGuide ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
              </IconButton>
              <Divider sx={{ flexGrow: 1, borderColor: "#D6DEE5" }} />
            </Box>

            {showGuide && (
              <Typography
                component="div"
                textAlign="justify"
                mt={1}
                color="#4A4A4A"
                variant="bodyMedium"
                sx={{ fontFamily }}
              >
                {t("assessmentReport.helpDescription", { lng: language })}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AttributeLayout;

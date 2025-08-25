import { Box, Grid, Typography } from "@mui/material";
import { styles } from "@styles";
import { t } from "i18next";
import { Gauge } from "@/components/common/charts/Gauge";
import { useScoreSection } from "../../model/hooks/useScoreSection";
import ChipsRow from "@/components/common/fields/ChipsRow";

export default function ScoreSection({
  rtl,
  lng,
  isQuickMode,
  assessment,
  gotoItems,
}: Readonly<{
  rtl: boolean;
  lng: string;
  isQuickMode: boolean;
  assessment: any;
  gotoItems: readonly any[];
}>) {
  const { introHtml, overallInsightHtml, gaugeProps } = useScoreSection({
    assessment,
    isQuickMode,
    lng,
  });

  return (
    <Grid container mt={2} columnSpacing={isQuickMode ? 2 : 5}>
      <Grid item xs={12} md={8}>
        {!isQuickMode && (
          <>
            <Typography
              component="div"
              variant="titleSmall"
              color="background.onVariant"
              textAlign={rtl ? "right" : "left"}
              sx={{ ...styles.rtlStyle(rtl) }}
            >
              {t("assessmentReport.introduction", { lng })}
            </Typography>
            <Typography
              component="div"
              textAlign="justify"
              variant="bodyMedium"
              sx={{ mt: 1, ...styles.rtlStyle(rtl) }}
              dangerouslySetInnerHTML={{ __html: introHtml }}
              className="tiptap"
            />
            <Typography
              component="div"
              variant="titleSmall"
              color="background.onVariant"
              textAlign={rtl ? "right" : "left"}
              sx={{ mt: 2, ...styles.rtlStyle(rtl) }}
            >
              {t("common.summary", { lng })}
            </Typography>
          </>
        )}

        <Typography
          component="div"
          textAlign="justify"
          variant="bodyMedium"
          sx={{ mt: 1, ...styles.rtlStyle(rtl) }}
          dangerouslySetInnerHTML={{ __html: overallInsightHtml }}
          className="tiptap"
        />

        <Box sx={{ ...styles.centerV }} gap={2}>
          <Typography
            component="div"
            variant="titleSmall"
            color="background.onVariant"
            sx={{ ...styles.rtlStyle(rtl) }}
          >
            {t("common.goto", { lng })}
          </Typography>
          <ChipsRow items={gotoItems} lng={lng} />
        </Box>
      </Grid>

      <Grid item xs={12} md={4} height="220px">
        <Gauge
          level_value={gaugeProps.level_value}
          maturity_level_status={gaugeProps.maturity_level_status}
          maturity_level_number={gaugeProps.maturity_level_number}
          confidence_value={gaugeProps.confidence_value}
          confidence_text={gaugeProps.confidence_text}
          isMobileScreen={false}
          hideGuidance
          status_font_variant="headlineLarge"
          height={300}
          confidence_text_variant="semiBoldSmall"
        />
      </Grid>
    </Grid>
  );
}

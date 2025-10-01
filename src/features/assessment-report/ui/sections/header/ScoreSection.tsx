import { Box, Grid } from "@mui/material";
import { styles } from "@styles";
import { t } from "i18next";
import { Gauge } from "@/components/common/charts/Gauge";
import { useScoreSection } from "../../../model/hooks/useScoreSection";
import ChipsRow from "@/components/common/fields/ChipsRow";
import { Text } from "@/components/common/Text";

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
      <Grid
        item
        xs={12}
        md={isQuickMode ? 8.5 : 9.3}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        {!isQuickMode && (
          <>
            <Text
              component="div"
              variant="semiBoldLarge"
              textAlign={rtl ? "right" : "left"}
              sx={{ ...styles.rtlStyle(rtl) }}
            >
              {t("assessmentReport.introduction", { lng })}
            </Text>
            <Text
              component="div"
              textAlign="justify"
              variant="bodyMedium"
              sx={{ mt: 1, ...styles.rtlStyle(rtl) }}
              dangerouslySetInnerHTML={{ __html: introHtml }}
              className="tiptap"
            />
            <Text
              component="div"
              variant="semiBoldLarge"
              textAlign={rtl ? "right" : "left"}
              sx={{ mt: 2, ...styles.rtlStyle(rtl) }}
            >
              {t("common.summary", { lng })}
            </Text>
          </>
        )}

        <Text
          component="div"
          textAlign="justify"
          variant="bodyMedium"
          sx={{ mt: 1, ...styles.rtlStyle(rtl) }}
          dangerouslySetInnerHTML={{ __html: overallInsightHtml }}
          className="tiptap"
        />

        <Box sx={{ ...styles.centerV, mt: "auto" }} gap={2}>
          <Text
            component="div"
            variant="semiBoldLarge"
            sx={{ ...styles.rtlStyle(rtl) }}
          >
            {t("common.goto", { lng })}
          </Text>
          <ChipsRow items={gotoItems} lng={lng} hoverable />
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        md={isQuickMode ? 3.5 : 2.7}
        height="230px"
        sx={{ ...styles.centerVH }}
      >
        <Gauge
          level_value={gaugeProps.level_value}
          maturity_level_status={gaugeProps.maturity_level_status}
          maturity_level_number={gaugeProps.maturity_level_number}
          confidence_value={gaugeProps.confidence_value}
          confidence_text={gaugeProps.confidence_text}
          status_font_variant="headlineMedium"
          maxWidth="240px"
          confidence_text_variant="semiBoldSmall"
          height="156px"
        />
      </Grid>
    </Grid>
  );
}

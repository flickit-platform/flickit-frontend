import { Dispatch, SetStateAction, useMemo } from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import TreeMapChart from "@/components/common/charts/TreeMapChart";
import ManWithMagnifier from "@/assets/svg/man-with-magnifier.svg";
import { t } from "i18next";
import { styles } from "@styles";
import { useTreeMapSection } from "../../../model/hooks/useTreeMapSection";
import languageDetector from "@/utils/languageDetector";
import MeasuresTable from "./MeasureTable";
import AIGenerated from "@/components/common/icons/AIGenerated";
import FlatGauge from "@/components/common/charts/flat-gauge/FlatGauge";
import { IMaturityLevel, IUserPermissions } from "@/types";

type Props = Readonly<{
  isQuickMode: boolean;
  assessment: any;
  subjects: any[];
  selectedId: number | null;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  lng: string;
  rtl?: boolean;
  permissions: IUserPermissions;
}>;

type AttributeVM = {
  title: string;
  weightText: string;
  description: string;
  maturityLevel: IMaturityLevel;
  insightHtml?: string;
  titleRtl: boolean;
  descRtl: boolean;
  levelRtl: boolean;
  rtl?: boolean;
  reasonText: string;
  guidanceText: string;
};

export const rtlSx = (flag?: boolean) => styles.rtlStyle(flag);
function toAttributeVM(
  attr: any,
  lng: string,
  rtl?: boolean,
): AttributeVM | null {
  if (!attr) return null;
  const title = attr.name ?? attr.title ?? "";
  const weight = attr.count ?? attr.weight ?? "";
  const description = attr.description ?? "";
  const maturityLevel = attr.maturityLevel;
  return {
    title,
    weightText: `${t("common.weight", { lng })}: ${weight}`,
    description,
    maturityLevel,
    insightHtml: attr.insight,
    titleRtl: languageDetector(title),
    descRtl: languageDetector(description),
    levelRtl: languageDetector(maturityLevel?.title),
    rtl,
    reasonText: t("assessmentReport.whyAtThisLevel", {
      lng,
      attribute: title,
      maturityLevel: maturityLevel?.title,
    }),
    guidanceText: t("assessmentReport.measureGuidance", {
      lng,
      attribute: title,
    }),
  };
}

const HeaderStrip: React.FC<{
  vm: AttributeVM;
  levels: number;
  lng: string;
  isQuickMode: boolean;
  assessment: any;
}> = ({ vm, levels, lng, isQuickMode, assessment }) => (
  <Box
    bgcolor="background.containerHigher"
    borderRadius="16px 16px 0 0"
    p={{ xs: 2, md: 2 }}
    mx={{ xs: 2, md: 4 }}
    mt={4}
  >
    <Grid
      container
      alignItems="stretch"
      sx={{
        bgcolor: "background.default.states.outlineBorder",
        borderRadius: 2,
        overflow: "hidden",
        ...styles.centerV,
      }}
    >
      <Grid
        item
        xs={12}
        md={4}
        sx={{ p: { xs: 2, md: 2 }, textAlign: "center" }}
      >
        <Typography
          component="div"
          variant="titleLarge"
          color="Background.default"
          sx={rtlSx(vm.titleRtl)}
        >
          {vm.title}
        </Typography>
        <Typography
          variant="semiBoldSmall"
          color="Background.onVariant"
          sx={rtlSx(vm.rtl)}
        >
          {vm.weightText}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        md={5.5}
        sx={{ p: { xs: 2, md: 2 }, textAlign: "center" }}
      >
        <Typography
          variant="bodyMedium"
          color="Background.default"
          sx={rtlSx(vm.descRtl)}
        >
          {vm.description}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        md={2.5}
        sx={{ p: { xs: 2, md: 2 }, textAlign: "center" }}
      >
        <FlatGauge
          maturityLevelNumber={levels}
          levelValue={vm.maturityLevel.value}
          text={vm.maturityLevel.title}
          confidenceLevelNum={Math.floor(assessment.confidenceValue)}
          confidenceText={!isQuickMode ? t("common.confidence") + ":" : ""}
          lng={lng}
          sx={{
            ...styles.centerVH,
            width: "100%",
            height: "100%",
          }}
        />
      </Grid>
    </Grid>
  </Box>
);

const BodyCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    bgcolor="background.container"
    borderRadius="0 0 16px 16px"
    px={{ xs: 2, md: 4 }}
    py={2}
    mx={{ xs: 2, md: 4 }}
  >
    {children}
  </Box>
);

const InsightBlock: React.FC<{
  title: string;
  html?: string;
  rtl?: boolean;
  isQuickMode?: boolean;
}> = ({ title, html, rtl, isQuickMode }) => {
  const theme = useTheme();
  return html ? (
    <Box>
      <Box sx={{ ...styles.centerV }} gap={0.5}>
        {isQuickMode && (
          <AIGenerated
            styles={{
              color: theme.palette.text.primary,
              width: "24px",
            }}
          />
        )}
        <Typography
          color="text.primary"
          variant="semiBoldLarge"
          sx={rtlSx(rtl)}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        component="div"
        textAlign="justify"
        variant="bodyMedium"
        sx={{ mt: 1, ...rtlSx(rtl) }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Box>
  ) : null;
};

const ReasonBar: React.FC<{ text: string; rtl?: boolean }> = ({
  text,
  rtl,
}) => (
  <Box
    bgcolor="background.containerHigh"
    mt={1}
    borderRadius="16px 16px 0 0"
    py={1}
    borderBottom="0.5px solid rgba(102,128,153,0.5)"
    sx={{ ...styles.centerVH }}
  >
    <Typography color="text.primary" variant="labelMedium" sx={rtlSx(rtl)}>
      {text}
    </Typography>
  </Box>
);

const GuidanceNote: React.FC<{ text: string; rtl?: boolean }> = ({
  text,
  rtl,
}) => (
  <Box my={1} sx={{ ...styles.centerV }}>
    <Typography
      color="info.main"
      variant="bodySmall"
      whiteSpace="break-spaces"
      textAlign="center"
      sx={rtlSx(rtl)}
    >
      {text}
    </Typography>
  </Box>
);

const EmptyState: React.FC<{ text: string; rtl?: boolean }> = ({
  text,
  rtl,
}) => (
  <Box
    bgcolor="background.container"
    borderRadius={2}
    p={{ xs: 0.5, md: 4 }}
    mx={{ xs: 0.5, md: 6 }}
    mt={4}
    gap={2}
    sx={{ ...styles.centerCH }}
  >
    <Box
      component="img"
      src={ManWithMagnifier}
      alt="Man With Magnifier"
      sx={{ width: "100%", height: 112, maxWidth: 260 }}
    />
    <Typography variant="semiBoldXLarge" color="disabled.on" sx={rtlSx(rtl)}>
      {text}
    </Typography>
  </Box>
);

export default function TreeMapSection({
  isQuickMode,
  assessment,
  subjects,
  selectedId,
  setSelectedId,
  lng,
  rtl,
  permissions,
}: Props) {
  const { treeMapData, selectedAttribute } = useTreeMapSection({
    subjects,
    selectedId,
  });
  const vm = useMemo(
    () => toAttributeVM(selectedAttribute, lng, rtl),
    [selectedAttribute, lng, rtl],
  );
  const measures: any[] = useMemo(
    () =>
      (selectedAttribute?.attributeMeasures || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        impactPercentage: m.impactPercentage,
        gainedScorePercentage: m.gainedScorePercentage,
        missedScorePercentage: m.missedScorePercentage,
      })),
    [selectedAttribute],
  );
  return (
    <Box>
      <TreeMapChart
        data={treeMapData}
        levels={assessment.assessmentKit.maturityLevelCount}
        lng={lng}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      {selectedId && vm ? (
        <>
          <HeaderStrip
            vm={vm}
            levels={assessment.assessmentKit.maturityLevelCount}
            lng={lng}
            isQuickMode={isQuickMode}
            assessment={assessment}
          />
          <BodyCard>
            <InsightBlock
              title={t("common.insights", { lng })}
              html={vm.insightHtml}
              rtl={vm.rtl}
              isQuickMode={isQuickMode}
            />
            <ReasonBar text={vm.reasonText} rtl={vm.rtl} />
            <GuidanceNote text={vm.guidanceText} rtl={vm.rtl} />
            <MeasuresTable
              measures={measures}
              selectedId={selectedId}
              isRTL={rtl}
              locale={lng}
              showQuestionColumn={permissions.canViewMeasureQuestions}
            />
          </BodyCard>
        </>
      ) : (
        <EmptyState
          text={t("assessmentReport.treemapEmptyState", { lng })}
          rtl={rtl}
        />
      )}
    </Box>
  );
}

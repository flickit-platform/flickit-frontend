import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Box, Typography, Grid } from "@mui/material";
import TreeMapChart from "@/components/common/charts/TreeMapChart";
import ManWithMagnifier from "@/assets/svg/man-with-magnifier.svg";
import { t } from "i18next";
import { styles } from "@styles";
import { useTreeMapSection } from "../../model/hooks/useTreeMapSection";
import languageDetector from "@/utils/languageDetector";

type Props = {
  assessment: any;
  subjects: any[];
  selectedId: number | null;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  lng: string;
  rtl?: boolean;
};

type AttributeVM = {
  title: string;
  weightText: string;
  description: string;
  levelTitle: string;
  insightHtml?: string;
  titleRtl: boolean;
  descRtl: boolean;
  levelRtl: boolean;
  rtl?: boolean;
  reasonText: string;
  guidanceText: string;
};

const rtlSx = (flag?: boolean) => styles.rtlStyle(flag);

function toAttributeVM(
  attr: any,
  lng: string,
  rtl?: boolean,
): AttributeVM | null {
  if (!attr) return null;
  const title = attr.name ?? attr.title ?? "";
  const weight = attr.count ?? attr.weight ?? "";
  const description = attr.description ?? "";
  const levelTitle = attr.maturityLevel?.title ?? "";
  return {
    title,
    weightText: `${t("common.weight", { lng })}: ${weight}`,
    description,
    levelTitle,
    insightHtml: attr.insight,
    titleRtl: languageDetector(title),
    descRtl: languageDetector(description),
    levelRtl: languageDetector(levelTitle),
    rtl,
    reasonText: t("assessmentReport.whyAtThisLevel", {
      lng,
      attribute: title,
      maturityLevel: levelTitle,
    }),
    guidanceText: t("assessmentReport.measureGuidance", {
      lng,
      attribute: title,
    }),
  };
}

const HeaderStrip: React.FC<{ vm: AttributeVM }> = ({ vm }) => (
  <Box
    bgcolor="background.containerHigher"
    borderRadius="16px 16px 0 0"
    p={2}
    mx={4}
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
      <Grid item xs={12} md={4} sx={{ p: 2, textAlign: "center" }}>
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
      <Grid item xs={12} md={5.5} sx={{ p: 2, textAlign: "center" }}>
        <Typography
          variant="bodyMedium"
          color="Background.default"
          sx={rtlSx(vm.descRtl)}
        >
          {vm.description}
        </Typography>
      </Grid>
      <Grid item xs={12} md={2.5} sx={{ p: 2, textAlign: "center" }}>
        <Typography
          variant="titleLarge"
          color="Background.default"
          sx={rtlSx(vm.levelRtl)}
        >
          {vm.levelTitle}
        </Typography>
      </Grid>
    </Grid>
  </Box>
);

const BodyCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    bgcolor="background.container"
    borderRadius="0 0 16px 16px"
    px={4}
    py={2}
    mx={4}
  >
    {children}
  </Box>
);

const InsightBlock: React.FC<{
  title: string;
  html?: string;
  rtl?: boolean;
}> = ({ title, html, rtl }) =>
  html ? (
    <>
      <Typography color="text.primary" variant="semiBoldLarge" sx={rtlSx(rtl)}>
        {title}
      </Typography>
      <Typography
        component="div"
        textAlign="justify"
        variant="bodyMedium"
        sx={{ mt: 1, ...rtlSx(rtl) }}
        dangerouslySetInnerHTML={{ __html: html }}
        className="tiptap"
      />
    </>
  ) : null;

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
    p={4}
    mx={6}
    mt={4}
    gap={2}
    sx={{ ...styles.centerVH }}
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
  assessment,
  subjects,
  selectedId,
  setSelectedId,
  lng,
  rtl,
}: Props) {
  const { treeMapData, selectedAttribute } = useTreeMapSection({
    subjects,
    selectedId,
  });
  const vm = useMemo(
    () => toAttributeVM(selectedAttribute, lng, rtl),
    [selectedAttribute, lng, rtl],
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
          <HeaderStrip vm={vm} />
          <BodyCard>
            <InsightBlock
              title={t("assessmentReport.resultAnalysis", { lng })}
              html={vm.insightHtml}
              rtl={vm.rtl}
            />
            <ReasonBar text={vm.reasonText} rtl={vm.rtl} />
            <GuidanceNote text={vm.guidanceText} rtl={vm.rtl} />
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

import { Box, Typography } from "@mui/material";
import TreeMapChart from "@/components/common/charts/TreeMapChart";
import ManWithMagnifier from "@/assets/svg/man-with-magnifier.svg";
import { styles } from "@styles";
import { t } from "i18next";
import { useTreeMapSection } from "../../model/hooks/useTreeMapSection";

export default function TreeMapSection({
  assessment, lang, subjects, selectedId, setSelectedId, rtl, lng,
}: any) {
  const { treeMapData, selectedAttribute } = useTreeMapSection({
    subjects,
    selectedId,
  });

  return (
    <>
      <TreeMapChart
        data={treeMapData}
        levels={assessment.assessmentKit.maturityLevelCount}
        lang={lang}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
      {selectedId ? (
        <Box bgcolor="background.container" marginInline={4} mt={4} borderRadius={1} paddingInline={4} paddingBlock={2} sx={{ ...styles.centerCVH }}>
          <Box bgcolor="background.default.states.outlineBorder" justifyContent="space-between" sx={{ ...styles.centerV }} width="100%">
            <Box sx={{ ...styles.centerCVH }} gap={2}>
              <Typography variant="titleLarge" color="Background.default">{selectedAttribute?.name}</Typography>
              <Typography variant="semiBoldSmall" color="Background.onVariant">
                {t("common.weight", { lng })}: {selectedAttribute?.count}
              </Typography>
            </Box>
            <Typography variant="bodyMedium" color="Background.default">
              {selectedAttribute?.description}
            </Typography>
            <Typography variant="titleLarge" color="Background.default">
              {selectedAttribute?.maturityLevel?.title}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box bgcolor="background.container" borderRadius="8px" padding={4} marginInline={6} mt={4} sx={{ ...styles.centerCVH }}>
          <Box component="img" src={ManWithMagnifier} alt="Man With Magnifier" width="100%" height="112px" />
          <Typography variant="semiBoldXLarge" color="disabled.on">
            {t("assessmentReport.treemapEmptyState")}
          </Typography>
        </Box>
      )}
    </>
  );
}

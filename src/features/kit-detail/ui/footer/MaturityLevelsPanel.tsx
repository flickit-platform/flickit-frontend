import { Text } from "@/components/common/Text";
import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { styles } from "@styles";
import { useMemo } from "react";
import { getPercentSymbol } from "@/utils/helpers";
import i18next from "i18next";
import { useAccordion } from "@/hooks/useAccordion";
import {
  BASE_PALETTE,
  getSemanticColors,
  withDefaultOverrides,
} from "@/config/colors";
import { IMaturityLevelIndexedItem } from "../../model/types";
import { getTranslation } from "./SubjectPanel";

const localPalette = withDefaultOverrides(BASE_PALETTE, { C5: "#C7CCD1" });

const MaturityLevelsPanel = ({
  maturityLevels,
}: {
  maturityLevels: IMaturityLevelIndexedItem[];
}) => {
  const { t } = useTranslation();
  const { isExpanded, onChange } = useAccordion<number>(null);

  const colorPallet = useMemo(
    () => getSemanticColors(maturityLevels?.length, "default", localPalette),
    [maturityLevels?.length],
  );

  const bgColorPallet = useMemo(
    () => getSemanticColors(maturityLevels?.length, "bg", localPalette),
    [maturityLevels?.length],
  );

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Text variant="semiBoldXLarge" color="primary">
        {t("common.maturityLevels")}
      </Text>

      <Box display="flex" flexDirection="column" gap={1}>
        {maturityLevels?.map((level, index) => (
          <Accordion
            key={level.index}
            expanded={isExpanded(level.index)}
            onChange={onChange(level.index)}
            sx={{
              boxShadow: "none !important",
              borderRadius: "16px !important",
              border: `1px solid ${colorPallet[index]}`,
              borderInlineStart: `8px solid ${colorPallet[index]}`,
              bgcolor: "initial",
              "&:before": { content: "none" },
              position: "relative",
              transition: "background-position .4s ease",
              "&.Mui-expanded": { margin: 0 },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreRounded sx={{ color: colorPallet[index] }} />
              }
              sx={{
                "&.Mui-expanded": { minHeight: "48px" },
                "& .MuiAccordionSummary-content": {
                  alignItems: "flex-start",
                  width: "100%",
                  gap: 2,
                  flexWrap: "wrap",
                },
                borderTopLeftRadius: "12px !important",
                borderTopRightRadius: "12px !important",
                backgroundColor: isExpanded(level.index)
                  ? bgColorPallet[index]
                  : "",
                borderBottom: isExpanded(level.index)
                  ? `1px solid ${colorPallet[index]}`
                  : "",
              }}
            >
              <Box
                sx={{ ...styles.centerV }}
                flex={getTranslation(level?.translations, "title") ? 0.5 : 0.25}
                gap={1}
              >
                <Box display="flex" gap={0.5}>
                  <Text variant="semiBoldMedium">{level.index}. </Text>
                  <Text variant="semiBoldMedium" lines={1}>
                    {level.title}
                  </Text>
                </Box>

                {getTranslation(level?.translations, "title") && (
                  <Text variant="bodyMedium" lines={1}>
                    {getTranslation(level?.translations, "title")}
                  </Text>
                )}
              </Box>
              {0 < level.competences.length && (
                <Box display="flex" gap={2} flex={1}>
                  <Text variant="semiBoldMedium">
                    {t("common.competences")}
                  </Text>
                  <Box
                    display="flex"
                    gap={1}
                    flexDirection={{ xs: "column", md: "row" }}
                  >
                    {level.competences.map((competence, i) => {
                      const isLast = i === level.competences.length - 1;
                      return (
                        <Box key={competence.title} sx={{ ...styles.centerV }}>
                          <Text variant="bodyMedium" lines={1}>
                            {competence.title}:
                          </Text>
                          <Text variant="bodyMedium" marginInlineStart={0.5}>
                            {competence.value}
                          </Text>
                          {getPercentSymbol(i18next.language === "fa")}
                          {!isLast && (
                            <Divider
                              flexItem
                              orientation="vertical"
                              sx={{
                                marginInlineStart: "8px",
                                bgcolor: isExpanded(level.index)
                                  ? "background.on"
                                  : "background.containerLowest",
                                display: { xs: "none", md: "flex" },
                              }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </AccordionSummary>

            <AccordionDetails>
              <Box
                display={{ xs: "block", md: "flex" }}
                gap={2}
                flex={1}
                paddingBlock={1}
              >
                <Text variant="semiBoldMedium">{t("common.description")}</Text>
                <Box width="100%">
                  <Text variant="bodyMedium">{level.description}</Text>

                  {getTranslation(level.translations, "description") && (
                    <>
                      <Divider flexItem sx={{ my: 1 }} />

                      <Text variant="bodyMedium" lines={1}>
                        {getTranslation(level.translations, "description")}
                      </Text>
                    </>
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default MaturityLevelsPanel;

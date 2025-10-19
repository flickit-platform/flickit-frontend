import { Text } from "@/components/common/Text";
import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { styles } from "@styles";
import { useMemo } from "react";
import { getPercentSymbol, getTranslation } from "@/utils/helpers";
import i18next from "i18next";
import { useAccordion } from "@/hooks/useAccordion";
import {
  BASE_PALETTE,
  getSemanticColors,
  withDefaultOverrides,
} from "@/config/colors";
import { IMaturityLevelIndexedItem } from "../../model/types";
import { sxAccordion } from "./AttributePanel";
import TitleWithTranslation from "@/components/common/fields/TranslationText";

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
              ...sxAccordion,
              border: `1px solid ${colorPallet[index]}`,
              borderInlineStart: `8px solid ${colorPallet[index]}`,
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreRounded sx={{ color: colorPallet[index] }} />
              }
              sx={{
                "&.Mui-expanded": { minHeight: "unset" },
                "& .MuiAccordionSummary-content": {
                  alignItems: "flex-start",
                  width: "100%",
                  gap: 2,
                  flexWrap: "wrap",
                },
                "& .MuiAccordionSummary-content.Mui-expanded": {
                  marginBlock: "12px !important",
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
              {Boolean(level.competences.length) && (
                <Box display="flex" gap={2} flex={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="nowrap"
                    spacing={1}
                    divider={
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                          mx: 1,
                          display: { xs: "none", md: "block" },
                          bgcolor: isExpanded(level.index)
                            ? "background.on"
                            : "background.containerLowest",
                        }}
                      />
                    }
                  >
                    <Text variant="semiBoldMedium">
                      {t("common.competences")}
                    </Text>
                    {level.competences.map((competence) => (
                      <Box key={competence.title} sx={{ ...styles.centerV }}>
                        <Text variant="bodyMedium" lines={1}>
                          {competence.title}:
                        </Text>
                        <Text variant="bodyMedium" marginInlineStart={0.5}>
                          {competence.value}
                        </Text>
                        {getPercentSymbol(i18next.language === "fa")}
                      </Box>
                    ))}
                  </Stack>
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
                  <TitleWithTranslation
                    title={level.description}
                    translation={getTranslation(
                      level.translations,
                      "description",
                    )}
                  />
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

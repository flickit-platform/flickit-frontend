import { Text } from "@/components/common/Text";
import { getMaturityLevelColors } from "@/config/styles";
import { IMaturityLevelIndexedItem } from "@/types";
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

export const MaturityLevels = ({
  maturityLevels,
}: {
  maturityLevels: IMaturityLevelIndexedItem[];
}) => {
  const { t } = useTranslation();
  const { isExpanded, onChange } = useAccordion<number>(null);

  const colorPallet = useMemo(
    () => getMaturityLevelColors(maturityLevels.length),
    [maturityLevels.length],
  );

  const bgColorPallet = useMemo(
    () => getMaturityLevelColors(maturityLevels.length, "background"),
    [maturityLevels.length],
  );

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Text variant="semiBoldXLarge" color="primary">
        {t("common.maturityLevels")}
      </Text>

      <Box display="flex" flexDirection="column" gap={1}>
        {maturityLevels.map((level, index) => (
          <Accordion
            key={level.index}
            expanded={isExpanded(level.index)}
            onChange={onChange(level.index)}
            sx={{
              boxShadow: "none !important",
              borderRadius: "16px !important",
              border: `0.5px solid ${colorPallet[index]}`,
              borderInlineStart: `6px solid ${colorPallet[index]}`,
              bgcolor: "initial",
              "&:before": { content: "none" },
              position: "relative",
              transition: "background-position .4s ease",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreRounded sx={{ color: colorPallet[index] }} />
              }
              sx={{
                "& .MuiAccordionSummary-content": {
                  alignItems: "flex-start",
                  width: "100%",
                  gap: 2,
                  margin: "16px",
                },
                borderTopLeftRadius: "12px !important",
                borderTopRightRadius: "12px !important",
                backgroundColor: isExpanded(level.index)
                  ? bgColorPallet[index]
                  : "",
              }}
            >
              <Box width="250px" sx={{ ...styles.centerV }}>
                <Text variant="semiBoldLarge" lines={1}>
                  {level.index}. {level.title}
                </Text>
                <Divider
                  flexItem
                  orientation="vertical"
                  sx={{ mx: "8px", bgcolor: "background.containerLowest" }}
                />
                <Text variant="bodyMedium" lines={1}>
                  {level.title}
                </Text>
              </Box>

              <Text variant="semiBoldMedium">{t("common.competences")}</Text>

              {level.competences.map((competence, i) => {
                const isLast = i === level.competences.length - 1;
                return (
                  <Box
                    key={competence.title}
                    maxWidth="120px"
                    sx={{ ...styles.centerV }}
                  >
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
                          bgcolor: "background.containerLowest",
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </AccordionSummary>

            <AccordionDetails />
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

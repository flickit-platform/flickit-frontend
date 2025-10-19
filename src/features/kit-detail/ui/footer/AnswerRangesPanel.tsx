import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
} from "@mui/material";
import { Text } from "@common/Text";
import { ExpandMoreRounded } from "@mui/icons-material";
import { styles } from "@styles";
import { useAccordion } from "@/hooks/useAccordion";
import Chip from "@mui/material/Chip";
import { KitDetailsType } from "@/features/kit-detail/model/types";
import { t } from "i18next";
import { OptionsSection } from "../common/OptionsSection";
import { sxAccordion } from "./AttributePanel";
import { getTranslation } from "@/utils/helpers";

const AnswerRangesPanel = ({
  ranges,
}: {
  ranges: KitDetailsType["answerRanges"];
}) => {
  const { isExpanded, onChange } = useAccordion<number | string>(null);
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Text variant="semiBoldXLarge" color="primary">
        {t("kitDesigner.answerRanges")}
      </Text>

      <Box display="flex" flexDirection="column" gap={1}>
        {ranges.map((range) => {
          return (
            <Accordion
              key={range.id}
              expanded={isExpanded(range.id)}
              onChange={onChange(range.id)}
              sx={sxAccordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRounded sx={{ color: "surface.on" }} />}
                sx={{
                  "&.Mui-expanded": { minHeight: "48px" },
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                    width: "100%",
                    gap: 2,
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: "0px !important",
                  },
                  borderTopLeftRadius: "12px !important",
                  borderTopRightRadius: "12px !important",
                  backgroundColor: isExpanded(range.id) ? "#66809914" : "",
                  borderBottom: isExpanded(range.id) ? `1px solid #C7CCD1` : "",
                }}
              >
                <>
                  <Box width="250px" sx={{ ...styles.centerV }}>
                    <Text variant="semiBoldLarge" lines={1}>
                      {range.title}
                    </Text>
                    {getTranslation(range.translations, "title") && (
                      <>
                        <Divider
                          flexItem
                          orientation="vertical"
                          sx={{
                            mx: "8px",
                            bgcolor: isExpanded(range.id)
                              ? "background.on"
                              : "background.containerLowest",
                          }}
                        />
                        <Text variant="bodyMedium" lines={1}>
                          {getTranslation(range.translations, "title")}
                        </Text>
                      </>
                    )}
                  </Box>
                  <Chip
                    label={
                      <Text variant="semiBoldMedium">
                        {range.answerOptions.length} {t("kitDetail.options")}
                      </Text>
                    }
                    sx={{ background: "#66809914", borderRadius: 4 }}
                  />
                </>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", p: 2 }}
              >
                <OptionsSection options={range.answerOptions} />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};

export default AnswerRangesPanel;

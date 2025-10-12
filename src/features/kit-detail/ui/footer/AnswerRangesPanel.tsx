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
import { useTranslation } from "react-i18next";
import { useAccordion } from "@/hooks/useAccordion";
import Chip from "@mui/material/Chip";
import { KitDetailsType } from "@/features/kit-detail/model/types";

const AnswerRangesPanel = ({
  ranges,
}: {
  ranges: KitDetailsType["answerRanges"];
}) => {
  const { t } = useTranslation();
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
              sx={{
                boxShadow: "none !important",
                borderRadius: "16px !important",
                border: `1px solid #C7CCD1`,
                bgcolor: "initial",
                "&:before": { content: "none" },
                position: "relative",
                transition: "background-position .4s ease",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRounded sx={{ color: "surface.on" }} />}
                sx={{
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
                <AccordionSummaryContent range={range} isExpanded={isExpanded} />
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Text variant={"titleSmall"} sx={{ mb: 1 }}>
                  {t("common.options")}
                </Text>
               <AccordionDetailsContent range={range} />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};

const AccordionSummaryContent = (props: any) =>{
  const {range, isExpanded} = props
  const { t } = useTranslation();

  const translation = range?.translations as Record<
    string,
    { title: string }
  >;
  const hasTranslation = Object.keys(translation || {}).length > 0;
  const translatedTitleSummary = hasTranslation
    ? Object.values(translation)[0]?.title
    : null;

  return (
    <>
      <Box width="250px" sx={{ ...styles.centerV }}>
        <Text variant="semiBoldLarge" lines={1}>
          {range.title}
        </Text>
        {hasTranslation && (
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
              {translatedTitleSummary}
            </Text>
          </>
        )}
      </Box>
      <Chip
        label={
          <Text>
            {range.answerOptions.length} {t("kitDetail.option")}
          </Text>
        }
        sx={{ background: "#66809914" }}
      />
    </>
  )
}
const AccordionDetailsContent = (props: any) =>{
  const {range} = props
  const { t } = useTranslation();
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {range?.answerOptions.map((option: any) => {
        const translation = option?.translations as Record<
          string,
          { title: string }
        >;
        const hasTranslation =
          Object.keys(translation || {}).length > 0;
        const translatedTitleDetail = hasTranslation
          ? Object.values(translation)[0]?.title
          : null;

        return (
          <Box
            key={option.index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginInlineEnd: 4,
              mb: 2,
              py: 2,
              px: 1,
              borderRadius: 2,
              border: "0.5px solid #C7CCD1",
              width: "fit-content",
            }}
          >
            <Box display={"flex"} flexDirection={"column"}>
              <Text variant={"bodyMedium"}>{option?.title}</Text>
              {hasTranslation && (
                <>
                  <Divider
                    variant="fullWidth"
                    orientation="horizontal"
                    flexItem
                  />
                  <Text variant="bodyMedium">{translatedTitleDetail}</Text>
                </>
              )}
            </Box>
            <Chip
              label={
                <Box>
                  <Text variant="bodySmall">
                    {t("common.score")}
                  </Text>
                  :
                  <Text
                    variant="bodyMedium"
                    sx={{ paddingInlineStart: "2.5px" }}
                  >
                    {t(option.value)}
                  </Text>
                </Box>
              }
            />
          </Box>
        );
      })}
    </Box>
  )
}

export default AnswerRangesPanel;

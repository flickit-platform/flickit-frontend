import { useParams } from "react-router-dom";
import { IIndexedItem } from "../../model/types";
import QueryData from "@/components/common/QueryData";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
} from "@mui/material";
import { useAccordion } from "@/hooks/useAccordion";
import { ExpandMoreRounded } from "@mui/icons-material";
import { Text } from "@/components/common/Text";
import { useTranslation } from "react-i18next";
import { useMeasures } from "../../model/footer/useMeasures";
import { InfoHeader } from "../common/InfoHeader";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { OptionsSection } from "../common/OptionsSection";
import { sxAccordion } from "./AttributePanel";
import { InfoField } from "../common/InfoField";
import { getTranslation } from "@/utils/helpers";

const MeasurePanel = ({ measure }: { measure: IIndexedItem }) => {
  const { assessmentKitId } = useParams();
  const { fetcMeasureDetailslQuery, measureDetails } = useMeasures(
    assessmentKitId,
    measure.id,
  );
  const { t } = useTranslation();
  const { isExpanded, onChange } = useAccordion<number | string>(null);

  return (
    <QueryData
      {...fetcMeasureDetailslQuery}
      render={(measure_element) => {
        const _measure = measureDetails ?? measure_element;
        return (
          <Box display="flex" flexDirection="column" gap={4}>
            <InfoHeader
              title={_measure.title}
              translations={getTranslation(measure?.translations, "title")}
              sectionName={t("common.measure")}
              tags={[`${_measure.questions.length} ${t("common.question")}`]}
            />
            <Box>
              <Text variant="semiBoldLarge" color={"background.secondaryDark"}>
                {t("common.description")}:
              </Text>
              <Box
                sx={{
                  px: 2,
                }}
              >
                <TitleWithTranslation
                  title={_measure.description}
                  translation={getTranslation(
                    _measure.translations,
                    "description",
                  )}
                  titleSx={{ color: "background.secondaryDark" }}
                  translationSx={{ color: "background.secondaryDark" }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Text variant="titleSmall" color={"background.secondaryDark"}>
                {t("common.questions")} ({_measure.questions.length}{" "}
                {t("kitDetail.questions")})
              </Text>{" "}
              {_measure.questions.map((question, index) => {
                return (
                  <Accordion
                    key={question.id}
                    expanded={isExpanded(question.id)}
                    onChange={onChange(question.id)}
                    sx={sxAccordion}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreRounded sx={{ color: "surface.on" }} />
                      }
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
                        backgroundColor: isExpanded(question.id)
                          ? "#66809914"
                          : "",
                        borderBottom: isExpanded(question.id)
                          ? `1px solid #C7CCD1`
                          : "",
                      }}
                    >
                      <Box display="flex" gap={0.5}>
                        <Text variant="bodyMedium">{index + 1}.</Text>{" "}
                        <Text variant="bodyMedium" textAlign="justify">
                          {" "}
                          {question.title}
                        </Text>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        gap: 2,
                      }}
                    >
                      <Grid container spacing={0}>
                        <Grid item xs={12} md={6}>
                          <InfoField
                            label={t("common.questionnaire")}
                            value={question.questionnaire.title}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InfoField
                            label={t("common.answerRange")}
                            value={question.answerRange.title}
                          />
                        </Grid>
                      </Grid>

                      <OptionsSection options={question?.options} />
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default MeasurePanel;

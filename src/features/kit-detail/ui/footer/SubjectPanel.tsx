import { Box, Chip, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { InfoHeader } from "../common/InfoHeader";
import { styles } from "@styles";
import { Text } from "@common/Text";
import TitleWithTranslation from "@common/fields/TranslationText";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import QueryData from "@common/QueryData";
import { useEffect } from "react";
import { ISubject } from "../../model/types";
import { TId } from "@/types";
import { getTranslation } from "@/utils/helpers";

const SubjectPanel = ({
  subject,
  onSelect,
}: {
  subject: ISubject;
  onSelect: any;
}) => {
  const { service } = useServiceContext();
  const { t } = useTranslation();
  const { assessmentKitId = "" } = useParams();

  const fetchSubjectDetail = useQuery({
    service: (args, config) => {
      const finalArgs = args ?? { assessmentKitId, subjectId: subject?.id };
      return service.assessmentKit.details.getSubject(finalArgs, config);
    },
  });

  useEffect(() => {
    fetchSubjectDetail.query();
  }, [subject.id]);

  const goToAttribute = (attributeId: TId) => {
    const nodeId = `attribute-${subject.id}-${attributeId}`;
    window.location.hash = nodeId;
    onSelect?.(nodeId);
  };

  return (
    <QueryData
      {...fetchSubjectDetail}
      render={(data: ISubject) => {
        const {
          weight,
          description,
          translations,
          attributes,
          questionsCount,
        } = data;

        return (
          <Box sx={{ ...styles.centerCV, gap: "32px" }}>
            <InfoHeader
              title={subject?.title}
              translations={getTranslation(subject?.translations, "title")}
              sectionName={t("kitDetail.subject")}
              tags={[
                `${questionsCount} ${t("kitDetail.questions")}`,
                `${t("common.weight")}: ${weight}`,
              ]}
            />

            <Box>
              <Text variant="semiBoldMedium" color={"background.secondaryDark"}>
                {t("common.description")}:
              </Text>
              <Box
                sx={{
                  px: 2,
                  pt: 1,
                }}
              >
                <TitleWithTranslation
                  title={description}
                  translation={getTranslation(translations, "description")}
                  titleSx={{ color: "background.secondaryDark" }}
                  translationSx={{ color: "background.secondaryDark" }}
                />
              </Box>
            </Box>
            <Box>
              <Text variant="semiBoldMedium" color={"background.secondaryDark"}>
                {t("kitDetail.includedAttribute")}:
              </Text>
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems="center"
                flexWrap="wrap"
                mt={2}
                divider={
                  <Box
                    sx={{
                      bgcolor: "outline.variant",
                      alignSelf: "stretch",
                      width: { xs: "100%", md: "1px" },
                      height: { xs: "1px", md: "auto" },
                      my: { xs: 1, md: 0 },
                      mx: { xs: 0, md: 1 },
                    }}
                  />
                }
              >
                {attributes?.map((attr) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Text
                      onClick={() => goToAttribute(attr.id)}
                      variant="semiBoldMedium"
                      color="primary.main"
                      textAlign="center"
                      sx={{ cursor: "pointer" }}
                    >
                      {attr.title}
                    </Text>
                    <Chip
                      label={
                        <Text
                          variant="semiBoldSmall"
                          color="background.contrastText"
                        >
                          {`${t("common.weight")} ${attr.weight}`}
                        </Text>
                      }
                      sx={{ bgcolor: "primary.states.hover", borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default SubjectPanel;

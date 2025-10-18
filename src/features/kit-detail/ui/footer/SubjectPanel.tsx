import { Box, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { InfoHeader } from "../common/InfoHeader";
import { styles } from "@styles";
import { Text } from "@common/Text";
import TitleWithTranslation from "@common/fields/TranslationText";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@providers/service-provider";
import { useParams } from "react-router-dom";
import QueryData from "@common/QueryData";
import Divider from "@mui/material/Divider";
import { useEffect } from "react";

type Ttranslations = Record<string, any>;
type TAttribute = { title: string; weight: number; id: number; index: number };

interface IsubjectData {
  attributes: TAttribute[];
  description: string;
  questionsCount: number;
  translations?: Ttranslations;
  weight: number;
}
interface IsubjectProp {
  attributes: TAttribute[];
  id: number;
  index: number;
  translations: Ttranslations;
  title: string;
}

export const getTranslation = (
  obj?: Ttranslations | null,
  type?: any,
): string | null => {
  return obj && Object.keys(obj).length > 0
    ? (Object.values(obj)[0]?.[type] ?? null)
    : null;
};

const SubjectPanel = ({
  subject,
  onSelect,
}: {
  subject: IsubjectProp;
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

  const goToAttribute = (attributeId: number) => {
    const nodeId = `attribute-${subject.id}-${attributeId}`;
    window.location.hash = nodeId;
    onSelect?.(nodeId);
  };

  return (
    <QueryData
      {...fetchSubjectDetail}
      render={(data: IsubjectData) => {
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
              firstTag={`${questionsCount} ${t("common.questions")}`}
              secondTag={`${t("common.weight")}: ${weight}`}
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
              <Box
                sx={{
                  justifyContent: "flex-start",
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                {attributes?.map(
                  (
                    {
                      title,
                      weight,
                      id,
                    }: { title: string; weight: number; id: number },
                    idx: number,
                  ) => {
                    const isLast = attributes.length - 1 === idx;
                    return (
                      <>
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
                            onClick={() => goToAttribute(id)}
                            variant="semiBoldMedium"
                            color="primary.main"
                            textAlign="center"
                            sx={{ cursor: "pointer" }}
                          >
                            {title}
                          </Text>
                          <Chip
                            label={
                              <Text
                                variant="semiBoldSmall"
                                color="background.contrastText"
                              >
                                {`${t("common.weight")} ${weight}`}
                              </Text>
                            }
                            sx={{ background: "#66809914", borderRadius: 4 }}
                          />
                        </Box>
                        {!isLast && (
                          <Divider
                            flexItem
                            orientation="vertical"
                            sx={{
                              marginInline: "8px",
                              bgcolor: "#C7CCD1",
                              alignSelf: "stretch",
                              mt: "12px",
                              mb: "12px",
                            }}
                          />
                        )}
                      </>
                    );
                  },
                )}
              </Box>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default SubjectPanel;

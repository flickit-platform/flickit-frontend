import { Box } from "@mui/material";
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

type Ttranslations = Record<string, { title?: string; description?: string }>;
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

const SubjectPanel = ({ subject }: { subject: IsubjectProp }) => {
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
  
  const getTranslation = (
    obj?: Ttranslations | null,
    type: keyof { title?: string; description?: string } = "title",
  ): string | null => {
    return obj && Object.keys(obj).length > 0
      ? (Object.values(obj)[0]?.[type] ?? null)
      : null;
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
              questionLabel={`${questionsCount} ${t("common.question")}`}
              weightLabel={`${t("common.weight")}: ${weight}`}
            />

            <Box>
              <Text variant="bodyLarge" color={"background.secondaryDark"}>
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
              <Text variant="bodyLarge" color={"background.secondaryDark"}>
                {t("kitDetail.includedAttribute")}:
              </Text>
              <Box
                sx={{ ...styles.centerV, justifyContent: "flex-start", mt: 2 }}
              >
                {attributes?.map(
                  (
                    { title, weight }: { title: string; weight: number },
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
                          <Text variant={"bodyMedium"} color={"primary.main"}>
                            {title}
                          </Text>
                          <Text
                            variant={"bodySmall"}
                            color={"background.secondaryDark"}
                          >{`${t("common.weight")} ${weight}`}</Text>
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

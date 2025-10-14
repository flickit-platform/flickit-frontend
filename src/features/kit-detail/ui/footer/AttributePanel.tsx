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
import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import uniqueId from "@utils/unique-id";
import languageDetector from "@utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";

type TTranslations = Record<string, { title?: string; description?: string }>;
type TAttribute = { title: string; weight: number; id: number; index: number };
type TMaturityLevels = { questionCount: number; title: string; weight: number; id: number; index: number };

interface IattributeData {
  id: number;
  index: number;
  maturityLevels: TMaturityLevels[];
  description: string;
  questionCount: number;
  translations?: TTranslations;
  weight: number;
  title: string
}

interface IsubjectProp {
  attributes: TAttribute[];
  id: number;
  index: number;
  translations: TTranslations;
  title: string;
}
type IattributeProp = Omit<IsubjectProp, "attributes">;

const AttributePanel = ({ subject, attribute }: { subject: IsubjectProp, attribute: IattributeProp }) => {
  const { service } = useServiceContext();
  const { t } = useTranslation();
  const { assessmentKitId = "" } = useParams();

  const [TopNavValue, setTopNavValue] = useState<number | null>(null);

  const fetchAttributeDetail = useQuery({
    service: (args, config) => {
      const finalArgs = args ?? { assessmentKitId, attributeId: attribute?.id };
      return service.assessmentKit.details.getAttribute(finalArgs, config);
    },
  });

  useEffect(() => {
    fetchAttributeDetail.query();
  }, [attribute.id]);

  const getTranslation = (
    obj?: TTranslations | null,
    type: keyof { title?: string; description?: string } = "title",
  ): string | null => {
    return obj && Object.keys(obj).length > 0
      ? (Object.values(obj)[0]?.[type] ?? null)
      : null;
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue, "test new");
    setTopNavValue(newValue);
  };


  return (
    <QueryData
      {...fetchAttributeDetail}
      render={(data: IattributeData) => {
        const {
          id,
          index,
          weight,
          description,
          translations,
          title,
          questionCount,
          maturityLevels
        } = data;

        useEffect(() => {
          const findMaturityLevelItem  = maturityLevels.find(item => item.questionCount != 0)
          if(findMaturityLevelItem){
            setTopNavValue(findMaturityLevelItem.questionCount)
          }
        }, []);

        return (
          <Box sx={{ ...styles.centerCV, gap: "32px" }}>
            <InfoHeader
              title={attribute?.title}
              translations={getTranslation(translations, "title")}
              sectionName={t("kitDetail.attribute")}
              questionLabel={`${questionCount} ${t("kitDetail.questions")}`}
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
              <Box>

                <Box
                  bgcolor="background.variant"
                  width="100%"
                  borderRadius="12px"
                  my={2}
                  paddingBlock={0.5}
                  sx={{ ...styles.centerVH }}
                >
                  <Tabs
                    value={TopNavValue}
                    onChange={(event, newValue) =>
                      handleChangeTab(event, newValue)
                    }
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    sx={{
                      border: "none",
                      "& .MuiTabs-indicator": {
                        display: "none",
                      },
                      alignItems: "center"
                    }}
                  >
                    {maturityLevels.map((item: any) => {
                      const { title, id, index, questionCount } = item;
                      return (
                        <Tab
                          // onClick={() =>
                          //   maturityHandelClick(maturityLevelOfScores.id)
                          // }
                          key={uniqueId()}
                          sx={{
                            // ...theme.typography.semiBoldLarge,
                            mr: 1,
                            border: "none",
                            textTransform: "none",
                            color: "text.primary",
                            "&.Mui-selected": {
                              boxShadow:
                                "0 1px 4px rgba(0,0,0,25%) !important",
                              borderRadius: "4px !important",
                              color: "primary.main",
                              bgcolor: "background.containerLowest",
                              "&:hover": {
                                bgcolor: "background.containerLowest",
                                border: "none",
                              },
                            },
                          }}
                          disabled={questionCount == 0}
                          label={
                            <Box
                              gap={1}
                              fontFamily={
                                languageDetector(title)
                                  ? farsiFontFamily
                                  : primaryFontFamily
                              }
                              sx={{ ...styles.centerVH }}
                            >
                               <Text variant={"bodyMedium"} >{`${index}.`}</Text>
                               <Text variant={"bodyMedium"} >{`${title}`}{" "}{`(${questionCount})`}</Text>
                            </Box>
                          }
                        />
                      );
                    })}
                  </Tabs>
                </Box>

              </Box>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default AttributePanel;

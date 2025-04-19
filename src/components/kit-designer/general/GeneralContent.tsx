import { Typography, Button, Divider, Box, Chip, Stack } from "@mui/material";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { IKitVersion, ILanguage } from "@/types/index";
import { useState, useEffect } from "react";
import { useQuery } from "@/utils/useQuery";
import QueryData from "@/components/common/QueryData";
import PermissionControl from "@/components/common/PermissionControl";
import LanguageSelectorChips from "./components/LanguageSelectorChips";
import { styles } from "@styles";
import { useConfigContext } from "@/providers/ConfgProvider";

const GeneralContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { service } = useServiceContext();
  const {
    config: { languages },
  } = useConfigContext();

  const fetchAssessmentKitInfoQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getInfo(
        args ?? { assessmentKitId: kitVersion.assessmentKit.id },
        config,
      ),
    runOnMount: true,
  });

  const addLanguageQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.addLanguage(args, config),
    runOnMount: false,
  });

  const [translatedLang, setTranslatedLang] = useState<ILanguage | undefined>(
    undefined,
  );

  const handleAddLanguage = (lang: ILanguage) => {
    if (
      lang.code !== fetchAssessmentKitInfoQuery.data?.mainLanguage.code &&
      languages.find((l) => l.code === lang.code)
    ) {
      setTranslatedLang(lang);
      addLanguageQuery.query({
        assessmentKitId: kitVersion.assessmentKit.id,
        data: { lang: lang.code },
      });
    }
  };

  useEffect(() => {
    if (fetchAssessmentKitInfoQuery.data) {
      const defaultTranslatedLanguage =
        fetchAssessmentKitInfoQuery.data.languages?.find(
          (lang: ILanguage) =>
            lang.code !== fetchAssessmentKitInfoQuery.data.mainLanguage.code,
        );
      setTranslatedLang(defaultTranslatedLanguage);
    }
  }, [fetchAssessmentKitInfoQuery.data]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="headlineSmall" fontWeight="bold">
          <Trans i18nKey="general" />
        </Typography>
      </Box>

      <Typography variant="bodyMedium">
        <Trans i18nKey="kitDesignerTab.generalDescription" />
      </Typography>

      <Divider sx={{ my: 2 }} />

      <PermissionControl
        error={[fetchAssessmentKitInfoQuery.errorObject?.response?.data]}
      >
        <QueryData
          {...fetchAssessmentKitInfoQuery}
          render={(data) => {
            return (
              <Stack spacing={2}>
                <Box sx={{ ...styles.centerV }} gap={2}>
                  <Typography variant="bodyLarge" fontWeight="bold">
                    <Trans i18nKey="kitDesignerTab.availableLanguages" />:
                  </Typography>
                  <LanguageSelectorChips
                    mainLanguage={data.mainLanguage}
                    translatedLanguage={translatedLang}
                    availableLanguages={languages}
                    onAddLanguage={handleAddLanguage}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                <Typography variant="bodyLarge">
                  <strong>Title:</strong> {data.title}
                </Typography>

                <Typography variant="bodyLarge">
                  <strong>Summary:</strong> {data.summary}
                </Typography>

                <Typography variant="bodyLarge">
                  <strong>Main Language:</strong> {data.mainLanguage.title}
                </Typography>

                {data.tags.length > 0 && (
                  <Box>
                    <Typography variant="bodyLarge" mb={1}>
                      <strong>Tags:</strong>
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {data.tags.map((tag: any) => (
                        <Chip
                          key={tag.id}
                          label={tag.title}
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Typography variant="bodyLarge">
                  <strong>Price:</strong>{" "}
                  {data.price === 0 ? "Free" : data.price + " toman"}
                </Typography>

                <Typography variant="bodyLarge">
                  <strong>Published:</strong> {data.published ? "Yes" : "No"}
                </Typography>
              </Stack>
            );
          }}
        />
      </PermissionControl>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" justifyContent="end" alignItems="center">
        <Button variant="contained">
          <Trans i18nKey="saveChanges" />
        </Button>
      </Box>
    </>
  );
};

export default GeneralContent;

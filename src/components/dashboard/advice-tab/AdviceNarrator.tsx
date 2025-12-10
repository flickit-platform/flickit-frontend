import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useServiceContext } from "@/providers/service-provider";
import { EditableRichEditor } from "@/components/common/fields/EditableRichEditor";
import { getReadableDate } from "@/utils/readable-date";
import { styles } from "@styles";
import { Text } from "@/components/common/Text";

export const AssessmentReportNarrator = ({ fetchAdviceNarration }: any) => {
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const abortController = useRef(new AbortController());

  const { t } = useTranslation();

  useEffect(() => {
    setAboutSection(
      fetchAdviceNarration.data?.aiNarration ??
        fetchAdviceNarration.data?.assessorNarration,
    );
    setEditable(fetchAdviceNarration.data.editable ?? false);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      justifyContent="start"
      textAlign="start"
      gap={0.5}
      py={2}
    >
      {fetchAdviceNarration.loading ? (
        <Box height="100%" sx={{ ...styles.centerVH }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <EditableRichEditor
            defaultValue={aboutSection?.narration}
            editable={editable}
            fieldName="narration"
            onSubmit={async (payload, event) => {
              await service.assessments.advice.updateNarration(
                {
                  assessmentId,
                  data: { assessorNarration: payload.narration },
                },
                { signal: abortController.current.signal },
              );
            }}
            infoQuery={fetchAdviceNarration.query}
            placeholder={t("advice.writeYourOwnAdvices") ?? ""}
            showEditorMenu={true}
            charLimit={1500}
          />
          {aboutSection?.creationTime && (
            <Text variant="bodyMedium" mx={1}>
              {getReadableDate(aboutSection?.creationTime)}
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

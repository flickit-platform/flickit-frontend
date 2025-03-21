import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useServiceContext } from "@providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@utils/convertToRelativeTime";
import { theme } from "@config/theme";
import formatDate from "@utils/formatDate";
import { EditableRichEditor } from "@/components/common/fields/EditableRichEditor";

export const AssessmentReportNarrator = ({ fetchAdviceNarration }: any) => {
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const abortController = useRef(new AbortController());

  const { t } = useTranslation();

  useEffect(() => {
    setAboutSection(
      fetchAdviceNarration.data?.aiNarration ||
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <EditableRichEditor
            defaultValue={aboutSection?.narration}
            editable={editable}
            fieldName="narration"
            onSubmit={async (payload, event) => {
              await service.updateAdviceNarration(
                {
                  assessmentId,
                  data: { assessorNarration: payload.narration },
                },
                { signal: abortController.current.signal },
              );
            }}
            infoQuery={fetchAdviceNarration.query}
            placeholder={t("writeYourOwnAdvices...") ?? ""}
          />
          {aboutSection?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {theme.direction == "rtl"
                ? formatDate(
                    format(
                      new Date(
                        new Date(aboutSection?.creationTime).getTime() -
                          new Date(
                            aboutSection?.creationTime,
                          ).getTimezoneOffset() *
                            60000,
                      ),
                      "yyyy/MM/dd HH:mm",
                    ),
                    "Shamsi",
                  )
                : formatDate(
                    format(
                      new Date(
                        new Date(aboutSection?.creationTime).getTime() -
                          new Date(
                            aboutSection?.creationTime,
                          ).getTimezoneOffset() *
                            60000,
                      ),
                      "yyyy/MM/dd HH:mm",
                    ) +
                      " (" +
                      t(convertToRelativeTime(aboutSection?.creationTime)) +
                      ")",
                    "Miladi",
                  )}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

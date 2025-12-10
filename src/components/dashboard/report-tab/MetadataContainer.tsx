import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import QueryData from "@common/QueryData";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Switch from "@mui/material/Switch";
import { EditableRichEditor } from "@/components/common/fields/EditableRichEditor";
import { styles } from "@styles";
import { Text } from "@/components/common/Text";
import { TId } from "@/types";

const reportFields: {
  id: TId;
  name: string;
  title: string;
  placeholder: string;
  charLimit?: number;

}[] = [
  {
    id: 1,
    name: "intro",
    title: "assessmentReport.introductionReport",
    placeholder: "assessmentReport.writeIntroduction",
    charLimit: 1000
  },
  {
    id: 2,
    name: "prosAndCons",
    title: "assessmentReport.maturityMapOfAssessedAttributes",
    placeholder: "assessmentReport.writeStrengthAndAreas",
    charLimit: 1000
  },
  {
    id: 3,
    name: "steps",
    title: "assessment.assessmentSteps",
    placeholder: "assessmentReport.writeStepsForAssessment",
  },
  {
    id: 4,
    name: "participants",
    title: "assessmentReport.participants",
    placeholder: "assessmentReport.writeAboutParticipants",
  },
];
const ReportTab = () => {
  const { spaceId = "", assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const fetchReportFields = useQuery({
    service: (args, config) =>
      service.assessments.metadata.getMetadata(
        args ?? { assessmentId },
        config,
      ),
    runOnMount: true,
  });

  const PublishReportStatus = useQuery({
    service: (args, config) =>
      service.assessments.report.updatePublishStatus(args, config),
    runOnMount: false,
  });

  const handlePublishChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let data = { published: event.target.checked };
    await PublishReportStatus.query({ assessmentId, data });
    await fetchReportFields.query();
  };

  return (
    <QueryData
      {...fetchReportFields}
      loadingComponent={<Loading />}
      render={(data) => {
        const { metadata, published } = data;

        return (
          <>
            {reportFields.map((field) => {
              const { id, name, title, placeholder, charLimit } = field;
              return (
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: { xs: "column-reverse", md: "row" },
                  }}
                >
                  <Box
                    sx={{
                      ...styles.boxStyle,
                      gap: 2,
                      minHeight: "190px",
                      width:
                        name == "intro" ? { xs: "100%", md: "68%" } : "100%",
                    }}
                  >
                    <Text
                      color="text.primary"
                      variant="semiBoldLarge"
                      justifyContent="flex-start"
                      gap={2}
                      mb={2}
                      sx={{ ...styles.centerV }}
                    >
                      <Trans i18nKey={title} />
                      {!metadata[name] && (
                        <Text variant="semiBoldLarge" color="error.main">
                          (<Trans i18nKey="common.empty" />)
                        </Text>
                      )}
                    </Text>
                    <Box>
                      <EditableRichEditor
                        defaultValue={metadata[name]}
                        editable={true}
                        fieldName={name}
                        onSubmit={async (payload: any, event: any) => {
                          await service.assessments.metadata.updateMetadata(
                            {
                              assessmentId,
                              reportData: { [name]: payload[name] },
                            },
                            {},
                          );
                        }}
                        infoQuery={fetchReportFields.query}
                        placeholder={t(placeholder) ?? ""}
                        required={false}
                        charLimit={charLimit}
                      />
                    </Box>
                  </Box>
                  {name == "intro" && (
                    <Box
                      sx={{
                        ...styles.boxStyle,
                        gap: 2,
                        minHeight: "190px",
                        width: { xs: "100%", md: "30%" },
                        display: "flex",
                        justifyContent: "center",
                        alignSelf: "flex-start",
                      }}
                    >
                      <Box width="100%" sx={{ ...styles.centerCH }}>
                        <Button
                          component={Link}
                          to={`/${spaceId}/assessments/${assessmentId}/graphical-report/`}
                          state={{ from: location.pathname }}
                          sx={{ display: "flex", gap: 1, width: "100%" }}
                          variant={"contained"}
                        >
                          <Text sx={{ whiteSpace: "nowrap" }}>
                            <Trans i18nKey="assessmentReport.viewReport" />
                          </Text>
                          <AssignmentOutlinedIcon fontSize={"small"} />
                        </Button>
                        <Divider sx={{ width: "100%", my: 2 }} />
                        <Box
                          width="100%"
                          justifyContent="space-between"
                          sx={{ ...styles.centerV }}
                        >
                          <Text variant="semiBoldLarge">
                            <Trans i18nKey="assessmentReport.publishReport" />
                          </Text>
                          <Switch
                            checked={published}
                            onChange={handlePublishChange}
                            size="small"
                            disabled={
                              Object.values(metadata).includes(null) &&
                              !published
                            }
                            sx={{ cursor: "pointer" }}
                          />
                        </Box>

                        {Object.values(metadata).includes(null) &&
                          !published && (
                            <Box bgcolor="transparent">
                              <Text
                                variant="semiBoldSmall"
                                color="error.main"
                                sx={{
                                  ...styles.centerVH,
                                  mt: 2,
                                  px: 2,
                                  gap: 1,
                                }}
                              >
                                <ReportProblemOutlinedIcon fontSize={"small"} />
                                <Trans i18nKey="errors.fillInAllRequired" />
                              </Text>
                            </Box>
                          )}
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            })}
          </>
        );
      }}
    />
  );
};

const Loading = () => {
  let count = Array.from(Array(4).keys());
  return (
    <>
      {count.map((item) => (
        <LoadingSkeleton
          key={item}
          sx={{ height: "150px", mt: "32px" }}
        />
      ))}
    </>
  );
};

export default ReportTab;

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Trans } from "react-i18next";
import { theme } from "@config/theme";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { t } from "i18next";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import QueryData from "@common/QueryData";
import uniqueId from "@/utils/uniqueId";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Switch from "@mui/material/Switch";
import { EditableRichEditor } from "@/components/common/fields/EditableRichEditor";
import { styles } from "@styles";
const ReportTab = () => {
  const { spaceId = "", assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const fetchReportFields = useQuery({
    service: (args, config) =>
      service.assessments.report.getMetadata(args ?? { assessmentId }, config),
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

  const reportFields: { name: string; title: string; placeholder: string }[] = [
    {
      name: "intro",
      title: "introductionReport",
      placeholder: "writeIntroduction",
    },
    {
      name: "prosAndCons",
      title: "strengthsAndAreasForImprovement",
      placeholder: "writeStrengthAndAreas",
    },
    {
      name: "steps",
      title: "assessmentSteps",
      placeholder: "writeStepsForAssessment",
    },
    {
      name: "participants",
      title: "participants",
      placeholder: "writeAboutParticipants",
    },
  ];
  return (
    <QueryData
      {...fetchReportFields}
      loadingComponent={<Loading />}
      render={(data) => {
        const { metadata, published } = data;

        return (
          <>
            {reportFields.map((field) => {
              const { name, title, placeholder } = field;
              return (
                <Box
                  key={uniqueId()}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: { xs: "column-reverse", md: "row" },
                    mt: name == "intro" ? 4 : null,
                  }}
                >
                  <Box
                    key={uniqueId()}
                    sx={{
                      ...styles.boxStyle,
                      gap: 2,
                      minHeight: "190px",
                      // mt: name == "intro" ? 4 : 5,
                      width:
                        name == "intro" ? { xs: "100%", md: "68%" } : "100%",
                    }}
                  >
                    <Typography
                      color="surface"
                      variant="semiBoldLarge"
                      sx={{
                        ...styles.centerV,
                        justifyContent: "flex-start",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Trans i18nKey={title} />
                      {!metadata[name] && (
                        <Typography
                          sx={{
                            ...theme.typography.semiBoldLarge,
                            color: theme.palette.error.main,
                          }}
                        >
                          (<Trans i18nKey={"empty"} />)
                        </Typography>
                      )}
                    </Typography>
                    <Box>
                      <EditableRichEditor
                        defaultValue={metadata[name]}
                        editable={true}
                        fieldName={name}
                        onSubmit={async (payload: any, event: any) => {
                          await service.assessments.report.updateMetadata(
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
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Button
                          component={Link}
                          to={`/${spaceId}/assessments/${assessmentId}/graphical-report/`}
                          sx={{ display: "flex", gap: 1, width: "100%" }}
                          variant={"contained"}
                        >
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            <Trans i18nKey={"viewReport"} />
                          </Typography>
                          <AssignmentOutlinedIcon fontSize={"small"} />
                        </Button>
                        <Divider sx={{ width: "100%", my: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Typography
                            sx={{ ...theme.typography.semiBoldLarge }}
                          >
                            <Trans i18nKey={"publishReport"} />
                          </Typography>
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
                            <Box
                              sx={{
                                background: "transparent",
                              }}
                            >
                              <Typography
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  ...theme.typography.semiBoldSmall,
                                  color: theme.palette.error.main,
                                  mt: 2,
                                  px: 2,
                                  gap: 1,
                                }}
                              >
                                <ReportProblemOutlinedIcon fontSize={"small"} />
                                <Trans i18nKey={"fillInAllRequired"} />
                              </Typography>
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
          key={uniqueId()}
          sx={{ height: "150px", mt: "32px" }}
        />
      ))}
    </>
  );
};

export default ReportTab;

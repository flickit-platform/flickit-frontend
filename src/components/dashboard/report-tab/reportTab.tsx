import Box from "@mui/material/Box";
import MainCard from "@utils/MainCard";
import { Button, Divider, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { useForm } from "react-hook-form";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RichEditorField from "@common/fields/RichEditorField";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import languageDetector from "@utils/languageDetector";
import EditRounded from "@mui/icons-material/EditRounded";
import Grid from "@mui/material/Grid";
import { t } from "i18next";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import QueryData from "@common/QueryData";
import { uniqueId } from "lodash";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import { styles } from "@styles";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Switch from "@mui/material/Switch";
import { EditableRichEditor } from "@/components/common/fields/EditableRichEditor";

const ReportTab = () => {
  const { spaceId = "", assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const fetchReportFields = useQuery({
    service: (args = { assessmentId }, config) =>
      service.fetchReportFields(args, config),
    runOnMount: true,
  });

  const PublishReportStatus = useQuery({
    service: (args, config) => service.PublishReportStatus(args, config),
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
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: { xs: "column-reverse", md: "row" },
                    mt: name == "intro" ? 4 : null,
                  }}
                >
                  <MainCard
                    key={uniqueId()}
                    style={{
                      minHeight: "180px",
                      // mt: name == "intro" ? 4 : 5,
                      width:
                        name == "intro" ? { xs: "100%", md: "68%" } : "100%",
                    }}
                  >
                    <Typography
                      style={{ ...theme.typography.semiBoldLarge }}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        color: "#2B333B",
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
                          await service.patchUpdateReportFields(
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
                  </MainCard>
                  {name == "intro" && (
                    <MainCard
                      style={{
                        minHeight: "180px",
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
                          justifyContent: "space-between",
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
                        <Divider sx={{ width: "100%" }} />
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
                                  py: 1,
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
                    </MainCard>
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

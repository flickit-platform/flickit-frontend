import { styles } from "@styles";
import Box from "@mui/material/Box";
import MainCard from "@utils/MainCard";
import { Button, Snackbar, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import TreeMapChart from "@common/charts/TreeMapChart";
import { t } from "i18next";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import QueryData from "@common/QueryData";

const ReportTab = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const patchUpdateReportFields = useQuery({
    service: (args = { assessmentId }, config) =>
      service.patchUpdateReportFields(args, config),
    runOnMount: false,
  });
  const fetchReportFields = useQuery({
    service: (args = { assessmentId }, config) =>
      service.fetchReportFields(args, config),
    runOnMount: true,
  });
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setSnackbarOpen(true);
    });
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <QueryData
      {...fetchReportFields}
      loading={false}
      render={(data) => {
        const { intro, prosAndCons, steps, participants } = data;
        return (
          <>
            <Box
              sx={{
                mt: "40px",
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/*<Grid item xs={12} md={6}>*/}
                {/*  {"" ? (*/}
                {/*    <Box*/}
                {/*      sx={{ background: theme.palette.error.main, borderRadius: 2 }}*/}
                {/*    >*/}
                {/*      <Typography*/}
                {/*        sx={{*/}
                {/*          display: "flex",*/}
                {/*          justifyContent: "center",*/}
                {/*          alignItems: "center",*/}
                {/*          ...theme.typography.semiBoldMedium,*/}
                {/*          color: "#FAD1D8",*/}
                {/*          py: 1,*/}
                {/*          px: 2,*/}
                {/*          gap: 1,*/}
                {/*        }}*/}
                {/*      >*/}
                {/*        <ReportProblemOutlinedIcon fontSize={"small"} />*/}
                {/*        <Trans i18nKey={"fillInAllRequired"} />*/}
                {/*      </Typography>*/}
                {/*    </Box>*/}
                {/*  ) : (*/}
                {/*    <Box*/}
                {/*      sx={{*/}
                {/*        background: theme.palette.warning.light,*/}
                {/*        borderRadius: 2,*/}
                {/*        display: "flex",*/}
                {/*        justifyContent: "space-between",*/}
                {/*        alignItems: "center",*/}
                {/*        py: 1,*/}
                {/*        px: 2,*/}
                {/*        gap: 5,*/}
                {/*      }}*/}
                {/*    >*/}
                {/*      <Typography*/}
                {/*        sx={{*/}
                {/*          display: "flex",*/}
                {/*          justifyContent: "center",*/}
                {/*          alignItems: "center",*/}
                {/*          ...theme.typography.semiBoldMedium,*/}
                {/*          color: theme.palette.warning.main,*/}

                {/*          gap: 1,*/}
                {/*        }}*/}
                {/*      >*/}
                {/*        <ReportProblemOutlinedIcon fontSize={"small"} />*/}
                {/*        <Trans i18nKey={"someAnswersNeedUpdating"} />*/}
                {/*      </Typography>*/}
                {/*      <Button*/}
                {/*        variant="contained"*/}
                {/*        sx={{*/}
                {/*          minWidth: "unset",*/}
                {/*          width: "28px",*/}
                {/*          height: "28px",*/}
                {/*          background: theme.palette.warning.main,*/}
                {/*          "&:hover": {*/}
                {/*            background: theme.palette.warning.main,*/}
                {/*            width: "fit-content",*/}
                {/*          },*/}
                {/*        }}*/}
                {/*      >*/}
                {/*        <CloseOutlinedIcon sx={{ color: "#fff" }} />*/}
                {/*      </Button>*/}
                {/*    </Box>*/}
                {/*  )}*/}
                {/*</Grid>*/}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: "auto",
                  }}
                >
                  <Box sx={{ ...styles.centerVH, gap: 1 }}>
                    <Button
                      onClick={copyLink}
                      sx={{ display: "flex", gap: 1 }}
                      variant={"outlined"}
                    >
                      <Typography sx={{ whiteSpace: "nowrap" }}>
                        <Trans i18nKey={"copy report link"} />
                      </Typography>
                      <InsertLinkIcon fontSize={"small"} />
                    </Button>
                    <Button
                      sx={{ display: "flex", gap: 1 }}
                      variant={"contained"}
                    >
                      <Typography sx={{ whiteSpace: "nowrap" }}>
                        <Trans i18nKey={"view report"} />
                      </Typography>
                      <AssignmentOutlinedIcon fontSize={"small"} />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <MainCard
              style={{
                // ...styles.centerCVH,
                minHeight: "50px",
                mt: 2,
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
                  mb: 3,
                }}
              >
                <Trans i18nKey={"introduction"} />
                <InfoOutlinedIcon />
                  {!intro &&
                      <Typography
                          sx={{
                              ...theme.typography.semiBoldLarge,
                              color: theme.palette.error.main,
                          }}
                      >
                          (<Trans i18nKey={"empty"} />)
                      </Typography>
                  }

              </Typography>
              <Box>
                <OnHoverInputReport
                  attributeId={1}
                  // formMethods={formMethods}
                  data={intro}
                  infoQuery={patchUpdateReportFields.query}
                  type="summary"
                  editable={true}
                  placeholder={t("writeIntroduction")}
                />
              </Box>
            </MainCard>
            <MainCard style={{ mt: "40px" }}>
              <Grid columns={12} container>
                <Grid xs={12} item>
                  <Typography
                    style={{ ...theme.typography.semiBoldLarge }}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: "#2B333B",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Trans i18nKey={"strengthsAndRoomsForImprovement"} />
                    <InfoOutlinedIcon />
                    <Typography
                      sx={{
                        ...theme.typography.semiBoldLarge,
                        color: theme.palette.error.main,
                      }}
                    >
                      (<Trans i18nKey={"empty"} />)
                    </Typography>
                  </Typography>
                  <OnHoverInputReport
                    attributeId={1}
                    // formMethods={formMethods}
                    data={prosAndCons}
                    // infoQuery={updateAttributeAndData}
                    type="summary"
                    editable={true}
                    placeholder={t("writeStrengthAndRooms")}
                  />
                </Grid>
                <Grid item>
                  {/*<TreeMapChart*/}
                  {/*    data={combinedAttributes}*/}
                  {/*    levels={*/}
                  {/*        jsonData?.assessment.assessmentKit*/}
                  {/*            .maturityLevelCount*/}
                  {/*    }*/}
                  {/*/>*/}
                </Grid>
              </Grid>
            </MainCard>
            <MainCard style={{ mt: "40px" }}>
              <Typography
                style={{ ...theme.typography.semiBoldLarge }}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  color: "#2B333B",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Trans i18nKey={"stepsTakenForThisAssessment"} />
                <InfoOutlinedIcon />
                <Typography
                  sx={{
                    ...theme.typography.semiBoldLarge,
                    color: theme.palette.error.main,
                  }}
                >
                  (<Trans i18nKey={"empty"} />)
                </Typography>
              </Typography>
              <Box sx={{ marginInlineStart: "1rem" }}>
                <Typography
                  sx={{
                    ...theme.typography.bodyMedium,
                    color: "#2B333B",
                    mb: "1.2rem",
                  }}
                >
                  <Trans i18nKey={"stepsTakenSoFar"} />
                </Typography>
                <OnHoverInputReport
                  attributeId={1}
                  // formMethods={formMethods}
                  data={steps}
                  // infoQuery={updateAttributeAndData}
                  type="summary"
                  editable={true}
                  placeholder={t("writeStepsForAssessment")}

                />
              </Box>
            </MainCard>
            <MainCard style={{ mt: "40px" }}>
              <Typography
                style={{ ...theme.typography.semiBoldLarge }}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  color: "#2B333B",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Trans i18nKey={"assessmentContributors"} />
                <InfoOutlinedIcon />
                <Typography
                  sx={{
                    ...theme.typography.semiBoldLarge,
                    color: theme.palette.error.main,
                  }}
                >
                  (<Trans i18nKey={"empty"} />)
                </Typography>
              </Typography>
              <Box sx={{ marginInlineStart: "1rem" }}>
                <Typography
                  sx={{
                    ...theme.typography.bodyMedium,
                    color: "#2B333B",
                    mb: "1.2rem",
                  }}
                >
                  <Trans i18nKey={"peopleHaveContributingInAssessment"} />
                </Typography>
                <OnHoverInputReport
                  attributeId={1}
                  // formMethods={formMethods}
                  data={participants}
                  // infoQuery={updateAttributeAndData}
                  type="summary"
                  editable={true}
                  placeholder={t("writeAssessmentContributors")}

                />
              </Box>
            </MainCard>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              message={t("linkCopied")}
            />
          </>
        );
      }}
    />
  );
};

const OnHoverInputReport = (props: any) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, editable, type, attributeId, infoQuery, placeholder } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [show, setShow] = useState<boolean>(!!!data);

  const handleCancel = () => {
    setShow(false);
    setError({});
    setHasError(false);
  };

  const { assessmentId = "" } = useParams();

  const updateAssessmentKit = async (
    data: any,
    event: any,
    shouldView?: boolean,
  ) => {
    try {
      // const res = await infoQuery(attributeId, assessmentId, data.title);
      const res = await infoQuery();
      res?.message && toast.success(res?.message);
      setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      if (Array.isArray(err.response?.data?.message)) {
        toastError(err.response?.data?.message[0]);
      } else if (
        err.response?.data &&
        err.response?.data.hasOwnProperty("message")
      ) {
        toastError(error);
      }
      setError(err);
      setHasError(true);
    }
  };
  const formMethods = useForm({ shouldUnregister: true });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {editable && show ? (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100% " }}>
          <FormProviderWithForm formMethods={formMethods}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RichEditorField
                name={"title"}
                label={""}
                required={false}
                defaultValue={data || ""}
                placeholder={placeholder}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <IconButton
                  edge="end"
                  sx={{
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                    borderRadius: "3px",
                    height: "36px",
                    marginBottom: "2px",
                  }}
                  onClick={formMethods.handleSubmit(updateAssessmentKit)}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
                <IconButton
                  edge="end"
                  sx={{
                    background: theme.palette.primary.main,
                    "&:hover": {
                      background: theme.palette.primary.dark,
                    },
                    borderRadius: "4px",
                    height: "36px",
                    marginBottom: "2px",
                  }}
                  onClick={handleCancel}
                >
                  <CancelRoundedIcon sx={{ color: "#fff" }} />
                </IconButton>
              </Box>
            </Box>
          </FormProviderWithForm>
          {hasError && (
            <Typography color="#ba000d" variant="caption">
              {error?.data?.[type]}
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: "38px",
            borderRadius: "4px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            wordBreak: "break-word",
            "&:hover": {
              border: editable ? "1px solid #1976d299" : "unset",
              borderColor: editable ? theme.palette.primary.main : "unset",
            },
          }}
          onClick={() => setShow(!show)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <Typography
            sx={{
              width: "100%",
            }}
          >
            <Typography
              dangerouslySetInnerHTML={{
                __html: data ?? "",
              }}
              style={{
                display: "-webkit-box",
                // height:"100px",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                // whiteSpace:"nowrap",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                ...theme.typography.titleMedium,
                fontWeight: "400",
                unicodeBidi: "plaintext",
                fontFamily: languageDetector(data)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
              sx={{
                "& > p": {
                  unicodeBidi: "plaintext",
                  textAlign: "initial",
                },
              }}
            ></Typography>
          </Typography>
          {isHovering && (
            <IconButton
              title="Edit"
              edge="end"
              sx={{
                background: theme.palette.primary.main,
                "&:hover": {
                  background: theme.palette.primary.dark,
                },
                borderRadius: "3px",
                height: "36px",
              }}
              onClick={() => setShow(!show)}
            >
              <EditRounded sx={{ color: "#fff" }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ReportTab;

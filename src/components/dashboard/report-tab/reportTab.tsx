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
    { name: "intro", title: "introduction", placeholder: "writeIntroduction" },
    {
      name: "prosAndCons",
      title: "strengthsAndRoomsForImprovement",
      placeholder: "writeStrengthAndRooms",
    },
    {
      name: "steps",
      title: "stepsTakenForThisAssessment",
      placeholder: "writeStepsForAssessment",
    },
    {
      name: "participants",
      title: "assessmentContributors",
      placeholder: "writeAssessmentContributors",
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
                    marginInlineStart: "auto",
                  }}
                ></Grid>
              </Grid>
            </Box>
            {reportFields.map((field) => {
              const { name, title, placeholder } = field;
              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: {xs: "column-reverse", md: "row"}
                  }}
                >
                  <MainCard
                    key={uniqueId()}
                    style={{
                      minHeight: "50px",
                      mt: 2,
                      width: name == "intro" ? {xs: "100%", md: "68%"} : "100%",
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
                      <OnHoverInputReport
                        attributeId={1}
                        data={metadata[name]}
                        infoQuery={fetchReportFields}
                        type="summary"
                        editable={true}
                        placeholder={t(placeholder)}
                        name={name}
                      />
                    </Box>
                  </MainCard>
                  {name == "intro" && (
                    <MainCard
                      style={{
                        minHeight: "180px",
                        mt: 2,
                        width: {xs: "100%", md: "30%"},
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
                        }}
                      >
                        <Button
                          component={Link}
                          to={`/${spaceId}/assessments/${assessmentId}/graphical-report/`}
                          sx={{ display: "flex", gap: 1, width: "100%" }}
                          variant={"contained"}
                          disabled={
                              Object.values(metadata).includes(null) || published == false
                          }
                        >
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            <Trans i18nKey={"viewReportPage"} />
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
                            disabled={Object.values(metadata).includes(null)}
                            sx={{ cursor: "pointer" }}
                          />
                        </Box>

                        {Object.values(metadata).includes(null) && (
                          <Box
                            sx={{
                              background: theme.palette.error.main,
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                ...theme.typography.semiBoldSmall,
                                color: "#FAD1D8",
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
          sx={{ height: "150px", mt: "50px" }}
        />
      ))}
    </>
  );
};

const OnHoverInputReport = (props: any) => {
  const [isHovering, setIsHovering] = useState(false);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const patchUpdateReportFields = useQuery({
    service: (args, config) => service.patchUpdateReportFields(args, config),
    runOnMount: false,
  });

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, editable, type, attributeId, infoQuery, placeholder, name } =
    props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [show, setShow] = useState<boolean>(!!!data);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [isFarsi, setIsFarsi] = useState(languageDetector(data));
  const paragraphRef = useRef<any>(null);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };
  useEffect(() => {
    if (paragraphRef?.current) {
      if (
        paragraphRef?.current?.offsetHeight <
        paragraphRef?.current?.scrollHeight
      ) {
        setShowMore(true);
        setShowBtn(true);
      } else {
        setShowMore(false);
        setShowBtn(false);
      }
    }
  }, []);
  const handleCancel = () => {
    if (data) {
      setShow(false);
    }
    setError({});
    setHasError(false);
  };

  const updateAssessmentKit = async (
    data: any,
    event: any,
    shouldView?: boolean,
  ) => {
    try {
      const reportData = {
        [name]: data?.[name],
      };
      // const res = await infoQuery(attributeId, assessmentId, data.title);
      // if (Object.values(reportData)[0]) {
        const res = await patchUpdateReportFields.query({
          assessmentId,
          reportData,
        });
        infoQuery.query();
        res?.message && toast.success(res?.message);
        setShow(false);
      // }
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

  const toggleBtn = () =>
    showMore ? (
      <Button variant={"text"} onClick={toggleShowMore}>
        <Trans i18nKey={"showMore"} />
      </Button>
    ) : (
      <Button onClick={toggleShowMore}>
        <Trans i18nKey={"showLess"} />
      </Button>
    );

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
                height: "100%",
                position: "relative",
              }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <RichEditorField
                name={name}
                label={""}
                required={false}
                defaultValue={data || ""}
                placeholder={placeholder}
                type={"reportTab"}
                setLangDir={setIsFarsi}
                isFarsi={isFarsi}
              />
              {isHovering && (
                <Box
                  sx={{
                    ...styles.centerCVH,
                    gap: "4px",
                    // height: "100%",
                    position: "absolute",
                    right: isFarsi ? "unset" : 0,
                    left: isFarsi ? 0 : "unset",
                    top: 0,
                    bottom: 0,
                  }}
                >
                  <IconButton
                    // edge="end"
                    sx={{
                      background: theme.palette.primary.main,
                      "&:hover": {
                        background: theme.palette.primary.dark,
                      },
                      borderRadius: isFarsi ? "8px 0 0 0" : "0 8px 0 0",
                      height: "49%",
                    }}
                    onClick={formMethods.handleSubmit(updateAssessmentKit)}
                  >
                    <CheckCircleOutlineRoundedIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    // edge="end"
                    sx={{
                      background: theme.palette.primary.main,
                      "&:hover": {
                        background: theme.palette.primary.dark,
                      },
                      borderRadius: isFarsi ? "0 0 0 8px" : "0 0 8px 0",
                      height: "49%",
                    }}
                    onClick={handleCancel}
                  >
                    <CancelRoundedIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </FormProviderWithForm>
          {hasError && (
            <Typography color="#ba000d" variant="caption">
              {error?.data?.[type]}
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "8px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
              p: 1.5,
              pr: languageDetector(data) ? 1 : 5,
              pl: languageDetector(data) ? 5 : 1,
              border: "1px solid #fff",
              "&:hover": {
                border: editable ? "1px solid #1976d299" : "unset",
                borderColor: editable ? theme.palette.primary.main : "unset",
              },
              position: "relative",
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
                  __html: data,
                }}
                style={{
                  display: "-webkit-box",
                  width: "100%",
                  height: showMore
                    ? "unset"
                    : paragraphRef?.current?.scrollHeight,
                  transition: "all 1s ease-in-out",
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
                ref={paragraphRef}
                className={"tiptap"}
              ></Typography>
            </Typography>
            {isHovering && (
              <IconButton
                title="Edit"
                // edge="end"
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: languageDetector(data)
                    ? "8px 0 0 8px"
                    : "0 8px 8px 0",
                  height: "100%",
                  position: "absolute",
                  right: languageDetector(data) ? "unset" : 0,
                  left: languageDetector(data) ? 0 : "unset",
                  top: 0,
                }}
                onClick={() => setShow(!show)}
              >
                <EditRounded sx={{ color: "#fff" }} />
              </IconButton>
            )}
          </Box>
          {showBtn ? toggleBtn() : null}
        </Box>
      )}
    </Box>
  );
};

export default ReportTab;

import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import CancelRounded from "@mui/icons-material/CancelRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import FormProviderWithForm from "../common/FormProviderWithForm";
import RichEditorField from "../common/fields/RichEditorField";
import { ICustomError } from "@/utils/CustomError";
import { useForm } from "react-hook-form";
import { useServiceContext } from "@/providers/ServiceProvider";
import { format } from "date-fns";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { styles } from "@styles";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { t } from "i18next";
import formatDate from "@utils/formatDate";
import languageDetector from "@/utils/languageDetector";
import { LoadingButton } from "@mui/lab";
import { useQuery } from "@/utils/useQuery";
import toastError from "@/utils/toastError";

export const AssessmentInsight = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [insight, setInsight] = useState<any>(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(true);
  const [isSystemic, setIsSystemic] = useState(true);

  const ApproveAssessmentInsight = useQuery({
    service: (
      args = {
        assessmentId,
      },
      config,
    ) => service.approveAssessmentInsight(args, config),
    runOnMount: false,
  });
  const InitAssessmentInsight = useQuery({
    service: (
      args = {
        assessmentId,
      },
      config,
    ) => service.initAssessmentInsight(args, config),
    runOnMount: false,
  });
  const ApproveInsight = async (event: React.SyntheticEvent) => {
    try {
      event.stopPropagation();
      await ApproveAssessmentInsight.query();
      fetchAssessment();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const fetchAssessment = () => {
    service
      .fetchAssessmentInsight({ assessmentId }, {})
      .then((res) => {
        const data = res.data;
        const selectedInsight = data.assessorInsight || data.defaultInsight;

        if (selectedInsight) {
          setIsSystemic(data.defaultInsight ?? false);
          setInsight(selectedInsight);
          setIsApproved(data.approved);
        }
        setEditable(data.editable ?? false);
      })
      .catch((error) => {
        console.error("Error fetching assessment insight:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId, service]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      textAlign="left"
      height="100%"
      gap={0.5}
      py={2}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        px: { xs: 2, sm: 3.75 },
      }}
    >
      {loading ? (
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
          <Box
            sx={{
              ...styles.centerV,
              width: "100%",
              gap: 1,
              justifyContent: "end",
            }}
          >
            {!isApproved && (
              <LoadingButton
                variant={"contained"}
                onClick={(event) => ApproveInsight(event)}
                loading={ApproveAssessmentInsight.loading}
                size="small"
              >
                <Trans i18nKey={"approve"} />
              </LoadingButton>
            )}
            {editable && (
              <LoadingButton
                onClick={(event) => {
                  event.stopPropagation();
                  InitAssessmentInsight.query().then(() => fetchAssessment());
                }}
                variant={"contained"}
                loading={InitAssessmentInsight.loading}
                size="small"
              >
                <Trans i18nKey={!insight ? "generate" : "regenerate"} />
              </LoadingButton>
            )}
          </Box>
          <OnHoverRichEditor
            data={insight?.insight}
            editable={editable}
            infoQuery={fetchAssessment}
            placeholder={t("writeHere", {
              title: t("insight").toLowerCase(),
            })}
          />
          {insight?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {languageDetector(insight)
                ? formatDate(
                    format(
                      new Date(
                        new Date(insight?.creationTime).getTime() -
                          new Date(insight?.creationTime).getTimezoneOffset() *
                            60000,
                      ),
                      "yyyy/MM/dd HH:mm",
                    ),
                    "Shamsi",
                  ) +
                  " (" +
                  t(convertToRelativeTime(insight?.creationTime)) +
                  ")"
                : format(
                    new Date(
                      new Date(insight?.creationTime).getTime() -
                        new Date(insight?.creationTime).getTimezoneOffset() *
                          60000,
                    ),
                    "yyyy/MM/dd HH:mm",
                  ) +
                  " (" +
                  t(convertToRelativeTime(insight?.creationTime)) +
                  ")"}
            </Typography>
          )}
          {!isApproved && insight && (
            <Box sx={{ ...styles.centerV }} gap={2} my={1}>
              <Box
                sx={{
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  ml: { xs: 0.75, sm: 0.75, md: 1 },
                }}
              >
                <Typography
                  variant="labelSmall"
                  sx={{
                    backgroundColor: "#d85e1e",
                    color: "white",
                    padding: "0.35rem 0.35rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  <Trans i18nKey={!isSystemic ? "outdated" : "note"} />
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  backgroundColor: "rgba(255, 249, 196, 0.31)",
                  padding: 1,
                  borderRadius: 2,
                  maxWidth: "100%",
                }}
              >
                <InfoOutlined
                  color="primary"
                  sx={{
                    marginRight: theme.direction === "ltr" ? 1 : "unset",
                    marginLeft: theme.direction === "rtl" ? 1 : "unset",
                  }}
                />
                <Typography
                  variant="titleMedium"
                  fontWeight={400}
                  textAlign="left"
                >
                  <Trans
                    i18nKey={
                      !isSystemic ? "invalidInsight" : "defaultInsightTemplate"
                    }
                  />
                </Typography>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export const OnHoverRichEditor = (props: any) => {
  const { data, editable, infoQuery } = props;
  const abortController = useRef(new AbortController());
  const [isHovering, setIsHovering] = useState(false);
  const [show, setShow] = useState(false);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });
  const [tempData, setTempData] = useState("");

  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleCancel = () => {
    setShow(false);
  };

  const onSubmit = async (data: any, event: any) => {
    event.preventDefault();
    try {
      await service.updateAssessmentInsight(
        { assessmentId, data: { insight: data.insight } },
        { signal: abortController.current.signal },
      );
      await infoQuery();
      setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  useEffect(() => {
    setTempData(formMethods.getValues().insight);
  }, [formMethods.watch("insight")]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        direction: languageDetector(tempData || data) ? "rtl" : "ltr",
        height: "100%",
        width: "100%",
      }}
    >
      {editable && show ? (
        <FormProviderWithForm
          formMethods={formMethods}
          style={{ height: "100%", width: "100%" }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <RichEditorField
              name="insight"
              label={<Box></Box>}
              disable_label={true}
              required={true}
              defaultValue={data || ""}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                height: tempData === "" ? "80%" : "100%",
              }}
            >
              <IconButton
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: languageDetector(tempData || data)
                    ? "8px 0 0 0"
                    : "0 8px 0 0",
                  height: "49%",
                }}
                onClick={formMethods.handleSubmit(onSubmit)}
              >
                <CheckCircleOutlineRounded sx={{ color: "#fff" }} />
              </IconButton>
              <IconButton
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: languageDetector(tempData || data)
                    ? "0 0 0 8px"
                    : "0 0 8px 0",
                  height: "49%",
                }}
                onClick={handleCancel}
              >
                <CancelRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
          </Box>
        </FormProviderWithForm>
      ) : (
        <Box
          sx={{
            minHeight: "38px",
            borderRadius: "8px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            wordBreak: "break-word",
            pr: languageDetector(tempData || data) ? 1 : 5,
            pl: languageDetector(tempData || data) ? 5 : 1,
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
              textAlign: languageDetector(
                (tempData || data)?.replace(/<[^>]*>/g, ""),
              )
                ? "right"
                : "left",
              fontFamily: languageDetector(tempData || data)
                ? farsiFontFamily
                : primaryFontFamily,
              width: "100%",
            }}
            dangerouslySetInnerHTML={{
              __html:
                data ??
                (editable
                  ? t("writeHere", { title: t("insight").toLowerCase() })
                  : t("unavailable")),
            }}
          />
          {isHovering && editable && (
            <IconButton
              title="Edit"
              sx={{
                background: theme.palette.primary.main,
                "&:hover": {
                  background: theme.palette.primary.dark,
                },
                borderRadius: languageDetector(tempData || data)
                  ? "8px 0 0 8px"
                  : "0 8px 8px 0",
                height: "100%",
                position: "absolute",
                right: languageDetector(tempData || data) ? "unset" : 0,
                left: languageDetector(tempData || data) ? 0 : "unset",
                top: 0,
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

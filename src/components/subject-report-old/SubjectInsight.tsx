import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
import { theme } from "@/config/theme";
import { t } from "i18next";
import languageDetector from "@utils/languageDetector";

interface ISubjectInsight {
  AssessmentLoading: boolean;
  fetchAssessment: () => void;
  editable: boolean;
  insight: any;
}

export const SubjectInsight = (props: ISubjectInsight) => {
  const { AssessmentLoading, fetchAssessment, editable, insight } = props;
  const { service } = useServiceContext();
  const { subjectId = "" } = useParams();

  useEffect(() => {
    fetchAssessment();
  }, [subjectId, service]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      textAlign="left"
      maxHeight="100%"
      gap={0.5}
      ml={3}
    >
      {AssessmentLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : insight ? (
        <>
          <OnHoverRichEditor
            data={insight.insight}
            editable={editable}
            infoQuery={fetchAssessment}
          />
          {insight?.creationTime && (
            <Typography variant="bodyMedium" mx={1}>
              {format(
                new Date(
                  new Date(insight?.creationTime).getTime() -
                    new Date(insight?.creationTime).getTimezoneOffset() * 60000,
                ),
                "yyyy/MM/dd HH:mm",
              ) +
                " (" +
                t(convertToRelativeTime(insight?.creationTime)) +
                ")"}
            </Typography>
          )}
          {editable && !insight?.isValid && (
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
                  <Trans i18nKey={"outdated"} />
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
                  <Trans i18nKey="invalidInsight" />
                </Typography>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body2">
          <Trans i18nKey="noInsightAvailable" />{" "}
        </Typography>
      )}
    </Box>
  );
};

const OnHoverRichEditor = (props: any) => {
  const { data, editable, infoQuery } = props;
  const abortController = useRef(new AbortController());
  const [isHovering, setIsHovering] = useState(false);
  const [show, setShow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<any>({});
  const { assessmentId = "", subjectId } = useParams();
  const { service } = useServiceContext();
  const formMethods = useForm({ shouldUnregister: true });

  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleCancel = () => {
    setShow(false);
    setError({});
    setHasError(false);
  };

  const onSubmit = async (data: any, event: any) => {
    event.preventDefault();
    try {
      await service.updateSubjectInsight(
        { assessmentId, data: { insight: data.insight }, subjectId },
        { signal: abortController.current.signal },
      );
      await infoQuery();
      setShow(false);
    } catch (e) {
      const err = e as ICustomError;
      setError(err);
      setHasError(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100%",
      }}
    >
      {editable && show ? (
        <FormProviderWithForm
          formMethods={formMethods}
          style={{ height: "100%" }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              direction: languageDetector(data) ? "rtl" : "ltr",
              textAlign: languageDetector(data) ? "right" : "left",
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
                alignItems: "center",
                height: "100%",
              }}
            >
              <IconButton
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                  borderRadius: languageDetector(data)
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
                  borderRadius: languageDetector(data)
                    ? "0 0 0 8px"
                    : "0 0 8px 0",
                  height: "49%",
                }}
                onClick={handleCancel}
              >
                <CancelRounded sx={{ color: "#fff" }} />
              </IconButton>
            </Box>
            {hasError && (
              <Typography color="#ba000d" variant="caption">
                {error?.data?.about}
              </Typography>
            )}
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
          <Typography dangerouslySetInnerHTML={{ __html: data }} />
          {isHovering && editable && (
            <IconButton
              title="Edit"
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
      )}
    </Box>
  );
};

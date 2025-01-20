import { styles } from "@styles";
import Box from "@mui/material/Box";
import MainCard from "@utils/MainCard";
import {Button, Snackbar, Typography} from "@mui/material";
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

const ReportTab = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const copyLink = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setSnackbarOpen(true);
      });
    };
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mt: "40px",
        }}
      >
        <Box></Box>
        <Box sx={{ ...styles.centerVH, gap: 1 }}>
          <Button
            onClick={copyLink}
            sx={{ display: "flex", gap: 1 }}
            variant={"outlined"}
          >
            <Trans i18nKey={"copy report link"} />
            <InsertLinkIcon fontSize={"small"} />
          </Button>
          <Button sx={{ display: "flex", gap: 1 }} variant={"contained"}>
            <Trans i18nKey={"view report"} />
            <AssignmentOutlinedIcon fontSize={"small"} />
          </Button>
        </Box>
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
            gap: 1,
            mb: 3,
          }}
        >
          <Trans i18nKey={"introduction"} />
          <InfoOutlinedIcon />
        </Typography>
        <Box>
          <OnHoverInputReport
            attributeId={1}
            // formMethods={formMethods}
            data={"This is state of the evaand high sonabsuch as enhanci"}
            // infoQuery={updateAttributeAndData}
            type="summary"
            editable={true}
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
                gap: 1,
                mb: 3,
              }}
            >
              <Trans i18nKey={"strengthsAndRoomsForImprovement"} />
              <InfoOutlinedIcon />
            </Typography>
            <OnHoverInputReport
              attributeId={1}
              // formMethods={formMethods}
              data={"2"}
              // infoQuery={updateAttributeAndData}
              type="summary"
              editable={true}
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
            gap: 1,
            mb: 3,
          }}
        >
          <Trans i18nKey={"stepsTakenForThisAssessment"} />
          <InfoOutlinedIcon />
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
            data={"3"}
            // infoQuery={updateAttributeAndData}
            type="summary"
            editable={true}
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
            gap: 1,
            mb: 3,
          }}
        >
          <Trans i18nKey={"assessmentContributors"} />
          <InfoOutlinedIcon />
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
            data={"4"}
            // infoQuery={updateAttributeAndData}
            type="summary"
            editable={true}
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
};

const OnHoverInputReport = (props: any) => {
  const [show, setShow] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    editable && setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { data, editable, type, attributeId, infoQuery } = props;
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
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
      const res = await infoQuery(attributeId, assessmentId, data.title);
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

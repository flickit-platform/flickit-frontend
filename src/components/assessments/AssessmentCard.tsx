import React, { useEffect, useMemo, useRef, useState } from "react";
import { Gauge } from "@common/charts/Gauge";
import LoadingGauge from "@common/charts/LoadingGauge";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import useMenu from "@utils/useMenu";
import { useServiceContext } from "@providers/ServiceProvider";
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import formatDate from "@utils/formatDate";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import MoreActions from "@common/MoreActions";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IAssessment, TId, IQuestionnairesModel, TQueryFunction } from "@types";
import { TDialogProps } from "@utils/useDialog";
import Button from "@mui/material/Button";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import QueryStatsRounded from "@mui/icons-material/QueryStatsRounded";
import hasStatus from "@utils/hasStatus";
import hasMaturityLevel from "@utils/hasMaturityLevel";
import { toast } from "react-toastify";
import { t } from "i18next";
import CompareRoundedIcon from "@mui/icons-material/CompareRounded";
import { useQuery } from "@utils/useQuery";

interface IAssessmentCardProps {
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  deleteAssessment: TQueryFunction<any, TId>;
}
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import languageDetector from "@/utils/languageDetector";
import Assessment from "@mui/icons-material/Assessment";

const AssessmentCard = (props: IAssessmentCardProps) => {
  const [calculateResault, setCalculateResault] = useState<any>();
  const [calculatePercentage, setCalculatePercentage] = useState<any>();
  const [show, setShow] = useState<boolean>();
  const { item } = props;
  const abortController = useRef(new AbortController());
  const { spaceId } = useParams();

  const {
    maturityLevel,
    isCalculateValid,
    kit,
    id,
    lastModificationTime,
    confidenceValue,
  } = item;
  const hasML = hasMaturityLevel(maturityLevel?.value);
  const { maturityLevelsCount } = kit;
  const location = useLocation();
  const { service } = useServiceContext();
  const calculateMaturityLevelQuery = useQuery({
    service: (args, config) =>
      service.calculateMaturityLevel(args ?? { assessmentId: id }, config),
    runOnMount: false,
  });

  const fetchAssessments = async () => {
    try {
      setShow(isCalculateValid);
      if (!isCalculateValid) {
        const data = await calculateMaturityLevelQuery.query().catch(() => {
          setShow(true);
        });
        setCalculateResault(data);
        if (data?.id) {
          setShow(true);
        }
      }
    } catch (e) {}
  };
  const assessmentTotalProgress = useQuery<IQuestionnairesModel>({
    service: (args, config) =>
      service.fetchAssessmentTotalProgress(
        { assessmentId: id, ...(args || {}) },
        config,
      ),
  });
  useEffect(() => {
    fetchAssessments();
    (async () => {
      const { answersCount, questionsCount } =
        await assessmentTotalProgress.query();
      const calc = (answersCount / questionsCount) * 100;
      setCalculatePercentage(calc.toFixed(2));
    })();
  }, [isCalculateValid]);

  const canViewReport = useMemo(() => {
    return (
      item.permissions.canViewReport &&
      !item.permissions.canViewQuestionnaires &&
      !item.permissions.canViewDashboard
    );
  }, [item.permissions]);

  return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Paper
        sx={{
          position: "relative",
          pt: 3,
          pb: 3,
          px: 2,
          borderRadius: "12px",
          ...styles.centerCH,
          minHeight: "300px",
          height: "100%",
          justifyContent: "space-between",
          ":hover": {
            boxShadow: 9,
          },
        }}
        elevation={4}
        data-cy="assessment-card"
      >
        {item.permissions.canManageSettings && (
          <Actions {...props} abortController={abortController} />
        )}
        <Grid container sx={{ textDecoration: "none", height: "100%" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
              component={Link}
              to={
                isCalculateValid && item.permissions.canViewDashboard
                  ? `${item.id}/dashboard`
                  : item.permissions.canViewReport && item.hasReport
                    ? `/${spaceId}/assessments/${item.id}/graphical-report/`
                    : item.permissions.canViewQuestionnaires
                      ? `${item.id}/questionnaires`
                      : ""
              }
            >
              <Tooltip title={kit?.title}>
                <Chip
                  label={kit?.title}
                  size="small"
                  sx={{
                    maxWidth: "70%",
                    width: "fit-content",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    border: `0.5px solid #2466A8`,
                    textTransform: "none",
                    color: "#101c32",
                    background: "transparent",
                    fontFamily: languageDetector(kit?.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                  data-cy="assessment-card-title"
                />
              </Tooltip>
              <Typography
                variant="h5"
                color="CaptionText"
                textTransform={"uppercase"}
                sx={{
                  padding: "8px 28px",
                  fontWeight: "bold",
                  pb: 0,
                  textAlign: "center",
                  color: item.color?.code || "#101c32",
                  maxWidth: "320px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: "0 auto",
                  width: "100%",
                  fontFamily: languageDetector(item?.title)
                    ? farsiFontFamily
                    : primaryFontFamily,
                }}
                data-cy="assessment-card-title"
              >
                {item.title}
              </Typography>
              <Typography
                variant="subMedium"
                color="GrayText"
                sx={{ padding: "1px 4px", textAlign: "center" }}
              >
                <Trans i18nKey="lastUpdated" />{" "}
                {theme.direction == "rtl"
                  ? formatDate(lastModificationTime, "Shamsi")
                  : formatDate(lastModificationTime, "Miladi")}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ ...styles.centerCH, textDecoration: "none" }}
            mt={2}
            component={Link}
            to={
              hasML && item.permissions.canViewDashboard
                ? `${item.id}/dashboard`
                : item.permissions.canViewQuestionnaires
                  ? `${item.id}/questionnaires`
                  : item.hasReport && item.permissions.canViewReport
                    ? `/${spaceId}/assessments/${item.id}/graphical-report/`
                    : ""
            }
          >
            {show ? (
              <Gauge
                maturity_level_number={maturityLevelsCount}
                level_value={
                  calculateResault?.index
                    ? calculateResault?.index
                    : maturityLevel?.index
                }
                maturity_level_status={
                  calculateResault?.title
                    ? calculateResault?.title
                    : maturityLevel?.title
                }
                maxWidth="275px"
                mt="auto"
              />
            ) : (
              <LoadingGauge />
            )}
          </Grid>
          {item.permissions.canViewReport && (
            <Grid item xs={12} mt="-4rem">
              <Typography
                variant="titleSmall"
                color="#243342"
                justifyContent="center"
                alignItems="center"
                display="flex"
                gap="0.125rem"
              >
                <Trans i18nKey="withConfidence" />:
                <ConfidenceLevel
                  displayNumber
                  inputNumber={Math.ceil(confidenceValue)}
                  variant="titleMedium"
                ></ConfidenceLevel>
              </Typography>
            </Grid>
          )}
          {(item.permissions.canViewQuestionnaires ||
            (item.permissions.canViewReport && item.hasReport)) && (
            <Grid item xs={12} mt={1} sx={{ ...styles.centerCH }}>
              <Button
                startIcon={
                  item.permissions.canViewReport || item.hasReport ? (
                    <Assessment />
                  ) : (
                    <QuizRoundedIcon />
                  )
                }
                fullWidth
                onClick={(
                  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
                ) => {
                  e.stopPropagation();
                }}
                component={Link}
                sx={{ position: "relative", zIndex: 1 }}
                state={location}
                to={
                  item.permissions.canViewReport && item.hasReport
                    ? `/${spaceId}/assessments/${item.id}/graphical-report/`
                    : item.permissions.canViewQuestionnaires
                      ? `${item.id}/questionnaires`
                      : ""
                }
                data-cy="questionnaires-btn"
                variant={
                  !item.permissions.canViewReport || !item.hasReport
                    ? "outlined"
                    : "contained"
                }
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    background: "rgba(102, 128, 153, 0.3)",
                    zIndex: -1,
                    width:
                      !(item.permissions.canViewReport && item.hasReport) &&
                      calculatePercentage
                        ? `${calculatePercentage}%`
                        : "0%",
                    transition: "all 1s ease-in-out",
                  }}
                ></Box>
                <Trans
                  i18nKey={
                    item.permissions.canViewReport && item.hasReport
                      ? "reportTitle"
                      : "questionnaires"
                  }
                />
              </Button>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sx={{
              ...styles.centerCH,
              display:
                item.permissions.canViewDashboard ||
                (item.permissions.canViewQuestionnaires &&
                  item.permissions.canViewReport &&
                  item.hasReport)
                  ? "block"
                  : "none",
            }}
            mt={1}
          >
            <Button
              startIcon={
                item.permissions.canViewQuestionnaires ? (
                  <QuizRoundedIcon />
                ) : (
                  <QueryStatsRounded />
                )
              }
              variant={"contained"}
              fullWidth
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.stopPropagation();
                if (!hasML) {
                  e.preventDefault();
                  toast.warn(t("inOrderToViewSomeInsight") as string);
                }
              }}
              component={Link}
              to={
                hasML && item.permissions.canViewDashboard
                  ? `${item.id}/dashboard`
                  : item.permissions.canViewQuestionnaires
                    ? `${item.id}/questionnaires`
                    : canViewReport
                      ? `/${spaceId}/assessments/${item.id}/graphical-report/`
                      : ""
              }
              sx={{
                backgroundColor: "#2e7d72",
                background:
                  item.permissions.canViewDashboard ||
                  canViewReport ||
                  item.permissions.canViewQuestionnaires
                    ? `#01221e`
                    : "rgba(0,59,100, 12%)",
                color:
                  !item.permissions.canViewDashboard &&
                  !canViewReport &&
                  !item.permissions.canViewQuestionnaires
                    ? "rgba(10,35,66, 38%)"
                    : "",
                boxShadow:
                  !item.permissions.canViewDashboard &&
                  !canViewReport &&
                  !item.permissions.canViewQuestionnaires
                    ? "none"
                    : "",
                "&:hover": {
                  background:
                    item.permissions.canViewDashboard ||
                    canViewReport ||
                    item.permissions.canViewQuestionnaires
                      ? ``
                      : "rgba(0,59,100, 12%)",
                  boxShadow:
                    !item.permissions.canViewDashboard &&
                    !canViewReport &&
                    !item.permissions.canViewQuestionnaires
                      ? "none"
                      : "",
                },
              }}
              data-cy="view-insights-btn"
            >
              <Trans
                i18nKey={
                  item.permissions.canViewDashboard
                    ? "dashboard"
                    : "questionnaire"
                }
              />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

const Actions = (props: {
  deleteAssessment: TQueryFunction<any, TId>;
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  abortController: React.MutableRefObject<AbortController>;
}) => {
  const { deleteAssessment, item } = props;
  const navigate = useNavigate();
  const deleteItem = async (e: any) => {
    try {
      await deleteAssessment(item.id);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const addToCompare = (e: any) => {
    navigate({
      pathname: "/compare",
      search: createSearchParams({
        assessmentIds: item.id as string,
      }).toString(),
    });
  };

  const assessmentSetting = (e: any) => {
    navigate(`${item.id}/settings/`, {
      state: item?.color || { code: "#073B4C", id: 6 },
    });
  };

  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}
      items={
        hasStatus(item.status)
          ? [
              {
                icon: <CompareRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="addToCompare" />,
                onClick: addToCompare,
              },
              {
                icon: <DeleteRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="delete" />,
                onClick: deleteItem,
                menuItemProps: { "data-cy": "delete-action-btn" },
              },
            ]
          : [
              {
                icon: <SettingsIcon fontSize="small" />,
                text: <Trans i18nKey="settings" />,
                onClick: assessmentSetting,
              },
              {
                icon: <DeleteRoundedIcon fontSize="small" />,
                text: <Trans i18nKey="delete" />,
                onClick: deleteItem,
                menuItemProps: { "data-cy": "delete-action-btn" },
              },
            ]
      }
    />
  );
};
export default AssessmentCard;

import { useEffect, useMemo, useRef, useState } from "react";
import { Gauge } from "@common/charts/Gauge";
import LoadingGauge from "@common/charts/LoadingGauge";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import useMenu from "@/hooks/useMenu";
import { useServiceContext } from "@/providers/service-provider";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { ICustomError } from "@/utils/custom-error";
import toastError from "@/utils/toast-error";
import MoreActions from "@common/MoreActions";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  IAssessment,
  TId,
  IQuestionnairesModel,
  TQueryFunction,
} from "@/types/index";
import useDialog, { TDialogProps } from "@/hooks/useDialog";
import Button from "@mui/material/Button";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import QueryStatsRounded from "@mui/icons-material/QueryStatsRounded";
import hasStatus from "@/utils/has-status";
import hasMaturityLevel from "@/utils/has-maturity-level";
import { useQuery } from "@/hooks/useQuery";
import Star from "@/assets/svg/star.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import CompletionRing from "@/components/common/charts/completion-ring/CompletionRing";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import languageDetector from "@/utils/language-detector";
import Assessment from "@mui/icons-material/Assessment";
import { getReadableDate } from "@/utils/readable-date";
import { Divider } from "@mui/material";
import { ASSESSMENT_MODE } from "@/utils/enum-type";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import MoveAssessmentDialog from "./MoveAssessmentDialog";
import { useAssessmentCreation } from "@/hooks/useAssessmentCreation";
import keycloakService from "@/service/keycloakService";
import { useAuthContext } from "@/providers/auth-provider";

interface IAssessmentCardProps {
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  deleteAssessment: TQueryFunction<any, TId>;
  fetchAssessments: any;
}

const AssessmentCard = ({
  item,
  dialogProps,
  deleteAssessment,
  fetchAssessments,
}: IAssessmentCardProps) => {
  const [show, setShow] = useState<boolean>();
  const [gaugeResult, setGaugeResult] = useState<any>();
  const [progressPercent, setProgressPercent] = useState<string | undefined>();
  const abortController = useRef(new AbortController());
  const { spaceId } = useParams();
  const {
    userInfo: { defaultSpaceId },
  } = useAuthContext();
  const { service } = useServiceContext();
  const location = useLocation();

  const {
    maturityLevel,
    isCalculateValid,
    kit,
    id,
    lastModificationTime,
    confidenceValue,
    language,
    mode,
    permissions,
    hasReport,
    color,
    title,
  } = item;

  const calculateMaturityLevelQuery = useQuery({
    service: (args, config) =>
      service.assessments.info.calculateMaturity(
        { assessmentId: id, ...(args ?? {}) },
        config,
      ),
    runOnMount: false,
  });

  const assessmentTotalProgress = useQuery<IQuestionnairesModel>({
    service: (args, config) =>
      service.assessments.info.getProgress(
        { assessmentId: id, ...(args ?? {}) },
        config,
      ),
    runOnMount: false,
  });

  useEffect(() => {
    const fetchGaugeAndProgress = async () => {
      setShow(isCalculateValid);
      if (!isCalculateValid) {
        try {
          const data = await calculateMaturityLevelQuery.query();
          setGaugeResult(data);
          if (data?.id) setShow(true);
        } catch {
          setShow(true);
        }
      }
        const result = await assessmentTotalProgress?.query();

        const answersCount = result?.answersCount ?? 0;
        const questionsCount = result?.questionsCount ?? 0;
      if (questionsCount) {
        setProgressPercent(((answersCount / questionsCount) * 100).toFixed(2));
      }
    };
    fetchGaugeAndProgress();
    // eslint-disable-next-line
  }, [isCalculateValid]);

  const hasML = useMemo(
    () => hasMaturityLevel(maturityLevel?.value),
    [maturityLevel?.value],
  );
  const isQuickMode = useMemo(
    () => mode?.code === ASSESSMENT_MODE.QUICK,
    [mode?.code],
  );

  const pathRoute = (checkItem: boolean): string => {
    if (permissions.canViewReport && hasReport && isQuickMode) {
      return `/${spaceId ?? defaultSpaceId}/assessments/${id}/graphical-report/`;
    }
    if (checkItem && permissions.canViewDashboard) {
      return isQuickMode
        ? `/${spaceId ?? defaultSpaceId}/assessments/1/${id}/questionnaires`
        : `/${spaceId ?? defaultSpaceId}/assessments/1/${id}/dashboard`;
    }
    if (permissions.canViewReport && hasReport) {
      return `/${spaceId ?? defaultSpaceId}/assessments/${id}/graphical-report/`;
    }
    if (permissions.canViewQuestionnaires && isQuickMode) {
      return `/${spaceId ?? defaultSpaceId}/assessments/1/${id}/questionnaires`;
    }
    return "";
  };

  const showReport = permissions.canViewReport && hasReport;
  const showDashboard = permissions.canViewDashboard;
  const showQuestionnaires = permissions.canViewQuestionnaires;

  const buttonTypes: Array<"report" | "questionnaires" | "dashboard"> = [];
  if (showReport) buttonTypes.push("report");
  if (showQuestionnaires && !(!isQuickMode && showReport && showDashboard))
    buttonTypes.push("questionnaires");
  if (showDashboard && !isQuickMode) buttonTypes.push("dashboard");

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
          ":hover": { boxShadow: 9 },
        }}
        data-cy="assessment-card"
        data-testid={"assessment-card"}
      >
        {permissions.canManageSettings && (
          <Actions
            deleteAssessment={deleteAssessment}
            item={item}
            dialogProps={dialogProps}
            abortController={abortController}
            fetchAssessments={fetchAssessments}
            spaceId={spaceId ?? defaultSpaceId}
          />
        )}

        <Grid container sx={{ textDecoration: "none", height: "100%" }}>
          {/* Header */}
          <Grid item xs={12}>
            <Header
              kit={kit}
              itemTitle={title}
              color={color}
              language={language}
              lastModificationTime={lastModificationTime}
              isQuickMode={isQuickMode}
              spaceId={spaceId}
              id={id}
              pathRoute={pathRoute}
              isCalculateValid={isCalculateValid}
            />
          </Grid>
          {/* Gauge */}
          <Grid
            item
            xs={12}
            sx={{
              ...styles.centerCH,
              textDecoration: "none",
            }}
            component={Link}
            mt={2}
            to={pathRoute(hasML)}
          >
            {show ? (
              <>
                <Gauge
                  maturity_level_number={kit.maturityLevelsCount}
                  level_value={gaugeResult?.index ?? maturityLevel?.index}
                  maturity_level_status={
                    gaugeResult?.title ?? maturityLevel?.title
                  }
                  status_font_variant="headlineSmall"
                  maxWidth="200px"
                  height={permissions.canViewReport ? "130px" : "unset"}
                />
                {permissions.canViewReport && !isQuickMode && (
                  <Typography
                    sx={{ ...styles.centerVH }}
                    variant="bodySmall"
                    color="background.onVariant"
                    gap="0.125rem"
                  >
                    <Trans i18nKey="common.confidence" />:
                    <CompletionRing
                      displayNumber
                      inputNumber={Math.ceil(confidenceValue)}
                      variant="titleSmall"
                    />
                  </Typography>
                )}
              </>
            ) : (
              <LoadingGauge />
            )}
          </Grid>
          {/* Confidence */}

          {/* Buttons Section */}
          {buttonTypes.length > 0 && (
            <Grid
              item
              xs={12}
              mt={2}
              sx={{
                ...styles.centerCH,
                gap: 1,
                flexDirection: "column",
              }}
            >
              {buttonTypes.map((type) => (
                <CardButton
                  key={type}
                  item={item}
                  progressPercent={progressPercent}
                  location={location}
                  language={language}
                  spaceId={spaceId ?? defaultSpaceId}
                  type={type}
                />
              ))}
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default AssessmentCard;

// --- Components breakdown ---

const Header = ({
  kit,
  itemTitle,
  color,
  language,
  lastModificationTime,
  isQuickMode,
  spaceId,
  id,
  pathRoute,
  isCalculateValid,
}: any) => (
  <Box
    sx={{
      ...styles.centerCVH,
      textDecoration: "none",
    }}
    component={Link}
    to={pathRoute(isCalculateValid)}
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
          ...styles.rtlStyle(languageDetector(kit?.title)),
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
        color: color?.code ?? "#101c32",
        maxWidth: "320px",
        margin: "0 auto",
        width: "100%",
        fontFamily: languageDetector(itemTitle)
          ? farsiFontFamily
          : primaryFontFamily,
        direction: languageDetector(itemTitle) ? "rtl" : "ltr",
        ...styles.centerVH,
        gap: "10px",
      }}
      data-cy="assessment-card-title"
    >
      {!isQuickMode && (
        <Box sx={{ flexShrink: 0, ...styles.centerVH }}>
          <img alt="star" src={Star} height={24} />
        </Box>
      )}
      <Box
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flexShrink: 1,
          direction: languageDetector(itemTitle) ? "rtl" : "ltr",
        }}
      >
        {itemTitle}
      </Box>
    </Typography>

    <Box sx={{ ...styles.centerVH }}>
      <Box
        sx={{
          ...styles.centerVH,
          backgroundColor: "#F9FAFB",
          borderRadius: "4px",
          border: "0.5px solid #C7CCD1",
          p: 0.5,
        }}
      >
        <Typography variant="labelSmall" color="info.main">
          {language.code}
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
      <Typography
        variant="labelSmall"
        sx={{ textAlign: "center" }}
        color="info.main"
      >
        <Trans i18nKey="common.lastUpdated" />{" "}
        {getReadableDate(lastModificationTime)}
      </Typography>
    </Box>
  </Box>
);

const CardButton = ({
  item,
  progressPercent,
  location,
  spaceId,
  language,
  type, // 'report' | 'questionnaires' | 'dashboard'
}: any) => {
  let to = "";
  let icon = null;
  let key = "";
  let label = "";

  if (type === "report") {
    to = `/${spaceId}/assessments/${item.id}/graphical-report/`;
    icon = <Assessment />;
    key = "reportTitle";
    label = "assessmentReport.reportTitle";
  } else if (type === "questionnaires") {
    to = `/${spaceId}/assessments/1/${item.id}/questionnaires`;
    icon = <QuizRoundedIcon />;
    key = "questionnaires";
    label = "common.questionnaires";
  } else if (type === "dashboard") {
    to = `/${spaceId}/assessments/1/${item.id}/dashboard`;
    icon = <QueryStatsRounded />;
    key = "dashboard";
    label = "dashboard.dashboard";
  }

  if (!type) {
    if (item.permissions.canViewReport && item.hasReport) {
      to = `/${spaceId}/assessments/${item.id}/graphical-report/`;
      icon = <Assessment />;
      key = "reportTitle";
      label = "assessmentReport.reportTitle";
    } else if (item.permissions.canViewQuestionnaires) {
      to = `/${spaceId}/assessments/1/${item.id}/questionnaires`;
      icon = <QuizRoundedIcon />;
      key = "questionnaires";
      label = "common.questionnaires";
    } else if (item.permissions.canViewDashboard) {
      to = `/${spaceId}/assessments/1/${item.id}/dashboard`;
      icon = <QueryStatsRounded />;
      key = "dashboard";
      label = "dashboard.dashboard";
    }
  }

  return (
    <Button
      startIcon={icon}
      fullWidth
      onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.stopPropagation();
      }}
      component={Link}
      sx={{
        position: "relative",
        zIndex: 1,
        ...(key === "dashboard" && {
          background: "#01221e",
          color: "#fff",
          "&:hover": {
            background: "#01221ecc",
          },
        }),
      }}
      state={{ location, language }}
      to={to}
      data-cy="assessment-card-btn"
      variant={
        key === "reportTitle" || key === "dashboard" ? "contained" : "outlined"
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
            key === "questionnaires" && progressPercent
              ? `${progressPercent}%`
              : "0%",
          transition: "all 1s ease-in-out",
        }}
      />
      <Trans i18nKey={label} />
    </Button>
  );
};

// --- Actions ---
const Actions = ({
  deleteAssessment,
  item,
  abortController,
  fetchAssessments,
  spaceId,
}: {
  deleteAssessment: TQueryFunction<any, TId>;
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  abortController: React.MutableRefObject<AbortController>;
  fetchAssessments: any;
  spaceId: any;
}) => {
  const { service } = useServiceContext();

  const navigate = useNavigate();
  const moveAssessmentDialogProps = useDialog();
  const { createOrOpenDialog } = useAssessmentCreation({
    openDialog: moveAssessmentDialogProps.openDialog,
    getSpacesArrayFetcher: async (args, config) =>
      service.assessments.info.getTargetSpaces(args, config),
    getSpacesAccessor: "items",
  });

  const deleteItem = async () => {
    try {
      await deleteAssessment(item.id);
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  const goToAssessmentSettings = () => {
    const targetPath = `/${spaceId}/assessments/1/${item.id}/settings/`;

    navigate(targetPath, {
      state: item?.color ?? { code: "#073B4C", id: 6 },
    });
  };

  const handleMoveToAssessment = (e: any, id: any, title: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (keycloakService.isLoggedIn()) {
      createOrOpenDialog({
        id,
        title,
        languages: [],
        setLoading: undefined,
        queryDataSpacesArgs: { assessmentId: item.id },
      });
    } else {
      window.location.hash = `#createAssessment?id=${id}`;
      keycloakService.doLogin();
    }
  };

  const actions = hasStatus(item.status)
    ? [
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: deleteItem,
          menuItemProps: { "data-cy": "delete-action-btn" },
        },
      ]
    : [
        {
          icon: <DriveFileMoveOutlinedIcon fontSize="small" />,
          text: <Trans i18nKey="assessment.move" />,
          onClick: handleMoveToAssessment,
        },
        {
          icon: <SettingsIcon fontSize="small" />,
          text: <Trans i18nKey="common.settings" />,
          onClick: goToAssessmentSettings,
        },
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: deleteItem,
          menuItemProps: { "data-cy": "delete-action-btn" },
        },
      ];

  return (
    <>
      <MoreActions
        {...useMenu()}
        boxProps={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 2,
        }}
        items={actions}
      />
      <MoveAssessmentDialog
        {...moveAssessmentDialogProps}
        assessmentId={item.id}
        onSubmitForm={fetchAssessments}
      />
    </>
  );
};

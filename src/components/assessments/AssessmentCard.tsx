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
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
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
import { TDialogProps } from "@utils/useDialog";
import Button from "@mui/material/Button";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import QueryStatsRounded from "@mui/icons-material/QueryStatsRounded";
import hasStatus from "@utils/hasStatus";
import hasMaturityLevel from "@utils/hasMaturityLevel";
import CompareRoundedIcon from "@mui/icons-material/CompareRounded";
import { useQuery } from "@utils/useQuery";
import Star from "@/assets/svg/star.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import { farsiFontFamily, primaryFontFamily } from "@config/theme";
import languageDetector from "@/utils/languageDetector";
import Assessment from "@mui/icons-material/Assessment";
import { getReadableDate } from "@utils/readableDate";
import { Divider } from "@mui/material";
import { ASSESSMENT_MODE } from "@utils/enumType";

interface IAssessmentCardProps {
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  deleteAssessment: TQueryFunction<any, TId>;
}

const AssessmentCard = ({
  item,
  dialogProps,
  deleteAssessment,
}: IAssessmentCardProps) => {
  const [show, setShow] = useState<boolean>();
  const [gaugeResult, setGaugeResult] = useState<any>();
  const [progressPercent, setProgressPercent] = useState<string | undefined>();
  const abortController = useRef(new AbortController());
  const { spaceId } = useParams();
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
      const { answersCount, questionsCount } =
        await assessmentTotalProgress.query();
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
      return `/${spaceId}/assessments/${id}/graphical-report/`;
    }
    if (checkItem && permissions.canViewDashboard) {
      return isQuickMode ? `${id}/questionnaires` : `${id}/dashboard`;
    }
    if (permissions.canViewReport && hasReport) {
      return `/${spaceId}/assessments/${id}/graphical-report/`;
    }
    if (permissions.canViewQuestionnaires && isQuickMode) {
      return `${id}/questionnaires`;
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
        elevation={4}
        data-cy="assessment-card"
      >
        {permissions.canManageSettings && (
          <Actions
            deleteAssessment={deleteAssessment}
            item={item}
            dialogProps={dialogProps}
            abortController={abortController}
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
            sx={{ ...styles.centerCH, textDecoration: "none" }}
            mt={2}
            component={Link}
            to={pathRoute(hasML)}
          >
            {show ? (
              <Gauge
                maturity_level_number={kit.maturityLevelsCount}
                level_value={gaugeResult?.index ?? maturityLevel?.index}
                maturity_level_status={
                  gaugeResult?.title ?? maturityLevel?.title
                }
                maxWidth="275px"
                mt="auto"
              />
            ) : (
              <LoadingGauge />
            )}
          </Grid>
          {/* Confidence */}
          {permissions.canViewReport && (
            <Grid item xs={12} mt="-4rem">
              <Typography
                variant="titleSmall"
                color="#243342"
                justifyContent="center"
                alignItems="center"
                display="flex"
                gap="0.125rem"
              >
                <Trans i18nKey="common.withConfidence" />:
                <ConfidenceLevel
                  displayNumber
                  inputNumber={Math.ceil(confidenceValue)}
                  variant="titleMedium"
                />
              </Typography>
            </Grid>
          )}
          {/* Buttons Section */}
          {buttonTypes.length > 0 && (
            <Grid
              item
              xs={12}
              mt={1}
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
                  spaceId={spaceId}
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
      textDecoration: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
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
        color: color?.code ?? "#101c32",
        maxWidth: "320px",
        margin: "0 auto",
        width: "100%",
        fontFamily: languageDetector(itemTitle)
          ? farsiFontFamily
          : primaryFontFamily,
        ...styles.centerVH,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
      data-cy="assessment-card-title"
    >
      {!isQuickMode && (
        <Box sx={{ flexShrink: 0 }}>
          <img alt="star" src={Star} height={24} />
        </Box>
      )}
      <Box
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flexShrink: 1,
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
          pb: 0,
        }}
      >
        <Typography variant="labelSmall" color="#6C8093">
          {language.code}
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
      <Typography
        variant="labelSmall"
        sx={{ textAlign: "center" }}
        color="#6C8093"
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
    to = `${item.id}/questionnaires`;
    icon = <QuizRoundedIcon />;
    key = "questionnaires";
    label = "common.questionnaires";
  } else if (type === "dashboard") {
    to = `${item.id}/dashboard`;
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
      to = `${item.id}/questionnaires`;
      icon = <QuizRoundedIcon />;
      key = "questionnaires";
      label = "common.questionnaires";
    } else if (item.permissions.canViewDashboard) {
      to = `${item.id}/dashboard`;
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
      state={location}
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
}: {
  deleteAssessment: TQueryFunction<any, TId>;
  item: IAssessment & { space: any };
  dialogProps: TDialogProps;
  abortController: React.MutableRefObject<AbortController>;
}) => {
  const navigate = useNavigate();

  const deleteItem = async () => {
    try {
      await deleteAssessment(item.id);
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  const addToCompare = () => {
    navigate({
      pathname: "/compare",
      search: createSearchParams({
        assessmentIds: item.id as string,
      }).toString(),
    });
  };

  const assessmentSetting = () => {
    navigate(`${item.id}/settings/`, {
      state: item?.color ?? { code: "#073B4C", id: 6 },
    });
  };

  const actions = hasStatus(item.status)
    ? [
        {
          icon: <CompareRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="addToCompare" />,
          onClick: addToCompare,
        },
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: deleteItem,
          menuItemProps: { "data-cy": "delete-action-btn" },
        },
      ]
    : [
        {
          icon: <SettingsIcon fontSize="small" />,
          text: <Trans i18nKey="common.settings" />,
          onClick: assessmentSetting,
        },
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: deleteItem,
          menuItemProps: { "data-cy": "delete-action-btn" },
        },
      ];

  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}
      items={actions}
    />
  );
};

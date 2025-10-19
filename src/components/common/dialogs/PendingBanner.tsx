import { useEffect, useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/assessment-provider";
import { useNavigate } from "react-router-dom";
import { styles } from "@styles";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { useTheme } from "@mui/material";
import { Text } from "../Text";

const SIZE = 40;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PendingBanner: React.FC<{ seconds?: number }> = ({ seconds = 10 }) => {
  const { pendingKitData, pendingReportData, dispatch } = useAssessmentContext();
  const [data, setData] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [counter, setCounter] = useState(seconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const check = () => {
      if (pendingKitData?.display || pendingReportData?.display) {
        setData(pendingKitData || pendingReportData);
        setShow(true);
        setCounter(seconds);
      } else {
        setShow(false);
      }
    };
    check();
  }, [pendingKitData,pendingReportData, seconds]);

  useEffect(() => {
    if (!show || !data) return;
    if (counter <= 0) {
      handleCancel();
      return;
    }
    timerRef.current = setTimeout(() => setCounter((c) => c - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, data, counter]);

  const clearAll = useCallback(() => {
    dispatch(assessmentActions.setPendingKit({}));
    dispatch(assessmentActions.setPendingShareReport({}));
    setShow(false);
    setData(null);
    setCounter(seconds);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [dispatch, seconds]);

  const handleCancel = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const handleContinue = useCallback(() => {
    if (data?.id) {
      navigate(`/assessment-kits#createAssessment?id=${data.id}`);
    } else if (data?.spaceId) {
      navigate(`/${data?.spaceId}/assessments/${data?.assessmentId}/graphical-report/#shareDialog`);
    }
    clearAll();
  }, [data, clearAll]);

  if (!show || !data) return null;

  const progress = counter / seconds;
  const dashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Box
      sx={{
        ...styles.centerH,
        position: "fixed",
        inset: 0,
        alignItems: "flex-end",
        zIndex: 1301,
        pointerEvents: "none",
        bottom: 20,
      }}
    >
      <Box
        sx={{
          ...styles.centerV,
          boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
          borderRadius: 1,
          bgcolor: "#f7f9fa",
          gap: 2,
          px: 3,
          py: 2,
          minWidth: 400,
          pointerEvents: "auto",
        }}
        data-testid="pending-banner"
      >
        <Box
          sx={{
            position: "relative",
            width: SIZE,
            height: SIZE,
          }}
        >
          <svg width={SIZE} height={SIZE}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#e0e0e0"
              strokeWidth={STROKE}
              fill="none"
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#1976d2"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashoffset}
              style={{
                transition: "stroke-dashoffset 1s linear",
              }}
            />
          </svg>
          <Box
            sx={{
              ...styles.centerVH,
              position: "absolute",
              top: 0,
              left: 0,
              width: SIZE,
              height: SIZE,
              userSelect: "none",
            }}
          >
            <Text variant="headlineSmall" color="#1976d2">
              {counter}
            </Text>
          </Box>
        </Box>
        <Text variant="semiBoldLarge">
          <Trans
            i18nKey={data?.report ? "assessmentReport.continueShareReportMessage" : "assessmentKit.continueAssessmentKitMessage"}
            values={{
              title: data?.title ?? "",
            }}
            components={{
              name: (
                <a
                  href={data?.id ? `/assessment-kits/${data?.id}` : `/${data?.spaceId}/assessments/${data?.assessmentId}/graphical-report/`}
                  style={{
                    textDecoration: "none",
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: languageDetector(data?.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.title}
                </a>
              ),
            }}
          />
        </Text>
        <Button color="primary" onClick={handleCancel}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button variant="contained" onClick={handleContinue}>
          <Trans i18nKey="common.yesContinue" />
        </Button>
      </Box>
    </Box>
  );
};

export default PendingBanner;

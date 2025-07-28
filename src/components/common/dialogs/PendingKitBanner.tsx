import React, { useEffect, useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/AssessmentProvider";
import { useNavigate } from "react-router-dom";
import { styles } from "@styles";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

const SIZE = 40;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PendingKitBanner: React.FC<{ seconds?: number }> = ({ seconds = 10 }) => {
  const { pendingKitData, dispatch } = useAssessmentContext();
  const [kit, setKit] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [counter, setCounter] = useState(seconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      if (pendingKitData?.display) {
        setKit(pendingKitData);
        setShow(true);
        setCounter(seconds);
      } else {
        setShow(false);
      }
    };
    check();
  }, [pendingKitData, seconds]);

  useEffect(() => {
    if (!show || !kit) return;
    if (counter <= 0) {
      handleCancel();
      return;
    }
    timerRef.current = setTimeout(() => setCounter((c) => c - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, kit, counter]);

  const clearAll = useCallback(() => {
    dispatch(assessmentActions.setPendingKit({}));
    setShow(false);
    setKit(null);
    setCounter(seconds);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [dispatch, seconds]);

  const handleCancel = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const handleContinue = useCallback(() => {
    if (kit?.id) {
      navigate(`/assessment-kits#createAssessment?id=${kit.id}`);
    }
    clearAll();
  }, [kit, clearAll]);

  if (!show || !kit) return null;

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
          background: "#f7f9fa",
          gap: 2,
          px: 3,
          py: 2,
          minWidth: 400,
          pointerEvents: "auto",
        }}
        data-testid="pending-kit-banner"
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
            <Typography variant="headlineSmall" color="#1976d2">
              {counter}
            </Typography>
          </Box>
        </Box>
        <Typography variant="semiBoldLarge">
          <Trans
            i18nKey="assessmentKit.continueAssessmentKitMessage"
            values={{
              kitName: kit?.title ?? "",
            }}
            components={{
              name: (
                <a
                  href={`/assessment-kits/${kit?.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#2466A8",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: languageDetector(kit?.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {kit?.title}
                </a>
              ),
            }}
          />
        </Typography>
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

export default PendingKitBanner;

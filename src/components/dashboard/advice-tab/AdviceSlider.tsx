import { useState, useMemo, useCallback } from "react";
import { Grid, ThemeProvider, createTheme, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import { useTheme, alpha } from "@mui/material/styles";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";

type MaturityLevel = { id: string; title: string };
type TargetItem = { attributeId: string; maturityLevelId: string };

type MaturitySliderProps = {
  defaultValue: number;
  attribute: { id: string; title: string };
  maturityLevels: MaturityLevel[];
  setTarget: React.Dispatch<React.SetStateAction<TargetItem[]>>;
  currentState?: { title?: string };
};

const MIN = 1;
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export default function MaturitySlider({
  defaultValue,
  attribute,
  maturityLevels = [],
  setTarget,
  currentState,
}: Readonly<MaturitySliderProps>) {
  const baseTheme = useTheme();
  const ltrTheme = useMemo(
    () => createTheme({ ...baseTheme, direction: "ltr" }),
    [baseTheme],
  );

  const total = Math.max(MIN, maturityLevels.length);
  const defaultPct = useMemo(
    () => (total > MIN ? ((defaultValue - MIN) / (total - MIN)) * 100 : 0),
    [defaultValue, total],
  );
  const [value, setValue] = useState<number>(defaultValue ?? MIN);

  const idx = useMemo(
    () => clamp((value ?? defaultValue ?? MIN) - MIN, 0, total - 1),
    [value, defaultValue, total],
  );
  const toTitle = maturityLevels[idx]?.title;
  const fromTitle = currentState?.title;
  const marks = useMemo(
    () => Array.from({ length: total }, (_, i) => ({ value: i + 1 })),
    [total],
  );
  const markTitles = useMemo(
    () => maturityLevels.map((m) => m.title),
    [maturityLevels],
  );

  const applyValue = useCallback(
    (next: number) => {
      if (next < defaultValue) return;
      setValue(next);

      const nextIdx = clamp(next - MIN, 0, total - 1);
      const nextLevelId = maturityLevels[nextIdx]?.id;

      setTarget((prev) => {
        const i = prev.findIndex((x) => x.attributeId === attribute.id);
        if (next <= defaultValue) {
          if (i === -1) return prev;
          const copy = [...prev];
          copy.splice(i, 1);
          return copy;
        }
        const item = {
          attributeId: attribute.id,
          maturityLevelId: nextLevelId,
        };
        if (i === -1) return [...prev, item];
        const copy = [...prev];
        copy[i] = item;
        return copy;
      });
    },
    [attribute.id, defaultValue, maturityLevels, setTarget, total],
  );

  const onChange = useCallback(
    (_e: unknown, v: number | number[]) =>
      applyValue(Array.isArray(v) ? v[0] : v),
    [applyValue],
  );

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", direction: "ltr" }}
      py={{ xs: 0.5, md: 2 }}
      columnSpacing={2}
    >
      <Grid item xs={4.1} sm={4.1}>
        <Box sx={styles.centerV} gap={2}>
          <Text
            variant="semiBoldLarge"
            sx={{
              maxWidth: { xs: 260, lg: 124 },
              width: "100%",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
          >
            {attribute.title}
          </Text>
        </Box>
      </Grid>

      <Grid item xs={7.9} sm={7.9}>
        <ThemeProvider theme={ltrTheme}>
          <SliderRow
            defaultValue={defaultValue}
            defaultPct={defaultPct}
            value={value}
            total={total}
            fromTitle={fromTitle}
            onChange={onChange}
            toTitle={toTitle}
            marks={marks}
            markTitles={markTitles}
            onSelectMark={applyValue}
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
}

const STEP = 1;
function SliderRow({
  defaultValue,
  defaultPct,
  value,
  total,
  fromTitle,
  onChange,
  toTitle,
  marks,
  markTitles,
  onSelectMark,
}: Readonly<{
  defaultValue: number;
  defaultPct: number;
  value: number;
  total: number;
  fromTitle?: string;
  toTitle?: string;
  marks: Array<{ value: number }>;
  markTitles: string[];
  onChange: (e: unknown, v: number | number[]) => void;
  onSelectMark: (next: number) => void;
}>) {
  const isMax = defaultValue === total;
  const minAllowed = Math.max(MIN, defaultValue);
  const canDec = value > minAllowed;
  const canInc = value < total;

  const nudge = (dir: -1 | 1) =>
    onSelectMark(clamp(value + dir * STEP, minAllowed, total));
  const defaultIdx = Math.max(0, defaultValue - 1);
  const currentIdx = Math.max(0, value - 1);

  return (
    <Box dir="ltr" sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          columnGap: 2,
          width: "100%",
        }}
      >
        <StepBtn
          ariaLabel="decrease"
          disabled={!canDec}
          onClick={() => nudge(-1)}
        >
          <ArrowLeftIcon fontSize="small" />
        </StepBtn>

        <Box position="relative" width="100%">
          <Track defaultPct={defaultPct} isMax={isMax} />

          {value > defaultValue && !isMax && (
            <GainStripe
              defaultValue={defaultValue}
              value={value}
              total={total}
              defaultPct={defaultPct}
            />
          )}

          <Slider
            min={1}
            max={total}
            marks={marks}
            value={value}
            onChange={onChange}
            valueLabelDisplay="on"
            valueLabelFormat={() => toTitle || ""}
            sx={(t) => sliderSX(t, isMax)}
          />

          <MarkHoverLabels
            total={total}
            titles={markTitles}
            hideAt={[defaultIdx, currentIdx]}
            onSelect={(i) => onSelectMark(i + 1)}
          />

          <BaselineMarker
            defaultPct={defaultPct}
            fromTitle={fromTitle}
            display={defaultValue !== value}
          />
        </Box>

        <StepBtn
          ariaLabel="increase"
          disabled={!canInc}
          onClick={() => nudge(1)}
        >
          <ArrowRightIcon fontSize="small" />
        </StepBtn>
      </Box>
    </Box>
  );
}

function StepBtn({
  children,
  onClick,
  disabled,
  ariaLabel,
}: Readonly<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}>) {
  return (
    <IconButton
      aria-label={ariaLabel}
      size="small"
      onClick={onClick}
      disabled={disabled}
      color="primary"
      sx={(t) => ({
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "#2466A808",
        transition: "background-color 120ms ease",
        "&:hover": { backgroundColor: "#2466A818" },
        "&.Mui-disabled": {
          backgroundColor: "#C2CCD650",
          color: "#3D4D5C50",
          opacity: 1,
        },
        "&.Mui-disabled:hover": { backgroundColor: "#C2CCD650" },
        "&.Mui-disabled .MuiSvgIcon-root": { color: t.palette.action.disabled },
      })}
    >
      {children}
    </IconButton>
  );
}

const Track = ({
  defaultPct,
  isMax = false,
}: Readonly<{
  defaultPct: number;
  isMax?: boolean;
}>) => (
  <Box
    sx={(t) => {
      const color = isMax ? t.palette.success.main : t.palette.primary.main;
      return {
        position: "absolute",
        inset: 0,
        top: "50%",
        height: 2,
        transform: "translateY(-50%)",
        borderRadius: 999,
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundImage: `linear-gradient(90deg, ${alpha(color, 0.25)}, ${alpha(color, 0.25)}), linear-gradient(90deg, ${color}, ${color})`,
        backgroundSize: `100% 100%, ${isMax ? "100%" : `${defaultPct}%`} 100%`,
        backgroundPosition: `0% 0%, 0% 0%`,
        zIndex: 1,
      };
    }}
  />
);

const GainStripe = ({
  defaultValue,
  value,
  total,
  defaultPct,
}: {
  defaultValue: number;
  value: number;
  total: number;
  defaultPct: number;
}) => {
  const widthPct = total > 1 ? ((value - defaultValue) / (total - 1)) * 100 : 0;
  return (
    <Box
      sx={(t) => ({
        position: "absolute",
        top: "50%",
        left: `${defaultPct}%`,
        width: `${widthPct}%`,
        height: 2,
        transform: "translateY(-50%)",
        backgroundImage: `repeating-linear-gradient(90deg, ${t.palette.primary.main} 0 4px, transparent 4px 8px)`,
        backgroundRepeat: "repeat-x",
        borderRadius: 999,
        zIndex: 0,
        opacity: 0.7,
        boxShadow: `0 0 0 5.5px ${t.palette.mode === "dark" ? "rgba(36,102,168,0.20)" : "rgba(36,102,168,0.15)"}`,
      })}
    />
  );
};

const BaselineMarker = ({
  defaultPct,
  fromTitle,
  display,
}: {
  defaultPct: number;
  fromTitle?: string;
  display: boolean;
}) => (
  <Tooltip
    arrow
    open={display}
    placement="bottom"
    title={fromTitle || ""}
    componentsProps={{
      tooltip: {
        sx: {
          bgcolor: "#66809920",
          color: (t) => t.palette.text.primary,
          fontWeight: 400,
          fontSize: "11px",
          px: 0.5,
        },
      },
      arrow: { sx: { color: "#66809920" } },
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: `calc(${defaultPct}% )`,
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: 1.1,
          height: "70%",
          borderRadius: 0,
          backgroundColor: "#2466A850",
        },
        "&::before": { left: "calc(50% - 2px)" },
        "&::after": { left: "calc(50% + 1px)" },
        width: 16,
        height: 13,
        borderRadius: "2px",
        backgroundColor: "#86A8CB",
      }}
    />
  </Tooltip>
);

function MarkHoverLabels({
  total,
  titles,
  hideAt = [],
  onSelect,
}: {
  total: number;
  titles: string[];
  hideAt?: number[];
  onSelect: (idx: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <Box
      sx={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
    >
      {Array.from({ length: total }, (_, i) => {
        if (hideAt.includes(i)) return null;
        const pct = total > 1 ? (i / (total - 1)) * 100 : 0;
        const title = titles[i] ?? String(i + 1);
        return (
          <Tooltip
            key={i}
            title={title}
            placement="top"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#66809920",
                  color: (t) => t.palette.text.primary,
                  fontWeight: 400,
                  fontSize: "11px",
                  px: 0.5,
                },
              },
              arrow: { sx: { color: "#66809920" } },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: `calc(${pct}% )`,
                top: "60%",
                transform: "translate(-50%, -50%)",
                width: 18,
                height: 24,
                pointerEvents: "auto",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(i);
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}

const sliderSX = (t: any, isMax: boolean) => {
  const success = t.palette.success.main;
  const thumbBg = isMax ? success : t.palette.primary.main;
  const labelBg = isMax ? alpha(success, 0.08) : "#66809920";

  return {
    height: 12,
    position: "relative",
    "& .MuiSlider-rail": { opacity: 0 },
    "& .MuiSlider-track": { opacity: 0, border: "none" },
    "& .MuiSlider-mark": {
      width: 2,
      height: 10,
      borderRadius: 1,
      backgroundColor: isMax ? success : t.palette.primary.main,
      transform: "translate(-1px, -4px)",
      opacity: 0.15,
    },
    "& .MuiSlider-thumb": {
      zIndex: 3,
      width: 16,
      height: 12,
      borderRadius: "2px",
      backgroundColor: thumbBg,
      position: "relative",
      boxShadow: "none",
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 1.1,
        height: "70%",
        borderRadius: 0,
        backgroundColor: t.palette.primary.contrastText,
      },
      "&::before": { left: "calc(50% - 2px)" },
      "&::after": { left: "calc(50% + 1px)" },
    },
    "& .MuiSlider-valueLabel": {
      position: "relative",
      overflow: "visible",
      color: isMax ? success : t.palette.text.primary,
      backgroundColor: labelBg,
      borderRadius: "4px",
      fontWeight: 400,
      fontSize: "0.68rem",
      lineHeight: "1rem",
      letterSpacing: 0,
      padding: "4px",
      "&::before": { display: "none" },
      "&::after": {
        content: '""',
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: -6,
        width: 10,
        height: 6,
        clipPath: "polygon(50% 100%, 0 0, 100% 0)",
        backgroundColor: labelBg,
      },
    },
  };
};

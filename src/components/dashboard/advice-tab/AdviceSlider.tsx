import { useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Grid, ThemeProvider, createTheme, IconButton } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
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

const MIN_VALUE = 1;
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
const fontFor = (text?: string) =>
  languageDetector(text) ? farsiFontFamily : primaryFontFamily;

const MaturitySlider = (props: MaturitySliderProps) => {
  const {
    defaultValue,
    attribute,
    maturityLevels = [],
    setTarget,
    currentState,
  } = props;

  const totalLevels = Math.max(MIN_VALUE, maturityLevels.length);
  const defaultPct =
    totalLevels > MIN_VALUE
      ? ((defaultValue - MIN_VALUE) / (totalLevels - MIN_VALUE)) * 100
      : 0;

  const [value, setValue] = useState<number>(defaultValue ?? MIN_VALUE);

  const selectedIdx = useMemo(() => {
    const chosenValue = value ?? defaultValue ?? MIN_VALUE;
    return clamp(chosenValue - MIN_VALUE, 0, totalLevels - 1);
  }, [value, defaultValue, totalLevels]);

  const currentLevel = maturityLevels[selectedIdx];
  const toTitle = currentLevel?.title;
  const fromTitle = currentState?.title;

  const handleChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      const nextValue = Array.isArray(newValue) ? newValue[0] : newValue;
      if (nextValue < defaultValue) return;

      setValue(nextValue);

      const nextIdx = clamp(nextValue - MIN_VALUE, 0, totalLevels - 1);
      const nextLevelId = maturityLevels[nextIdx]?.id;

      setTarget((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.attributeId === attribute.id,
        );
        if (nextValue <= defaultValue) {
          if (existingIndex === -1) return prev;
          const clone = [...prev];
          clone.splice(existingIndex, 1);
          return clone;
        }
        const newItem = {
          attributeId: attribute.id,
          maturityLevelId: nextLevelId,
        };
        if (existingIndex === -1) return [...prev, newItem];
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      });
    },
    [attribute.id, defaultValue, maturityLevels, setTarget, totalLevels],
  );

  const baseTheme = useTheme();
  const ltrTheme = useMemo(
    () => createTheme({ ...baseTheme, direction: "ltr" }),
    [baseTheme],
  );

  const marks = useMemo(
    () => Array.from({ length: totalLevels }, (_, i) => ({ value: i + 1 })),
    [totalLevels],
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
          <TitleCell title={attribute.title} />
        </Box>
      </Grid>

      <Grid item xs={7.9} sm={7.9}>
        <ThemeProvider theme={ltrTheme}>
          <SliderRow
            defaultValue={defaultValue}
            defaultPct={defaultPct}
            value={value}
            totalLevels={totalLevels}
            fromTitle={fromTitle}
            onSliderChange={handleChange}
            marks={marks}
            toTitle={toTitle}
          />
        </ThemeProvider>
      </Grid>
    </Grid>
  );
};

const TitleCell = ({ title }: { title: string }) => (
  <Typography
    variant="semiBoldLarge"
    sx={{
      fontFamily: fontFor(title),
      maxWidth: { xs: 260, lg: 124 },
      width: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      textOverflow: "ellipsis",
    }}
  >
    {title}
  </Typography>
);

interface SliderRowProps {
  defaultValue: number;
  defaultPct: number;
  value: number;
  totalLevels: number;
  fromTitle?: string;
  onSliderChange: (event: Event, value: number | number[]) => void;
  marks: Array<{ value: number }>;
  toTitle?: string;
}

const STEP = 1;

const SliderRow = (props: SliderRowProps) => {
  const {
    defaultValue,
    defaultPct,
    value,
    totalLevels,
    fromTitle,
    onSliderChange,
    marks,
    toTitle,
  } = props;

  const isMax = defaultValue === totalLevels;
  const minAllowed = Math.max(MIN_VALUE, defaultValue);
  const canDec = value > minAllowed;
  const canInc = value < totalLevels;

  const nudge = (dir: -1 | 1) => {
    const next = clamp(value + dir * STEP, minAllowed, totalLevels);
    onSliderChange({} as any, next);
  };

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
        <StepButton
          ariaLabel="decrease"
          disabled={!canDec}
          onClick={() => nudge(-1)}
        >
          <ArrowLeftIcon fontSize="small" />
        </StepButton>

        <Box position="relative" width="100%">
          <TrackBackground defaultPct={defaultPct} isMax={isMax} />

          {value > defaultValue && !isMax && (
            <GainStripe
              defaultValue={defaultValue}
              value={value}
              totalLevels={totalLevels}
              defaultPct={defaultPct}
            />
          )}

          <Slider
            min={1}
            max={totalLevels}
            marks={marks}
            value={value}
            onChange={onSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={() => toTitle || ""}
            sx={(theme) => sliderStyles(theme, isMax)}
          />

          <BaselineMarker defaultPct={defaultPct} fromTitle={fromTitle} />
        </Box>

        <StepButton
          ariaLabel="increase"
          disabled={!canInc}
          onClick={() => nudge(1)}
        >
          <ArrowRightIcon fontSize="small" />
        </StepButton>
      </Box>
    </Box>
  );
};

function StepButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <IconButton
      aria-label={ariaLabel}
      size="small"
      onClick={onClick}
      disabled={disabled}
      color="primary"
      sx={(theme) => ({
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
        "&.Mui-disabled .MuiSvgIcon-root": {
          color: theme.palette.action.disabled,
        },
      })}
    >
      {children}
    </IconButton>
  );
}

const TrackBackground = ({
  defaultPct,
  isMax = false,
}: {
  defaultPct: number;
  isMax?: boolean;
}) => (
  <Box
    sx={(theme) => {
      const base = theme.palette.primary.main;
      const success = theme.palette.success.main;
      const color = isMax ? success : base;
      return {
        position: "absolute",
        inset: 0,
        top: "50%",
        height: 2,
        transform: "translateY(-50%)",
        borderRadius: 999,
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundImage: `
          linear-gradient(90deg, ${alpha(color, 0.25)}, ${alpha(color, 0.25)}),
          linear-gradient(90deg, ${color}, ${color})
        `,
        backgroundSize: `
          100% 100%,
          ${isMax ? "100%" : `${defaultPct}%`} 100%
        `,
        backgroundPosition: `0% 0%, 0% 0%`,
        zIndex: 1,
      };
    }}
  />
);

interface GainStripeProps {
  defaultValue: number;
  value: number;
  totalLevels: number;
  defaultPct: number;
}

const GainStripe = (props: GainStripeProps) => {
  const { defaultValue, value, totalLevels, defaultPct } = props;
  const widthPct =
    totalLevels > 1 ? ((value - defaultValue) / (totalLevels - 1)) * 100 : 0;

  return (
    <Box
      sx={(theme) => ({
        position: "absolute",
        top: "50%",
        left: `${defaultPct}%`,
        width: `${widthPct}%`,
        height: 2,
        transform: "translateY(-50%)",
        backgroundImage: `repeating-linear-gradient(90deg, ${theme.palette.primary.main} 0 4px, transparent 4px 8px)`,
        backgroundRepeat: "repeat-x",
        borderRadius: 999,
        zIndex: 0,
        opacity: 0.7,
        boxShadow: `0 0 0 5.5px ${
          theme.palette.mode === "dark"
            ? "rgba(36,102,168,0.20)"
            : "rgba(36,102,168,0.15)"
        }`,
      })}
    />
  );
};

const BaselineMarker = ({
  defaultPct,
  fromTitle,
}: {
  defaultPct: number;
  fromTitle?: string;
}) => (
  <Tooltip
    arrow
    placement="bottom"
    title={fromTitle || ""}
    disableHoverListener={!fromTitle}
    componentsProps={{
      tooltip: {
        sx: {
          bgcolor: "#66809920",
          color: (t) => t.palette.text.primary,
          fontWeight: 400,
          fontSize: "11px",
        },
      },
      arrow: { sx: { color: "#66809920" } },
    }}
  >
    <Box
      sx={() => ({
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
      })}
    />
  </Tooltip>
);

const sliderStyles = (theme: any, isMax: boolean) => {
  const success = theme.palette.success.main;
  const thumbBg = isMax ? success : theme.palette.primary.main;
  const labelBg = isMax ? alpha(success, 0.08) : "#66809920";
  const labelArrow = labelBg;

  return {
    height: 12,
    position: "relative",
    "& .MuiSlider-rail": { opacity: 0 },
    "& .MuiSlider-track": { opacity: 0, border: "none" },
    "& .MuiSlider-mark": {
      width: 2,
      height: 10,
      borderRadius: 1,
      backgroundColor: isMax ? success : theme.palette.primary.main,
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
        backgroundColor: theme.palette.primary.contrastText,
      },
      "&::before": { left: "calc(50% - 2px)" },
      "&::after": { left: "calc(50% + 1px)" },
    },
    "& .MuiSlider-valueLabel": {
      position: "relative",
      overflow: "visible",
      color: isMax ? success : theme.palette.text.primary,
      backgroundColor: labelBg,
      borderRadius: "4px",
      fontWeight: 400,
      fontSize: "0.68rem",
      lineHeight: "1rem",
      letterSpacing: 0,
      padding: "4px",
    },
    "& .MuiSlider-valueLabel::before": { display: "none" },
    "& .MuiSlider-valueLabel::after": {
      content: '""',
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      bottom: -6,
      width: 10,
      height: 6,
      clipPath: "polygon(50% 100%, 0 0, 100% 0)",
      backgroundColor: labelArrow,
    },
  };
};

export default MaturitySlider;

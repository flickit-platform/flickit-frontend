import { useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { styles } from "@styles";

type MaturityLevel = {
  id: string;
  title: string;
};

type TargetItem = {
  attributeId: string;
  maturityLevelId: string;
};

type AdviceSliderProps = {
  defaultValue: number;
  attribute: { id: string; title: string };
  maturityLevels: MaturityLevel[];
  setTarget: React.Dispatch<React.SetStateAction<TargetItem[]>>;
  target: TargetItem[];
  currentState?: { title?: string };
};

const MIN_VALUE = 1;
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
const fontFor = (text?: string) =>
  languageDetector(text) ? farsiFontFamily : primaryFontFamily;

const AdviceSlider = (props: AdviceSliderProps) => {
  const {
    defaultValue,
    attribute,
    maturityLevels = [],
    setTarget,
    target,
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

  const currentMaturityLevel = maturityLevels[selectedIdx];
  const toTitle = currentMaturityLevel?.title;
  const fromTitle = currentState?.title;

  const handleSliderChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      const nextValue = Array.isArray(newValue) ? newValue[0] : newValue;

      if (nextValue < defaultValue) return;

      setValue(nextValue);

      const nextIdx = clamp(nextValue - MIN_VALUE, 0, totalLevels - 1);
      const nextLevelId = maturityLevels[nextIdx]?.id;

      setTarget((prevTarget) => {
        const existingIndex = prevTarget.findIndex(
          (item) => item.attributeId === attribute.id,
        );

        const newItem = {
          attributeId: attribute.id,
          maturityLevelId: nextLevelId,
        };

        if (existingIndex === -1) {
          return [...prevTarget, newItem];
        }

        const updated = [...prevTarget];
        updated[existingIndex] = newItem;
        return updated;
      });
    },
    [defaultValue, totalLevels, maturityLevels, setTarget, attribute.id],
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
          <AttributeTitle title={attribute.title} />
        </Box>
      </Grid>

      <Grid item xs={6} sm={6}>
        <ThemeProvider theme={ltrTheme}>
          <SliderContainer
            defaultValue={defaultValue}
            defaultPct={defaultPct}
            value={value}
            totalLevels={totalLevels}
            fromTitle={fromTitle}
            onSliderChange={handleSliderChange}
            marks={marks}
            toTitle={toTitle}
          />
        </ThemeProvider>
      </Grid>

      <Grid item xs={1.9} sm={1.9}>
        <LevelIndicator value={value} defaultValue={defaultValue} />
      </Grid>
    </Grid>
  );
};

const AttributeTitle = ({ title }: { title: string }) => (
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

interface SliderContainerProps {
  defaultValue: number;
  defaultPct: number;
  value: number;
  totalLevels: number;
  fromTitle?: string;
  onSliderChange: (event: Event, value: number | number[]) => void;
  marks: Array<{ value: number }>;
  toTitle?: string;
}

const SliderContainer = (props: SliderContainerProps) => {
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

  return (
    <Box dir="ltr" position="relative">
      <BackgroundTrack defaultPct={defaultPct} />

      {value > defaultValue && (
        <ImprovementIndicator
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
        sx={sliderStyles}
      />

      <DefaultValueIndicator defaultPct={defaultPct} fromTitle={fromTitle} />
    </Box>
  );
};

const BackgroundTrack = ({ defaultPct }: { defaultPct: number }) => (
  <Box
    sx={(theme) => ({
      position: "absolute",
      inset: 0,
      top: "50%",
      height: 2,
      transform: "translateY(-50%)",
      borderRadius: 999,
      backgroundRepeat: "no-repeat, no-repeat",
      backgroundImage: `
        linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.25)}, ${alpha(theme.palette.primary.main, 0.25)}),
        linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.main})
      `,
      backgroundSize: `
        100% 100%,
        ${defaultPct}% 100%
      `,
      backgroundPosition: `0% 0%, 0% 0%`,
      zIndex: 1,
    })}
  />
);

interface ImprovementIndicatorProps {
  defaultValue: number;
  value: number;
  totalLevels: number;
  defaultPct: number;
}

const ImprovementIndicator = (props: ImprovementIndicatorProps) => {
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
        zIndex: 2,
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

const DefaultValueIndicator = ({
  defaultPct,
  fromTitle,
}: {
  defaultPct: number;
  fromTitle?: string;
}) => (
  <Tooltip
    arrow
    placement="top"
    title={fromTitle || ""}
    disableHoverListener={!fromTitle}
  >
    <Box
      sx={(theme) => ({
        position: "absolute",
        top: "50%",
        left: `calc(${defaultPct}% )`,
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          borderRadius: "50%",
          backgroundColor: alpha(theme.palette.primary.main, 0.7),
        },
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
      })}
    />
  </Tooltip>
);

const LevelIndicator = ({
  value,
  defaultValue,
}: {
  value: number;
  defaultValue: number;
}) => {
  const levelDifference = value - defaultValue;
  const isPlural = levelDifference > 1;

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Typography
        color="primary"
        variant="semiBoldSmall"
        sx={(theme) => ({ direction: theme.direction })}
      >
        <Trans
          i18nKey={isPlural ? "common.levels" : "common.level"}
          values={{ count: levelDifference }}
        />
      </Typography>
    </Box>
  );
};

// Styles
const sliderStyles = (theme: any) => ({
  mt: 1,
  height: 2,
  position: "relative",
  zIndex: 3,
  "& .MuiSlider-rail": { opacity: 0 },
  "& .MuiSlider-track": { opacity: 0, border: "none" },
  "& .MuiSlider-mark": {
    width: 1.5,
    height: 12,
    borderRadius: 1,
    backgroundColor: theme.palette.primary.main,
    transform: "translate(-1px, -6px)",
    opacity: 0.35,
  },
  "& .MuiSlider-thumb": {
    width: 12,
    height: 12,
    "&:before": { boxShadow: "none" },
  },
});

export default AdviceSlider;

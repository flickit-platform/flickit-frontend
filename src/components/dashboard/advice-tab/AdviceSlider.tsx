import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Grid, ThemeProvider, createTheme } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

type AdviceSliderProps = {
  defaultValue: number;
  attribute: { id: string; title: string };
  maturityLevels: Array<{ id: string; title: string }>;
  setTarget: React.Dispatch<React.SetStateAction<any[]>>;
  target: any[];
  currentState?: { title?: string };
};

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

  const totalLevels = Math.max(1, maturityLevels.length || 5);
  const [value, setValue] = useState<number>(defaultValue ?? 1);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const next = Array.isArray(newValue) ? newValue[0] : newValue;
    if (next >= defaultValue) {
      setValue(next);
      const nextIdx = clamp(next - 1, 0, totalLevels - 1);
      const nextLevelId = maturityLevels[nextIdx]?.id;

      const existingIndex = target.findIndex(
        (item: any) => item.attributeId === attribute?.id,
      );
      if (existingIndex === -1) {
        setTarget((prev: any[]) => [
          ...prev,
          { attributeId: attribute?.id, maturityLevelId: nextLevelId },
        ]);
      } else {
        setTarget((prev: any[]) => {
          const updated = [...prev];
          updated[existingIndex] = {
            attributeId: attribute?.id,
            maturityLevelId: nextLevelId,
          };
          return updated;
        });
      }
    }
  };

  const baseTheme = useTheme();
  const ltrTheme = useMemo(
    () => createTheme({ ...baseTheme, direction: "ltr" }),
    [baseTheme],
  );

  const defaultPct =
    totalLevels > 1 ? ((defaultValue - 1) / (totalLevels - 1)) * 100 : 0;

  const selectedIdx = useMemo(() => {
    const chosenValue = value ?? defaultValue ?? 1;
    return clamp(chosenValue - 1, 0, totalLevels - 1);
  }, [value, defaultValue, totalLevels]);

  const toLevel = maturityLevels[selectedIdx];
  const toTitle = toLevel?.title;
  const fromTitle = currentState?.title;

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", direction: "ltr" }}
      padding={{ xs: 0.5, md: 2 }}
    >
      <Grid item xs={4} sm={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography
            variant="semiBoldLarge"
            sx={{
              fontFamily: fontFor(attribute?.title),
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
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6} sm={6}>
        <ThemeProvider theme={ltrTheme}>
          <Box dir="ltr" position="relative">
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

            {value > defaultValue && (
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "50%",
                  left: `${defaultPct}%`,
                  width:
                    totalLevels > 1
                      ? `${((value - defaultValue) / (totalLevels - 1)) * 100}%`
                      : "0%",
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
            )}

            <Slider
              min={1}
              max={totalLevels}
              marks
              value={value}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              valueLabelFormat={() => toTitle || ""}
              sx={(theme) => ({
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
              })}
            />
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
              ></Box>
            </Tooltip>
          </Box>
        </ThemeProvider>
      </Grid>

      <Grid item xs={1.5} sm={1.5}>
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Typography
            color="background.onVariant"
            variant="bodySmall"
            sx={(theme) => ({ direction: theme.direction })}
          >
            <Trans
              i18nKey="common.level"
              values={{ count: value - defaultValue }}
            />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdviceSlider;

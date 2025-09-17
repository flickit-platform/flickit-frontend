import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/language-detector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import Typography from "@mui/material/Typography";
import { v3Tokens } from "@/config/tokens";

type AdviceSliderProps = {
  defaultValue: number;
  attribute: { id: string; title: string };
  subject: { title: string };
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
    subject,
    maturityLevels = [],
    setTarget,
    target,
    currentState,
  } = props;

  const totalLevels = Math.max(1, maturityLevels.length || 5);
  const defaultIdx = clamp((defaultValue ?? 1) - 1, 0, totalLevels - 1);

  const [value, setValue] = useState<number>(defaultValue ?? 1);

  const selectedIdx = useMemo(() => {
    const chosenValue = value ?? defaultValue ?? 1;
    return clamp(chosenValue - 1, 0, totalLevels - 1);
  }, [value, defaultValue, totalLevels]);

  const toLevel = maturityLevels[selectedIdx];
  const toTitle = toLevel?.title;
  const fromTitle = currentState?.title;

  const fromIsFa = languageDetector(fromTitle);
  const toIsFa = languageDetector(toTitle);

  const currentPercent =
    totalLevels > 1 ? (defaultIdx * 99) / (totalLevels - 1) : 0;

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

  return (
    <Box
      justifyContent="space-between"
      px={{ xs: 1, sm: 4 }}
      width="100%"
      margin="0 auto"
      flexDirection={{ xs: "column", sm: "row" }}
      mb={{ xs: 4, sm: 2 }}
      textAlign="start"
      sx={{ ...styles.centerH }}
    >
      <Box sx={{ ...styles.centerVH }} gap={2} width="35%">
        <Box
          px="10px"
          color="#D81E5B"
          bgcolor="#FDF1F5"
          fontSize=".75rem"
          border="1px solid #D81E5B"
          borderRadius="8px"
          textAlign="center"
          fontFamily={fontFor(subject?.title)}
        >
          {subject.title}
        </Box>

        <Typography
          variant="semiBoldXLarge"
          width="100%"
          maxWidth="260px"
          sx={{ fontFamily: fontFor(attribute?.title) }}
        >
          {attribute.title}
        </Typography>
      </Box>

      <Box width={{ xs: "100%", md: "37%" }} mt={4}>
        <Box px={2}>
          <Slider
            min={1}
            max={totalLevels}
            marks
            defaultValue={defaultValue}
            value={value}
            onChange={handleSliderChange}
            sx={{
              "& .MuiSlider-thumb": { marginRight: "-20px" },
            }}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          width="91%"
          mt="-10px"
          marginInlineStart="2%"
          marginInlineEnd="4%"
        >
          <Box
            position="relative"
            sx={(theme) => ({
              [theme.direction === "rtl" ? "right" : "left"]:
                `${currentPercent}%`,
            })}
          >
            <svg
              width="20"
              height="9"
              viewBox="0 0 20 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 9L10 0L0 9H20Z" fill="#F9A03F" />
            </svg>
          </Box>

          <Box
            sx={(theme) => ({
              position: "relative",
              [theme.direction === "rtl" ? "right" : "left"]:
                `${currentPercent}%`,
              marginInlineStart: "-20px",
              mt: "-5px",
              whiteSpace: "nowrap",
              fontSize: ".75rem",
              fontWeight: 400,
              color: "#F9A03F",
            })}
          >
            <Trans i18nKey="advice.currentStage" />
          </Box>
        </Box>
      </Box>

      <Box width={{ xs: "90%", sm: "28%" }} mt={1} sx={{ ...styles.centerVH }}>
        <Typography color="background.onVariant" variant="bodySmall">
          <Trans
            i18nKey="advice.fromTo"
            values={{ fromTitle: fromTitle, toTitle: toTitle }}
            components={{
              fromStyle: (
                <span
                  style={{
                    fontSize: "14px",
                    color: v3Tokens.surface.on,
                    fontWeight: 700,
                    fontFamily: fromIsFa ? farsiFontFamily : primaryFontFamily,
                  }}
                />
              ),
              toStyle: (
                <span
                  style={{
                    fontSize: "14px",
                    color: v3Tokens.surface.on,
                    fontWeight: 700,
                    fontFamily: toIsFa ? farsiFontFamily : primaryFontFamily,
                  }}
                />
              ),
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default AdviceSlider;

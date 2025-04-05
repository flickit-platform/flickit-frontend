import { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { getMaturityLevelColors, styles } from "@styles";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import Typography from "@mui/material/Typography";
const AdviceSlider = (props: any) => {
  const {
    defaultValue,
    attribute,
    subject,
    maturityLevels,
    setTarget,
    target,
    currentState,
  } = props;
  const [value, setValue] = useState(defaultValue ?? 0);
  const handleSliderChange = (event: Event, newValue: any) => {
    if (newValue >= defaultValue) {
      setValue(newValue);
      const existingIndex = target.findIndex(
        (item: any) => item.attributeId === attribute?.id,
      );

      if (existingIndex === -1) {
        // If the attributeId doesn't exist, add a new object
        setTarget((prev: any) => [
          ...prev,
          {
            attributeId: attribute?.id,
            maturityLevelId: maturityLevels[newValue - 1]?.id,
          },
        ]);
      } else {
        // If the attributeId exists, update the existing object
        setTarget((prev: any) => {
          const updatedTarget = [...prev];
          updatedTarget[existingIndex] = {
            attributeId: attribute?.id,
            maturityLevelId: maturityLevels[newValue - 1]?.id,
          };
          return updatedTarget;
        });
      }
    }
  };
  const colorPallet = getMaturityLevelColors(maturityLevels?.length ?? 5);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 3, sm: 4 },
        width: "100%",
        margin: "0 auto",
        flexDirection: { xs: "column", sm: "row" },
        mb: { xs: 4, sm: 2 },
        textAlign: "start",
      }}
    >
      <Box sx={{ ...styles.centerVH }} gap={2} width="30%">
        <Box
          sx={{
            px: "10px",
            color: "#D81E5B",
            background: "#FDF1F5",
            fontSize: ".75rem",
            border: "1px solid #D81E5B",
            borderRadius: "8px",
            textAlign: "center",
            fontFamily: languageDetector(subject?.title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {subject.title}
        </Box>
        <Typography
          variant="semiBoldXLarge"
          sx={{
            width: "100%",
            maxWidth: "260px",
            fontFamily: languageDetector(attribute?.title)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {attribute.title}
        </Typography>
      </Box>
      <Box sx={{ width: { xs: "100%", md: "320px" } }} mt={4}>
        <Box px={2}>
          <Slider
            defaultValue={defaultValue}
            min={1}
            max={maturityLevels?.length ?? 5}
            onChange={handleSliderChange}
            value={value}
            marks
            sx={{
              "& .MuiSlider-thumb": {
                marginRight: "-20px",
              },
            }}
          />
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"91%"}
          mt={"-10px"}
          sx={{
            marginInlineStart: "2%",
            marginInlineEnd: "4%",
          }}
        >
          <Box
            position={"relative"}
            left={`${
              ((defaultValue - 1) * 99) /
              (maturityLevels?.length ? maturityLevels?.length - 1 : 4)
            }%`}
            right={`${
              ((defaultValue - 1) * 99) /
              (maturityLevels?.length ? maturityLevels?.length - 1 : 4)
            }%`}
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
            sx={{
              position: "relative",
              left: `${
                ((defaultValue - 1) * 99) /
                (maturityLevels?.length ? maturityLevels?.length - 1 : 4)
              }%`,
              right: `${
                ((defaultValue - 1) * 99) /
                (maturityLevels?.length ? maturityLevels?.length - 1 : 4)
              }%`,
              marginInlineStart: "-20px",
              mt: "-5px",
              whiteSpace: "nowrap",
              fontSize: ".75rem",
              fontWeight: "400",
              color: "#F9A03F",
            }}
          >
            <Trans i18nKey="currentStage" />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          textAlign: "center",
          width: "20%",
        }}
      >
        <Typography
          sx={{
            color: "#6C8093",
          }}
          variant="bodySmall"
        >
          <Trans
            i18nKey="fromTo"
            values={{
              fromTitle: currentState?.title,
              toTitle:
                maturityLevels[value ? value - 1 : defaultValue - 1]?.title,
            }}
            components={{
              fromStyle: (
                <span
                  style={{
                    fontSize: "14px",
                    color: colorPallet[currentState?.index - 1],
                    fontWeight: "700",
                    fontFamily: languageDetector(currentState?.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                />
              ),
              toStyle: (
                <span
                  style={{
                    fontSize: "14px",
                    color: colorPallet[value ? value - 1 : defaultValue - 1],
                    fontWeight: "700",
                    fontFamily: languageDetector(
                      maturityLevels[value ? value - 1 : defaultValue - 1]
                        ?.title,
                    )
                      ? farsiFontFamily
                      : primaryFontFamily,
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

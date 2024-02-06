import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { getMaturityLevelColors } from "@styles";
const AdviceSlider = (props: any) => {
  const {
    defaultValue,
    attribute,
    subject,
    maturityLevels,
    setTarget,
    target,
  } = props;
  const [value, setValue] = useState();
  const [maturityLevelID, setMaturityLevelID] = useState();
  const handleSliderChange = (event: Event, newValue: any) => {
    if (newValue >= defaultValue) {
      setValue(newValue);
      const existingIndex = target.findIndex(
        (item: any) => item.attributeId === attribute?.id
      );

      if (existingIndex === -1) {
        // If the attributeId doesn't exist, add a new object
        setTarget((prev: any) => [
          ...prev,
          {
            attributeId: attribute?.id,
            maturityLevelId: maturityLevels[newValue - 1]?.maturity_level.id,
          },
        ]);
      } else {
        // If the attributeId exists, update the existing object
        setTarget((prev: any) => {
          const updatedTarget = [...prev];
          updatedTarget[existingIndex] = {
            attributeId: attribute?.id,
            maturityLevelId: maturityLevels[newValue - 1]?.maturity_level.id,
          };
          return updatedTarget;
        });
      }
    }
  };

  const colorPallet = getMaturityLevelColors(
    subject?.maturity_level?.maturity_levels_count ?? 5
  );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 8,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Box sx={{ display: "contents" }}>
        <Box
          sx={{
            px: "10px",
            color: "#D81E5B",
            background: "#FDF1F5",
            fontSize: "11px",
            border: "1px solid #D81E5B",
            borderRadius: "8px",
            textAlign:"center"
          }}
        >
          {subject.title}
        </Box>
        <Box
          sx={{
            fontSize: "24px",
            fontWeight: "500",
            ml: 4,
            width: "240px",
            px: "8px",
          }}
        >
          {attribute.title}
        </Box>
      </Box>

      <Box width={"400px"} margin={"0 auto"} my={6}>
        <Box px={2}>
          <Slider
            defaultValue={defaultValue}
            min={1}
            max={subject?.maturity_level?.maturity_levels_count ?? 5}
            onChange={handleSliderChange}
            value={value}
            marks
            sx={{
              ".MuiSlider-thumb": {
                color: "#1CC2C4",
              },
              ".MuiSlider-track": {
                border: "none",
                height: "4px",
                backgroundColor: "#1CC2C4",
              },
              ".MuiSlider-rail": {
                opacity: 0.5,
                height: "4px",
                backgroundColor: "#1CC2C4 !important",
              },
              ".MuiSlider-markActive": {
                background: "rgba(237, 244, 252, 1)",
              },
            }}
          />
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          marginTop={"-5px"}
          width={"92%"}
          ml={"1.5%"}
          mr={"4%"}
          mt={"-10px"}
        >
          <Box position={"relative"} left={`${(defaultValue - 1) * 25}%`}>
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
              left: `${(defaultValue - 1) * 25}%`,
              ml: "-25px",
              mt: "-5px",
              whiteSpace: "nowrap",
              fontSize: "12px",
              fontWeight: "400",
              color: "#F9A03F",
            }}
          >
            current stage
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          width: "100px",
        }}
      >
        <Box
          sx={{
            color: "#9DA7B3",
            fontSize: "11px",
            fontWeight: "400",
          }}
        >
          from
        </Box>
        <Box
          sx={{
            color: "#FDAE61",
            fontSize: "11px",
            fontWeight: "700",
          }}
        >
          Moderate
        </Box>
        <Box
          sx={{
            color: "#9DA7B3",
            fontSize: "11px",
            fontWeight: "400",
          }}
        >
          to
        </Box>

        <Box
          sx={{
            color: colorPallet[value ? value - 1 : defaultValue - 1],
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          {
            maturityLevels[value ? value - 1 : defaultValue - 1]?.maturity_level
              .title
          }
        </Box>
      </Box>
    </Box>
  );
};

export default AdviceSlider;

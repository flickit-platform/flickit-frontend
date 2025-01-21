import { lazy, Suspense, useMemo } from "react";
import { colorPallet } from "./style";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import languageDetector from "../languageDetector";
import { confidenceColor, maturityLevelColorMap } from "@/config/styles";

interface IconfidenceLevelType {
  inputNumber: number | null | undefined;
  displayNumber?: boolean;
  variant?: any;
  fontFamily?: any;
}

const ConfidenceLevel = ({
  inputNumber = 0,
  displayNumber = false,
  variant = "titleLarge",
  fontFamily,
}: IconfidenceLevelType) => {
  const { id, colorText, number } = calculate(inputNumber);

  const ImgRate = useMemo(
    () => lazy(() => import(`./confLevel${id}.tsx`)),
    [id],
  );
  return (
    <Suspense fallback={<Box>fallback</Box>}>
      <Box
        sx={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2px",
        }}
      >
        {displayNumber && (
          <Typography
            variant={variant}
            color={colorText}
            sx={{
              fontFamily: fontFamily,
            }}
          >
            {number}%
          </Typography>
        )}
        <ImgRate />
      </Box>
    </Suspense>
  );
};

const calculate = (inputNumber: any) => {
  let number;
  let id;
  let colorText;

  if (!inputNumber || typeof inputNumber !== "number") {
    number = 0;
  } else {
    number = Math.ceil(inputNumber);
  }

  let newNum = Math.floor(number / 20);
  colorText = confidenceColor[newNum];

  switch (number >= 0) {
    case number < 10:
      id = 10;
      break;
    case number < 20:
      id = 20;
      break;
    case number < 30:
      id = 30;
      break;
    case number < 40:
      id = 40;
      break;
    case number < 50:
      id = 50;
      break;
    case number < 60:
      id = 60;
      break;
    case number < 70:
      id = 70;
      break;
    case number < 80:
      id = 80;
      break;
    case number < 90:
      id = 90;
      break;
    case number <= 100:
      id = 100;
      break;
    default:
      id = 100;
  }

  return { id, colorText, number };
};

export default ConfidenceLevel;

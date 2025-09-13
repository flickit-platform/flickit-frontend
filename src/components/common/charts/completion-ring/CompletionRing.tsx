import { lazy, Suspense, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { confidenceColor } from "@/config/styles";
import { formatRoundedPercent } from "@/features/assessment-report/ui/sections/tree-map/MeasureTable";
import i18next from "i18next";

interface IcompletionRingType {
  inputNumber?: number | null;
  displayNumber?: boolean;
  variant?: any;
  fontFamily?: any;
}

const CompletionRing = ({
  inputNumber = 0,
  displayNumber = false,
  variant = "titleLarge",
  fontFamily,
}: IcompletionRingType) => {
  const { id, textColor, number } = calculate(inputNumber);

  const CompletionRingComponent = useMemo(
    () => lazy(() => import(`./CompletionRing${id}.tsx`)),
    [id],
  );
  return (
    <Suspense fallback={<Box>fallback</Box>}>
      <Box
        display="inline-flex"
        justifyContent="center"
        alignItems="center"
        gap="2px"
        marginInlineStart={0.5}
      >
        {displayNumber && (
          <Typography
            variant={variant}
            color={textColor}
            sx={{
              fontFamily: fontFamily,
            }}
          >
            {number}
            {i18next.language === "en" ? "%" : "٪"}
          </Typography>
        )}
        <CompletionRingComponent color={textColor}/>
      </Box>
    </Suspense>
  );
};

const calculate = (inputNumber: any) => {
  let number;
  let id;
  let textColor;

  if (!inputNumber || typeof inputNumber !== "number") {
    number = 0;
  } else {
    number = Math.ceil(inputNumber);
  }

  let newNum = Math.floor(number / 20);
  textColor = confidenceColor[newNum];

  switch (number >= 0) {
    case number < 20:
      id = 20;
      break;
    case number < 40:
      id = 40;
      break;
    case number < 60:
      id = 60;
      break;
    case number < 80:
      id = 80;
      break;
    case number < 100:
      id = 90;
      break;
    default:
      id = 100;
  }

  return { id, textColor, number };
};

export default CompletionRing;

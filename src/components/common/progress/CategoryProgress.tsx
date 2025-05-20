import Box, { BoxProps } from "@mui/material/Box";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { secondaryFontFamily } from "@/config/theme";

interface IQuestionnaireProgress extends BoxProps {
  progress: number;
}

const progressToLabelMap: Record<number, string> = {
  0: "notStarted",
  100: "completed",
};

const progressToColorMap: Record<number, LinearProgressProps["color"]> = {
  0: "inherit",
  100: "success",
};

const progressToColorMapColor: Record<number, string> = {
  0: "gray",
  100: "#2e7d32",
};

const QuestionnaireProgress = (props: IQuestionnaireProgress) => {
  const { progress = 0, ...rest } = props;
  const is_farsi = Boolean(localStorage.getItem("lang") === "fa");
  return (
    <Box sx={{ ...styles.centerV }} flex="1" {...rest}>
      <Box flex={1}>
        <LinearProgress
          value={progress}
          color={progressToColorMap[progress] ?? "primary"}
          variant="determinate"
          sx={{
            borderRadius: is_farsi ? "8px 0 0 8px" : "0 8px 8px 0px",
            color: progress === 0 ? "gray" : undefined,
          }}
        />
      </Box>
      <Box pl={is_farsi ? 0 : "8px"} pr={is_farsi ? "8px" : 0} mr="-2px">
          <Typography
            fontWeight={"bold"}
            fontFamily={is_farsi ? "Vazirmatn" : secondaryFontFamily}
            textTransform="uppercase"
            color={progressToColorMapColor[progress] ?? "#1976d2"}
          >
            <Trans i18nKey={progressToLabelMap[progress] ?? "inprogress"} />
          </Typography>
      </Box>
    </Box>
  );
};

export default QuestionnaireProgress;

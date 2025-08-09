import Box, { BoxProps } from "@mui/material/Box";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useTheme } from "@mui/material";

interface IQuestionnaireProgress extends BoxProps {
  progress: number;
}

const progressToLabelMap: Record<number, string> = {
  0: "common.notStarted",
  100: "common.completed",
};

const progressToColorMap: Record<number, LinearProgressProps["color"]> = {
  0: "inherit",
  100: "success",
};

const progressToColorMapColor: Record<number, string> = {
  0: "#8A0F24",
  100: "#2e7d32",
};

const QuestionnaireProgress = (props: IQuestionnaireProgress) => {
  const { progress = 0, ...rest } = props;
  const is_farsi = Boolean(localStorage.getItem("lang") === "fa");
  const theme = useTheme();

  return (
    <Box sx={{ ...styles.centerV }} flex="1" {...rest}>
      <Box flex={1}>
        <LinearProgress
          value={progress}
          color={progressToColorMap[progress] ?? "primary"}
          variant="determinate"
          sx={{
            borderRadius: is_farsi ? "8px 0 0 8px" : "0 8px 8px 0px",
            color: progress === 0 ? theme.palette.error.main : undefined,
          }}
        />
      </Box>
      <Box pl={is_farsi ? 0 : "8px"} pr={is_farsi ? "8px" : 0} mr="-2px">
        <Typography
          color={progressToColorMapColor[progress] ?? "#1976d2"}
          sx={{
            ...theme.typography.semiBoldSmall,
            position: "relative",
            [is_farsi ? "left" : "right"]: "-16px",
          }}
        >
          <Trans
            i18nKey={progressToLabelMap[progress] ?? "common.inProgress"}
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default QuestionnaireProgress;

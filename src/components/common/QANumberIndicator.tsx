import { useTheme } from "@mui/material";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { Trans } from "react-i18next";

interface IQANumberIndicatorProps extends TypographyProps {
  q?: number;
  variant?: any
}

const QANumberIndicator = (props: IQANumberIndicatorProps) => {
  const theme = useTheme();

  const { q = 0,variant="labelSmall" , ...rest } = props;
  const isFarsi = theme.direction === "rtl";
  return q === undefined ? null : (
    <Typography
      sx={{
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
      variant={variant}
      color="GrayText"
      {...rest}
    >
      {q} <Trans i18nKey={isFarsi ? "common.question" : "common.questions"} />
    </Typography>
  );
};

export default QANumberIndicator;

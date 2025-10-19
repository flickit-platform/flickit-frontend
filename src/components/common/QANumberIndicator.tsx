import { useTheme } from "@mui/material";
import { TypographyProps } from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Text } from "./Text";

interface IQANumberIndicatorProps extends TypographyProps {
  q?: number;
  variant?: any
}

const QANumberIndicator = (props: IQANumberIndicatorProps) => {
  const theme = useTheme();

  const { q = 0,variant="labelSmall" , ...rest } = props;
  const isFarsi = theme.direction === "rtl";
  return q === undefined ? null : (
    <Text
      sx={{
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
      variant={variant}
      color="GrayText"
      {...rest}
    >
      {q} <Trans i18nKey={isFarsi ? "common.question" : "common.questions"} />
    </Text>
  );
};

export default QANumberIndicator;

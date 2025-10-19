import Box, { BoxProps } from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { Text } from "../Text";

interface IGettingThingsReadyLoadingProps extends BoxProps {}

const ErrorRecalculating = (props: IGettingThingsReadyLoadingProps) => {
  const { ...rest } = props;
  return (
    <Box
      color="disabled.main"
      {...rest}
      sx={{
        width: "100%",
        minWidth: { xs: "120px", sm: "360px" },
        maxWidth: "400px",
        px: { xs: 0.5, sm: 2 },
        margin: "0 auto",
        ...(rest.sx ?? {}),
      }}
    >
      <Box sx={{ ...styles.centerCH }}>
        <Text variant="h5">
          <Trans i18nKey="notification.insightsAreRecalculating" />
        </Text>
        <Text variant="h5">
          <Trans i18nKey="notification.pleaseWait" />
        </Text>
      </Box>
      <LinearProgress color="inherit" sx={{ marginTop: "12px" }} />
    </Box>
  );
};

export default ErrorRecalculating;

import Box, { BoxProps } from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";

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
        <Typography variant="h5">
          <Trans i18nKey="notification.insightsAreRecalculating" />
        </Typography>
        <Typography variant="h5">
          <Trans i18nKey="notification.pleaseWait" />
        </Typography>
      </Box>
      <LinearProgress color="inherit" sx={{ marginTop: "12px" }} />
    </Box>
  );
};

export default ErrorRecalculating;

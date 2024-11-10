import { theme } from "@/config/theme";
import Alert, { AlertProps } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import useScreenResize from "@utils/useScreenResize";

interface IAlertBox extends AlertProps {}

const AlertBox = (props: IAlertBox) => {
  const { children, action, ...rest } = props;
  const isSmall = useScreenResize("md");
  return (
    <Alert
      {...rest}
      action={!isSmall ? action : undefined}
      sx={
        isSmall && action
          ? { ...(rest.sx || {}), "& .MuiAlert-message": { width: "100%" } }
          : rest.sx
      }
    >
      <Box sx={isSmall ? { flexDirection: "column", width: "100%" } : {}}>
        {children}
        {isSmall && action ? (
          <Box
            sx={{
              pt: { xs: 1.5, md: 0.5 },
              paddingLeft: theme.direction === "ltr" ? 2 : "unset",
              paddingRight: theme.direction === "rtl" ? 2 : "unset",
              ml: `${theme.direction === "rtl" ? { xs: 0, md: -1 } : "auto"}`,
              mr: `${theme.direction === "rtl" ? "auto" : { xs: 0, md: -1 }}`,
              alignItems: { xs: "flex-end", md: "flex-start" },
              justifyContent: "flex-end",
              display: "flex",
            }}
          >
            {action}
          </Box>
        ) : null}
      </Box>
    </Alert>
  );
};

export default AlertBox;

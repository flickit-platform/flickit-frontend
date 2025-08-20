import { Trans } from "react-i18next";
import ErrorImage from "@assets/img/errorBoundary.png";
import { Component } from "react";
import Button from "@mui/material/Button";
import { HOME_URL } from "@/config/constants";
import { styles } from "@styles";
import Box from "@mui/material/Box";

class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return (
        <Box
          width="100%"
          height="100vh"
          textAlign="center"
          sx={{ ...styles.centerCVH }}
        >
          <div>
            <img src={ErrorImage} alt="error" width="100%" />
          </div>
          <h2 style={{ opacity: 0.8 }}>
            <Trans i18nKey="errors.someThingWentWrong" />
          </h2>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              window.location.href = HOME_URL;
            }}
          >
            <Trans i18nKey="common.backToHome" />
          </Button>
        </Box>
      );
    }

    return (this.props as any).children;
  }
}

export default ErrorBoundary;

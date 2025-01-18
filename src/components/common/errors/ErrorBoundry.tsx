import { Trans } from "react-i18next";
import ErrorImage from "@assets/img/errorBoundary.png";
import React, { Component } from "react";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

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
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div>
            <img src={ErrorImage} alt="error" width="100%" />
          </div>
          <h2 style={{ opacity: 0.8 }}>
            <Trans i18nKey={"someThingWentWrong"} />
          </h2>
            <Button
                variant="contained"
                size="large"
                component={Link}
                to={"/"}
            >
                <Trans i18nKey={"backToHome"} />
            </Button>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

export default ErrorBoundary;

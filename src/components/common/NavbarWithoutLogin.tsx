import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import { theme } from "@config/theme";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import AssessmentRounded from "@mui/icons-material/AssessmentRounded";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import { MULTILINGUALITY } from "@constants";
import LanguageSelector from "@common/LangSelector";
import { useConfigContext } from "@providers/ConfgProvider";
import CircularProgress from "@mui/material/CircularProgress";
import keycloakService from "@/service/keycloakService";

const login = () => {
  keycloakService.doLogin();
};
const LandingPage = import.meta.env.VITE_LANDING_PAGE
  ? import.meta.env.VITE_LANDING_PAGE
  : `https://flickit.org/`;

const NavbarWithoutLogin = () => {
  const { config } = useConfigContext();
  return (
    <AppBar
      component="nav"
      sx={{
        borderRadius: "0px",
        backgroundColor: theme.palette.primary.main,
        position: "sticky",
        px: { xl: 26, lg: 8, xs: 1, sm: 3 },
      }}
      data-cy="nav-bar"
    >
      <Toolbar
        variant="dense"
        sx={{
          backgroundColor: theme.palette.primary.main,
          borderRadius: 1,
          justifyContent: "space-between",
          p: 0,
        }}
      >
        <Typography
          variant="h6"
          component={NavLink}
          to={
            import.meta.env.VITE_LANDING_PAGE
              ? import.meta.env.VITE_LANDING_PAGE
              : `https://flickit.org/`
          }
          sx={{
            display: {
              xs: "block",
            },
            color: "grey",
            height: "42px",
            width: "110px",
            cursor: "pointer",
          }}
        >
          {config.appLogoUrl ? (
            <img
              src={config.appLogoUrl}
              alt={"logo"}
              style={{ maxWidth: "120px", height: "100%" }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            </Box>
          )}
        </Typography>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            mx: "auto",
          }}
        >
          <Button
            component={NavLink}
            to={`https://flickit.org/`}
            sx={{
              ...styles.activeNavbarLink,
              textTransform: "uppercase",
              color: "#fff",
            }}
            size="small"
          >
            <Trans i18nKey="home" />
          </Button>
          <Button
            component={NavLink}
            to={`/assessment-kits`}
            startIcon={
              <AssessmentRounded
                sx={{ opacity: 0.8, fontSize: "18px !important" }}
              />
            }
            sx={{
              ...styles.activeNavbarLink,
              textTransform: "uppercase",
              color: "#fff",
            }}
            size="small"
          >
            <Trans i18nKey="kitLibrary" />
          </Button>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" }, ml: 3 }}>
          {/* Other buttons */}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.8, sm: 2 },
          }}
        >
          {MULTILINGUALITY.toString() == "true" ? <LanguageSelector /> : ""}
          <Button
            variant={"outlined"}
            size={"medium"}
            onClick={login}
            sx={{
              height: "32px",
              color: "#fff",
              textTransform: "capitalize",
              borderColor: "#fff",
              "&:hover": {
                borderColor: "#fff",
              },
            }}
          >
            <Trans i18nKey={"login"} />
          </Button>
          <Button
            variant={"contained"}
            size={"medium"}
            onClick={() => keycloakService._kc.register()}
            sx={{
              height: "32px",
              color: theme.palette.primary.main,
              textTransform: "capitalize",
              background: "#F3F5F6",
              boxShadow: "0 1px 5px rgba(0,0,0,0.12)",
              "&:hover": {
                background: "#F3F5F6",
              },
            }}
          >
            <Trans i18nKey={"createAccount"} />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarWithoutLogin;

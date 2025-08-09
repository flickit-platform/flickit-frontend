import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
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
import { useTheme } from "@mui/material";

const rawLandingPage = import.meta.env.VITE_LANDING_PAGE;
const LandingPage =
  rawLandingPage && rawLandingPage !== "PLATFORM_LANDING_PAGE"
    ? rawLandingPage
    : "";

const NavbarWithoutLogin = () => {
  const { config } = useConfigContext();
  const theme = useTheme();

  const handleButtonClick = (e: any, name: string) => {
    keycloakService.doLogin();
    (window as any).dataLayer.push({
      event: "ppms.cm:trackEvent",
      parameters: {
        category: "Button",
        action: "Click",
        name: name,
      },
    });
  };
  return (
    <AppBar
      component="nav"
      sx={{
        borderRadius: "0px",
        backgroundColor: theme.palette.primary.main,
        position: "sticky",
        px: { xxl: 26, xl: 18, lg: 8, xs: 1, sm: 3 },
        boxShadow: "0 0px 8px rgba(10, 35, 66, 0.25)",
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
          to={LandingPage}
          sx={{
            display: {
              xs: "block",
            },
            color: "grey",
            height: "42px",
            width: "110px",
            cursor: LandingPage ? "pointer" : "default",
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
          {LandingPage && (
            <Button
              component={NavLink}
              to={LandingPage}
              sx={{
                ...styles.activeNavbarLink,
                textTransform: "uppercase",
                color: "#fff",
              }}
              size="small"
            >
              <Trans i18nKey="common.home" />
            </Button>
          )}
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
            <Trans i18nKey="common.kitLibrary" />
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
            variant={"contained"}
            size={"medium"}
            onClick={(e) => handleButtonClick(e, "Login")}
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
            <Trans i18nKey="common.loginOrSignup" />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarWithoutLogin;

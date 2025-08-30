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

const LandingPage = import.meta.env.VITE_LANDING_PAGE;


const NavbarWithoutLogin = () => {
  const { config } = useConfigContext();

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
        backgroundColor: "primary.main",
        position: "sticky",
        px: { xxl: 26, xl: 18, lg: 8, xs: 1, sm: 3 },
        boxShadow: "0 0px 8px rgba(10, 35, 66, 0.25)",
      }}
      data-cy="nav-bar"
    >
      <Toolbar
        variant="dense"
        sx={{
          backgroundColor: "primary.main",
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
            <Box height="100" sx={{ ...styles.centerVH }}>
              <CircularProgress
                size={20}
                sx={{ color: "background.containerLowest" }}
              />
            </Box>
          )}
        </Typography>
        <Box display={{ xs: "none", md: "flex" }} gap={2} mx="auto">
          {LandingPage && (
            <Button
              component={NavLink}
              to={LandingPage}
              sx={{
                ...styles.activeNavbarLink,
                textTransform: "uppercase",
                color: "background.containerLowest",
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
              color: "background.containerLowest",
            }}
            size="small"
          >
            <Trans i18nKey="common.kitLibrary" />
          </Button>
        </Box>
        <Box display={{ xs: "none", md: "block" }} ml={3}>
          {/* Other buttons */}
        </Box>
        <Box gap={{ xs: 0.8, sm: 2 }} sx={{ ...styles.centerV }}>
          {MULTILINGUALITY.toString() == "true" ? <LanguageSelector /> : ""}
          <Button
            variant={"contained"}
            size={"medium"}
            onClick={(e) => handleButtonClick(e, "Login")}
            sx={{
              height: "32px",
              color: "primary.main",
              textTransform: "capitalize",
              bgcolor: "background.container",
              boxShadow: "0 1px 5px rgba(0,0,0,0.12)",
              "&:hover": {
                bgcolor: "background.container",
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

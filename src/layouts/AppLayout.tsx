import { PropsWithChildren, Suspense } from "react";
import Box from "@mui/material/Box";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import Navbar from "@common/Navbar";
import { styles } from "@styles";
import { useLocation, useParams } from "react-router-dom";
import NavbarWithoutLogin from "@/components/common/NavbarWithoutLogin";
import keycloakService from "@/service/keycloakService";
import FloatButton from "@utils/floatButton";
import useDialog from "@utils/useDialog";
import ContactUsDialog from "@components/assessment-kit/ContactUsDialog";
import { isPathMatching } from "@/utils/pathMatcher";
import PendingKitBanner from "@/components/common/dialogs/PendingKitBanner";

const AppLayout = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  const { pathname } = useLocation();
  const { assessmentKitId = "" } = useParams();
  const dialogProps = useDialog();
  const shouldApplyPadding = !isPathMatching(pathname, [
    "/assessment-kits",
    "/graphical-report",
  ]);
  const shouldApplyHorizontalPadding = !isPathMatching(pathname, [
    `/assessment-kits/${assessmentKitId}`,
    "/graphical-report",
  ]);

  const isAuthenticated = keycloakService.isLoggedIn();

  return (
    <Box sx={{ overflowX: "clip", minHeight: "100vh" }}>
      {isAuthenticated ? <Navbar /> : <NavbarWithoutLogin />}{" "}
      <Box
        sx={{
          p: shouldApplyPadding ? { xs: 1, sm: 1, md: 4 } : "0",
          px: shouldApplyHorizontalPadding
            ? { xxl: 30, xl: 20, lg: 12, md: 8, xs: 1, sm: 3 }
            : 0,
        }}
        m="auto"
      >
        <Suspense
          fallback={
            <Box sx={{ ...styles.centerVH }}>
              <GettingThingsReadyLoading color={"gray"} />
            </Box>
          }
        >
          {children}
        </Suspense>
        <FloatButton onClick={() => dialogProps.openDialog({})} />
      </Box>
      <PendingKitBanner />
      <ContactUsDialog {...dialogProps} />
    </Box>
  );
};

export default AppLayout;

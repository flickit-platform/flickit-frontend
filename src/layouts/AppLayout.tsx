import { PropsWithChildren, Suspense } from "react";
import Box from "@mui/material/Box";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import Navbar from "@common/Navbar";
import { styles } from "@styles";

const AppLayout = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <Box sx={{ overflowX: "clip", minHeight: "100vh" }}>
      <Navbar />
      <Box
        sx={{
          p: !location.pathname.startsWith("/assessment-kits/")
            ? { xs: 1, sm: 1, md: 4 }
            : "0",
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
      </Box>
    </Box>
  );
};

export default AppLayout;

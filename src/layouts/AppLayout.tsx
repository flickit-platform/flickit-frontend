import { PropsWithChildren, Suspense } from "react";
import Box from "@mui/material/Box";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import Navbar from "@common/Navbar";
import { styles } from "@styles";
import WrapperApp from "@utils/wrapperApp";

const AppLayout = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <Box sx={{ overflowX: "clip", minHeight: "100vh" }}>
      <Navbar />
      <Box
        m="auto"
      >
        <Suspense
          fallback={
            <Box sx={{ ...styles.centerVH }}>
              <GettingThingsReadyLoading color={"gray"} />
            </Box>
          }
        >
          <WrapperApp>
            {children}
          </WrapperApp>
        </Suspense>
      </Box>
    </Box>
  );
};

export default AppLayout;

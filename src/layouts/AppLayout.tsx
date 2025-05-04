import { PropsWithChildren, Suspense } from "react";
import Box from "@mui/material/Box";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import Navbar from "@common/Navbar";
import { styles } from "@styles";
import { useLocation, useParams } from "react-router-dom";

const AppLayout = (props: PropsWithChildren<{}>) => {

  const { children } = props;
  const { pathname } = useLocation()
  const { assessmentKitId = "" } = useParams();

  const checkLink = (link: string)=>{
    return  pathname.startsWith(link)
  }

  return (
    <Box sx={{ overflowX: "clip", minHeight: "100vh" }}>
      <Navbar />
      <Box
        sx={{
          p: !checkLink("/assessment-kits")
            ? { xs: 1, sm: 1, md: 4 }
            : "0",
          px: checkLink(`/assessment-kits/${assessmentKitId}`) ?  0 :  { xl: 30, lg: 12, xs: 2, sm: 3 }
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

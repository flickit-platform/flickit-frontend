import React from "react";
import Box from "@mui/material/Box";
import { useLocation, useParams } from "react-router-dom";

const WrapperApp = (props: any) => {

  const { children } = props
  const { pathname } = useLocation()
  const { assessmentKitId = "" } = useParams();

 const checkLink = (link: string)=>{
 return  pathname.startsWith(link)
  }

  return (
    <Box sx={{
        p: !checkLink("/assessment-kits")
          ? { xs: 1, sm: 1, md: 4 }
          : "0",
         px: checkLink(`/assessment-kits/${assessmentKitId}`) ?  0 :  { xl: 30, lg: 12, xs: 2, sm: 3 }
    }}>
      {children}
    </Box>
  );
};

export default WrapperApp;
import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AssessmentKitsStoreBanner from "./AssessmentKitsStoreBanner";
import AssessmentKitsContactUs from "./AssessmentKitsContactUs";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";
import useMediaQuery from "@mui/material/useMediaQuery";

const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {

  const isMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm"),
  );

  const sharedBoxProps = {
    m: "auto",
    my: isMobileScreen ? 2 : 3,
    pb: isMobileScreen ? 0 :  3,
    gap: "40px",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <Box sx={{ ...sharedBoxProps }}>
        <AssessmentKitsStoreBanner mobileScreen={isMobileScreen} />
      </Box>
      <Box sx={{ ...sharedBoxProps }}>
        <AssessmentKitsStoreListCard />
        <AssessmentKitsContactUs />
      </Box>
    </>
  );
};

export default AssessmentKitsContainer;

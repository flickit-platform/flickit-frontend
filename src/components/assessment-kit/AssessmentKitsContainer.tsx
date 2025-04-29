import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AssessmentKitsStoreBanner from "./AssessmentKitsStoreBanner";
import AssessmentKitsContactUs from "./AssessmentKitsContactUs";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";

const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {
  const sharedBoxProps = {
    m: "auto",
    my: 4,
    pb: 3,
    gap: "40px",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <Box sx={{ ...sharedBoxProps, px: { xl: 30, lg: 12, xs: 0, sm: 3 } }}>
        <AssessmentKitsStoreBanner />
      </Box>
      <Box sx={{ ...sharedBoxProps, px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
        <AssessmentKitsStoreListCard />
        <AssessmentKitsContactUs />
      </Box>
    </>
  );
};

export default AssessmentKitsContainer;

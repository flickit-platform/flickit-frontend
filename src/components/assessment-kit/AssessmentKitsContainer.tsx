import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AssessmentKitsStoreBanner from "./AssessmentKitsStoreBanner";
import AssessmentKitsContactUs from "./AssessmentKitsContactUs";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";

const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {
  return (
    <Box>
      <AssessmentKitsStoreBanner />
      <Box m="auto" my={4} pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
        <AssessmentKitsStoreListCard />
        <AssessmentKitsContactUs />
      </Box>
    </Box>
  );
};

export default AssessmentKitsContainer;

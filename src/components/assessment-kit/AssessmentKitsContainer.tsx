import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AssessmentKitsStoreBanner from "./AssessmentKitsStoreBanner";
import AssessmentKitsContactUs from "./AssessmentKitsContactUs";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";

const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {
  return (
    <Box gap="8px" display="flex" flexDirection="column">
      <AssessmentKitsStoreBanner />
      <Box
        m="auto"
        my={4}
        pb={3}
        sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}
        gap="40px"
        display="flex"
        flexDirection="column"
      >
        <AssessmentKitsStoreListCard />
        <AssessmentKitsContactUs />
      </Box>
    </Box>
  );
};

export default AssessmentKitsContainer;

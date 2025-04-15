import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AssessmentKitsStoreBanner from "./AssessmentKitsStoreBanner";
import AssessmentKitsContactUs from "./AssessmentKitsContactUs";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";

const AssessmentKitsContainer = () => {
  return (
    <Box>
      <AssessmentKitsStoreBanner />
      <AssessmentKitsStoreListCard />
      <AssessmentKitsContactUs />
    </Box>
  );
};

export default AssessmentKitsContainer;

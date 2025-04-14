import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import AssessmentKitsStoreBanner from "./AssessmentKitsStoreBanner";
import Button from "@mui/material/Button";
import AssessmentKitsContactUs from "./AssessmentKitsContactUs";

const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {
  return (
    <Box>
      <AssessmentKitsStoreBanner />
      <AssessmentKitsContactUs />
    </Box>
  );
};

export default AssessmentKitsContainer;

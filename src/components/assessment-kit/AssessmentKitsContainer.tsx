import { PropsWithChildren } from "react";
import AssessmentKitsStore from "@components/assessment-kit/AssessmentKitsStore";

const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {
  return (
        <AssessmentKitsStore />
  );
};

export default AssessmentKitsContainer;

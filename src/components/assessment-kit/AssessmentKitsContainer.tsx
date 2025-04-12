import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import AssessmentKitsListContainer from "./AssessmentKitsListContainer";
import AssessmentKitsListContainerNew from "@components/assessment-kit/AssessmentKitsListContainerNew";
{/*<AssessmentKitsListContainer />*/}
const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {
  return (

        <AssessmentKitsListContainerNew />
  );
};

export default AssessmentKitsContainer;

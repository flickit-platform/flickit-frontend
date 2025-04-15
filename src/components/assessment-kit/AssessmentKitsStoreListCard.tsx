import React from "react";
import Grid from "@mui/material/Grid";
import AssessmentKitsStoreCard from "@components/assessment-kit/AssessmentKitsStoreCard";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import QueryData from "@common/QueryData";
import AssessmentCEFromDialog from "@components/assessments/AssessmentCEFromDialog";
import useDialog from "@utils/useDialog";
import { Box } from "@mui/material";

const AssessmentKitsStoreListCard = () => {
  const { service } = useServiceContext();
  const dialogProps = useDialog();

  const assessmentKitsQueryData = useQuery({
    service: (args, config) => service.assessmentKit.info.getAll(args, config),
  });

  return (
    <QueryData
      {...assessmentKitsQueryData}
      render={(data) => {
        const { items = [] } = data;
        return (
          <Grid container spacing={4}>
            {items.map((item: any) => {
              return (
                <AssessmentKitsStoreCard openDialog={dialogProps} {...item} />
              );
            })}
            <AssessmentCEFromDialog {...dialogProps} />
          </Grid>
        );
      }}
    />
  );
};

export default AssessmentKitsStoreListCard;

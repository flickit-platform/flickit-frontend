import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AssessmentCard from "./AssessmentCard";
import { IAssessment, TId } from "@/types/index";
import { TDialogProps } from "@utils/useDialog";
import React from "react";
interface IAssessmentListProps {
  data: IAssessment[];
  space: any;
  dialogProps: TDialogProps;
  setOpenDeleteDialog: React.Dispatch<React.SetStateAction<{status: boolean, id: TId}>>;
}

const AssessmentsList = (props: IAssessmentListProps) => {
  const { data, space } = props;

  return (
    <Box>
      <Grid container spacing={4}>
        {data.map((item) => {
          return (
            <AssessmentCard
              item={{ ...item, space }}
              {...props}
              key={item?.id}
            />
          );
        })}
      </Grid>
    </Box>
  );
};

export { AssessmentsList };

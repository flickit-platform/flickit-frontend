import Grid from "@mui/material/Grid";
import AssessmentKitsStoreCard from "@components/assessment-kit/AssessmentKitsStoreCard";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import QueryData from "@common/QueryData";
import AssessmentCEFromDialog from "@components/assessments/AssessmentCEFromDialog";
import useDialog from "@utils/useDialog";
import forLoopComponent from "@/utils/forLoopComponent";
import uniqueId from "@/utils/uniqueId";
import { LoadingSkeleton } from "../common/loadings/LoadingSkeleton";

const AssessmentKitsStoreListCard = () => {
  const { service } = useServiceContext();
  const dialogProps = useDialog();

  const assessmentKitsQueryData = useQuery({
    service: (args, config) => service.assessmentKit.info.getAll(args, config),
  });

  return (
    <QueryData
      {...assessmentKitsQueryData}
      loadingComponent={
        <Grid container spacing={4}>
          {forLoopComponent(6, () => (
            <Grid item xs={12} md={6} key={uniqueId()}>
              <LoadingSkeleton
                key={uniqueId()}
                sx={{ height: "340px", mb: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      }
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

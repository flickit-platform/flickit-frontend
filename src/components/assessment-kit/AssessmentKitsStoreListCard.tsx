import Grid from "@mui/material/Grid";
import AssessmentKitsStoreCard from "@components/assessment-kit/AssessmentKitsStoreCard";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import QueryData from "@common/QueryData";
import AssessmentCEFromDialog from "@components/assessments/AssessmentCEFromDialog";
import useDialog from "@utils/useDialog";
import { LoadingSkeleton } from "../common/loadings/LoadingSkeleton";
import uniqueId from "@/utils/uniqueId";

const AssessmentKitsStoreListCard = () => {
  const { service } = useServiceContext();
  const dialogProps = useDialog();

  const assessmentKitsQueryData = useQuery({
    service: (args, config) => service.assessmentKit.info.getAll(args, config),
  });

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_) => (
      <Grid item xs={12} md={6} key={uniqueId()}>
        <LoadingSkeleton sx={{ height: "340px", mb: 1 }} />
      </Grid>
    ));

  return (
    <QueryData
      {...assessmentKitsQueryData}
      loadingComponent={
        <Grid container spacing={4}>
          {renderSkeletons()}
        </Grid>
      }
      render={(data) => {
        const { items = [] } = data;
        return (
          <Grid container spacing={4}>
            {items.map((item: any) => (
              <AssessmentKitsStoreCard
                key={item.id}
                openDialog={dialogProps}
                {...item}
              />
            ))}
            <AssessmentCEFromDialog {...dialogProps} />
          </Grid>
        );
      }}
    />
  );
};

export default AssessmentKitsStoreListCard;

import Grid from "@mui/material/Grid";
import AssessmentKitsStoreCard from "@components/assessment-kit/AssessmentKitsStoreCard";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import QueryData from "@common/QueryData";
import useDialog from "@/hooks/useDialog";
import { LoadingSkeleton } from "../common/loadings/LoadingSkeleton";
import uniqueId from "@/utils/unique-id";
import { useParams } from "react-router-dom";
import keycloakService from "@/service/keycloakService";
import NewAssessmentDialog from "@/components/common/dialogs/NewAssessmentDialog";
import ContactUsDialog from "@/components/common/dialogs/ContactUsDialog";
import { usePurchaseDialog } from "@/hooks/usePurchaseDialog";

const AssessmentKitsStoreListCard = ({ small = false }: any) => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();

  const dialogProps = useDialog();
  const dialogPurchaseProps = usePurchaseDialog();

  const isAuthenticated = keycloakService.isLoggedIn();
  const isPublic = isAuthenticated ? "" : "/public";
  const assessmentKitsQueryData = useQuery({
    service: (args, config) => {
      const finalArgs = args ?? { isPublic };
      return service.assessmentKit.info.getAll(finalArgs, config);
    },
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
          <Grid container sx={{ gap: { xs: 2, sm: small ? 2.5 : 4 } }}>
            {items
              .filter((item: any) => item.id != assessmentKitId)
              .map((item: any) => (
                <Grid key={item.id} item xs={12} md={small ? 4 : 6}>
                  <AssessmentKitsStoreCard
                    key={item.id}
                    dialogProps={dialogProps}
                    dialogPurchaseProps={dialogPurchaseProps}
                    {...item}
                    small={small}
                  />
                </Grid>
              ))}
            {dialogProps.open && <NewAssessmentDialog {...dialogProps} />}
            {dialogPurchaseProps.open && (
              <ContactUsDialog {...dialogPurchaseProps} />
            )}
          </Grid>
        );
      }}
    />
  );
};

export default AssessmentKitsStoreListCard;

import { Box, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { IAssessmentReportModel } from "@types";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import EmptyAdviceList from "@/components/assessment-report/advice-items/EmptyAdviceItems";
import QueryData from "@/components/common/QueryData";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import AdviceItemsAccordion from "./AdviceItemsAccordions";

const AdviceItems = (props: any) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const queryData = useQuery<IAssessmentReportModel>({
    service: (args, config) =>
      service.fetchAdviceItems({ assessmentId, page: 0, size: 50 }, config),
    toastError: false,
  });

  return (
    <>
      <QueryData
        {...queryData}
        renderLoading={() => <LoadingSkeletonKitCard />}
        render={(data) => {
          const { items } = data;
          return (
            <Grid container>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                id="advices-empty"
                mt={2}
              >
                {items.length ? (
                  <AdviceItemsAccordion items={items} />
                ) : (
                  <EmptyAdviceList
                    onAddNewRow={() => {}}
                    btnTitle="newAdviceItem"
                    title={"NoAdviceSoFar"}
                    SubTitle={"CreateFirstAdvice"}
                  />
                )}
              </Grid>
            </Grid>
          );
        }}
      />
    </>
  );
};

export default AdviceItems;

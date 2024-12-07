import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import EmptyAdviceList from "@/components/assessment-report/advice-items/EmptyAdviceItems";
import QueryData from "@/components/common/QueryData";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import AdviceItemsAccordion from "./AdviceItemsAccordions";
import { Box, CircularProgress } from "@mui/material";

const AdviceItems = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const [page, setPage] = useState(0);
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);

  const queryData = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceItems({ assessmentId, page, size: 15 }, config),
    toastError: false,
  });

  const { data } = queryData;
  const totalItems = data?.total || 0;

  useEffect(() => {
    if (data?.items?.length) {
      setDisplayedItems((prevItems) => [...prevItems, ...data.items]);
    }
  }, [data]);

  const handleScroll = (event: React.UIEvent) => {
    const container = event.currentTarget;
    const atBottom =
      container.scrollHeight === container.scrollTop + container.clientHeight;

    if (atBottom && displayedItems.length < totalItems) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 0) {
      queryData.query();
    }
  }, [page]);

  return (
    <QueryData
      {...queryData}
      renderLoading={() => <LoadingSkeletonKitCard />}
      render={() => (
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12} mt={2}>
            {displayedItems.length ? (
              <Box
                maxHeight={400}
                overflow="auto"
                onScroll={handleScroll}
                sx={{ position: "relative" }}
              >
                <AdviceItemsAccordion items={displayedItems} />
              </Box>
            ) : (
              <EmptyAdviceList
                onAddNewRow={() => {}}
                btnTitle="newAdviceItem"
                title="NoAdviceSoFar"
                subTitle="CreateFirstAdvice"
              />
            )}
          </Grid>
        </Grid>
      )}
    />
  );
};

export default AdviceItems;

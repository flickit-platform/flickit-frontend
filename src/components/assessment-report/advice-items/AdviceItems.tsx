import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import EmptyAdviceList from "@/components/assessment-report/advice-items/EmptyAdviceItems";
import QueryData from "@/components/common/QueryData";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import AdviceItemsAccordion from "./AdviceItemsAccordions";
import { Box, Button, Divider, Link, Typography } from "@mui/material";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import AdviceListNewForm from "../AdviceListNewForm";

const AdviceItems = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const [page, setPage] = useState(0);
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // Add a flag for refreshing

  const queryData = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceItems({ assessmentId, page, size: 15 }, config),
    toastError: false,
  });

  const deleteAdviceItem = useQuery<any>({
    service: (args, config) => service.deleteAdviceItem(args, config),
    toastError: false,
  });

  const { data } = queryData;
  const totalItems = data?.total || 0;

  useEffect(() => {
    if (data?.items?.length && !isRefreshing) {
      setDisplayedItems((prevItems) => [...prevItems, ...data.items]);
    }
  }, [data]);

  useEffect(() => {
    if (isRefreshing) {
      setDisplayedItems([]);
      setPage(0);
      queryData.query().finally(() => setIsRefreshing(false));
    }
  }, [isRefreshing]);

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

  const handleDeleteAdviceItem = async (adviceItemId: any) => {
    try {
      await deleteAdviceItem.query({ adviceItemId });
      setIsRefreshing(true);
      setPage(0);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const postAdviceItem = useQuery({
    service: (args = { assessmentId, data: newAdvice }, config) =>
      service.postAdviceItem(args, config),
    runOnMount: false,
  });

  const [showNewAdviceListForm, setShowNewAdviceListForm] = useState(false);
  const removeDescriptionAdvice = useRef(false);
  const [newAdvice, setNewAdvice] = useState({
    assessmentId: assessmentId,
    title: "",
    description: "",
    priority: "",
    cost: "",
    impact: "",
  });

  const handleCancel = () => {
    setShowNewAdviceListForm(false);
    removeDescriptionAdvice.current = true;
    setNewAdvice({
      ...newAdvice,
      title: "",
      description: "",
      priority: "",
      cost: "",
      impact: "",
    });
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewAdviceListForm(true);
    removeDescriptionAdvice.current = true;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdvice((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await postAdviceItem.query();
      removeDescriptionAdvice.current = true;
      setNewAdvice({
        ...newAdvice,
        title: "",
        description: "",
        priority: "",
        cost: "",
        impact: "",
      });
      setPage(0);
      setDisplayedItems([]);
      setShowNewAdviceListForm(false);
      queryData.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  return (
    <QueryData
      {...queryData}
      renderLoading={() => <LoadingSkeletonKitCard />}
      render={() => (
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box sx={{ ...styles.centerCV }} marginTop={4} gap={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  color="#73808C"
                  variant="h5"
                  display="flex"
                  alignItems="center"
                >
                  <Trans i18nKey="adviceItems" />
                </Typography>
                {displayedItems.length !== 0 && (
                  <Link
                    href="#new-advice-item"
                    sx={{
                      textDecoration: "none",
                      opacity: 0.9,
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleAddNewRow}
                      data-test-id="newAdvice"
                    >
                      <Trans i18nKey="newAdviceItem" />
                    </Button>
                  </Link>
                )}
              </Box>{" "}
              <Divider sx={{ width: "100%" }} />
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} mt={2}>
            {displayedItems.length ? (
              <Box
                maxHeight={900}
                overflow="auto"
                onScroll={handleScroll}
                sx={{ position: "relative" }}
              >
                <AdviceItemsAccordion
                  items={displayedItems}
                  onDelete={handleDeleteAdviceItem}
                />
              </Box>
            ) : (
              !showNewAdviceListForm && (
                <EmptyAdviceList
                  onAddNewRow={handleAddNewRow}
                  btnTitle="newAdviceItem"
                  title="NoAdviceSoFar"
                  subTitle="CreateFirstAdvice"
                />
              )
            )}
            {showNewAdviceListForm && (
              <AdviceListNewForm
                newAdvice={newAdvice}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
                setNewAdvice={setNewAdvice}
                removeDescriptionAdvice={removeDescriptionAdvice}
                postAdviceItem={postAdviceItem}
              />
            )}
          </Grid>
        </Grid>
      )}
    />
  );
};

export default AdviceItems;

import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import EmptyAdviceList from "@components/dashboard/advice-tab/advice-items/EmptyAdviceItems";
import { LoadingSkeletonKitCard } from "@common/loadings/LoadingSkeletonKitCard";
import AdviceItemsAccordion from "./AdviceItemsAccordions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import AdviceListNewForm from "./AdviceListNewForm";
import QueryData from "@/components/common/QueryData";

const AdviceItems = () => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const [page, setPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState({});
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);

  const fetchAdviceItems = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceItems({ assessmentId, page, size: 50 }, config),
    toastError: false,
  });

  const deleteAdviceItem = useQuery<any>({
    service: (args, config) => service.deleteAdviceItem(args, config),
    toastError: false,
    runOnMount: false,
  });

  const { data } = fetchAdviceItems;
  const totalItems = data?.total ?? 0;

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
      fetchAdviceItems.query();
    }
  }, [page]);

  const handleDeleteAdviceItem = async (adviceItemId: any) => {
    try {
      await deleteAdviceItem.query({ adviceItemId });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const postAdviceItem = useQuery({
    service: (args, config) =>
      service.postAdviceItem(args ?? { assessmentId, data: newAdvice }, config),
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
    setErrorMessage({});

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
    setShowNewAdviceListForm(!showNewAdviceListForm);
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
      let errorOccurred = false;
      const updatedErrorMessage: any = {};

      if (!newAdvice.title) {
        updatedErrorMessage.title = "requiredFieldError";
        errorOccurred = true;
      } else {
        updatedErrorMessage.title = null;
      }

      if (!newAdvice.description || newAdvice.description === "<p></p>") {
        updatedErrorMessage.description = "requiredFieldError";
        errorOccurred = true;
      } else {
        updatedErrorMessage.description = null;
      }
      if (errorOccurred) {
        setErrorMessage((prevState: any) => ({
          ...prevState,
          ...updatedErrorMessage,
        }));
        return;
      } else {
        await postAdviceItem.query().then((res) => {
          fetchAdviceItems.query();
          setDisplayedItems([]);
        });
        removeDescriptionAdvice.current = true;
        setNewAdvice({
          ...newAdvice,
          title: "",
          description: "",
          priority: "",
          cost: "",
          impact: "",
        });
        setShowNewAdviceListForm(false);
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  return (
    <QueryData
      {...fetchAdviceItems}
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
                <Typography variant="semiBoldLarge">
                  <Trans i18nKey="suggestedActionItems" />
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
                      size="small"
                      variant="outlined"
                      onClick={handleAddNewRow}
                      data-test-id="newAdvice"
                    >
                      <Trans i18nKey="newActionItem" />
                    </Button>
                  </Link>
                )}
              </Box>{" "}
              <Divider sx={{ width: "100%" }} />
            </Box>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} mt={2}>
            {showNewAdviceListForm && (
              <AdviceListNewForm
                newAdvice={newAdvice}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
                setNewAdvice={setNewAdvice}
                removeDescriptionAdvice={removeDescriptionAdvice}
                postAdviceItem={postAdviceItem}
                errormessage={errorMessage}
              />
            )}
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
                  setDisplayedItems={setDisplayedItems}
                  query={fetchAdviceItems}
                  readOnly={false}
                />
              </Box>
            ) : (
              !showNewAdviceListForm && (
                <EmptyAdviceList
                  onAddNewRow={handleAddNewRow}
                  btnTitle="newActionItem"
                  title="noActionYet"
                />
              )
            )}
          </Grid>
        </Grid>
      )}
    />
  );
};

export default AdviceItems;

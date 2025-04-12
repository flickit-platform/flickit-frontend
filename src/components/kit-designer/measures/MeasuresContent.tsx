import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import ListOfItems from "../common/GeneralList";
import EmptyState from "../common/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import debounce from "lodash/debounce";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDHeader from "@/components/kit-designer/common/KitHeader";
import MeasureForm from "./MeasureForm";

const MeasuresContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const fetchMeasureKit = useQuery({
    service: (args, config) =>
      service.kitVersions.measures.getAll(args ?? { kitVersionId }, config),
  });
  const postMeasureKit = useQuery({
    service: (args, config) =>
      service.kitVersions.measures.create(args, config),
    runOnMount: false,
  });

  const updateKitMeasure = useQuery({
    service: (args, config) =>
      service.kitVersions.measures.update(args, config),
    runOnMount: false,
  });

  const [showNewMeasureForm, setShowNewMeasureForm] = useState(false);
  const [newMeasure, setNewMeasure] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    weight: 1,
  });

  useEffect(() => {
    if (fetchMeasureKit.data?.items?.length) {
      setNewMeasure((prev) => ({
        ...prev,
        index: fetchMeasureKit.data.items.length + 1,
        value: fetchMeasureKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchMeasureKit.data]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewMeasure((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewMeasureForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newMeasure.index,
        value: newMeasure.value,
        title: newMeasure.title,
        weight: newMeasure.weight,
        description: newMeasure.description,
      };
      if (newMeasure.id) {
        await service.kitVersions.measures.update({
          kitVersionId,
          measureId: newMeasure.id,
          data,
        });
      } else {
        await postMeasureKit.query({ kitVersionId, data });
      }

      // Reset form and re-fetch data after saving
      setShowNewMeasureForm(false);
      await fetchMeasureKit.query();

      // Reset the form values
      setNewMeasure({
        title: "",
        description: "",
        index: (fetchMeasureKit.data?.items.length ?? 0) + 1,
        value: (fetchMeasureKit.data?.items.length ?? 0) + 1,
        weight: 0,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleCancel = () => {
    setShowNewMeasureForm(false);
    setNewMeasure({
      title: "",
      description: "",
      index: (fetchMeasureKit.data?.items.length ?? 0) + 1,
      value: (fetchMeasureKit.data?.items.length ?? 0) + 1,
      weight: 0,
      id: null,
    });
  };

  const handleEdit = async (measureItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: measureItem.index,
        value: measureItem.value,
        title: measureItem.title,
        weight: measureItem.weight,
        description: measureItem.description,
      };
      await updateKitMeasure.query({
        kitVersionId,
        measureId: measureItem.id,
        data,
      });

      setShowNewMeasureForm(false);
      fetchMeasureKit.query();

      setNewMeasure({
        title: "",
        description: "",
        index: (fetchMeasureKit.data?.items.length ?? 0) + 1,
        value: (fetchMeasureKit.data?.items.length ?? 0) + 1,
        weight: 0,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const debouncedHandleReorder = debounce(async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
      }));

      await service.kitVersions.measures.reorder({ kitVersionId }, { orders });

      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  }, 2000);

  const handleReorder = (newOrder: any[]) => {
    debouncedHandleReorder(newOrder);
  };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDHeader
          onAddNewRow={handleAddNewRow}
          hasBtn={
            fetchMeasureKit.loaded && fetchMeasureKit.data.items.length !== 0
          }
          mainTitle={"kitDesignerTab.measures"}
          btnTitle={"kitDesignerTab.newMeasure"}
          description={"kitDesignerTab.measuresKitDesignerDescription"}
        />
        {fetchMeasureKit.loaded && fetchMeasureKit.data.items.length !== 0 ? (
          <Typography variant="bodyMedium" mt={1}>
            <Trans i18nKey="changeOrderHelper" />
          </Typography>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchMeasureKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([measureData]) => {
            return (
              <>
                {measureData?.items?.length > 0 ? (
                  <Box maxHeight={500} overflow="auto">
                    <ListOfItems
                      items={measureData?.items}
                      onEdit={handleEdit}
                      onReorder={handleReorder}
                      name={"measure"}
                    />
                  </Box>
                ) : (
                  !showNewMeasureForm && (
                    <EmptyState
                      btnTitle={"newMeasure"}
                      title={"measuresListEmptyState"}
                      SubTitle={"measureEmptyStateDetailed"}
                      onAddNewRow={handleAddNewRow}
                    />
                  )
                )}
                {showNewMeasureForm && (
                  <MeasureForm
                    newMeasure={newMeasure}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                  />
                )}
              </>
            );
          }}
        />
      </Box>
    </PermissionControl>
  );
};

export default MeasuresContent;

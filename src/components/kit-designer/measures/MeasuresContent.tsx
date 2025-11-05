import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import ListOfItems from "../common/GeneralList";
import EmptyState from "../common/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/custom-error";
import debounce from "lodash/debounce";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDesignerHeader from "@/components/kit-designer/common/KitHeader";
import MeasureForm from "./MeasureForm";
import { MultiLangs } from "@/types";
import { t } from "i18next";
import showToast from "@/utils/toast-error";
import { Text } from "@/components/common/Text";

const MeasuresContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const fetchMeasures = useQuery({
    service: (args, config) =>
      service.kitVersions.measures.getAll(args ?? { kitVersionId }, config),
  });

  const createMeasure = useQuery({
    service: (args, config) =>
      service.kitVersions.measures.create(args, config),
    runOnMount: false,
  });

  const updateMeasure = useQuery({
    service: (args, config) =>
      service.kitVersions.measures.update(args, config),
    runOnMount: false,
  });

  const [showNewForm, setShowNewForm] = useState(false);
  const [newMeasure, setNewMeasure] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    weight: 1,
    id: null,
    translations: null as MultiLangs | null,
  });

  useEffect(() => {
    const count = fetchMeasures.data?.items?.length ?? 0;
    setNewMeasure((prev) => ({
      ...prev,
      index: count + 1,
      value: count + 1,
      weight: 1,
      id: null,
    }));
  }, [fetchMeasures.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMeasure((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        title: newMeasure.title,
        description: newMeasure.description,
        value: newMeasure.value,
        index: newMeasure.index,
        weight: newMeasure.weight,
        translations: newMeasure.translations,
      };

      if (newMeasure.id) {
        await updateMeasure.query({
          kitVersionId,
          measureId: newMeasure.id,
          data,
        });
      } else {
        await createMeasure.query({ kitVersionId, data });
      }

      setShowNewForm(false);
      await fetchMeasures.query();

      setNewMeasure({
        title: "",
        description: "",
        index: (fetchMeasures.data?.items.length ?? 0) + 1,
        value: (fetchMeasures.data?.items.length ?? 0) + 1,
        weight: 1,
        id: null,
        translations: null,
      });
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const handleCancel = () => {
    setShowNewForm(false);
    setNewMeasure({
      title: "",
      description: "",
      index: (fetchMeasures.data?.items.length ?? 0) + 1,
      value: (fetchMeasures.data?.items.length ?? 0) + 1,
      weight: 1,
      id: null,
      translations: null,
    });
  };

  const handleEdit = async (item: any) => {
    try {
      const data = {
        kitVersionId,
        title: item.title,
        description: item.description,
        value: item.value,
        index: item.index,
        weight: item.weight,
        translations: item.translations,
      };

      await updateMeasure.query({
        kitVersionId,
        measureId: item.id,
        data,
      });

      setShowNewForm(false);
      await fetchMeasures.query();
      handleCancel();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const debouncedReorder = debounce(async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
      }));

      await service.kitVersions.measures.reorder({ kitVersionId }, { orders });
      handleCancel();
    } catch (e) {
      showToast(e as ICustomError);
    }
  }, 2000);

  const handleReorder = (newOrder: any[]) => {
    debouncedReorder(newOrder);
  };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDesignerHeader
          onAddNewRow={handleAddNewRow}
          hasBtn={fetchMeasures.loaded && fetchMeasures.data.items.length !== 0}
          mainTitle="kitDesigner.measures"
          btnTitle="kitDesigner.newMeasure"
          description="kitDesigner.measuresKitDesignerDescription"
        />
        {fetchMeasures.loaded && fetchMeasures.data.items.length !== 0 && (
          <Text variant="bodyMedium" mt={1}>
            <Trans i18nKey="kitDesigner.changeOrderHelper" />
          </Text>
        )}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchMeasures]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([data]) => (
            <>
              {data?.items?.length > 0 ? (
                <Box maxHeight={500} overflow="auto">
                  <ListOfItems
                    items={data.items}
                    onEdit={handleEdit}
                    onReorder={handleReorder}
                    editableFieldKey={"questionsCount"}
                    editableFieldLabel={t("common.questions")}
                    editable={false}
                  />
                </Box>
              ) : (
                !showNewForm && (
                  <EmptyState
                    btnTitle="kitDesigner.newMeasure"
                    title="kitDesigner.measuresListEmptyState"
                    SubTitle="kitDesigner.measureEmptyStateDetailed"
                    onAddNewRow={handleAddNewRow}
                  />
                )
              )}
              {showNewForm && (
                <MeasureForm
                  newMeasure={newMeasure}
                  handleInputChange={handleInputChange}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  setNewMeasure={setNewMeasure}
                />
              )}
            </>
          )}
        />
      </Box>
    </PermissionControl>
  );
};

export default MeasuresContent;

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import ListOfItems from "./QuestionnaireList";
import EmptyState from "../common/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/custom-error";
import debounce from "lodash/debounce";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDesignerHeader from "@components/kit-designer/common/KitHeader";
import QuestionnairesForm from "./QuestionnairesForm";
import showToast from "@/utils/toast-error";
import { Text } from "@/components/common/Text";

const QuestionnairesContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const fetchQuestionnairesKit = useQuery({
    service: (args, config) =>
      service.kitVersions.questionnaires.getAll(
        args ?? { kitVersionId },
        config,
      ),
  });
  const postQuestionnairesKit = useQuery({
    service: (args, config) =>
      service.kitVersions.questionnaires.create(args, config),
    runOnMount: false,
  });

  const updateKitQuestionnaires = useQuery({
    service: (args, config) =>
      service.kitVersions.questionnaires.update(args, config),
    runOnMount: false,
  });

  const [showNewQuestionnairesForm, setShowNewQuestionnairesForm] =
    useState(false);
  const [newQuestionnaires, setNewQuestionnaires] = useState({
    title: "",
    description: "",
    translations: null,
    index: 1,
    value: 1,
    id: null,
    weight: 1,
  });

  useEffect(() => {
    if (fetchQuestionnairesKit.data?.items?.length) {
      setNewQuestionnaires((prev) => ({
        ...prev,
        index: fetchQuestionnairesKit.data.items.length + 1,
        value: fetchQuestionnairesKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchQuestionnairesKit.data]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewQuestionnaires((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewQuestionnairesForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newQuestionnaires.index,
        value: newQuestionnaires.value,
        title: newQuestionnaires.title,
        weight: newQuestionnaires.weight,
        description: newQuestionnaires.description,
        translations: newQuestionnaires.translations,
      };
      if (newQuestionnaires.id) {
        await service.kitVersions.questionnaires.update({
          kitVersionId,
          questionnaireId: newQuestionnaires.id,
          data,
        });
      } else {
        await postQuestionnairesKit.query({ kitVersionId, data });
      }

      await fetchQuestionnairesKit.query();
      setShowNewQuestionnairesForm(false);

      setNewQuestionnaires({
        title: "",
        description: "",
        translations: null,
        index: (fetchQuestionnairesKit.data?.items.length ?? 0) + 1,
        value: (fetchQuestionnairesKit.data?.items.length ?? 0) + 1,
        weight: 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleCancel = () => {
    setShowNewQuestionnairesForm(false);
    setNewQuestionnaires({
      title: "",
      description: "",
      translations: null,
      index: (fetchQuestionnairesKit.data?.items.length ?? 0) + 1,
      value: (fetchQuestionnairesKit.data?.items.length ?? 0) + 1,
      weight: 0,
      id: null,
    });
  };

  const handleEdit = async (QuestionnairesItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: QuestionnairesItem.index,
        value: QuestionnairesItem.value,
        title: QuestionnairesItem.title,
        weight: QuestionnairesItem.weight,
        description: QuestionnairesItem.description,
        translations: QuestionnairesItem.translations,
      };
      await updateKitQuestionnaires.query({
        kitVersionId,
        questionnaireId: QuestionnairesItem.id,
        data,
      });

      setShowNewQuestionnairesForm(false);
      fetchQuestionnairesKit.query();

      setNewQuestionnaires({
        title: "",
        description: "",
        translations: null,
        index: (fetchQuestionnairesKit.data?.items.length ?? 0) + 1,
        value: (fetchQuestionnairesKit.data?.items.length ?? 0) + 1,
        weight: 0,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const debouncedHandleReorder = debounce(async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
      }));

      await service.kitVersions.questionnaires.reorder(
        { kitVersionId },
        { orders },
      );

      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  }, 2000);

  const handleReorder = (newOrder: any[]) => {
    debouncedHandleReorder(newOrder);
  };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDesignerHeader
          onAddNewRow={handleAddNewRow}
          hasBtn={
            fetchQuestionnairesKit.loaded &&
            fetchQuestionnairesKit.data.items.length !== 0
          }
          btnTitle="kitDesigner.newQuestionnaire"
          mainTitle="common.questionnaires"
          description="kitDesigner.questionnairesKitDesignerDescription"
        />
        {fetchQuestionnairesKit.loaded &&
        fetchQuestionnairesKit.data.items.length !== 0 ? (
          <Text variant="bodyMedium" mt={1}>
            <Trans i18nKey="kitDesigner.changeOrderHelper" />
          </Text>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchQuestionnairesKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([QuestionnairesData]) => {
            return (
              <>
                {QuestionnairesData?.items?.length > 0 ? (
                  <Box maxHeight={500} overflow="auto">
                    <ListOfItems
                      items={QuestionnairesData?.items}
                      fetchQuery={fetchQuestionnairesKit}
                      onEdit={handleEdit}
                      onReorder={handleReorder}
                    />
                  </Box>
                ) : (
                  !showNewQuestionnairesForm && (
                    <EmptyState
                      btnTitle="kitDesigner.newQuestionnaire"
                      title="kitDesigner.questionnairesListEmptyState"
                      SubTitle="kitDesigner.questionnairesEmptyStateDetailed"
                      onAddNewRow={handleAddNewRow}
                    />
                  )
                )}
                {showNewQuestionnairesForm && (
                  <QuestionnairesForm
                    newItem={newQuestionnaires}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    setNewQuestionnaires={setNewQuestionnaires}
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

export default QuestionnairesContent;

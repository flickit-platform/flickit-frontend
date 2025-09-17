import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/utils/useQuery";
import EmptyState from "../common/EmptyState";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import debounce from "lodash/debounce";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import KitDesignerHeader from "@/components/kit-designer/common/KitHeader";
import SubjectTable from "./SubjectTable";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import { MultiLangs } from "@/types";
import showToast from "@/utils/toastError";

interface INewAttribute {
  title: string;
  description: string;
  index: number;
  value: number;
  id: number | null;
  weight: number;
  translations: MultiLangs | null;
}
const AttributesContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    status: boolean;
    id: string;
  }>({ status: false, id: "" });

  const [subjects, setSubjects] = useState([]);

  const fetchSubjectKit = useQuery({
    service: (args, config) =>
      service.kitVersions.subjects.getAll(args ?? { kitVersionId }, config),
  });

  const fetchAttributeKit = useQuery({
    service: (args, config) =>
      service.kitVersions.attributes.getAll(args ?? { kitVersionId }, config),
  });

  const postAttributeKit = useQuery({
    service: (args, config) =>
      service.kitVersions.attributes.create(args, config),
    runOnMount: false,
  });

  const deleteAttributeKit = useQuery({
    service: (args, config) =>
      service.kitVersions.attributes.remove(args, config),
    runOnMount: false,
  });

  const updateKitAttribute = useQuery({
    service: (args, config) =>
      service.kitVersions.attributes.update(args, config),
    runOnMount: false,
  });

  const [showNewAttributeForm, setShowNewAttributeForm] = useState(false);
  const [newAttribute, setNewAttribute] = useState<INewAttribute>({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    weight: 1,
    translations: null,
  });

  useEffect(() => {
    fetchSubjectKit.query();
  }, []);

  useEffect(() => {
    if (fetchAttributeKit.data?.items?.length) {
      setNewAttribute((prev) => ({
        ...prev,
        index: fetchAttributeKit.data.items.length + 1,
        value: fetchAttributeKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchAttributeKit.data]);

  useEffect(() => {
    if (fetchSubjectKit.data) {
      setSubjects(fetchSubjectKit.data.items ?? []);
    }
  }, [fetchSubjectKit.data]);

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewAttributeForm(true);
  };

  const handleSave = async (subjectId: number) => {
    try {
      const data = {
        kitVersionId,
        index: newAttribute.index,
        value: newAttribute.value,
        title: newAttribute.title,
        weight: newAttribute.weight,
        description: newAttribute.description,
        translations: newAttribute.translations,
        subjectId: subjectId,
      };
      if (newAttribute?.id) {
        await service.kitVersions.attributes.update({
          kitVersionId,
          attributeId: newAttribute?.id,
          data,
        });
      } else {
        await postAttributeKit.query({ kitVersionId, data });
      }
      setShowNewAttributeForm(false);

      await fetchAttributeKit.query();

      setNewAttribute({
        title: "",
        description: "",
        translations: null,
        index: (fetchAttributeKit.data?.items.length ?? 0) + 1,
        value: (fetchAttributeKit.data?.items.length ?? 0) + 1,
        weight: 1,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleCancel = () => {
    setShowNewAttributeForm(false);
    setNewAttribute({
      title: "",
      description: "",
      translations: null,
      index: (fetchAttributeKit.data?.items.length ?? 0) + 1,
      value: (fetchAttributeKit.data?.items.length ?? 0) + 1,
      weight: 0,
      id: null,
    });
    setOpenDeleteDialog({ status: false, id: "" });
  };

  const handleEdit = async (AttributeItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: AttributeItem.index,
        value: AttributeItem.value,
        title: AttributeItem.title,
        weight: AttributeItem.weight,
        description: AttributeItem.description,
        subjectId: AttributeItem.subject.id,
        translations: AttributeItem.translations,
      };
      await updateKitAttribute.query({
        kitVersionId,
        attributeId: AttributeItem?.id,
        data,
      });

      setShowNewAttributeForm(false);
      fetchAttributeKit.query();

      setNewAttribute({
        title: "",
        description: "",
        translations: null,
        index: (fetchAttributeKit.data?.items.length ?? 0) + 1,
        value: (fetchAttributeKit.data?.items.length ?? 0) + 1,
        weight: 0,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleDelete = async () => {
    try {
      let attributeId = openDeleteDialog.id;
      await deleteAttributeKit.query({ kitVersionId, attributeId });
      await fetchAttributeKit.query();
      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const debouncedHandleReorder = debounce(
    async (newOrder: any[], destinationSubjectId: any) => {
      try {
        const orders = newOrder.map((item, idx) => ({
          id: item?.id,
          index: idx + 1,
        }));

        await service.kitVersions.attributes.reorder(
          { kitVersionId },
          { orders, subjectId: destinationSubjectId },
        );
        handleCancel();
      } catch (e) {
        const err = e as ICustomError;
        showToast(err);
      }
    },
    2000,
  );

  const handleReorder = (newOrder: any[], destinationSubjectId: any) => {
    debouncedHandleReorder(newOrder, destinationSubjectId);
  };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDesignerHeader
          onAddNewRow={handleAddNewRow}
          hasBtn={
            fetchAttributeKit.loaded &&
            fetchAttributeKit.data.items.length !== 0
          }
          mainTitle="common.attributes"
          description="kitDesigner.attributesKitDesignerDescription"
          btnTitle="kitDesigner.newAttribute"
        />
        {fetchAttributeKit.loaded &&
        fetchAttributeKit.data.items.length !== 0 ? (
          <Typography variant="bodyMedium" mt={1}>
            <Trans i18nKey="kitDesigner.changeOrderHelper" />
          </Typography>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchAttributeKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([AttributeData]) => (
            <>
              {AttributeData?.items?.length > 0 || showNewAttributeForm ? (
                <Box>
                  <SubjectTable
                    subjects={subjects}
                    initialAttributes={AttributeData?.items}
                    onAddAttribute={handleAddNewRow}
                    onReorder={handleReorder}
                    showNewAttributeForm={showNewAttributeForm}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    newAttribute={newAttribute}
                    setNewAttribute={setNewAttribute}
                    handleEdit={handleEdit}
                  />
                </Box>
              ) : (
                !showNewAttributeForm && (
                  <EmptyState
                    btnTitle="kitDesigner.newAttribute"
                    title="kitDesigner.attributesListEmptyState"
                    SubTitle="kitDesigner.attributeEmptyStateDetailed"
                    onAddNewRow={handleAddNewRow}
                    disabled={subjects.length === 0}
                    disableTextBox={
                      <Trans i18nKey="kitDesigner.disableAttributeMessage" />
                    }
                  />
                )
              )}
            </>
          )}
        />
      </Box>
      <DeleteConfirmationDialog
        open={openDeleteDialog.status}
        onClose={() =>
          setOpenDeleteDialog({ ...openDeleteDialog, status: false })
        }
        onConfirm={handleDelete}
        title="common.warning"
        content="kitDesigner.deleteAttribute"
      />
    </PermissionControl>
  );
};

export default AttributesContent;

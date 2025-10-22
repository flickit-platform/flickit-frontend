import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import PermissionControl from "../../common/PermissionControl";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import ListOfItems from "./AnswerRangeList";
import EmptyState from "../common/EmptyState";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/custom-error";
import debounce from "lodash/debounce";
import KitDesignerHeader from "@components/kit-designer/common/KitHeader";
import AnswerRangeForm from "./AnswerRangeForm";
import showToast from "@/utils/toast-error";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import { useTranslation } from "react-i18next";

const AnaweRangeContent = () => {
  const { t } = useTranslation();
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();
  const [data, setData] = useState<any>([]);
  const [changeData, setChangeData] = useState(false);
  const fetchAnswerRangeKit = useQuery({
    service: (args, config) =>
      service.kitVersions.answerRanges.getAll(args ?? { kitVersionId }, config),
    runOnMount: false,
  });
  const postKitAnswerRange = useQuery({
    service: (args, config) =>
      service.kitVersions.answerRanges.create(args, config),
    runOnMount: false,
  });

  const updateKitAnswerRange = useQuery({
    service: (args, config) =>
      service.kitVersions.answerRanges.update(args, config),
    runOnMount: false,
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    status: boolean;
    id: string;
    title: string;
  }>({ status: false, id: "", title: "" });

  const [showNewAnswerRangeForm, setShowNewAnswerRangeForm] = useState(false);
  const [newAnswerRange, setNewAnswerRange] = useState({
    title: "",
    translations: null,
    index: 1,
    id: null,
  });

  const deleteAnsweRange = useQuery({
    service: (args, config) =>
      service.kitVersions.answerRanges.remove(args, config),
    runOnMount: false,
  });

  const handleDelete = async () => {
    try {
      let answerRangeId = openDeleteDialog.id;
      await deleteAnsweRange.query({ kitVersionId, answerRangeId });
      await fetchAnswerRangeKit.query();
      handleCancel();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
    setOpenDeleteDialog({ ...openDeleteDialog, status: false });
  };

  useEffect(() => {
    if (fetchAnswerRangeKit.data?.items?.length) {
      setNewAnswerRange((prev) => ({
        ...prev,
        index: fetchAnswerRangeKit.data.items.length + 1,
        id: null,
      }));
    }
  }, [fetchAnswerRangeKit.data]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseFloat(value) || 1 : value;
    setNewAnswerRange((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewAnswerRangeForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        answerRangeId: newAnswerRange.index,
        title: newAnswerRange.title,
        translations: newAnswerRange.translations,
      };
      if (newAnswerRange.id) {
        await service.kitVersions.answerRanges.update({
          kitVersionId,
          answerRangeId: newAnswerRange.id,
          data,
        });
      } else {
        await postKitAnswerRange.query({ kitVersionId, data });
      }

      // Reset the form values
      setShowNewAnswerRangeForm(false);
      setNewAnswerRange({
        title: "",
        translations: null,
        index: (fetchAnswerRangeKit.data?.items.length ?? 0) + 1,
        id: null,
      });
      setChangeData((prev) => !prev);
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleCancel = () => {
    setShowNewAnswerRangeForm(false);
    setNewAnswerRange({
      title: "",
      translations: null,
      index: (fetchAnswerRangeKit.data?.items.length ?? 0) + 1,
      id: null,
    });
  };

  const handleEdit = async (AnswerRangeItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: AnswerRangeItem.index,
        title: AnswerRangeItem.title,
        translations: AnswerRangeItem.translations,
        reusable: true,
      };
      await updateKitAnswerRange.query({
        kitVersionId,
        answerRangeId: AnswerRangeItem.id,
        data,
      });

      setShowNewAnswerRangeForm(false);

      setNewAnswerRange({
        title: "",
        translations: null,
        index: (fetchAnswerRangeKit.data?.items.length ?? 0) + 1,
        id: null,
      });
      setChangeData((prev) => !prev);
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

  useEffect(() => {
    (async () => {
      await fetchAnswerRangeKit.query().then((res) => {
        const { items } = res;
        setData(items);
      });
    })();
  }, [changeData]);
  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDesignerHeader
          onAddNewRow={handleAddNewRow}
          hasBtn={
            fetchAnswerRangeKit.loaded &&
            fetchAnswerRangeKit.data.items.length !== 0
          }
          btnTitle="kitDesigner.newAnswerRange"
          mainTitle="kitDesigner.answerRanges"
          description="kitDesigner.answerRangeKitDesignerDescription"
        />
        <Divider sx={{ my: 1 }} />
        <>
          {data?.length !== 0 ? (
            <Box maxHeight={500} overflow="auto">
              <ListOfItems
                items={data}
                fetchQuery={fetchAnswerRangeKit}
                onEdit={handleEdit}
                onReorder={handleReorder}
                setChangeData={setChangeData}
                setOpenDeleteDialog={setOpenDeleteDialog}
              />
            </Box>
          ) : (
            data?.length == 0 &&
            !showNewAnswerRangeForm && (
              <EmptyState
                btnTitle="kitDesigner.newAnswerRange"
                title="kitDesigner.answerRangeListEmptyState"
                SubTitle="kitDesigner.answerRangeEmptyStateDetailed"
                onAddNewRow={handleAddNewRow}
              />
            )
          )}

          {showNewAnswerRangeForm && (
            <AnswerRangeForm
              newItem={newAnswerRange}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
              handleCancel={handleCancel}
              setNewAnswerRange={setNewAnswerRange}
            />
          )}
        </>
        <DeleteConfirmationDialog
          open={openDeleteDialog.status}
          onClose={() =>
            setOpenDeleteDialog({ ...openDeleteDialog, status: false })
          }
          onConfirm={handleDelete}
          content={{
            category: t("common.answerRange"),
            title: openDeleteDialog.title,
          }}
        />
      </Box>
    </PermissionControl>
  );
};

export default AnaweRangeContent;

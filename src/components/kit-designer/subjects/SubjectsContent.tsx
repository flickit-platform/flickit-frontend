import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Text } from "@/components/common/Text";
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
import SubjectForm from "./SubjectForm";
import { t } from "i18next";
import showToast from "@/utils/toast-error";

const SubjectsContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const fetchSubjectKit = useQuery({
    service: (args, config) =>
      service.kitVersions.subjects.getAll(args ?? { kitVersionId }, config),
  });
  const postSubjectKit = useQuery({
    service: (args, config) =>
      service.kitVersions.subjects.create(args, config),
    runOnMount: false,
  });

  const updateKitSubject = useQuery({
    service: (args, config) =>
      service.kitVersions.subjects.update(args, config),
    runOnMount: false,
  });

  const [showNewSubjectForm, setShowNewSubjectForm] = useState(false);
  const [newSubject, setNewSubject] = useState({
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    weight: 1,
    translations: null,
  });

  useEffect(() => {
    if (fetchSubjectKit.data?.items?.length) {
      setNewSubject((prev) => ({
        ...prev,
        index: fetchSubjectKit.data.items.length + 1,
        value: fetchSubjectKit.data.items.length + 1,
        weight: 1,
        id: null,
      }));
    }
  }, [fetchSubjectKit.data]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewRow = () => {
    handleCancel();
    setShowNewSubjectForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newSubject.index,
        value: newSubject.value,
        title: newSubject.title,
        weight: newSubject.weight,
        description: newSubject.description,
        translations: newSubject.translations,
      };
      if (newSubject.id) {
        await service.kitVersions.subjects.update({
          kitVersionId,
          subjectId: newSubject.id,
          data,
        });
      } else {
        await postSubjectKit.query({ kitVersionId, data });
      }

      // Reset form and re-fetch data after saving
      setShowNewSubjectForm(false);
      await fetchSubjectKit.query();

      // Reset the form values
      setNewSubject({
        title: "",
        description: "",
        index: (fetchSubjectKit.data?.items.length ?? 0) + 1,
        value: (fetchSubjectKit.data?.items.length ?? 0) + 1,
        translations: null,
        weight: 0,
        id: null,
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  const handleCancel = () => {
    setShowNewSubjectForm(false);
    setNewSubject({
      title: "",
      description: "",
      index: (fetchSubjectKit.data?.items.length ?? 0) + 1,
      value: (fetchSubjectKit.data?.items.length ?? 0) + 1,
      translations: null,
      weight: 0,
      id: null,
    });
  };

  const handleEdit = async (subjectItem: any) => {
    try {
      const data = {
        kitVersionId,
        index: subjectItem.index,
        value: subjectItem.value,
        title: subjectItem.title,
        weight: subjectItem.weight,
        description: subjectItem.description,
        translations: subjectItem.translations,
      };
      await updateKitSubject.query({
        kitVersionId,
        subjectId: subjectItem.id,
        data,
      });

      setShowNewSubjectForm(false);
      fetchSubjectKit.query();

      setNewSubject({
        title: "",
        description: "",
        index: (fetchSubjectKit.data?.items.length ?? 0) + 1,
        value: (fetchSubjectKit.data?.items.length ?? 0) + 1,
        translations: null,
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

      await service.kitVersions.subjects.reorder({ kitVersionId }, { orders });

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
            fetchSubjectKit.loaded && fetchSubjectKit.data.items.length !== 0
          }
          mainTitle="common.subjects"
          btnTitle="kitDesigner.newSubject"
          description="kitDesigner.subjectsKitDesignerDescription"
        />
        {fetchSubjectKit.loaded && fetchSubjectKit.data.items.length !== 0 ? (
          <Text variant="bodyMedium" mt={1}>
            <Trans i18nKey="kitDesigner.changeOrderHelper" />
          </Text>
        ) : null}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[fetchSubjectKit]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([subjectData]) => {
            return (
              <>
                {subjectData?.items?.length > 0 ? (
                  <Box maxHeight={500} overflow="auto">
                    <ListOfItems
                      items={subjectData?.items}
                      onEdit={handleEdit}
                      onReorder={handleReorder}
                      editableFieldKey="weight"
                      editableFieldLabel={t("common.weight")}
                    />
                  </Box>
                ) : (
                  !showNewSubjectForm && (
                    <EmptyState
                      btnTitle="kitDesigner.newSubject"
                      title="kitDesigner.subjectsListEmptyState"
                      SubTitle="kitDesigner.subjectEmptyStateDetailed"
                      onAddNewRow={handleAddNewRow}
                    />
                  )
                )}
                {showNewSubjectForm && (
                  <SubjectForm
                    newSubject={newSubject}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    setNewSubject={setNewSubject}
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

export default SubjectsContent;

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PermissionControl from "../../common/PermissionControl";
import QueryBatchData from "../../common/QueryBatchData";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useQuery } from "@/utils/useQuery";
import { LoadingSkeleton } from "../../common/loadings/LoadingSkeleton";
import MaturityLevelForm from "./MaturityLevelForm";
import MaturityLevelList from "./MaturityLevelList";
import CompetencesTable from "./CompetencesTable";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import debounce from "lodash/debounce";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import KitDesignerHeader from "../common/KitHeader";
import EmptyState from "../common/EmptyState";
import showToast from "@/utils/toastError";

const MaturityLevelsContent = () => {
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    status: false,
    id: "",
  });

  const maturityLevels = useQuery({
    service: (args, config) =>
      service.kitVersions.maturityLevel.getAll(
        args ?? { kitVersionId },
        config,
      ),
  });

  const maturityLevelsCompetences = useQuery({
    service: (args, config) =>
      service.kitVersions.levelsCompetences.getAll(
        args ?? { kitVersionId },
        config,
      ),
  });

  const [showNewMaturityLevelForm, setShowNewMaturityLevelForm] =
    useState(false);

  const initialMaturityLevel = {
    title: "",
    description: "",
    index: 1,
    value: 1,
    id: null,
    translations: null,
  };

  const [newMaturityLevel, setNewMaturityLevel] =
    useState(initialMaturityLevel);

  useEffect(() => {
    if (maturityLevels.data?.items?.length) {
      setNewMaturityLevel((prev) => ({
        ...prev,
        index: maturityLevels.data.items.length + 1,
        value: maturityLevels.data.items.length + 1,
        id: null,
      }));
    }
  }, [maturityLevels.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === "value" ? parseInt(value) || 1 : value;
    setNewMaturityLevel((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleNewMaturityLevelClick = () => {
    handleCancel();
    setShowNewMaturityLevelForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        kitVersionId,
        index: newMaturityLevel.index,
        value: newMaturityLevel.value,
        title: newMaturityLevel.title,
        description: newMaturityLevel.description,
        translations: newMaturityLevel.translations,
      };

      if (newMaturityLevel.id) {
        await service.kitVersions.maturityLevel.update(
          { kitVersionId, maturityLevelId: newMaturityLevel.id },
          data,
        );
      } else {
        await service.kitVersions.maturityLevel.create({ kitVersionId }, data);
      }

      setShowNewMaturityLevelForm(false);
      maturityLevels.query();
      maturityLevelsCompetences.query();
      setNewMaturityLevel({
        ...initialMaturityLevel,
        index: (maturityLevels.data?.items.length ?? 0) + 1,
        value: (maturityLevels.data?.items.length ?? 0) + 1,
      });
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const handleCancel = () => {
    setShowNewMaturityLevelForm(false);
    setNewMaturityLevel({
      ...initialMaturityLevel,
      index: (maturityLevels.data?.items.length ?? 0) + 1,
      value: (maturityLevels.data?.items.length ?? 0) + 1,
    });
    setOpenDeleteDialog({ status: false, id: "" });
  };

  const handleEdit = async (maturityLevel: any) => {
    try {
      const data = {
        kitVersionId,
        index: maturityLevel.index,
        value: maturityLevel.value,
        title: maturityLevel.title,
        description: maturityLevel.description,
        translations: maturityLevel.translations,
      };
      await service.kitVersions.maturityLevel.update(
        { kitVersionId, maturityLevelId: maturityLevel.id },
        data,
      );

      setShowNewMaturityLevelForm(false);
      maturityLevels.query();
      maturityLevelsCompetences.query();

      setNewMaturityLevel({
        ...initialMaturityLevel,
        index: (maturityLevels.data?.items.length ?? 0) + 1,
        value: (maturityLevels.data?.items.length ?? 0) + 1,
      });
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const handleDelete = async () => {
    try {
      await service.kitVersions.maturityLevel.remove({
        kitVersionId,
        maturityLevelId: openDeleteDialog.id,
      });
      maturityLevels.query();
      maturityLevelsCompetences.query();
      handleCancel();
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const debouncedHandleReorder = debounce(async (newOrder: any[]) => {
    try {
      const orders = newOrder.map((item, idx) => ({
        id: item.id,
        index: idx + 1,
      }));

      await service.kitVersions.maturityLevel.changeOrder(
        { kitVersionId },
        { orders },
      );
      maturityLevelsCompetences.query();

      handleCancel();
    } catch (e) {
      showToast(e as ICustomError);
    }
  }, 2000);

  const handleReorder = (newOrder: any[]) => {
    debouncedHandleReorder(newOrder);
  };

  return (
    <PermissionControl scopes={["edit-assessment-kit"]}>
      <Box width="100%">
        <KitDesignerHeader
          onAddNewRow={handleNewMaturityLevelClick}
          hasBtn={
            maturityLevels.loaded && maturityLevels.data.items.length !== 0
          }
          mainTitle="common.maturityLevels"
          btnTitle="kitDesigner.newMaturityLevel"
          description="kitDesigner.maturityLevelsKitDesignerDescription"
        />
        {maturityLevels.loaded && maturityLevels.data.items.length !== 0 && (
          <Typography variant="bodyMedium" mt={1}>
            <Trans i18nKey="kitDesigner.changeOrderHelper" />
          </Typography>
        )}
        <Divider sx={{ my: 1 }} />

        <QueryBatchData
          queryBatchData={[maturityLevels]}
          renderLoading={() => <LoadingSkeletonKitCard />}
          render={([maturityLevelsData]) => {
            return (
              <>
                {maturityLevelsData?.items?.length > 0 ? (
                  <>
                    <Box maxHeight={500} overflow="auto">
                      <MaturityLevelList
                        maturityLevels={maturityLevelsData.items}
                        onEdit={handleEdit}
                        onReorder={handleReorder}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                      />
                    </Box>

                    {showNewMaturityLevelForm && (
                      <MaturityLevelForm
                        newMaturityLevel={newMaturityLevel}
                        setNewMaturityLevel={setNewMaturityLevel as any}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {showNewMaturityLevelForm ? (
                      <MaturityLevelForm
                        newMaturityLevel={newMaturityLevel}
                        setNewMaturityLevel={setNewMaturityLevel as any}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                      />
                    ) : (
                      <EmptyState
                        btnTitle="kitDesigner.newMaturityLevel"
                        title="kitDesigner.maturityLevelsListEmptyState"
                        SubTitle="kitDesigner.maturityLevelsListEmptyStateDetailed"
                        onAddNewRow={handleNewMaturityLevelClick}
                      />
                    )}
                  </>
                )}
              </>
            );
          }}
        />

        {maturityLevels.loaded && maturityLevels.data.items.length !== 0 && (
          <Box mt={4}>
            <Typography variant="headlineSmall" fontWeight="bold">
              <Trans i18nKey="common.competences" />
            </Typography>
            <Divider sx={{ my: 1 }} />
            <QueryBatchData
              queryBatchData={[maturityLevelsCompetences]}
              renderLoading={() => <LoadingSkeleton height={200} />}
              render={([maturityLevelsCompetencesData]) => (
                <CompetencesTable
                  data={maturityLevelsCompetencesData?.items}
                  maturityLevelsCompetences={maturityLevelsCompetences}
                  kitVersionId={kitVersionId}
                />
              )}
            />
          </Box>
        )}
      </Box>

      <DeleteConfirmationDialog
        open={openDeleteDialog.status}
        onClose={() =>
          setOpenDeleteDialog({ ...openDeleteDialog, status: false })
        }
        onConfirm={handleDelete}
        title="common.warning"
        content="kitDesigner.deleteMaturityLevel"
      />
    </PermissionControl>
  );
};

export default MaturityLevelsContent;

import { useState } from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import AttributeImpactList from "./ImpactList";
import ImpactForm from "./ImpactForm";
import EmptyState from "../../common/EmptyState";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/custom-error";
import i18next, { t } from "i18next";
import showToast from "@/utils/toast-error";
import { Text } from "@/components/common/Text";
import usePopover from "@/hooks/usePopover";
import { GenericPopover } from "@common/PopOver";
import { Button } from "@mui/material";
import { getDeleteContent, getDeleteTitle } from "@common/dialogs/DeleteConfirmationDialog";

const ImpactSection: React.FC<{ question: any }> = ({ question }) => {
  const { kitVersionId = "" } = useParams();
  const { service } = useServiceContext();
  const lng = i18next.language
  const {anchorEl, open, handlePopoverOpen, handlePopoverClose, data} = usePopover();
  const [showForm, setShowForm] = useState(false);
  const [impact, setImpact] = useState({
    questionId: question.id,
    attributeId: undefined,
    maturityLevelId: undefined,
    weight: 1,
  });

  const fetchAttributeKit = useQuery({
    service: () => service.kitVersions.attributes.getAll({ kitVersionId }),
    runOnMount: true,
  });

  const fetchMaturityLevels = useQuery({
    service: () => service.kitVersions.maturityLevel.getAll({ kitVersionId }),
    runOnMount: true,
  });

  const fetchImpacts = useQuery({
    service: () =>
      service.kitVersions.questions.getImpacts({
        kitVersionId,
        questionId: question.id,
      }),
    runOnMount: true,
  });

  const createImpact = useQuery({
    service: (args, config) =>
      service.kitVersions.questionImpacts.create(args, config),
  });

  const updateImpact = useQuery({
    service: (args, config) =>
      service.kitVersions.questionImpacts.update(args, config),
  });

  const deleteImpact = useQuery({
    service: (args, config) =>
      service.kitVersions.questionImpacts.remove(args, config),
  });

  const handleSave = async () => {
    try {
      await createImpact.query({ kitVersionId, data: impact });
      fetchImpacts.query();
      setShowForm(false);
      resetForm();
    } catch (err) {
      showToast(err as ICustomError);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleEdit = async (values: any, item: any) => {
    try {
      await updateImpact.query({
        kitVersionId,
        questionImpactId: item.questionImpactId,
        data: values,
      });
      fetchImpacts.query();
    } catch (err) {
      showToast(err as ICustomError);
    }
  };

  const handleDelete = async (item: any) => {
    try {
      await deleteImpact.query({
        kitVersionId,
        questionImpactId: item.questionImpactId,
      });
      fetchImpacts.query();
      handlePopoverClose()
    } catch (err) {
      showToast(err as ICustomError);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setImpact((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setImpact({
      questionId: question.id,
      attributeId: undefined,
      maturityLevelId: undefined,
      weight: 1,
    });
  };

  const fields = [
    {
      id: 1,
      name: "attributeId",
      label: t("kitDesigner.attribute"),
      options: fetchAttributeKit?.data?.items ?? [],
    },
    {
      id: 2,
      name: "maturityLevelId",
      label: t("common.maturityLevel"),
      options: fetchMaturityLevels?.data?.items ?? [],
    },
  ];

  const impacts = fetchImpacts?.data?.attributeImpacts ?? [];
  const disabled = fields.some((f) => f.options.length === 0);
  return (
    <>
      <Box display="flex" flexDirection="column" gap={1} mt={4}>
        <Text variant="titleSmall" gutterBottom>
          <Trans i18nKey="kitDesigner.questionImpacts" />
        </Text>
        <Text variant="bodyMedium" color="textSecondary">
          <Trans i18nKey="kitDesigner.optionsImpactsDescription" />
        </Text>
      </Box>

      <>
        {impacts?.length > 0 ? (
          <Box maxHeight={500} overflow="auto">
            <AttributeImpactList
              attributeImpacts={impacts}
              questionId={question.id}
              isAddingNew={showForm}
              setIsAddingNew={setShowForm}
              handleDeleteImpact={(e: any, item: any) => {
                handlePopoverOpen(e, item);
              }}
              handleEditImpact={handleEdit}
              fields={fields}
              hasWeight={true}
            />
          </Box>
        ) : (
          !showForm && (
            <EmptyState
              btnTitle="kitDesigner.newOptionImpact"
              title="kitDesigner.optionsImpactsEmptyState"
              SubTitle="kitDesigner.optionsImpactsEmptyStateDetailed"
              onAddNewRow={() => setShowForm(true)}
              disabled={disabled}
              disableTextBox={
                <Trans i18nKey="kitDesigner.optionsImpactsDisabled" />
              }
            />
          )
        )}
        {showForm && (
          <ImpactForm
            newItem={impact}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            fields={fields}
          />
        )}
      </>
      <GenericPopover
        open={open}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        title={getDeleteTitle({
          category: t("kitDesigner.impact"),
        })}
        direction={lng === "fa" ? "rtl" : "ltr"}
        actions={
          <>
            <Button
              variant="outlined"
              onClick={handlePopoverClose}
            >
              <Text variant="labelMedium">{t("common.cancel", { lng })}</Text>
            </Button>
            <Button variant="contained" onClick={() => handleDelete(data)}>
              <Text variant="labelMedium">{t("common.confirm", { lng })}</Text>
            </Button>
          </>
        }
        hideBackdrop
      >
        <Text>
          {getDeleteContent({
            title:  "",
            category: t("kitDesigner.impact"),
            lng,
          })}
        </Text>
      </GenericPopover>
    </>
  );
};

export default ImpactSection;

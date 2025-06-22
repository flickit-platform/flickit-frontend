import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import AttributeImpactList from "./ImpactList";
import ImpactForm from "./ImpactForm";
import EmptyState from "../../common/EmptyState";
import { useQuery } from "@/utils/useQuery";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { t } from "i18next";

const ImpactSection: React.FC<{ question: any }> = ({ question }) => {
  const { kitVersionId = "" } = useParams();
  const { service } = useServiceContext();

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
      service.kitVersions.questionImpacts.update(args, config),
  });

  const handleSave = async () => {
    try {
      await createImpact.query({ kitVersionId, data: impact });
      fetchImpacts.query();
      setShowForm(false);
      resetForm();
    } catch (err) {
      toastError(err as ICustomError);
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
      toastError(err as ICustomError);
    }
  };

  const handleDelete = async (item: any) => {
    try {
      await deleteImpact.query({
        kitVersionId,
        questionImpactId: item.questionImpactId,
      });
      fetchImpacts.query();
    } catch (err) {
      toastError(err as ICustomError);
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
      name: "attributeId",
      label: t("kitDesigner.attribute"),
      options: fetchAttributeKit?.data?.items ?? [],
    },
    {
      name: "maturityLevelId",
      label: t("maturityLevel"),
      options: fetchMaturityLevels?.data?.items ?? [],
    },
  ];

  const impacts = fetchImpacts?.data?.attributeImpacts ?? [];
  const disabled = fields.some((f) => f.options.length === 0);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1} mt={4}>
        <Typography variant="semiBoldXLarge" gutterBottom>
          <Trans i18nKey="questionImpacts" />
        </Typography>
        <Typography variant="bodyMedium" color="textSecondary">
          <Trans i18nKey="optionsImpactsDescription" />
        </Typography>
      </Box>

      <>
        {impacts?.length > 0 ? (
          <Box maxHeight={500} overflow="auto">
            <AttributeImpactList
              attributeImpacts={impacts}
              questionId={question.id}
              isAddingNew={showForm}
              setIsAddingNew={setShowForm}
              handleDeleteImpact={handleDelete}
              handleEditImpact={handleEdit}
              fields={fields}
              hasWeight={true}
            />
          </Box>
        ) : (
          !showForm && (
            <EmptyState
              btnTitle="newOptionImpact"
              title="optionsImpactsEmptyState"
              SubTitle="optionsImpactsEmptyStateDetailed"
              onAddNewRow={() => setShowForm(true)}
              disabled={disabled}
              disableTextBox={<Trans i18nKey="optionsImpactsDisabled" />}
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
    </>
  );
};

export default ImpactSection;

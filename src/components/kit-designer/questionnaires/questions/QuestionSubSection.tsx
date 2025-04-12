import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Trans } from "react-i18next";
import AttributeImpactList from "./ImpactList";
import ImpactForm from "./ImpactForm";
import EmptyState from "../../common/EmptyState";

interface Field {
  name: string;
  label: string;
  options: any[];
}

interface QuestionSubSectionProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptySubtitle: string;
  emptyBtnTitle: string;
  disabledCondition?: boolean;
  impacts: any[];
  fields: Field[];
  hasWeight: boolean;
  isAddingNew: boolean;
  setIsAddingNew: (value: boolean) => void;
  newImpact: any;
  handlers: {
    onAdd: () => void;
    onSave: () => void;
    onCancel: () => void;
    onEdit: (values: any, item: any) => void;
    onDelete: (item: any) => void;
    onInputChange: (field: string, value: any) => void;
  };
  questionId?: number;
}

const QuestionSubSection: React.FC<QuestionSubSectionProps> = ({
  title,
  description,
  emptyTitle,
  emptySubtitle,
  emptyBtnTitle,
  disabledCondition,
  impacts,
  fields,
  hasWeight,
  isAddingNew,
  setIsAddingNew,
  newImpact,
  handlers,
  questionId,
}) => {
  return (
    <>
      <Box display="flex" flexDirection="column" gap={1} mt={4}>
        <Typography variant="semiBoldXLarge" gutterBottom>
          <Trans i18nKey={title} />
        </Typography>
        <Typography variant="bodyMedium" color="textSecondary">
          <Trans i18nKey={description} />
        </Typography>
      </Box>

      {impacts?.length > 0 ? (
        <>
          <Box maxHeight={500} overflow="auto">
            <AttributeImpactList
              attributeImpacts={impacts}
              questionId={questionId}
              isAddingNew={isAddingNew}
              setIsAddingNew={setIsAddingNew}
              handleDeleteImpact={handlers.onDelete}
              handleEditImpact={handlers.onEdit}
              fields={fields}
              hasWeight={hasWeight}
            />
          </Box>
          {isAddingNew && (
            <ImpactForm
              newItem={newImpact}
              handleInputChange={handlers.onInputChange}
              handleSave={handlers.onSave}
              handleCancel={handlers.onCancel}
              fields={fields}
              hasWeight={hasWeight}
            />
          )}
        </>
      ) : (
        <>
          {isAddingNew ? (
            <ImpactForm
              newItem={newImpact}
              handleInputChange={handlers.onInputChange}
              handleSave={handlers.onSave}
              handleCancel={handlers.onCancel}
              fields={fields}
              hasWeight={hasWeight}
            />
          ) : (
            <EmptyState
              btnTitle={emptyBtnTitle}
              title={emptyTitle}
              SubTitle={emptySubtitle}
              onAddNewRow={handlers.onAdd}
              disabled={disabledCondition}
              disableTextBox={<Trans i18nKey="optionsImpactsDisabled" />}
            />
          )}
        </>
      )}
    </>
  );
};

export default QuestionSubSection;

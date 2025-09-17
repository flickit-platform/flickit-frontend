import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Trans } from "react-i18next";
import { t } from "i18next";
import { TId } from "@/types/index";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import uniqueId from "@/utils/unique-id";
import { styles } from "@styles";

interface OptionValue {
  optionId: number;
  value: number;
}

interface Impact {
  questionImpactId: number;
  weight: number;
  maturityLevel?: {
    maturityLevelId: number;
    title: string;
  };
  optionValues?: OptionValue[];
  [key: string]: any;
}

interface AttributeImpact {
  attributeId: number;
  title: string;
  impacts: Impact[];
}

interface FieldConfig {
  name: string;
  label: string;
  options?: Array<{ id: number; title: string }>;
}

interface AttributeImpactListProps {
  attributeImpacts: AttributeImpact[];
  questionId?: TId;
  isAddingNew: boolean;
  setIsAddingNew: any;
  handleDeleteImpact: any;
  handleEditImpact: any;
  fields: FieldConfig[];
  hasWeight?: boolean;
}

const AttributeImpactList = ({
  attributeImpacts,
  questionId,
  isAddingNew,
  setIsAddingNew,
  handleDeleteImpact,
  handleEditImpact,
  fields,
  hasWeight = true,
}: AttributeImpactListProps) => {
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, any>>({
    questionId,
    weight: 1,
  });

  const toggleEditMode = (
    id: number | null,
    item?: Impact,
    attribute?: any,
  ) => {
    if (id !== null && item && attribute) {
      const newTemp: Record<string, any> = {
        questionId,
        weight: item.weight ?? 0,
      };
      fields.forEach((field) => {
        const key = field.name;
        newTemp[key] =
          key === "attributeId"
            ? attribute?.attributeId
            : (item?.[key]?.id ?? item?.maturityLevel?.maturityLevelId);
      });
      setTempValues(newTemp);
    }
    setEditMode(id);
  };

  const handleInputChange = (field: string, value: any) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async (item: Impact) => {
    handleEditImpact(tempValues, item);
    toggleEditMode(null);
  };

  const handleCancelClick = () => {
    toggleEditMode(null);
    setTempValues({ questionId, weight: 1 });
  };

  return (
    <Box mt={2}>
      {attributeImpacts.map((attribute) => (
        <Box
          key={attribute.attributeId}
          sx={{ mb: 2 }}
          paddingX={2}
          maxHeight={200}
          overflow="auto"
        >
          {attribute.impacts.map((item) => (
            <Box
              key={item.questionImpactId}
              justifyContent="space-between"
              py={1.5}
              sx={{ ...styles.centerV }}
            >
              <ImpactDetails
                attribute={attribute}
                item={item}
                editMode={editMode}
                tempValues={tempValues}
                handleInputChange={handleInputChange}
                toggleEditMode={() =>
                  toggleEditMode(item.questionImpactId, item, attribute)
                }
                fields={fields}
                hasWeight={hasWeight}
              />

              <ActionButtons
                item={item}
                editMode={editMode === item.questionImpactId}
                onSave={() => handleSaveClick(item)}
                onCancel={handleCancelClick}
                onEdit={() =>
                  toggleEditMode(item.questionImpactId, item, attribute)
                }
                onDelete={() => handleDeleteImpact(item)}
              />
            </Box>
          ))}
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}

      {!isAddingNew && (
        <Box mt={2} sx={{ ...styles.centerH }}>
          <Button
            onClick={() => setIsAddingNew(true)}
            variant="outlined"
            color="primary"
            size="small"
          >
            <Add fontSize="small" />
            <Trans i18nKey="kitDesigner.newImpact" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

const ImpactDetails = ({
  attribute,
  item,
  editMode,
  tempValues,
  handleInputChange,
  fields,
  hasWeight,
}: any) => (
  <Box justifyContent="space-between" width="100%" sx={{ ...styles.centerV }}>
    {editMode === item.questionImpactId ? (
      <>
        {fields.map((field: any, idx: number) => (
          <FormControl
            key={uniqueId()}
            fullWidth
            size="small"
            sx={textFieldStyle}
          >
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              value={tempValues[field.name] ?? ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              label={field.label}
            >
              {field.options?.map((option: any) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        {hasWeight && (
          <TextField
            type="number"
            required
            value={tempValues.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            variant="outlined"
            size="small"
            label={t("common.weight")}
            sx={textFieldStyle}
          />
        )}
      </>
    ) : (
      <>
        <Box display="flex">
          <Typography variant="bodyLarge" sx={{ ml: 2, fontWeight: "bold" }}>
            {attribute.title}
          </Typography>
          <Typography variant="bodyLarge" sx={{ ml: 0.5 }}>
            {t("kitDesigner.impactsOn") + " " + item.maturityLevel?.title}
          </Typography>
        </Box>
        {hasWeight && (
          <Chip
            label={`${t("common.weight")}: ${item.weight}`}
            color="primary"
            size="small"
            sx={{ ml: 2, fontSize: 12 }}
          />
        )}
      </>
    )}
  </Box>
);

const ActionButtons = ({
  editMode,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: any) => {
  return (
    <Box sx={{ ...styles.centerV }}>
      {editMode ? (
        <>
          <IconButton
            size="small"
            onClick={onSave}
            sx={{ ml: 1 }}
            color="success"
          >
            <CheckRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onCancel}
            sx={{ ml: 1 }}
            color="secondary"
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton size="small" onClick={onEdit} sx={{ ml: 1 }}>
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ ml: 1 }} onClick={onDelete}>
            <DeleteRoundedIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};

const textFieldStyle = {
  fontSize: 14,
  ml: 2,
  "& .MuiInputBase-root": { fontSize: 14, overflow: "auto" },
  "& .MuiFormLabel-root": { fontSize: 14 },
};

export default AttributeImpactList;

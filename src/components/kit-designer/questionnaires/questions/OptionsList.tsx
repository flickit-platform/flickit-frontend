import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IOption } from "@/types/index";
import { Trans } from "react-i18next";
import { t } from "i18next";
import OptionForm from "./OptionForm";
import Add from "@mui/icons-material/Add";
import { useKitDesignerContext } from "@/providers/kit-provider";
import TitleWithTranslation from "@/components/common/fields/TranslationText";
import { Text } from "@/components/common/Text";
import { NumberField } from "@/components/common/fields/NumberField";

interface OptionListProps {
  Options: Array<IOption>;
  onEdit: (id: any) => void;
  onDelete: (id: any) => void;
  onReorder: (reorderedItems: IOption[]) => void;
  onAdd: (newOption: IOption) => void;
  isAddingNew: boolean;
  setIsAddingNew: any;
  disableAddOption: boolean;
  isDragDisabled: boolean;
}

const OptionList = (props: OptionListProps) => {
  const {
    Options,
    onEdit,
    onReorder,
    onAdd,
    isAddingNew,
    setIsAddingNew,
    disableAddOption,
    isDragDisabled,
  } = props;

  const [reorderedItems, setReorderedItems] = useState(Options);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempValues, setTempValues] = useState(defaultTempValues());

  const { kitState } = useKitDesignerContext();
  const langCode = kitState.translatedLanguage?.code ?? "";

  useEffect(() => setReorderedItems(Options), [Options]);

  useEffect(() => {
    if (!isAddingNew) {
      resetTempValues();
    }
  }, [isAddingNew]);

  function defaultTempValues() {
    return {
      title: "",
      translations: null,
      value: 1,
      index: reorderedItems?.length + 1,
    };
  }

  function resetTempValues() {
    setTempValues(defaultTempValues());
    setIsAddingNew(false);
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(reorderedItems);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);
    setReorderedItems(items);
    onReorder(items);
  };

  const handleSaveClick = (item: IOption) => {
    onEdit({ ...item, ...tempValues });
    setEditMode(null);
  };

  const handleCancelClick = resetTempValues;

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setTempValues(defaultTempValues());
  };

  const handleSaveNewOption = () => {
    onAdd({
      ...tempValues,
      id: reorderedItems?.length + 1,
      index: reorderedItems?.length + 1,
    });
  };

  const handleCancelNewOption = resetTempValues;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="Options">
        {(provided: any) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            paddingX={2}
          >
            {reorderedItems?.map((item) => (
              <OptionRow
                key={item.id}
                item={item}
                index={item.index}
                editMode={editMode}
                tempValues={tempValues}
                setTempValues={setTempValues}
                handleSaveClick={handleSaveClick}
                handleCancelClick={handleCancelClick}
                langCode={langCode}
                isDragDisabled={isDragDisabled}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {isAddingNew ? (
        <OptionForm
          newItem={tempValues}
          setNewItem={setTempValues}
          handleInputChange={(e) =>
            setTempValues({ ...tempValues, [e.target.name]: e.target.value })
          }
          handleSave={handleSaveNewOption}
          handleCancel={handleCancelNewOption}
        />
      ) : (
        !disableAddOption && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              onClick={handleAddNewClick}
              variant="outlined"
              color="primary"
              size="small"
            >
              <Add fontSize="small" />
              <Trans i18nKey="kitDesigner.newOption" />
            </Button>
          </Box>
        )
      )}
    </DragDropContext>
  );
};

const OptionRow = ({
  item,
  index,
  editMode,
  tempValues,
  setTempValues,
  handleSaveClick,
  handleCancelClick,
  langCode,
  isDragDisabled,
}: {
  item: IOption;
  index: number;
  editMode: number | null;
  tempValues: any;
  setTempValues: React.Dispatch<any>;
  handleSaveClick: (item: IOption) => void;
  handleCancelClick: () => void;
  langCode: string;
  isDragDisabled: boolean;
}) => {
  const isEditing = editMode === item.id;
  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      draggableId={item.id.toString()}
      index={index}
    >
      {(draggableProvided: any) => (
        <>
          <Box
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
            }}
          >
            <OptionTitleSection
              item={item}
              index={index}
              isEditing={isEditing}
              tempValues={tempValues}
              setTempValues={setTempValues}
              langCode={langCode}
            />

            <OptionValueSection
              item={item}
              isEditing={isEditing}
              tempValues={tempValues}
              setTempValues={setTempValues}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
            />
          </Box>
          <Divider />
        </>
      )}
    </Draggable>
  );
};

const OptionTitleSection = ({
  item,
  index,
  isEditing,
  tempValues,
  setTempValues,
  langCode,
}: any) => (
  <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
    <Text
      variant="bodyMedium"
      color="background.secondaryDark"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        ml: 1,
        paddingInlineEnd: 1.5,
        borderRadius: "8px",
      }}
    >
      {index}.
    </Text>
    {isEditing ? (
      <TextField
        required
        value={tempValues.title}
        onChange={(e) =>
          setTempValues({ ...tempValues, title: e.target.value })
        }
        variant="outlined"
        fullWidth
        size="small"
        sx={{
          marginInline: 2,
          fontSize: 14,
          ml: 2,
          "& .MuiInputBase-root": { fontSize: 14, overflow: "auto" },
          "& .MuiFormLabel-root": { fontSize: 14 },
        }}
        label={<Trans i18nKey="common.title" />}
      />
    ) : (
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <TitleWithTranslation
          title={item.title}
          translation={langCode ? item.translations?.[langCode]?.title : ""}
          variant="semiBoldMedium"
          showCopyIcon
        />
      </Box>
    )}
  </Box>
);

const OptionValueSection = ({
  item,
  isEditing,
  tempValues,
  setTempValues,
  handleSaveClick,
  handleCancelClick,
}: any) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    {isEditing ? (
      <NumberField
        required
        type="int"
        label={<Trans i18nKey="common.score" />}
        value={tempValues?.value}
        onChange={(next) => setTempValues({ ...tempValues, value: next })}
        min={0}
        size="small"
        variant="outlined"
        inputProps={{
          style: { textAlign: "center", width: 40 },
        }}
      />
    ) : (
      <Chip
        label={t("common.score") + ": " + item.value}
        color="primary"
        size="small"
        sx={{ ml: 2, fontSize: 12 }}
      />
    )}

    {isEditing && (
      <>
        <IconButton
          size="small"
          onClick={() => handleSaveClick(item)}
          sx={{ ml: 1 }}
          color="success"
        >
          <CheckRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleCancelClick}
          sx={{ ml: 1 }}
          color="secondary"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </>
    )}
  </Box>
);

export default OptionList;

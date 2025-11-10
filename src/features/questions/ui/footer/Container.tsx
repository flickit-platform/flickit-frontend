import React, { useEffect, useState } from "react";
import { Avatar, Box, IconButton, Chip } from "@mui/material";
import { t } from "i18next";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import { styles } from "@styles";
import { Text } from "@common/Text";
import { getReadableDate } from "@utils/readable-date";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RichEditorField from "@common/fields/RichEditorField";
import { useForm } from "react-hook-form";
import UseFetchData from "@/features/questions/model/footer/useFetchData";
import Attachments from "@/features/questions/ui/footer/Attachments";
import useDialog from "@/hooks/useDialog";
import {
  setSelectedQuestion,
  useQuestionContext,
  useQuestionDispatch,
} from "../../context";

type Polarity = "Positive" | "Negative" | "";
type Variant = "history" | "evidences" | "comments";

const ICON_SIZE = { width: 24, height: 24 };

const BOX_STYLES = {
  Positive: { color: "#17823B", label: "questions_temp.positiveEvidence" },
  Negative: { color: "#821717", label: "questions_temp.negativeEvidence" },
  Comment: { color: "#73808C", label: "questions_temp.comment" },
  History: { color: "transparent", label: "" },
  Edit: { color: "#2466A8", label: "questions_temp.editing" },
} as const;

const getVariant = (item: any): Variant =>
  item?.answer ? "history" : item?.type ? "evidences" : "comments";

const Container: React.FC<{ item: any; fetchByTab: any }> = ({
  item,
  fetchByTab,
}) => {
  const dispatch = useQuestionDispatch();
  const { selectedQuestion } = useQuestionContext();
  const variant = getVariant(item);
  const { addEvidence, deleteEvidence } = UseFetchData();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<{ description: string; type?: Polarity }>({
    description: item?.description ?? "",
    type: (item?.type as Polarity) ?? "",
  });

  const deleteDialog = useDialog();

  const formMethods = useForm({ shouldUnregister: true });
  const watchedDesc = formMethods.watch("evidence-description");

  useEffect(() => {
    if (isEditing) {
      formMethods.setValue(
        "evidence-description",
        draft.description ?? item?.description ?? "",
      );
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    const cur =
      formMethods.getValues()["evidence-description"] ??
      item?.description ??
      "";
    if (cur !== draft.description)
      setDraft((d) => ({ ...d, description: cur }));
  }, [watchedDesc]);

  const handleStartEdit = () => {
    if (variant === "history") return;
    setDraft({
      description: item?.description ?? "",
      type: (item?.type as Polarity) ?? "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraft({
      description: item?.description ?? "",
      type: (item?.type as Polarity) ?? "",
    });
  };

  const handleSave = async () => {
    await addEvidence
      .query({
        id: item.id,
        description: draft.description,
        type: draft.type ? draft.type.toUpperCase() : null,
      })
      .then(() => {
        fetchByTab();
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const handleConfirmDelete = async () => {
    await deleteEvidence
      .query({ id: item.id })
      .then(() => {
        fetchByTab();
      })
      .finally(() => {
        deleteDialog.onClose();
        dispatch(
          setSelectedQuestion({
            ...selectedQuestion,
            counts: {
              ...selectedQuestion.counts,
              [variant]: selectedQuestion.counts[variant] - 1,
            },
          }),
        );
      });
  };

  const headerActions = (
    <>
      {isEditing && (
        <>
          <IconButton onClick={handleSave} sx={{ p: 0.4 }}>
            <CheckIcon fontSize="small" sx={ICON_SIZE} />
          </IconButton>
          <IconButton onClick={handleCancelEdit} sx={{ p: 0.4 }}>
            <CloseIcon fontSize="small" sx={ICON_SIZE} />
          </IconButton>
        </>
      )}

      {!isEditing && item?.editable && (
        <IconButton onClick={handleStartEdit} sx={{ p: 0.4 }}>
          <EditOutlinedIcon fontSize="small" sx={ICON_SIZE} />
        </IconButton>
      )}

      {!isEditing && item?.deletable && (
        <IconButton onClick={() => deleteDialog.openDialog({})} sx={{ p: 0.4 }}>
          <DeleteOutlinedIcon fontSize="small" sx={ICON_SIZE} />
        </IconButton>
      )}
    </>
  );

  return (
    <Box bgcolor={"background.background"} sx={{ mb: 2, borderRadius: 1 }}>
      <Header
        item={item}
        variant={variant}
        isEditing={isEditing}
        currentType={draft.type}
      >
        {variant !== "history" && <>{headerActions}</>}
      </Header>

      <Detail
        item={item}
        variant={variant}
        isEditing={isEditing}
        draft={draft}
        setDraft={setDraft}
        formMethods={formMethods}
      />

      {variant !== "history" && (
        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onClose={deleteDialog.onClose}
          onConfirm={handleConfirmDelete}
          content={{
            category: item.type
              ? t("questions.evidence")
              : t("questions.comment"),
            title: "",
          }}
        />
      )}
    </Box>
  );
};

export default Container;

const resolveBoxMeta = (
  variant: Variant,
  isEditing: boolean,
  effectiveType: Polarity,
) => {
  if (isEditing) return BOX_STYLES.Edit;
  if (variant === "history") return BOX_STYLES.History;
  if (variant === "comments") return BOX_STYLES.Comment;
  if (effectiveType === "Positive") return BOX_STYLES.Positive;
  if (effectiveType === "Negative") return BOX_STYLES.Negative;
  return BOX_STYLES.Comment;
};

const Header: React.FC<{
  item: any;
  variant: Variant;
  isEditing: boolean;
  currentType?: Polarity;
  children?: React.ReactNode;
}> = ({ item, variant, isEditing, currentType, children }) => {
  const { createdBy = {}, lastModificationTime, creationTime, type } = item;

  const { displayName, pictureLink } = createdBy;
  const effectiveType = (isEditing ? currentType : (type as Polarity)) ?? "";
  const meta = resolveBoxMeta(variant, isEditing, effectiveType);
  const ts = lastModificationTime || creationTime;

  const headerStyle = {
    ...styles.centerV,
    justifyContent: "space-between",
    flex: 1,
    px: 2,
    py: 1,
    bgcolor: "background.containerHighest",
    borderInlineStart: `4px solid ${meta.color}`,
    borderRadius: "4px",
  };

  const labelStyle = {
    color: meta.color,
    p: "4px 8px",
    border: `0.5px solid ${meta.color}`,
    borderRadius: 1,
  };

  return (
    <Box sx={headerStyle}>
      <Box sx={{ ...styles.centerVH, gap: 1 }}>
        <Avatar src={pictureLink} sx={{ ...ICON_SIZE, fontSize: 16 }} />
        <Text variant="bodyMedium" color="background.secondaryDark">
          {displayName || t("common.unknownUser")}
        </Text>
        <Text variant="bodySmall" color="info.main">
          {getReadableDate(ts, "absolute", false)}
        </Text>
      </Box>

      <Box sx={{ ...styles.centerVH, gap: 1 }}>
        {!!meta.label && (
          <Text variant="labelSmall" sx={labelStyle}>
            {t(meta.label)}
          </Text>
        )}

        {children}
      </Box>
    </Box>
  );
};

const Detail: React.FC<{
  item: any;
  variant: Variant;
  isEditing: boolean;
  draft: { description: string; type?: Polarity };
  setDraft: React.Dispatch<
    React.SetStateAction<{ description: string; type?: Polarity }>
  >;
  formMethods: ReturnType<typeof useForm>;
}> = ({ item, variant, isEditing, draft, setDraft, formMethods }) => {
  const { id, description, attachmentsCount, answer } = item;
  const hasAttachments = (attachmentsCount ?? 0) > 0;

  if (variant === "history") {
    return (
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ width: "100%", pt: 1 }}>
          <Text variant="bodyMedium" sx={{ color: "#333", mb: 1 }}>
            {t("questions_temp.answer")}:{" "}
            <Text component="span" sx={{ fontWeight: 600, color: "#1976D2" }}>
              {answer?.selectedOption?.index
                ? `${t("common.option")} ${answer.selectedOption.index}`
                : "-"}
            </Text>
          </Text>

          {answer?.confidenceLevel?.title && (
            <Text variant="bodySmall" sx={{ color: "#666", mb: 1 }}>
              {t("common.confidenceLevel")}:{" "}
              <Text component="span" sx={{ fontWeight: 500, color: "#008D4B" }}>
                {answer.confidenceLevel.title}
              </Text>
            </Text>
          )}

          {answer?.isNotApplicable && (
            <Chip
              label={t("history.notApplicable")}
              size="small"
              sx={{
                bgcolor: "#FFF3E0",
                color: "#E65100",
                border: "1px solid #FFB74D",
                fontWeight: 500,
                fontSize: "11px",
                height: "20px",
              }}
              variant="outlined"
            />
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box
        width="100%"
        justifyContent="space-between"
        sx={{ ...styles.centerV }}
      >
        {isEditing ? (
          <Box sx={{ width: "100%", padding: draft.type ? "16px 0px" : "" }}>
            <FormProviderWithForm formMethods={formMethods}>
              {!!draft.type && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Text variant="bodySmall" color="background.secondaryDark">
                    {t("questions.typeOfEvidence")}
                  </Text>
                  <RadioGroup
                    row
                    name={`evidence-type-${id}`}
                    value={draft.type}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        type: e.target.value as Exclude<Polarity, "">,
                      }))
                    }
                  >
                    <FormControlLabel
                      value="Positive"
                      control={<Radio sx={{ padding: "4px" }} size="small" />}
                      label={
                        <Text
                          variant="bodySmall"
                          color="background.secondaryDark"
                        >
                          {t("questions.positiveEvidence")}
                        </Text>
                      }
                      sx={{ marginRight: 0 }}
                    />
                    <FormControlLabel
                      value="Negative"
                      control={<Radio sx={{ padding: "4px" }} size="small" />}
                      label={
                        <Text
                          variant="bodySmall"
                          color="background.secondaryDark"
                        >
                          {t("questions.negativeEvidence")}
                        </Text>
                      }
                      sx={{ marginRight: "16px" }}
                    />
                  </RadioGroup>
                </Box>
              )}

              <Box
                sx={{
                  width: "100%",
                  mt: { xs: 26, sm: 17, md: 17, lg: 12 },
                }}
              >
                <RichEditorField
                  name="evidence-description"
                  label={t("common.description")}
                  disable_label={false}
                  required
                  defaultValue={draft.description ?? ""}
                  showEditorMenu
                />
              </Box>
            </FormProviderWithForm>
          </Box>
        ) : (
          <Box sx={{ width: "100%", pt: 1 }}>
            <Text
              variant="bodyMedium"
              color="background.secondaryDark"
              dangerouslySetInnerHTML={{ __html: description ?? "" }}
            />
          </Box>
        )}
      </Box>

      {hasAttachments && (
        <Attachments evidenceId={id} attachmentsCount={attachmentsCount} />
      )}
    </Box>
  );
};

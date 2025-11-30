import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Chip,
  Rating,
  Grid,
  Button,
} from "@mui/material";
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
import Attachments from "@/features/questions/ui/footer/Attachments";
import useDialog from "@/hooks/useDialog";
import {
  deleteComment,
  deleteEvidence,
  setSelectedQuestion,
  updateComment,
  updateEvidence,
  useQuestionContext,
  useQuestionDispatch,
} from "../../context";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AttachementPlus from "../../assets/attachment-plus.svg";
import useFetchData from "@/features/questions/model/footer/useFetchData";
import { Trans } from "react-i18next";
import {
  RadioButtonCheckedRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material";
import languageDetector from "@/utils/language-detector";

type Variant = "history" | "evidences" | "comments";

const ICON_SIZE = { width: 24, height: 24 };

const BOX_STYLES = {
  Positive: { color: "#17823B", label: "questions_temp.positiveEvidenceLabel" },
  Negative: { color: "#821717", label: "questions_temp.negativeEvidenceLabel" },
  Comment: { color: "#73808C", label: "" },
  History: { color: "transparent", label: "" },
  Edit: { color: "#2466A8", label: "questions_temp.editingLabel" },
} as const;

const getVariant = (item: any): Variant => {
  const hasAnswer = Boolean(item?.answer);
  const hasType = Boolean(item?.type);

  if (hasAnswer) return "history";
  if (hasType) return "evidences";
  return "comments";
};

const Panel: React.FC<{
  item: any;
  readonly?: boolean;
}> = ({ item, readonly }) => {
  const dispatch = useQuestionDispatch();
  const { selectedQuestion } = useQuestionContext();
  const variant = getVariant(item);
  const { addEvidenceQuery, deleteEvidenceQuery, resolveComment, fetchIssues } =
    useFetchData();

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
    await addEvidenceQuery
      .query({
        id: item.id,
        description: draft.description,
        type: draft.type ? draft.type.toUpperCase() : null,
      })
      .then(() => {
        dispatch(
          draft.type
            ? updateEvidence({
                id: item.id,
                description: draft.description,
                type: draft.type.toUpperCase(),
              })
            : updateComment({ id: item.id, description: draft.description }),
        );
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  const handleConfirmDelete = async () => {
    await deleteEvidenceQuery
      .query({ id: item.id })
      .then(async () => {
        dispatch(
          item.type
            ? deleteEvidence({ id: item.id })
            : deleteComment({ id: item.id }),
        );
        let resIssues = selectedQuestion.issues;
        setTimeout(async () => {
          await fetchIssues
            .query({
              questionId: selectedQuestion.id,
            })
            .then((res) => {
              resIssues = res;
            })
            .finally(() => {
              const updatedQuestion = {
                ...selectedQuestion,
                counts: {
                  ...selectedQuestion.counts,
                  [variant]: selectedQuestion.counts[variant] - 1,
                },
                issues: resIssues,
              };
              dispatch(setSelectedQuestion(updatedQuestion));
            });
        }, 500);
      })
      .finally(() => {
        deleteDialog.onClose();
      });
  };

  const handleResolve = async () => {
    await resolveComment
      .query({ id: item.id })
      .then(async () => {
        dispatch(deleteComment({ id: item.id }));

        let resIssues = selectedQuestion.issues;
        setTimeout(async () => {
          await fetchIssues
            .query({
              questionId: selectedQuestion.id,
            })
            .then((res) => {
              resIssues = res;
            })
            .finally(() => {
              const updatedQuestion = {
                ...selectedQuestion,
                counts: {
                  ...selectedQuestion.counts,
                  [variant]: selectedQuestion.counts[variant] - 1,
                },
                issues: resIssues,
              };
              dispatch(setSelectedQuestion(updatedQuestion));
            });
        }, 500);
      })
      .finally(() => {
        deleteDialog.onClose();
      });
  };

  const headerActions = (
    <>
      {isEditing ? (
        <>
          <IconButton onClick={handleSave} sx={{ p: 0.4 }}>
            <CheckIcon fontSize="small" sx={ICON_SIZE} />
          </IconButton>
          <IconButton onClick={handleCancelEdit} sx={{ p: 0.4 }}>
            <CloseIcon fontSize="small" sx={ICON_SIZE} />
          </IconButton>
        </>
      ) : (
        <>
          {item?.resolvable && (
            <IconButton
              onClick={handleResolve}
              sx={{ p: 0.4 }}
              loading={resolveComment.loading}
            >
              <CheckRoundedIcon fontSize="small" sx={ICON_SIZE} />
            </IconButton>
          )}
          {item?.editable && (
            <IconButton onClick={handleStartEdit} sx={{ p: 0.4 }}>
              <EditOutlinedIcon fontSize="small" sx={ICON_SIZE} />
            </IconButton>
          )}

          {item?.deletable && (
            <IconButton
              onClick={() => deleteDialog.openDialog({})}
              sx={{ p: 0.4 }}
            >
              <DeleteOutlinedIcon fontSize="small" sx={ICON_SIZE} />
            </IconButton>
          )}
        </>
      )}
    </>
  );

  return (
    <Box
      key={item.id}
      bgcolor={"background.background"}
      sx={{ mb: 2, borderRadius: 1 }}
    >
      <Header
        item={item}
        variant={variant}
        isEditing={isEditing}
        currentType={draft.type}
      >
        {variant !== "history" && !readonly && <>{headerActions}</>}
      </Header>

      <Detail
        item={item}
        variant={variant}
        isEditing={isEditing}
        draft={draft}
        setDraft={setDraft}
        formMethods={formMethods}
        readonly={readonly}
      />

      {variant !== "history" && (
        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onClose={deleteDialog.onClose}
          onConfirm={handleConfirmDelete}
          content={{
            category: item.type
              ? t("questions_temp.evidenceLabel")
              : t("questions_temp.commentLabel"),
            title: "",
          }}
        />
      )}
    </Box>
  );
};

export default Panel;

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
  readonly?: boolean;
}> = ({ item, variant, isEditing, draft, setDraft, formMethods, readonly }) => {
  const { id, description, attachmentsCount } = item;
  const totalAttachments = attachmentsCount ?? 0;
  const dispatch = useQuestionDispatch();

  const [showAttachments, setShowAttachments] = useState(totalAttachments > 0);
  const [startAddMode, setStartAddMode] = useState(false);
  useEffect(() => {
    setShowAttachments(item.autoOpenAttachment);
    setStartAddMode(item.autoOpenAttachment);
  }, [item.autoOpenAttachment]);

  if (variant === "history") {
    return (
      <Grid container spacing={2} sx={{ width: "100%", p: "24px 16px" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            {item?.answer?.selectedOption ? (
              <>
                <Text variant="bodyMedium">
                  <Trans i18nKey="questions.selectedOption" />
                </Text>
                <Text variant="bodyMedium" sx={{ maxWidth: 400 }}>
                  {t("common.option")} {item?.answer?.selectedOption?.index}
                </Text>
              </>
            ) : (
              <Text variant="bodyMedium">
                <Trans i18nKey="questions.noOptionSelected" />
              </Text>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            {item?.answer?.confidenceLevel?.title && (
              <Box display="flex" alignItems="center" gap={3}>
                <Text variant="bodyMedium">
                  <Trans i18nKey="common.confidenceLevel" />
                </Text>
                <Rating
                  value={
                    item?.answer?.confidenceLevel?.id === null
                      ? null
                      : (item?.answer?.confidenceLevel?.id as number)
                  }
                  readOnly
                  size="medium"
                  icon={<RadioButtonCheckedRounded fontSize="inherit" />}
                  emptyIcon={<RadioButtonUncheckedRounded fontSize="inherit" />}
                  sx={{
                    "& .MuiRating-iconFilled": { color: "primary.main" },
                    pointerEvents: "none",
                    cursor: "default",
                  }}
                />
              </Box>
            )}

            {item?.answer?.isNotApplicable && (
              <Chip
                label={t("questions_temp.notApplicableLabel")}
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
        </Grid>
      </Grid>
    );
  }

  return (
    <Box sx={{ px: 2, pb: 1 }}>
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
                    {t("questions_temp.evidenceTypeLabel")}
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
                          {t("questions_temp.positiveEvidenceLabel")}
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
                          {t("questions_temp.negativeEvidenceLabel")}
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
                  mt: 1,
                }}
              >
                <RichEditorField
                  name="evidence-description"
                  label={t("common.description")}
                  disable_label={false}
                  required
                  defaultValue={draft.description ?? ""}
                  showEditorMenu
                  menuProps={{
                    variant: "inline",
                  }}
                />
              </Box>
            </FormProviderWithForm>
          </Box>
        ) : (
          <Box
            sx={{
              ...styles.rtlStyle(languageDetector(description)),
              width: "100%",
            }}
          >
            <Text
              textAlign="justify"
              variant="bodyMedium"
              color="background.secondaryDark"
              dangerouslySetInnerHTML={{ __html: description ?? "" }}
            />
          </Box>
        )}
      </Box>

      {attachmentsCount > 0 || showAttachments ? (
        <Attachments
          id={id}
          type={item.type}
          attachmentsCount={attachmentsCount}
          startAddMode={startAddMode}
          readonly={readonly}
          onCloseAddMode={(noAttachments: boolean) => {
            setStartAddMode(false);
            dispatch(
              item.type
                ? updateEvidence({ autoOpenAttachment: false, id: item.id })
                : updateComment({ autoOpenAttachment: false, id: item.id }),
            );
          }}
        />
      ) : (
        !readonly && (
          <Button
            variant="text"
            size="small"
            sx={{
              px: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
            onClick={() => {
              setShowAttachments(true);
              setStartAddMode(true);
            }}
            startIcon={
              <Box
                component="img"
                src={AttachementPlus}
                alt="empty state"
                sx={{ width: "100%", maxWidth: 80 }}
              />
            }
          >
            {t("questions_temp.addAttachment")}
          </Button>
        )
      )}
    </Box>
  );
};

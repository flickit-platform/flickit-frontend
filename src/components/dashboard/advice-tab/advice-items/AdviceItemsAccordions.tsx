import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { AdviceItem } from "@/types/index";
import i18next, { t } from "i18next";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import Impact from "@common/icons/Impact";
import AdviceListNewForm from "./AdviceListNewForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import languageDetector from "@utils/languageDetector";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";

enum ELevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

const COLORS = {
  primary: { background: "#EDF7ED", text: "#2E6B2E", icon: "#388E3C" },
  secondary: { background: "#F9F3EB", text: "#995700", icon: "#995700" },
  error: { background: "#FFEBEE", text: "#B86A77", icon: "#B86A77" },
  border: "#E0E0E0",
  unknown: { background: "#E0E0E0", text: "#000", icon: "#000" },
};

const getPriorityColor = (priority: string) => {
  let color;
  if (priority === ELevel.HIGH) {
    color = "#E72943";
  } else if (priority === ELevel.LOW) {
    color = "#3D4D5C80";
  } else {
    color = "primary";
  }
  return color;
};

const getIconColors = (level: string, type: string) => {
  let obj;
  if (
    (level === ELevel.HIGH && type !== "cost") ||
    (level === ELevel.LOW && type === "cost")
  ) {
    obj = COLORS.primary;
  } else if (
    (level === ELevel.HIGH && type === "cost") ||
    (level === ELevel.LOW && type !== "cost")
  ) {
    obj = COLORS.error;
  } else {
    obj = COLORS.secondary;
  }
  return obj;
};

const getChipData = (
  type: "impact" | "cost",
  level: string,
  readOnly: boolean,
  language?: string,
) => {
  const priorityColor: any = getIconColors(level, type);
  const translatedLevel = t(
    level.toLowerCase(),
    readOnly ? { lng: language } : {},
  );
  const translatedType = t(`common.${type}`, readOnly ? { lng: language } : {});
  const isFarsi = i18next.language === "fa" || readOnly;

  return {
    backgroundColor: priorityColor.background,
    color: priorityColor.text,
    iconColor: priorityColor.icon,
    label: isFarsi
      ? `${translatedType} ${translatedLevel}`
      : `${translatedLevel} ${translatedType}`,
  };
};

const CustomChip: React.FC<{
  type: "impact" | "cost";
  level: string;
  readOnly: boolean;
  language?: string;
}> = ({ type, level, readOnly, language }) => {
  const { backgroundColor, color, iconColor, label } = getChipData(
    type,
    level,
    readOnly,
    language,
  );
  const Icon =
    type === "impact" ? (
      <Impact
        styles={{ color: iconColor, px: 2, width: readOnly ? "14px" : "20px" }}
      />
    ) : (
      <AttachMoneyOutlinedIcon fontSize="small" />
    );

  return (
    <Chip
      size="small"
      label={label}
      icon={
        <IconButton
          size="small"
          sx={{
            color: iconColor + " !important",
          }}
        >
          {Icon}
        </IconButton>
      }
      sx={{
        backgroundColor,
        color,
        "& .MuiChip-icon": {
          marginRight:
            language === "fa" || (!readOnly && theme.direction == "rtl")
              ? "0"
              : "-10px",
          marginLeft:
            language === "fa" || (!readOnly && theme.direction == "rtl")
              ? "-10px"
              : "0",
        },
        "& .MuiChip-label": {
          fontWeight:
            language === "fa" || (!readOnly && theme.direction == "rtl")
              ? 200
              : "initial",
          letterSpacing: "0px",
          fontSize:
            language === "fa" || (!readOnly && theme.direction == "rtl")
              ? "10px"
              : "12px",
          fontFamily:
            language === "fa" || (!readOnly && theme.direction == "rtl")
              ? farsiFontFamily
              : primaryFontFamily,
        },
      }}
    />
  );
};

const AdviceItemAccordion: React.FC<{
  item: AdviceItem;
  onDelete: (adviceItemId: string) => void;
  onEdit: (adviceItemId: string) => void;
  isEditing: boolean;
  setEditingItemId: any;
  items: any;
  setDisplayedItems: any;
  query: any;
  readOnly: boolean;
  language?: string;
}> = ({
  item,
  onDelete,
  onEdit,
  isEditing,
  setEditingItemId,
  items,
  setDisplayedItems,
  query,
  readOnly,
  language,
}) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isFarsi = i18next.language === "fa";
  const [errorMessage, setErrorMessage] = useState({});

  const [newAdvice, setNewAdvice] = useState({
    title: "",
    description: "",
    priority: "",
    cost: "",
    impact: "",
  });

  const updateAdviceItem = useQuery({
    service: (args, config) =>
      service.advice.update(
        args ?? { adviceItemId: item.id, data: newAdvice },
        config,
      ),
    runOnMount: false,
  });

  const removeDescriptionAdvice = useRef(false);

  useEffect(() => {
    setNewAdvice({
      title: item.title,
      description: item.description,
      priority: item.priority.code,
      cost: item.cost.code,
      impact: item.impact.code,
    });
  }, [isEditing, item, assessmentId]);

  const handleCancel = () => {
    setNewAdvice({
      title: item.title,
      description: item.description,
      priority: item.priority.code,
      cost: item.cost.code,
      impact: item.impact.code,
    });
    setEditingItemId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdvice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      let errorOccurred = false;
      const updatedErrorMessage: any = {};

      if (!newAdvice.title) {
        updatedErrorMessage.title = "errors.requiredFieldError";
        errorOccurred = true;
      } else {
        updatedErrorMessage.title = null;
      }

      if (!newAdvice.description || newAdvice.description === "<p></p>") {
        updatedErrorMessage.description = "errors.requiredFieldError";
        errorOccurred = true;
      } else {
        updatedErrorMessage.description = null;
      }
      if (errorOccurred) {
        setErrorMessage((prevState: any) => ({
          ...prevState,
          ...updatedErrorMessage,
        }));
        return;
      } else {
        await updateAdviceItem.query();
        removeDescriptionAdvice.current = true;
        query.query();

        setDisplayedItems([]);
        setEditingItemId(null);
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  if (isEditing) {
    return (
      <AdviceListNewForm
        newAdvice={newAdvice}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        setNewAdvice={setNewAdvice}
        removeDescriptionAdvice={removeDescriptionAdvice}
        postAdviceItem={updateAdviceItem}
        errormessage={errorMessage}
      />
    );
  }

  return (
    <>
      <Accordion
        sx={{
          borderBottom: `1px solid ${COLORS.border}`,
          borderInlineStart: readOnly ? "4px solid #6C8093" : "",
          border: readOnly ? "" : `1px solid ${COLORS.border}`,
          borderRadius: "8px",
          mb: 1,
          boxShadow: "none",
          background: !readOnly ? "#F9FAFB" : "initial",
          "&:before": { content: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={readOnly ? null : <ExpandMoreIcon fontSize="small" />}
          sx={{
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              minWidth: readOnly ? "20%" : "unset",
              width: "100%",
            },
            padding: "0 16px",
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            spacing={1}
          >
            <Grid item xs={12} md={readOnly ? 7 : 8.3}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} alignItems="center" display="flex">
                  <Typography
                    sx={{
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      wordBreak: "break-word",
                      marginInline: "8px",
                      fontWeight: 500,
                      letterSpacing: "0.15px",
                      fontSize: readOnly ? "1rem" : "1.25rem",
                    }}
                    title={item.title}
                    dir={languageDetector(item.title) ? "rtl" : "ltr"}
                    fontFamily={
                      languageDetector(item.title)
                        ? farsiFontFamily
                        : primaryFontFamily
                    }
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    color={getPriorityColor(item.priority.code)}
                    sx={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      fontWeight: 500,
                      letterSpacing: "0.15px",
                      fontSize: "1rem",
                    }}
                    fontFamily={
                      isFarsi || readOnly ? farsiFontFamily : primaryFontFamily
                    }
                  >
                    (
                    {!isFarsi && !readOnly
                      ? t(item.priority.code.toLowerCase()) +
                        " " +
                        t("common.priority")
                      : t("common.priority", !readOnly ? {} : { lng: language }) +
                        " " +
                        t(
                          item.priority.code.toLowerCase(),
                          !readOnly ? {} : { lng: language },
                        )}
                    )
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={readOnly ? 2.8 : 3.7}>
              <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid
                  item
                  display="flex"
                  xs={readOnly ? 12 : 9}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent={{ xs: "flex-start", md: "flex-end" }}
                  gap={1}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  <CustomChip
                    type="impact"
                    level={item.impact.code}
                    readOnly={readOnly}
                    language={language}
                  />

                  <CustomChip
                    type="cost"
                    level={item.cost.code}
                    readOnly={readOnly}
                    language={language}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  alignItems="center"
                  display={readOnly ? "none" : "flex"}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item.id);
                    }}
                  >
                    <EditRounded fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteRounded fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails sx={{ padding: "8px 16px" }}>
          <Divider sx={{ marginBottom: "8px" }} />
          <Typography
            textAlign="justify"
            variant={readOnly ? "bodyMedium" : "body1"}
            component="div"
            dangerouslySetInnerHTML={{ __html: item.description }}
            dir={languageDetector(item.description) ? "rtl" : "ltr"}
            fontFamily={
              languageDetector(item.description)
                ? farsiFontFamily
                : primaryFontFamily
            }
          />
        </AccordionDetails>
      </Accordion>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(item.id);
          const updatedItems = items.filter(
            (currentItem: any) => currentItem.id !== item.id,
          );
          setDisplayedItems(updatedItems);
        }}
        title={t("deleteItem")}
        content={t("advice.deleteItemConfirmation", { title: item.title })}
      />
    </>
  );
};

const AdviceItemsAccordion: React.FC<{
  items: AdviceItem[];
  onDelete: (adviceItemId: string) => void;
  setDisplayedItems: any;
  query: any;
  readOnly: boolean;
  language?: string;
}> = ({ items, onDelete, setDisplayedItems, query, readOnly, language }) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingItemId((prev) => (prev === id ? null : id));
  };

  return (
    <Box>
      {items?.map((item) => (
        <AdviceItemAccordion
          key={item.id}
          item={item}
          onDelete={onDelete}
          onEdit={handleEdit}
          isEditing={editingItemId === item.id}
          setEditingItemId={setEditingItemId}
          items={items}
          setDisplayedItems={setDisplayedItems}
          query={query}
          readOnly={readOnly}
          language={language}
        />
      ))}
    </Box>
  );
};

export default AdviceItemsAccordion;

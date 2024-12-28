import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Chip,
  Box,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import { AdviceItem } from "@/types";
import i18next, { t } from "i18next";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import Impact from "@/components/common/icons/Impact";
import AdviceListNewForm from "./AdviceListNewForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@/utils/useQuery";
import { useServiceContext } from "@/providers/ServiceProvider";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import languageDetector from "@/utils/languageDetector";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

const COLORS = {
  primary: { background: "#EDF7ED", text: "#2E6B2E", icon: "#388E3C" },
  secondary: { background: "#F9F3EB", text: "#995700", icon: "#995700" },
  error: { background: "#FFEBEE", text: "#B86A77", icon: "#B86A77" },
  border: "#E0E0E0",
  unknown: { background: "#E0E0E0", text: "#000", icon: "#000" },
};

const ICON_COLORS: Record<string, keyof typeof COLORS> = {
  high: "error",
  medium: "secondary",
  low: "primary",
};

const INVERSE_ICON_COLORS: Record<string, keyof typeof COLORS> = {
  high: "primary",
  medium: "secondary",
  low: "error",
};

const getPriorityColor = (priority: string) => {
  let color;
  if (priority.toLowerCase() === "high") {
    color = "#E72943";
  } else if (priority.toLowerCase() === "low") {
    color = "#3D4D5C80";
  } else {
    color = "primary";
  }
  return color;
};

const getIconColors = (
  icon: string,
  colors: Record<string, keyof typeof COLORS>,
) => COLORS[colors[icon.toLowerCase()] || "unknown"];

const getChipData = (type: "impact" | "cost", level: string) => {
  const priorityColor: any = getIconColors(
    level,
    type === "cost" ? ICON_COLORS : INVERSE_ICON_COLORS,
  );
  const translatedLevel = t(level.toLowerCase());
  const translatedType = t(type);
  const isFarsi = i18next.language === "fa";

  return {
    backgroundColor: priorityColor.background,
    color: priorityColor.text,
    iconColor: priorityColor.icon,
    label: isFarsi
      ? `${translatedType} ${translatedLevel}`
      : `${translatedLevel} ${translatedType}`,
  };
};

const CustomChip: React.FC<{ type: "impact" | "cost"; level: string }> = ({
  type,
  level,
}) => {
  const { backgroundColor, color, iconColor, label } = getChipData(type, level);
  const Icon =
    type === "impact" ? (
      <Impact styles={{ color: iconColor, px: 2, width: "20px" }} />
    ) : (
      <AttachMoneyOutlinedIcon sx={{ fontSize: "14px" }} />
    );

  return (
    <Chip
      size="small"
      label={label}
      icon={
        <IconButton size="small" sx={{ color: iconColor + " !important" }}>
          {Icon}
        </IconButton>
      }
      sx={{ backgroundColor, color }}
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
}) => {
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isFarsi = i18next.language === "fa";

  const [newAdvice, setNewAdvice] = useState({
    title: "",
    description: "",
    priority: "",
    cost: "",
    impact: "",
  });

  const updateAdviceItem = useQuery({
    service: (args = { adviceItemId: item.id, data: newAdvice }, config) =>
      service.updateAdviceItem(args, config),
    runOnMount: false,
  });

  const removeDescriptionAdvice = useRef(false);

  useEffect(() => {
    if (isEditing) {
      setNewAdvice({
        title: item.title,
        description: item.description,
        priority: item.priority.toUpperCase(),
        cost: item.cost.toUpperCase(),
        impact: item.impact.toUpperCase(),
      });
    }
  }, [isEditing, item, assessmentId]);

  const handleCancel = () => {
    setNewAdvice({
      title: item.title,
      description: item.description,
      priority: item.priority.toUpperCase(),
      cost: item.cost.toUpperCase(),
      impact: item.impact.toUpperCase(),
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
      await updateAdviceItem.query();
      removeDescriptionAdvice.current = true;
      query.query();

      setDisplayedItems([]);
      setEditingItemId(null);
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
          "&:before": { content: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={readOnly ? null : <ExpandMoreIcon fontSize="small" />}
          sx={{
            "& .MuiAccordionSummary-content": { alignItems: "center" },
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
            <Grid item xs={12} sm={8} md={readOnly ? 7 : 8.3}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={12} alignItems="center" display="flex">
                  <Typography
                    variant="h6"
                    sx={{
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      wordBreak: "break-word",
                      marginInlineEnd: "8px",
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
                    variant="subtitle1"
                    color={getPriorityColor(item.priority.toLowerCase())}
                    sx={{
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    (
                    {!isFarsi
                      ? t(item.priority.toLowerCase()) + " " + t("priority")
                      : t("priority") + " " + t(item.priority.toLowerCase())}
                    )
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={4} md={readOnly ? 4 : 3.7}>
              <Grid container justifyContent="flex-start" alignItems="center">
                <Grid item xs={readOnly ? 6 : 4.8}>
                  <CustomChip type="impact" level={item.impact} />
                </Grid>
                <Grid item xs={readOnly ? 6 : 4.8}>
                  <CustomChip type="cost" level={item.cost} />
                </Grid>
                <Grid
                  item
                  xs={0.2}
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
                      setDeleteDialogOpen(true);
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
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(item.id);
          const updatedItems = items.filter(
            (currentItem: any) => currentItem.id !== item.id,
          );
          setDisplayedItems(updatedItems);
        }}
        title={t("deleteItem")}
        content={t("deleteItemConfirmation", { title: item.title })}
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
}> = ({ items, onDelete, setDisplayedItems, query, readOnly }) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingItemId((prev) => (prev === id ? null : id));
  };

  return (
    <Box>
      {items.map((item) => (
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
        />
      ))}
    </Box>
  );
};

export default AdviceItemsAccordion;

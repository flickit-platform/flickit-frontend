import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Chip,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import VerticalAlignBottomOutlinedIcon from "@mui/icons-material/VerticalAlignBottomOutlined";
import { AdviceItem } from "@/types";
import i18next, { t } from "i18next";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";

const COLORS = {
  primary: { background: "#EDF7ED", text: "#2E6B2E", icon: "#388E3C" },
  secondary: { background: "#F9F3EB", text: "#995700", icon: "#995700" },
  error: { background: "#FFEBEE", text: "#B86A77", icon: "#B86A77" },
  border: "#E0E0E0",
  unknown: { background: "#E0E0E0", text: "#000", icon: "#000" },
};

const PRIORITY_MAP: Record<string, keyof typeof COLORS> = {
  high: "error",
  medium: "secondary",
  low: "primary",
};

const MAX_TITLE_LENGTH = 50; // Adjustable max length for titles

const getPriorityColor = (priority: string) =>
  COLORS[PRIORITY_MAP[priority.toLowerCase()] || "unknown"];

const truncateText = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const getChipData = (type: "impact" | "cost", level: string) => {
  const priorityColor: any = getPriorityColor(level);
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
    type === "impact"
      ? VerticalAlignBottomOutlinedIcon
      : AttachMoneyOutlinedIcon;

  return (
    <Chip
      size="small"
      label={label}
      icon={
        <IconButton size="small" sx={{ color: iconColor + " !important" }}>
          <Icon fontSize="small" />
        </IconButton>
      }
      sx={{ backgroundColor, color }}
    />
  );
};

const AdviceItemAccordion: React.FC<{
  item: AdviceItem;
  onDelete: (adviceItemId: string) => void;
}> = ({ item, onDelete }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(item.id);
    setDeleteDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Accordion
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: "8px",
          mb: 1,
          boxShadow: "none",
          "&:before": { content: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon fontSize="small" />}
          sx={{
            "& .MuiAccordionSummary-content": { alignItems: "center" },
            padding: "0 16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  maxWidth: "250px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={item.title}
              >
                {truncateText(item.title, MAX_TITLE_LENGTH)}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: (getPriorityColor(item.priority) as any).text }}
              >
                ({t(item.priority.toLowerCase())})
              </Typography>
            </Box>

            <Box display="flex" gap={1} alignItems="center">
              <CustomChip type="impact" level={item.impact} />
              <CustomChip type="cost" level={item.cost} />
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => e.stopPropagation()}
              >
                <EditRounded fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                onClick={handleDeleteClick}
              >
                <DeleteRounded fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: "8px 16px" }}>
          <Divider sx={{ marginBottom: "8px" }} />
          <Typography
            component="div"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </AccordionDetails>
      </Accordion>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title={t("deleteItem")}
        content={t("deleteItemConfirmation", { title: item.title })}
      />
    </>
  );
};

const AdviceItemsAccordion: React.FC<{
  items: AdviceItem[];
  onDelete: (adviceItemId: string) => void;
}> = ({ items, onDelete }) => (
  <Box>
    {items.map((item) => (
      <AdviceItemAccordion key={item.id} item={item} onDelete={onDelete} />
    ))}
  </Box>
);

export default AdviceItemsAccordion;

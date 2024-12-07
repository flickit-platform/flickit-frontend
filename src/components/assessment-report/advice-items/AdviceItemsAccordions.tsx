import React from "react";
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

interface AdviceItemsAccordionProps {
  items: AdviceItem[];
}

interface color {
  background: string;
  text: string;
  icon: string;
}

const colors = {
  primary: { background: "#EDF7ED", text: "#2E6B2E", icon: "#388E3C" },
  secondary: { background: "#F9F3EB", text: "#995700", icon: "#995700" },
  error: { background: "#FFEBEE", text: "#B86A77", icon: "#B86A77" },
  border: "#E0E0E0",
  unknown: { background: "#E0E0E0", text: "#000", icon: "#000" },
};

const getColorForPriority = (priority: string): keyof typeof colors => {
  const priorityMap: Record<string, keyof typeof colors> = {
    high: "error",
    medium: "secondary",
    low: "primary",
  };
  return priorityMap[priority.toLowerCase()] || "unknown";
};

const getChipStyle = (type: "impact" | "cost", level: string) => {
  const colorKey = getColorForPriority(level);
  const { background, text, icon } = colors[colorKey] as color;

  const translatedLevel = t(level.toLowerCase());
  const translatedType = type === "impact" ? t("impact") : t("price");

  const isFarsi = i18next.language === "fa";

  const label = isFarsi
    ? `${translatedType} ${translatedLevel}`
    : `${translatedLevel} ${translatedType}`;

  return {
    backgroundColor: background,
    color: text,
    iconColor: icon,
    label,
  };
};

const CustomChip: React.FC<{ type: "impact" | "cost"; level: string }> = ({
  type,
  level,
}) => {
  const style = getChipStyle(type, level);
  const Icon =
    type === "impact"
      ? VerticalAlignBottomOutlinedIcon
      : AttachMoneyOutlinedIcon;

  return (
    <Chip
      size="small"
      label={style.label}
      icon={
        <IconButton
          size="small"
          sx={{ color: `${style.iconColor} !important` }}
        >
          <Icon fontSize="small" />
        </IconButton>
      }
      sx={{ backgroundColor: style.backgroundColor, color: style.color }}
    />
  );
};

// Individual Accordion Item Component
const AdviceItemAccordion: React.FC<{ item: AdviceItem }> = ({ item }) => {
  const priorityColor = colors[getColorForPriority(item.priority)];

  return (
    <Accordion
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        mb: 1,
        boxShadow: "none",
        "&:before": {
          backgroundColor: "transparent",
          content: "none",
        },
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
            <Typography variant="h6">{item.title}</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: (priorityColor as color).text }}
            >
              ({t(item.priority.toLowerCase())})
            </Typography>
          </Box>

          {/* Chips and Action Buttons */}
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
              onClick={(e) => e.stopPropagation()}
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
  );
};

// Main Component
const AdviceItemsAccordion: React.FC<AdviceItemsAccordionProps> = ({
  items,
}) => (
  <Box>
    {items.map((item) => (
      <AdviceItemAccordion key={item.id} item={item} />
    ))}
  </Box>
);

export default AdviceItemsAccordion;

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

interface AdviceItemsAccordionProps {
  items: AdviceItem[];
}

type ChipStyle = {
  backgroundColor: string;
  color: string;
  label: string;
  iconColor: string;
};

const getChipStyle = (type: "impact" | "cost", level: string): ChipStyle => {
  const styles: Record<
    "high" | "medium" | "low",
    { impact: ChipStyle; cost: ChipStyle }
  > = {
    high: {
      impact: {
        backgroundColor: "#E8F5E9",
        color: "#388E3C",
        iconColor: "#388E3C",
        label: "High Impact",
      },
      cost: {
        backgroundColor: "#FFEBEE",
        color: "#D32F2F",
        iconColor: "#D32F2F",
        label: "High Price",
      },
    },
    medium: {
      impact: {
        backgroundColor: "#FFF8E1",
        color: "#F57C00",
        iconColor: "#F57C00",
        label: "Medium Impact",
      },
      cost: {
        backgroundColor: "#FFF8E1",
        color: "#F57C00",
        iconColor: "#F57C00",
        label: "Medium Price",
      },
    },
    low: {
      impact: {
        backgroundColor: "#FFEBEE",
        color: "#D32F2F",
        iconColor: "#D32F2F",
        label: "Low Impact",
      },
      cost: {
        backgroundColor: "#E8F5E9",
        color: "#388E3C",
        iconColor: "#388E3C",
        label: "Low Price",
      },
    },
  };

  return (
    styles[level.toLowerCase() as "high" | "medium" | "low"]?.[type] || {
      backgroundColor: "#E0E0E0",
      color: "#000",
      iconColor: "#000",
      label: `Unknown ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    }
  );
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
          sx={{
            color: `${style.iconColor} !important`,
            padding: 1,
          }}
        >
          <Icon fontSize="small" />
        </IconButton>
      }
      sx={{
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
    />
  );
};

const AdviceItemAccordion: React.FC<{ item: AdviceItem }> = ({ item }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "primary";
      default:
        return "grey.500";
    }
  };

  return (
    <Accordion
      key={item.id}
      sx={{
        border: "1px solid #E0E0E0",
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
            <Typography sx={{ fontWeight: "bold" }}>{item.title}</Typography>
            <Typography
              color={getPriorityColor(item.priority)}
              sx={{ fontWeight: "bold" }}
            >
              ({item.priority})
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <CustomChip type="impact" level={item.impact} />
            <CustomChip type="cost" level={item.cost} />
            <IconButton size="small" color="primary">
              <EditRounded fontSize="small" />
            </IconButton>
            <IconButton size="small" color="primary">
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

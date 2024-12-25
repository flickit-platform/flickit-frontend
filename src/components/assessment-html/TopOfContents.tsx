import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

// Define the type for the state to track open items
interface OpenItemsState {
  [key: string]: boolean;
}

export const AssessmentTOC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Track the open state of each item with explicit type
  const [openItems, setOpenItems] = React.useState<OpenItemsState>({});

  const handleToggle = (itemKey: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemKey]: !prevState[itemKey], // Toggle the state for the specific item
    }));
  };

  // Define the items and their corresponding subitems
  const items = [
    {
      key: "introduction",
      subItems: [],
    },
    {
      key: "summary",
      subItems: [],
    },
    {
      key: "strengths_and_weaknesses",
      subItems: [],
    },
    {
      key: "software_status",
      subItems: [
        "software_maintainability",
        "software_reliability",
        "software_portability",
        "software_scalability",
        "software_efficiency",
      ],
    },
    {
      key: "team_status",
      subItems: ["team_performance_stability", "team_agility"],
    },
    {
      key: "operations_status",
      subItems: [
        "operations_reliability",
        "operations_efficiency",
        "operations_scalability",
        "operations_agility",
      ],
    },
    {
      key: "recommendations",
      subItems: [],
    },
    {
      key: "evaluation_process",
      subItems: [
        "disclaimer",
        "evaluation_steps",
        "assessment_kit_info",
        "maturity_levels",
        "topics_and_indicators",
        "questionnaires",
      ],
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 2,
        p: 2,
        maxHeight: "88vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        color="primary"
        sx={{
          pb: 1,
          ...theme.typography.titleMedium,
        }}
      >
        {t("quick_access")}
      </Typography>
      <List
        sx={{
          width: "100%",
          borderInlineStart: `2px solid ${theme.palette.primary.main}`,
          padding: 0,
          bgcolor: theme.palette.background.paper,
        }}
        component="nav"
      >
        {items.map((item, index) => {
          const hasSubItems = item.subItems.length > 0;

          return (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    backgroundColor: hasSubItems
                      ? "rgba(36, 102, 168, 0.08)"
                      : "initial",
                    color: hasSubItems
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      color: theme.palette.primary.dark,
                    },
                  }}
                  onClick={
                    hasSubItems ? () => handleToggle(item.key) : undefined
                  }
                >
                  <ListItemText
                    primary={t(item.key)}
                    sx={{
                      "& .MuiTypography-root": {
                        ...theme.typography.semiBoldMedium,
                      },
                    }}
                  />
                  {hasSubItems &&
                    (openItems[item.key] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {hasSubItems && (
                <Collapse in={openItems[item.key]} timeout="auto" unmountOnExit>
                  <List
                    sx={{
                      paddingInlineStart: theme.spacing(4),
                      bgcolor: theme.palette.grey[100],
                    }}
                  >
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem key={subIndex} disablePadding>
                        <ListItemText
                          primary={t(subItem)}
                          sx={{
                            ml: 2,
                            marginBlock: 1,
                            color: theme.palette.text.secondary,
                            "& .MuiTypography-root": {
                              ...theme.typography.semiBoldSmall,
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

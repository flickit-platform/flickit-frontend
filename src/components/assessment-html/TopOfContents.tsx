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

import assessmentData from "./greport.json";

export const AssessmentTOC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [openItems, setOpenItems] = React.useState<OpenItemsState>({});

  const handleToggle = (itemKey: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemKey]: !prevState[itemKey],
    }));
  };

  const subjects = assessmentData.subjects.map((subject: any) => ({
    key: subject.title,
    subItems: subject.attributes.map((attribute: any) => attribute.title),
    id: subject.title,
  }));

  const items = [
    {
      key: "introduction",
      subItems: [],
      id: "introduction",
    },
    {
      key: "summary",
      subItems: [],
      id: "summary",
    },
    {
      key: "strengths_and_weaknesses",
      subItems: [],
      id: "strengthsAndWeaknesses",
    },
    ...subjects,
    {
      key: "recommendations",
      subItems: [],
      id: "recommendations",
    },
    {
      key: "evaluation_process",
      subItems: [],
      id: "evaluationProcess",
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
                  component="a"
                  href={`#${item.id}`}
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
                    {item.subItems.map((subItem: any, subIndex: any) => (
                      <ListItem key={subIndex} disablePadding>
                        <ListItemButton component="a" href={`#${subItem}`}>
                          <ListItemText
                            primary={t(subItem, { title: "" })}
                            sx={{
                              ml: 2,
                              marginBlock: 1,
                              color: theme.palette.text.secondary,
                              "& .MuiTypography-root": {
                                ...theme.typography.semiBoldSmall,
                              },
                            }}
                          />
                        </ListItemButton>
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

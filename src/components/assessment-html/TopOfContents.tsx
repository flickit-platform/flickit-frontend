import React, { useMemo } from "react";
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
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";

// Define the type for the state to track open items
interface OpenItemsState {
  [key: string]: boolean;
}

export const AssessmentTOC = ({ data }: any) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [openItems, setOpenItems] = React.useState<OpenItemsState>({});

  const handleToggle = (itemKey: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemKey]: !prevState[itemKey],
    }));
  };

  const subjects = useMemo(() => {
    return (
      data?.subjects?.map((subject: any) => ({
        key: subject.title,
        subItems:
          subject?.attributes?.map((attribute: any) => attribute.title) || [],
        id: subject.title,
      })) || []
    );
  }, [data]);

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
        direction: true ? "rtl" : "ltr",
        fontFamily: true ? farsiFontFamily : primaryFontFamily,
        textAlign: true ? "right" : "left",
      }}
    >
      <Typography
        variant="h6"
        color="primary"
        sx={{
          pb: 1,
          ...theme.typography.titleMedium,
          direction: true ? "rtl" : "ltr",
          fontFamily: true ? farsiFontFamily : primaryFontFamily,
        }}
      >
        {t("quick_access", { lng: "fa" })}
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
        {items?.map((item, index) => {
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
                    primary={t(item.key, { lng: "fa" })}
                    sx={{
                      "& .MuiTypography-root": {
                        ...theme.typography.semiBoldMedium,
                        direction: true ? "rtl" : "ltr",
                        fontFamily: true ? farsiFontFamily : primaryFontFamily,
                        textAlign: true ? "right" : "left",
                      },
                      direction: true ? "rtl" : "ltr",
                      fontFamily: true ? farsiFontFamily : primaryFontFamily,
                      textAlign: true ? "right" : "left",
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
                      bgcolor: "#F9FAFB",
                    }}
                  >
                    {item.subItems?.map((subItem: any, subIndex: any) => (
                      <ListItem key={subIndex} disablePadding>
                        <ListItemButton component="a" href={`#${subItem}`}>
                          <ListItemText
                            primary={t(subItem, { lng: "fa", title: "" })}
                            sx={{
                              ml: 2,
                              marginBlock: 1,
                              direction: true ? "rtl" : "ltr",
                              fontFamily: true
                                ? farsiFontFamily
                                : primaryFontFamily,
                              textAlign: true ? "right" : "left",
                              color: theme.palette.text.secondary,
                              "& .MuiTypography-root": {
                                ...theme.typography.semiBoldSmall,
                                direction: true ? "rtl" : "ltr",
                                fontFamily: true
                                  ? farsiFontFamily
                                  : primaryFontFamily,
                                textAlign: true ? "right" : "left",
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

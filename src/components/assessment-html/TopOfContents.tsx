import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import useTheme from "@mui/material/styles/useTheme";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { IAttribute, IGraphicalReport, ISubject } from "@/types/index";
import { styles } from "@styles";
import uniqueId from "@/utils/uniqueId";
import { useAssessmentContext } from "@/providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@/utils/enumType";
import { Button } from "@mui/material";
import keycloakService from "@/service/keycloakService";
import useDialog from "@/utils/useDialog";
import ContactUsDialog from "../assessment-kit/ContactUsDialog";
import { t } from "i18next";
import { Trans } from "react-i18next";

interface OpenItemsState {
  [key: string]: boolean;
}

export const AssessmentTOC = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {
  const { assessmentInfo } = useAssessmentContext();
  const contactusDialogProps = useDialog({
    context: {
      type: "getHelp",
      data: {
        email:
          keycloakService._kc.tokenParsed?.preferred_username ??
          keycloakService._kc.tokenParsed?.sub,
        dialogTitle: t("getHelpFromAssessor"),
        content: <Trans i18nKey="getHelpFromAssessorContent" />,
        messagePlaceHolder: t("describeYourIssue"),
      },
    },
  });
  const isAdvanceMode = useMemo(() => {
    return assessmentInfo?.mode?.code === ASSESSMENT_MODE.ADVANCED;
  }, [assessmentInfo?.mode?.code]);

  const theme = useTheme();

  const [openItems, setOpenItems] = React.useState<OpenItemsState>({});

  const handleToggle = (itemKey: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemKey]: !prevState[itemKey],
    }));
  };
  const { lang } = graphicalReport;
  const rtlLanguage = lang.code.toLowerCase() === "fa";

  const subjects: any = useMemo(() => {
    return (
      graphicalReport.subjects?.map((subject: ISubject) => ({
        key: subject.title,
        subItems:
          subject?.attributes?.map(
            (attribute: IAttribute) => attribute.title,
          ) ?? [],
        id: subject.title,
      })) ?? []
    );
  }, [graphicalReport]);

  const items = [
    {
      key: "introduction",
      subItems: [],
      id: "introduction",
      isAdvanceMode: true,
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
        maxHeight: "88vh",
        position: "sticky",
        top: 70,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.primary.main}`,
          borderRadius: 2,
          p: 2,
          overflowY: "auto",
          textAlign: rtlLanguage ? "right" : "left",
          ...styles.rtlStyle(rtlLanguage),
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          sx={{
            pb: 1,
            ...theme.typography.titleMedium,
            ...styles.rtlStyle(rtlLanguage),
          }}
        >
          {t("quickAccess", { lng: lang.code.toLowerCase() })}
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
          {items?.map((item) => {
            const hasSubItems = item.subItems.length > 0;
            if (item.isAdvanceMode && !isAdvanceMode) {
              return;
            }
            return (
              <React.Fragment key={uniqueId()}>
                <ListItem
                  disablePadding
                  sx={{
                    display: {
                      md: "block",
                      xs: item.key !== "evaluation_process" ? "block" : "none",
                    },
                  }}
                >
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
                      primary={t(item.key, { lng: lang.code.toLowerCase() })}
                      sx={{
                        "& .MuiTypography-root": {
                          ...theme.typography.semiBoldMedium,
                          textAlign: rtlLanguage ? "right" : "left",
                          ...styles.rtlStyle(rtlLanguage),
                        },
                        textAlign: rtlLanguage ? "right" : "left",
                        ...styles.rtlStyle(rtlLanguage),
                      }}
                    />
                    {hasSubItems &&
                      (openItems[item.key] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>

                {hasSubItems && (
                  <Collapse
                    in={openItems[item.key]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      sx={{
                        bgcolor: "#F9FAFB",
                      }}
                    >
                      {item.subItems?.map((subItem: any) => (
                        <ListItem key={uniqueId()} disablePadding>
                          <ListItemButton component="a" href={`#${subItem}`}>
                            <ListItemText
                              primary={t(subItem, {
                                lng: lang.code.toLowerCase(),
                                title: "",
                              })}
                              sx={{
                                ml: 2,
                                marginBlock: 1,
                                textAlign: rtlLanguage ? "right" : "left",
                                ...styles.rtlStyle(rtlLanguage),
                                color: theme.palette.text.secondary,
                                "& .MuiTypography-root": {
                                  ...theme.typography.semiBoldSmall,
                                  textAlign: rtlLanguage ? "right" : "left",
                                  ...styles.rtlStyle(rtlLanguage),
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
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          onClick={() => contactusDialogProps.openDialog({})}
          variant="contained"
          sx={{
            width: "100%",
            height: 48,
            borderRadius: "16px !important",
            background: "linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)",
            color: "#fff",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            "&:hover": {
              background: "linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)",
              opacity: 0.9,
            },
          }}
        >
          {t("getHelpFromAssessor")}
        </Button>
      </Box>
      <ContactUsDialog {...contactusDialogProps} />
    </Box>
  );
};

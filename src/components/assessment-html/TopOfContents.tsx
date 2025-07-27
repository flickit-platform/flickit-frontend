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
import { useAuthContext } from "@/providers/AuthProvider";

interface OpenItemsState {
  [key: string]: boolean;
}

const SCROLL_OFFSET = -60;

const scrollToWithOffset = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const y =
      el.getBoundingClientRect().top + window.pageYOffset + SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
    window.history.pushState(null, "", `#${id}`);
  }
};

export const AssessmentTOC = ({
  graphicalReport,
}: {
  graphicalReport: IGraphicalReport;
}) => {
  const { assessmentInfo } = useAssessmentContext();
  const requestAnExpertDialogProps = useDialog({
    context: {
      type: "requestAnExpertReview",
      data: {
        email:
          keycloakService._kc.tokenParsed?.preferred_username ??
          keycloakService._kc.tokenParsed?.sub,
        dialogTitle: t("assessmentReport.expertReassessmentService"),
        children: (
          <Box>
            <Typography textAlign="justify" variant="bodyLarge">
              <Trans
                i18nKey="assessmentReport.requestAnExpertReviewContent.intro"
                components={{ strong: <strong /> }}
              />
            </Typography>

            <Typography mt={2} variant="bodyLarge" fontWeight="bold">
              {t("assessmentReport.requestAnExpertReviewContent.listTitle")}
            </Typography>

            <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
              {(
                t("assessmentReport.requestAnExpertReviewContent.listItems", {
                  returnObjects: true,
                }) as string[]
              ).map((item) => (
                <li key={uniqueId()} style={{ marginBottom: 6 }}>
                  • {item}
                </li>
              ))}
            </ul>

            <Typography mt={2} textAlign="justify" variant="bodyLarge">
              <Trans
                i18nKey="assessmentReport.requestAnExpertReviewContent.note"
                components={{ strong: <strong /> }}
              />
            </Typography>

            <Typography mt={1} textAlign="justify" variant="bodyLarge">
              {t("assessmentReport.requestAnExpertReviewContent.instruction")}
            </Typography>
          </Box>
        ),
        primaryActionButtonText: t("assessmentReport.submitRequest"),
      },
    },
  });

  const theme = useTheme();

  const [openItems, setOpenItems] = React.useState<OpenItemsState>({});

  const handleToggle = (itemKey: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemKey]: !prevState[itemKey],
    }));
  };
  const { lang, assessment } = graphicalReport;
  const rtlLanguage = lang.code.toLowerCase() === "fa";

  const isAdvanceMode = useMemo(() => {
    return assessment?.mode?.code === ASSESSMENT_MODE.ADVANCED;
  }, [assessmentInfo?.mode?.code]);

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
      label: "assessmentReport.introduction",
      subItems: [],
      id: "introduction",
      isAdvanceMode: true,
    },
    {
      label: "common.summary",
      subItems: [],
      id: "summary",
    },
    {
      label: "assessmentReport.prosAndCons",
      subItems: [],
      id: "strengthsAndWeaknesses",
    },
    ...subjects,
    {
      label: "assessmentReport.recommendations",
      subItems: [],
      id: "recommendations",
    },
    {
      label: "assessmentReport.evaluation_process",
      subItems: [],
      id: "evaluationProcess",
    },
  ];
  const { isAuthenticatedUser } = useAuthContext();

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
          maxHeight: "50vh",
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
          {t("assessmentReport.quickAccess", { lng: lang.code.toLowerCase() })}
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
                      xs: item.id !== "evaluationProcess" ? "block" : "none",
                    },
                  }}
                >
                  <ListItemButton
                    component="button"
                    onClick={
                      hasSubItems
                        ? () => handleToggle(item.id)
                        : () => scrollToWithOffset(item.id)
                    }
                    sx={{
                      width: "100%",
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
                  >
                    <ListItemText
                      primary={t(hasSubItems ? item.id : item.label, {
                        lng: lang.code.toLowerCase(),
                      })}
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
                      (openItems[item.id] ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>

                {hasSubItems && (
                  <Collapse
                    in={openItems[item.id]}
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
                          <ListItemButton
                            component="button"
                            onClick={() => scrollToWithOffset(subItem)}
                          >
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

      {isAuthenticatedUser && !isAdvanceMode && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "#EAF2FB",
            boxShadow: "0px 0px 8px 0px rgba(10, 35, 66, 0.25)",
            flexShrink: 0,
            ...styles.rtlStyle(rtlLanguage),
          }}
        >
          <Typography
            textAlign="justify"
            variant="bodySmall"
            sx={{ fontFamily: "inherit" }}
          >
            <Trans
              i18nKey="assessmentReport.contactExpertBoxText.intro"
              components={{ strong: <strong /> }}
              t={(key: any, options?: any) =>
                t(key, { lng: lang.code.toLowerCase(), ...options })
              }
            />
          </Typography>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginBlock: 0,
              ...theme.typography.bodySmall,
              fontFamily: "inherit",
            }}
          >
            {(
              t("assessmentReport.contactExpertBoxText.points", {
                lng: lang.code.toLowerCase(),
                returnObjects: true,
              }) as string[]
            ).map((item) => (
              <li key={uniqueId()}>• {item}</li>
            ))}
          </ul>

          <Typography
            textAlign="justify"
            variant="bodySmall"
            sx={{ fontFamily: "inherit" }}
          >
            {t("assessmentReport.contactExpertBoxText.outro", {
              lng: lang.code.toLowerCase(),
            })}
          </Typography>

          <Button
            size="medium"
            onClick={() => requestAnExpertDialogProps.openDialog({})}
            variant="contained"
            sx={{
              mt: 2,
              width: "100%",
              background: "linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)",
              color: "#fff",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              "&:hover": {
                background: "linear-gradient(45deg, #1B4D7E, #2D80D2, #1B4D7E)",
                opacity: 0.9,
              },
              fontFamily: "inherit",
            }}
          >
            {t("assessmentReport.contactExpertGroup", {
              lng: lang.code.toLowerCase(),
            })}
          </Button>
        </Box>
      )}

      <ContactUsDialog {...requestAnExpertDialogProps} />
    </Box>
  );
};

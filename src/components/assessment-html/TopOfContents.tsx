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
import ContactUsDialog from "../common/dialogs/ContactUsDialog";
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
  const { lang, assessment } = graphicalReport;
  const lng = lang.code.toLowerCase();
  const rtlLanguage = lang.code.toLowerCase() === "fa";

  const requestAnExpertDialogProps = useDialog({
    context: {
      type: "requestAnExpertReview",
      data: {
        email:
          keycloakService._kc.tokenParsed?.preferred_username ??
          keycloakService._kc.tokenParsed?.sub,
        dialogTitle: t("assessmentReport.contactExpertGroup", { lng }),
        children: (
          <Typography
            textAlign="justify"
            variant="bodyLarge"
            fontFamily="inherit"
            dangerouslySetInnerHTML={{
              __html: t("assessmentReport.requestAnExpertReviewContent", {
                lng,
              }),
            }}
          ></Typography>
        ),
      },
    },
  });


  const [openItems, setOpenItems] = React.useState<OpenItemsState>({});

  const theme = useTheme()

  const handleToggle = (itemKey: string) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [itemKey]: !prevState[itemKey],
    }));
  };

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
      label: "assessmentReport.subjectsOverview",
      subItems: [],
      id: "subjectsOverview",
      hideItem: subjects.length === 1,
    },
    {
      label: "assessmentReport.maturityMapOfAssessedAttributes",
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
      maxHeight="88vh"
      position="sticky"
      top={70}
    >
      <Box
        bgcolor="background.containerLowest"
        border={(theme) => `2px solid ${theme.palette.primary.main}`}
        borderRadius={2}
        p={2}
        maxHeight={isAuthenticatedUser && !isAdvanceMode ? "50vh" : "88vh"}
        textAlign={rtlLanguage ? "right" : "left"}
        sx={{
          overflowY: "auto",
          ...styles.rtlStyle(rtlLanguage),
        }}
      >
        <Typography
          variant="titleMedium"
          color="primary"
          pb={1}
          sx={{ ...styles.rtlStyle(rtlLanguage) }}
        >
          {t("assessmentReport.quickAccess", { lng })}
        </Typography>
        <List
          sx={{
            width: "100%",
            borderInlineStart: (theme) => `2px solid ${theme.palette.primary.main}`,
            padding: 0,
            bgcolor: "background.containerLowest",
          }}
          component="nav"
        >
          {items?.map((item) => {
            const hasSubItems = item.subItems.length > 0;
            if ((item.isAdvanceMode && !isAdvanceMode) || item.hideItem) {
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
                      color: hasSubItems ? "primary.main" : "text.primary",
                      "&:hover": {
                        bgcolor: "action.hover",
                        color: "primary.dark",
                      },
                    }}
                  >
                    <ListItemText
                      primary={t(hasSubItems ? item.id : item.label, {
                        lng,
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
                    <List sx={{ bgcolor: "background.containerLow" }}>
                      {item.subItems?.map((subItem: any) => (
                        <ListItem key={uniqueId()} disablePadding>
                          <ListItemButton
                            component="button"
                            onClick={() => scrollToWithOffset(subItem)}
                          >
                            <ListItemText
                              primary={t(subItem, {
                                lng,
                                title: "",
                              })}
                              sx={{
                                ml: 2,
                                marginBlock: 1,
                                textAlign: rtlLanguage ? "right" : "left",
                                ...styles.rtlStyle(rtlLanguage),
                                color: "background.onVariant",
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
          mt={2}
          p={2}
          borderRadius={2}
          bgcolor="primary.states.selected"
          boxShadow="0px 0px 8px 0px rgba(10, 35, 66, 0.25)"
          flexShrink={0}
          sx={{ ...styles.rtlStyle(rtlLanguage) }}
        >
          <Typography
            variant="bodySmall"
            textAlign="justify"
            fontFamily="inherit"
            display="block"
          >
            <Trans
              i18nKey="assessmentReport.contactExpertBoxText.intro"
              components={{ strong: <strong /> }}
              t={(key: any, options?: any) => t(key, { lng, ...options })}
            />
          </Typography>

          <ul
            style={{
              listStyle: "none",
              paddingInline: 8,
              ...theme.typography.bodySmall,
              fontFamily: "inherit",
              textAlign: "justify",
            }}
          >
            {(
              t("assessmentReport.contactExpertBoxText.points", {
                lng,
                returnObjects: true,
              }) as string[]
            ).map((item) => (
              <li key={uniqueId()}>• {item}</li>
            ))}
          </ul>

          <Typography
            variant="bodySmall"
            textAlign="justify"
            fontFamily="inherit"
            display="block"
          >
            {t("assessmentReport.contactExpertBoxText.outro", { lng })}
          </Typography>

          <Button
            size="medium"
            onClick={() => requestAnExpertDialogProps.openDialog({})}
            variant="contained"
            sx={{
              mt: 2,
              width: "100%",
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #2D80D2,  ${theme.palette.primary.dark})`,
              color: "background.containerLowest",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              "&:hover": {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #2D80D2,  ${theme.palette.primary.dark})`,
                opacity: 0.9,
              },
              fontFamily: "inherit",
            }}
          >
            {t("assessmentReport.contactExpertGroup", { lng })}
          </Button>
        </Box>
      )}

      <ContactUsDialog
        {...requestAnExpertDialogProps}
        lng={lng}
        sx={{ ...styles.rtlStyle(rtlLanguage) }}
      />
    </Box>
  );
};

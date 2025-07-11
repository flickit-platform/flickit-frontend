import { QuestionnaireCard } from "./QuestionnaireCard";
import QueryData from "@common/QueryData";
import Grid from "@mui/material/Grid";
import LoadingSkeletonOfQuestionnaires from "@common/loadings/LoadingSkeletonOfQuestionnaires";
import Box from "@mui/material/Box";
import QANumberIndicator from "@common/QANumberIndicator";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { t } from "i18next";
import { theme } from "@config/theme";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useMemo, useState } from "react";
import { styles } from "@styles";
import { Link, useLocation, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useAssessmentContext } from "@providers/AssessmentProvider";
import { ASSESSMENT_MODE } from "@utils/enumType";

interface IQuestionnaireListProps {
  questionnaireQueryData: any;
  assessmentTotalProgress: any;
}

const itemNames = [
  {
    translate: t("dashboard.unansweredQuestions"),
    original: "unanswered",
  },
  {
    translate: t("dashboard.lowConfidenceAnswers"),
    original: "answeredWithLowConfidence",
  },
  {
    translate: t("dashboard.unresolvedComments"),
    original: "unresolvedComments",
  },
  {
    translate: t("dashboard.answersWithNoEvidence"),
    original: "answeredWithoutEvidence",
  },
  {
    translate: t("dashboard.unapprovedAnswers"),
    original: "unapprovedAnswers",
  },
];

export const QuestionsFilteringDropdown = (props: any) => {
  const {
    originalItem,
    setOriginalItem,
    itemNames,
    dropdownLabel,
    allSelected,
    filteredItem,
  } = props;
  const { assessmentInfo } = useAssessmentContext();
  const [issues, setIssues] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof issues>) => {
    const {
      target: { value },
    } = event;
    setIssues(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    if (!!filteredItem && typeof filteredItem == "string") {
      const filteredItemObj = itemNames.find(
        (item: any) => filteredItem === item.original,
      );

      setIssues([filteredItemObj.translate]);
    }
    if (allSelected) {
      const allItems = itemNames.map((item: any) => item.translate);
      setIssues(allItems);
      setOriginalItem(itemNames.map((item: any) => item.original));
    }
  }, []);

  const handelSaveOriginal = (name: any) => {
    if (!originalItem.includes(name)) {
      setOriginalItem([...originalItem, name]);
    } else {
      const copySave = [...originalItem];
      const filtered = copySave.filter((item) => item != name);
      setOriginalItem(filtered);
    }
  };

  const handelSelected = (selected: any) => {
    const isAllSelected = issues.length === itemNames.length;

    if (selected.length == 0) {
      return (
        <Typography
          sx={{ ...theme.typography.semiBoldMedium, color: "#333333" }}
        >
          <Trans i18nKey="common.none" />
        </Typography>
      );
    } else if (isAllSelected) {
      return (
        <Typography
          sx={{ ...theme.typography.semiBoldMedium, color: "#333333" }}
        >
          <Trans i18nKey="common.all" />
        </Typography>
      );
    } else if (selected.length == 1) {
      return selected.join(", ");
    } else {
      return (
        <Box
          sx={{
            ...theme.typography.semiBoldMedium,
            color: "#333333",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Trans i18nKey="dashboard.selectedIssuesType" />:
          <Typography>{selected.length}</Typography>
        </Box>
      );
    }
  };
  return (
    <Box
      sx={{
        display:
          ASSESSMENT_MODE.ADVANCED === assessmentInfo?.mode?.code
            ? "flex"
            : "none",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography sx={{ ...theme.typography.semiBoldLarge }}>
        {dropdownLabel ?? (
          <Trans i18nKey="dashboard.filterQuestionsWithIssues" />
        )}
      </Typography>
      <FormControl sx={{ m: 1, width: 250 }}>
        <Select
          labelId="demo-multiple-checkbox-label-kit-container"
          id="demo-multiple-checkbox"
          multiple
          value={issues.map((item: any) => t(item))}
          onChange={handleChange}
          displayEmpty={true}
          renderValue={(selected) => handelSelected(selected)}
          sx={{
            ...theme.typography.semiBoldMedium,
            background: "#fff",
            px: "0px",
            height: "40px",
          }}
        >
          {itemNames.map((item: { translate: string; original: string }) => (
            <MenuItem
              key={item.translate}
              value={item.translate}
              onClick={() => handelSaveOriginal(item.original)}
            >
              <Checkbox
                checked={
                  issues.includes(t(item.translate)) ||
                  issues.includes(item.original)
                }
              />
              <ListItemText
                sx={{
                  ...theme.typography.semiBoldMedium,
                  color: "#333333",
                }}
                primary={<Trans i18nKey={`${item.translate}`} />}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const ProgressButton = (props: any) => {
  const { questionsCount, answersCount } = props;
  const { assessmentId, spaceId } = useParams();

  const leftQuestions = useMemo(() => {
    const total = questionsCount ?? 0;
    const answered = answersCount ?? 0;
    return total - answered;
  }, [questionsCount, answersCount]);

  const calculatePercentage = useMemo(() => {
    const total = questionsCount ?? 0;
    const answered = answersCount ?? 0;
    return Number((answered / total).toFixed(2)) * 100;
  }, [questionsCount, answersCount]);

  return (
    <Box>
      {leftQuestions > 0 ? (
        <Box>
          <Button
            sx={{
              borderRadius: "4px",
              background: "#C2CCD680",
              height: "40px",
              width: "176px",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                background: "#C2CCD680",
              },
            }}
          >
            <Box
              sx={{
                background: "#C2CCD680",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius:
                  theme.direction == "rtl" ? "4px 0 0 4px" : "0 4px 4px 0",
                width: calculatePercentage ? `${calculatePercentage}%` : "0%",
                transition: "all 1s ease-in-out",
              }}
            ></Box>
            <Typography
              sx={{
                color: "#3D4D5C80",
              }}
            >
              <Trans i18nKey="assessmentReport.viewReport" />
            </Typography>
          </Button>
          <Typography
            sx={{
              ...theme.typography.labelMedium,
              color: "#FF9000",
              textAlign: "center",
            }}
          >
            <Trans
              i18nKey="dashboard.moreAnswersNeeded"
              values={{ count: leftQuestions }}
            />
          </Typography>
        </Box>
      ) : (
        <Button
          component={Link}
          to={`/${spaceId}/assessments/${assessmentId}/graphical-report/`}
          state={{ from: location.pathname }}
          sx={{
            borderRadius: "4px",
            background: "#F3F5F6",
            height: "40px",
            width: "176px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 1px 5px rgba(0,0,0,0.12)",
            "&:hover": {
              background: "#F3F5F6",
            },
          }}
        >
          <Typography
            sx={{
              color: theme.palette.primary.main,
            }}
          >
            <Trans i18nKey="assessmentReport.viewReport" />
          </Typography>
        </Button>
      )}
    </Box>
  );
};

export const QuestionnaireList = (props: IQuestionnaireListProps) => {
  const { questionnaireQueryData, assessmentTotalProgress } = props;
  const [originalItem, setOriginalItem] = useState<string[]>([]);

  const { assessmentInfo } = useAssessmentContext();

  const [isQuickMode, setIsQuickMode] = useState(false);

  useEffect(() => {
    setIsQuickMode(assessmentInfo?.mode?.code === ASSESSMENT_MODE.QUICK);
  }, [assessmentInfo?.mode?.code]);

  const { state } = useLocation();

  useEffect(() => {
    if (!!state && typeof state == "string") {
      setOriginalItem([state]);
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          ...styles.centerH,
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: { sm: "10px" },
        }}
      >
        <Box
          minWidth="130px"
          display="flex"
          justifyContent={"flex-end"}
          sx={{
            position: {
              xs: "absolute",
              sm: "static",
              top: "8px",
              right: "14px",
            },
          }}
        >
          <Typography variant={"titleLarge"} color="white">
            <Trans i18nKey="common.questionnaires" />
            {"  "}(
            <QANumberIndicator
              color="white"
              q={assessmentTotalProgress?.data?.questionsCount ?? ""}
              variant={"titleLarge"}
            />
            )
          </Typography>
        </Box>

        {isQuickMode ? (
          <ProgressButton {...assessmentTotalProgress?.data} />
        ) : (
          <QuestionsFilteringDropdown
            setOriginalItem={setOriginalItem}
            originalItem={originalItem}
            itemNames={itemNames}
            filteredItem={state}
          />
        )}
      </Box>
      <Box>
        <Divider sx={{ borderColor: "white", opacity: 0.4, mt: 1, mb: 1 }} />
        <Box pb={2}>
          <QueryData
            {...(questionnaireQueryData ?? {})}
            isDataEmpty={(data) => data.questionaries_info?.length === 0}
            renderLoading={() => <LoadingSkeletonOfQuestionnaires />}
            render={(data) => {
              const { items, permissions } = data;
              const filteredItems = items.filter((item: any) =>
                originalItem.length === 0
                  ? item
                  : Object.keys(item.issues).some(
                      (key) =>
                        originalItem.includes(key) && item.issues[key] > 0,
                    ),
              );
              return (
                <Grid container spacing={2} sx={{ minHeight: "250px" }}>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((data: any) => {
                      return (
                        <Grid item lg={4} md={6} sm={12} xs={12} key={data.id}>
                          <QuestionnaireCard
                            data={data}
                            permissions={permissions}
                            originalItem={originalItem}
                          />
                        </Grid>
                      );
                    })
                  ) : (
                    <Box sx={{ ...styles.centerVH, width: "100%" }}>
                      <Typography
                        sx={{
                          ...theme.typography.headlineLarge,
                          color: "#C2CCD680",
                        }}
                      >
                        {originalItem.length == 1 && (
                          <Trans i18nKey="dashboard.noIssueFound" />
                        )}
                        {originalItem.length > 1 && (
                          <Trans i18nKey="dashboard.NoIssuesFound" />
                        )}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              );
            }}
          />
        </Box>
      </Box>
    </>
  );
};

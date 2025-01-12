import { QuestionnaireCard } from "./QuestionnaireCard";
import QueryData from "@common/QueryData";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import LoadingSkeletonOfQuestionnaires from "@common/loadings/LoadingSkeletonOfQuestionnaires";
import Box from "@mui/material/Box";
import QANumberIndicator from "@common/QANumberIndicator";
import Divider from "@mui/material/Divider";
import { MenuItem, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { t } from "i18next";
import { theme } from "@config/theme";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

interface IQuestionnaireListProps {
  questionnaireQueryData: any;
  assessmentTotalProgress: any;
}

export const QuestionnaireList = (props: IQuestionnaireListProps) => {
  const { questionnaireQueryData, assessmentTotalProgress } = props;
  const [issues, setIssues] = useState<string[]>([]);
  const [originalItem, setOriginalItem] = useState<string[]>([]);
  const [questionCardColumnCondition, setQuestionCardColumnCondition] =
    useState<boolean>(true);

  const handleChange = (event: SelectChangeEvent<typeof issues>) => {
    const {
      target: { value },
    } = event;
    setIssues(typeof value === "string" ? value.split(",") : value);
  };

  const handelSaveOriginal = (name: any) => {
    if (!originalItem.includes(name)) {
      setOriginalItem([...originalItem, name]);
    } else {
      const copySave = [...originalItem];
      const filtered = copySave.filter((item) => item != name);
      setOriginalItem(filtered);
    }
  };

  const itemNames = [
    { translate: t("unansweredQuestions"), original: "unanswered" },
    {
      translate: t("lowConfidenceAnswers"),
      original: "answeredWithLowConfidence",
    },
    { translate: t("unresolvedComments"), original: "unresolvedComments" },
    {
      translate: t("answersWithNoEvidence"),
      original: "answeredWithoutEvidence",
    },
  ];

  const handelSelected = (selected: any) => {
    const isAllSelected = issues.length === itemNames.length;

    if (selected.length == 0) {
      return (
        <Typography
          sx={{ ...theme.typography.semiBoldMedium, color: "#333333" }}
        >
          <Trans i18nKey={"none"} />
        </Typography>
      );
    } else if (isAllSelected) {
      return (
        <Typography
          sx={{ ...theme.typography.semiBoldMedium, color: "#333333" }}
        >
          <Trans i18nKey={"allIssuesSelected"} />
        </Typography>
      );
    } else {
      if (selected.length == 1) {
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
            <Trans i18nKey={"selectedIssuesType"} />:
            <Typography>{selected.length}</Typography>
          </Box>
        );
      }
    }
  };

  return (
    <>
      <Box display={"flex"} justifyContent="space-between">
        {/* <QueryData
          {...(pageQueryData || {})}
          errorComponent={<></>}
          renderLoading={() => {
            return (
              <Box height="100%" sx={{ ...styles.centerV, pl: 1 }}>
                {[1, 2, 3].map((item) => {
                  return <LoadingSkeleton height="36px" width="70px" key={item} sx={{ ml: 1 }} />;
                })}
              </Box>
            );
          }}
          render={(data) => {
            const { subjects = [] } = data;
            return <FilterBySubject fetchQuestionnaires={fetchQuestionnaires} subjects={subjects} />;
          }}
        /> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ ...theme.typography.semiBoldLarge }}>
            <Trans i18nKey={"filterQuestionsWithIssues"} />:
          </Typography>
          <FormControl sx={{ m: 1, width: 250 }}>
            <Select
              labelId="demo-multiple-checkbox-label"
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
              {itemNames.map(
                (item: { translate: string; original: string }) => (
                  <MenuItem
                    key={item.translate}
                    value={item.translate}
                    onClick={() => handelSaveOriginal(item.original)}
                  >
                    <Checkbox checked={issues.includes(t(item.translate))} />
                    <ListItemText
                      sx={{
                        ...theme.typography.semiBoldMedium,
                        color: "#333333",
                      }}
                      primary={<Trans i18nKey={`${item.translate}`} />}
                    />
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </Box>
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
          <QueryData
            {...(assessmentTotalProgress || {})}
            errorComponent={<></>}
            renderLoading={() => <Skeleton width="60px" height="36px" />}
            render={(data) => {
              const { questionsCount = 0, answersCount = 0 } = data || {};
              return (
                <QANumberIndicator
                  color="white"
                  q={questionsCount}
                  a={answersCount}
                  variant="h6"
                />
              );
            }}
          />
        </Box>
      </Box>
      <Box>
        <Divider sx={{ borderColor: "white", opacity: 0.4, mt: 1, mb: 1 }} />
        <Box pb={2}>
          <QueryData
            {...(questionnaireQueryData || {})}
            isDataEmpty={(data) => data.questionaries_info?.length === 0}
            renderLoading={() => <LoadingSkeletonOfQuestionnaires />}
            render={(data) => {
              const { items, permissions } = data;
              return (
                <Grid container spacing={2}>
                  {items
                    .filter((item: any) =>
                      originalItem.length === 0
                        ? item
                        : Object.keys(item.issues).some(
                            (key) =>
                              originalItem.includes(key) &&
                              item.issues[key] > 0,
                          ),
                    )
                    .map((data: any) => {
                      return (
                        <Grid
                          item
                          // xl={questionCardColumnCondition ? 4 : 6}
                          // md={questionCardColumnCondition ? 6 : 12}
                          md={6}
                          sm={12}
                          xs={12}
                          key={data.id}
                        >
                          <QuestionnaireCard
                            data={data}
                            permissions={permissions}
                            originalItem={originalItem}
                            setQuestionCardColumnCondition={
                              setQuestionCardColumnCondition
                            }
                          />
                        </Grid>
                      );
                    })}
                </Grid>
              );
            }}
          />
        </Box>
      </Box>
    </>
  );
};

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Trans } from "react-i18next";
import QANumberIndicator from "@common/QANumberIndicator";
import QuestionnaireProgress from "@common/progress/CategoryProgress";
import { Link } from "react-router-dom";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import { styles } from "@styles";
import { IPermissions, IQuestionnairesInfo, TId } from "@/types/index";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import languageDetector from "@/utils/languageDetector";
import { useRef, useState } from "react";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import Grid from "@mui/material/Grid";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTheme } from "@mui/material";
import Title from "@common/Title";

interface IQuestionnaireCardProps {
  data: IQuestionnairesInfo;
  permissions: IPermissions;
  originalItem: string[];
}

const QuestionnaireCard = (props: IQuestionnaireCardProps) => {
  const { data, originalItem } = props;
  const {
    issues: {
      answeredWithLowConfidence,
      answeredWithoutEvidence,
      unanswered,
      unresolvedComments,
      unapprovedAnswers,
    },
  } = data;
  const { permissions }: { permissions: IPermissions } = props;
  const {
    id,
    title,
    questionCount: number_of_questions,
    answerCount: number_of_answers,
    description,
    progress = 0,
    nextQuestion,
  } = data ?? {};
  const is_farsi = Boolean(localStorage.getItem("lang") === "fa");
  const [collapse, setCollapse] = useState<boolean>(false);
  const theme = useTheme();

  const titleRef = useRef<any>(null);
  const mainBoxRef = useRef<any>(null);
  const boxRef = useRef<any>(null);

  return (
    <Paper sx={{ mt: 3, borderRadius: "4px" }} data-cy="questionnaire-card">
      <Box
        p="16px"
        display="flex"
        flexDirection={"column"}
        height="100%"
        justifyContent={"space-between"}
      >
        <Box>
          <Box flex={1}>
            <Title size="small" sx={{width:"100%"}} fontWeight={"bold"}>
              <Box ref={mainBoxRef} flex="1" sx={{ ...styles.centerV }}>
                <Title
                  fontWeight={"bold"}
                  size="small"
                  sx={{
                    ...theme.typography.titleMedium,
                    whiteSpace: "wrap",
                    fontFamily: languageDetector(title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                    display: "inline-block",
                    textTransform: "lowercase",
                    "&::first-letter": !languageDetector(title)
                      ? {
                          textTransform: "uppercase",
                        }
                      : {},
                  }}
                  ref={titleRef}
                >
                  <span
                    style={{
                      fontFamily: languageDetector(title)
                        ? farsiFontFamily
                        : primaryFontFamily,
                    }}
                  >
                    {title}
                  </span>
                  {description && (
                    <IconButton
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => setCollapse(!collapse)}
                      size="small"
                    >
                      <InfoOutlined sx={{ width: "16px", height: "16px" }} />
                    </IconButton>
                  )}
                </Title>
                <Box
                  ref={boxRef}
                  display="inline-block"
                  sx={{
                    float: theme.direction === "ltr" ? "right" : "left",
                    marginInlineStart: "auto",
                    marginInlineEnd: "unset",
                    minWidth: "80px",
                    textAlign: "end",
                  }}
                >
                  <QANumberIndicator
                    q={number_of_questions}
                    color={theme.palette.background.onVariant}
                    variant={"labelSmall"}
                  />
                </Box>
              </Box>
            </Title>
            <QuestionDescription
              description={description}
              collapse={collapse}
            />
          </Box>
        </Box>
        <Box sx={{ ...styles.centerV }} pt={1}>
          <QuestionnaireProgress
            position="relative"
            left={is_farsi ? 0 : "-16px"}
            right={is_farsi ? "-16px" : 0}
            progress={progress}
          />
        </Box>

        {/* Error Chips */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            my: originalItem.length >= 1 ? "15px" : "10px",
          }}
        >
          {originalItem.includes("answeredWithLowConfidence") && (
            <ErrorChip
              i18nKey="dashboard.answeredWithLowConfidence"
              value={answeredWithLowConfidence}
            />
          )}
          {originalItem.includes("answeredWithoutEvidence") && (
            <ErrorChip
              i18nKey="dashboard.answeredWithoutEvidence"
              value={answeredWithoutEvidence}
            />
          )}
          {originalItem.includes("unapprovedAnswers") && (
            <ErrorChip
              i18nKey="dashboard.unapprovedAnswers"
              value={unapprovedAnswers}
            />
          )}
          {originalItem.includes("unanswered") && (
            <ErrorChip i18nKey="dashboard.unanswered" value={unanswered} />
          )}
          {originalItem.includes("unresolvedComments") && (
            <ErrorChip
              i18nKey="dashboard.unresolvedComments"
              value={unresolvedComments}
            />
          )}
        </Box>

        {/* Subject Chips & Actions */}
        <Box display="flex" alignItems="end" justifyContent={"flex-end"}>
          {permissions.viewQuestionnaireQuestions && (
            <ActionButtons
              id={id}
              progress={progress}
              number_of_answers={number_of_answers}
              nextQuestion={nextQuestion}
              title={title}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const QuestionDescription = ({ description, collapse }: any) => {
  const is_farsi = languageDetector(description);
  return (
    <Box>
      <Box mt={1} width="100%">
        <Collapse in={collapse}>
          <Box
            sx={{
              flex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              border: "1px dashed #ffffff99",
              borderRadius: "8px",
              ...styles.rtlStyle(is_farsi),
            }}
          >
            <Box display="flex" alignItems={"baseline"} sx={{ width: "100%" }}>
              <Typography
                variant="bodyLarge"
                fontFamily={
                  languageDetector(description)
                    ? farsiFontFamily
                    : primaryFontFamily
                }
              >
                {description}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

const ActionButtons = ({
  id,
  title,
  progress,
  number_of_answers,
  nextQuestion,
}: {
  id: TId;
  title: string;
  progress: number;
  number_of_answers: number;
  nextQuestion: number;
}) => {
  const is_farsi = localStorage.getItem("lang") === "fa";
  return (
    <Box display="flex" gap={1}>
      {progress === 100 && <ActionButton to={`${id}/1`} text="common.edit" />}
      {progress > 0 && (
        <ActionButton
          to={`${id}/completed`}
          text="common.review"
          state={{ name: "Questionnaires" }}
        />
      )}
      {progress < 100 && progress > 0 && (
        <ActionButton
          to={`${id}/${nextQuestion || number_of_answers + 1}`}
          text="common.continue"
          data-cy={`questionnaire-${title}-start-btn`}
          variant="contained"
        />
      )}
      {progress === 0 && (
        <ActionButton
          to={`${id}/1`}
          text="common.start"
          icon={
            <StartRoundedIcon
              sx={{
                transform: is_farsi ? "rotate(-180deg)" : "",
                ml: is_farsi ? 0 : 1,
                mr: is_farsi ? 1 : 0,
              }}
              fontSize="small"
            />
          }
          data-cy={`questionnaire-${title}-start-btn`}
          variant={"contained"}
        />
      )}
    </Box>
  );
};

const ActionButton = ({
  to,
  text,
  icon,
  state = {},
  variant,
  ...rest
}: {
  to: string;
  text: string;
  icon?: JSX.Element;
  state?: any;
  variant?: any;
}) => (
  <Button
    size="medium"
    component={Link}
    state={state}
    to={to}
    endIcon={icon}
    sx={{ ml: 0.5 }}
    variant={variant}
    {...rest}
  >
    <Typography
      variant="semiBoldMedium"
      color={variant ? "primary.contrastText" : "primary.main"}
      textTransform="capitalize"
    >
      <Trans i18nKey={text} />
    </Typography>
  </Button>
);

const ErrorChip = ({ i18nKey, value }: { i18nKey: string; value?: number }) => {
  const theme = useTheme();

  if (!value) return null;

  return (
    <Chip
      sx={{ bgcolor: "#8A0F240A" }}
      label={
        <Grid>
          <Box gap={1} sx={{ ...styles.centerVH }}>
            <ErrorOutlineIcon
              fontSize={"small"}
              style={{ fill: theme.palette.error.main }}
            />
            <Typography variant="bodyMedium" color="error.main">
              <Trans i18nKey={i18nKey} />: {value}
            </Typography>
          </Box>
        </Grid>
      }
    />
  );
};

export { QuestionnaireCard };

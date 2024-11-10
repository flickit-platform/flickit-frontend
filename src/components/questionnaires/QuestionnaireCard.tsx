import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import QANumberIndicator from "@common/QANumberIndicator";
import QuestionnaireProgress from "@common/progress/CategoryProgress";
import { Link } from "react-router-dom";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import useScreenResize from "@utils/useScreenResize";
import { styles } from "@styles";
import { IPermissions, IQuestionnairesInfo, TId } from "@types";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import languageDetector from "@/utils/languageDetector";
import { useState } from "react";
import InfoRounded from "@mui/icons-material/InfoRounded";
import { theme } from "@/config/theme";

interface IQuestionnaireCardProps {
  data: IQuestionnairesInfo;
  permissions: IPermissions;
}

const QuestionnaireCard = (props: IQuestionnaireCardProps) => {
  const { data } = props;
  const { permissions }: { permissions: IPermissions } = props;
  const {
    id,
    title,
    questionCount: number_of_questions,
    answerCount: number_of_answers,
    description,
    progress = 0,
    subjects,
    nextQuestion,
  } = data || {};
  const isSmallScreen = useScreenResize("sm");
  const is_farsi = localStorage.getItem("lang") === "fa" ? true : false;
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <Paper sx={{ mt: 3 }} data-cy="questionnaire-card">
      <Box
        p="8px 6px"
        pl={is_farsi ? 0 : "12px"}
        pr={is_farsi ? "12px" : 0}
        display="flex"
        flexDirection={"column"}
        height="100%"
        justifyContent={"space-between"}
      >
        <Box>
          <Box flex={1}>
            <Title
              // sub={last_updated && `${(<Trans i18nKey={"lastUpdated"} />)} ${last_updated}`}
              size="small"
              fontWeight={"bold"}
            >
              <Box flex="1" display="flex" alignItems={"flex-start"}>
                {title}
                {description && (
                  <IconButton
                    sx={{
                      cursor: "pointer",
                      userSelect: "none",
                      marginInline: 1,
                    }}
                    onClick={() => setCollapse(!collapse)}
                    size="small"
                  >
                    <InfoRounded />
                  </IconButton>
                )}

                {!isSmallScreen && (
                  <Box
                    p="0 8px"
                    display="inline-block"
                    sx={{
                      float: theme.direction === "ltr" ? "right" : "left",
                      marginLeft: theme.direction === "ltr" ? "auto" : "unset",
                      marginRight: theme.direction === "ltr" ? "unset" : "auto",
                      minWidth: "80px",
                    }}
                  >
                    <QANumberIndicator
                      q={number_of_questions}
                      a={number_of_answers}
                    />
                  </Box>
                )}
              </Box>
            </Title>
            <QuestionDescription
              description={description}
              collapse={collapse}
            />
          </Box>
        </Box>
        <Box sx={{ ...styles.centerV }} pt={1} pb={2}>
          <QuestionnaireProgress
            position="relative"
            left={is_farsi ? 0 : "-12px"}
            right={is_farsi ? "-12px" : 0}
            progress={progress}
            q={number_of_questions}
            a={number_of_answers}
            isQuestionnaire={true}
            isSmallScreen={isSmallScreen}
          />
        </Box>
        <Box display="flex" alignItems="end" justifyContent={"space-between"}>
          <Box>
            {subjects.map((subject) => {
              const { title, id } = subject;
              return (
                <Chip
                  label={title}
                  size="small"
                  sx={{
                    marginRight: theme.direction === "ltr" ? 0.3 : "unset",
                    marginLeft: theme.direction === "rtl" ? 0.3 : "unset",
                    mb: 0.1,
                  }}
                  key={id}
                />
              );
            })}
          </Box>
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

const QuestionDescription = (props: any) => {
  const { description, collapse } = props;
  const is_farsi = languageDetector(description);
  return (
    <Box>
      <Box mt={1} width="100%">
        <Collapse in={collapse}>
          <Box
            sx={{
              flex: 1,
              mr: { xs: 0, md: 4 },
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              border: "1px dashed #ffffff99",
              borderRadius: "8px",
              direction: `${is_farsi ? "rtl" : "ltr"}`,
            }}
          >
            <Box
              display="flex"
              alignItems={"baseline"}
              sx={{
                width: "100%",
              }}
            >
              <Typography variant="bodyLarge">{description}</Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
const ActionButtons = (props: {
  id: TId;
  title: string;
  progress: number;
  number_of_answers: number;
  nextQuestion: number;
}) => {
  const { id, progress, number_of_answers, nextQuestion, title } = props;
  const is_farsi = localStorage.getItem("lang") === "fa"
  return (
    <Box display="flex">
      {progress === 100 && (
        <ActionButton
          to={`${id}/1`}
          text="edit"
          icon={<ModeEditOutlineRoundedIcon sx={{ ml: is_farsi ? 0 : 1, mr: is_farsi ? 1 : 0 }} fontSize="small" />}
        />
      )}
      {progress > 0 && (
        <ActionButton
          to={`${id}/review`}
          text="review"
          state={{ name: "Questionnaires" }}
          icon={<RemoveRedEyeRoundedIcon sx={{ ml: is_farsi ? 0 : 1, mr: is_farsi ? 1 : 0 }} fontSize="small" />}
        />
      )}
      {progress < 100 && progress > 0 && (
        <ActionButton
          to={`${id}/${nextQuestion || number_of_answers + 1}`}
          text="continue"
          icon={<PlayArrowRoundedIcon sx={{transform: is_farsi ? 'rotate(-180deg)' : "", ml: is_farsi ? 0 : 1, mr: is_farsi ? 1 : 0 }} fontSize="small" />}
          data-cy={`questionnaire-${title}-start-btn`}
        />
      )}
      {progress === 0 && (
        <ActionButton
          to={`${id}/1`}
          text="start"
          icon={<StartRoundedIcon sx={{transform: is_farsi ? 'rotate(-180deg)' : "", ml: is_farsi ? 0 : 1, mr: is_farsi ? 1 : 0 }} fontSize="small" />}
          data-cy={`questionnaire-${title}-start-btn`}
        />
      )}
    </Box>
  );
};

const ActionButton = (props: {
  to: string;
  text: string;
  icon: JSX.Element;
  state?: any;
}) => {
  const { to, text, icon, state = {}, ...rest } = props;
  return (
    <Button
      {...rest}
      size="small"
      component={Link}
      state={state}
      to={to}
      startIcon={icon}
      sx={{ ml: 0.5 }}
    >
      <Trans i18nKey={text} />
    </Button>
  );
};

export { QuestionnaireCard };

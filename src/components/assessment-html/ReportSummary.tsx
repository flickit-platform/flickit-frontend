import React from "react";
import {
  Box,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import { theme } from "@/config/theme";
import data from "./greport.json";
import { getMaturityLevelColors, styles } from "@/config/styles";
import { ISubject } from "@/types";
import { Trans } from "react-i18next";
import { t } from "i18next";

const sectionStyle = {
  marginTop: "16px",
  padding: "16px",
};

const textStyle = {
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#424242",
};

const sectionTitleStyle = {
  fontWeight: "bold",
  marginBottom: "12px",
};

const StepsTable = ({ steps }: any) => (
  <TableContainer component={Box}>
    <Table sx={{ width: "100%" }}>
      <TableBody>
        {steps.map((item: any, index: any) => (
          <TableRow key={index}>
            <TableCell sx={{ padding: "8px", width: "20%" }}>
              {item.index}
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "30%" }}>
              {item.title}
            </TableCell>
            <TableCell sx={{ padding: "8px" }}>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const TitleBox = () => (
  <Box
    sx={{
      position: "absolute",
      top: "-24px",
      left: "24px",
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: "16px 24px",
      border: "1px solid #ddd",
      borderRadius: 5,
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: "bold",
        margin: 0,
      }}
    >
      <Trans i18nKey="how_was_this_report_built" />
    </Typography>
  </Box>
);

const Section = ({ title, children }: any) => (
  <Box sx={sectionStyle}>
    <Typography color="primary" variant="h6" sx={sectionTitleStyle}>
      {title}
    </Typography>
    <Typography sx={textStyle}>{children}</Typography>
  </Box>
);

const TopicsList = () => (
  <Box>
    {data.subjects.map((subject: any, index: any) => (
      <Box key={index} sx={{ marginBottom: "16px" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#2466A8",
            marginBottom: "8px",
          }}
        >
          {subject.title}
        </Typography>
        {subject.attributes.map((attribute: any, idx: any) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Typography
              variant="titleSmall"
              sx={{
                fontWeight: "bold",
                width: "20%",
                marginRight: "8px",
              }}
            >
              {attribute.title}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
            <Typography sx={textStyle}>{attribute.description}</Typography>
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);

const QuestionnaireList = () => (
  <Box>
    {data.questionnaires.map((item: any, index: any) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <Typography
          variant="titleSmall"
          sx={{
            fontWeight: "bold",
            width: "15%",
          }}
        >
          {item.title}
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
        <Typography sx={{ ...textStyle, width: "70px" }}>
          {item.questionCount} {t("question")}
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
        <Typography sx={textStyle}>{item.description}</Typography>
      </Box>
    ))}
  </Box>
);

const ReportCard = () => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#EAF3FC",
        borderRadius: "16px",
        padding: "24px",
        width: "100%",
        marginTop: 8,
        border: "3px solid #2466A8",
      }}
    >
      <TitleBox />

      <Section title={t("disclaimer")}>{data.assessment.intro}</Section>

      <Section title={t("evaluationSteps")}>
        <Trans i18nKey="stepsDescription" />
        <StepsTable steps={data.steps} />
      </Section>

      <Section title={t("assessmentKit", { title: "" })}>
        <Trans
          i18nKey="assessmentKitDescription"
          values={{
            title: data.assessment.assessmentKit.title,
            attributesCount: data.assessment.assessmentKit.attributesCount,
            subjectsLength: data.subjects.length,
            subjects: data.subjects
              ?.map((elem: ISubject, index: number) =>
                index === data.subjects?.length - 1 &&
                data.subjects?.length !== 1
                  ? t("and") + elem?.title
                  : index === 0
                    ? elem?.title
                    : ", " + elem?.title,
              )
              ?.join(""),
            maturityLevelCount:
              data.assessment.assessmentKit.maturityLevelCount,
            questionnairesCount:
              data.assessment.assessmentKit.questionnairesCount,
          }}
        />
      </Section>

      <Section title={t("maturityLevels")}>
        <Trans
          i18nKey="maturityLevelsDescription"
          values={{
            maturityLevelCount:
              data.assessment.assessmentKit.maturityLevelCount,
          }}
        />
        {data.assessment.assessmentKit.maturityLevels.map((level, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: getMaturityLevelColors(
                  data.assessment.assessmentKit.maturityLevelCount,
                )[level.value - 1],
                height: "10px",
                width: "27px",
                borderRadius: "16px",
                color: "#fff",
                fontWeight: "bold",
              }}
            ></Box>

            <Typography
              component="span"
              sx={{
                ...theme.typography.body2,
                color: getMaturityLevelColors(
                  data.assessment.assessmentKit.maturityLevelCount,
                )[level.value - 1],
                minWidth: "70px",
              }}
            >
              {level.title}
            </Typography>

            <Typography
              component="span"
              sx={{
                ...theme.typography.body2,
              }}
            >
              {level.description}
            </Typography>
          </Box>
        ))}
      </Section>

      <Section title={t("topicsAndIndicators")}>
        <Trans i18nKey="topicsTable" />
        <TopicsList />
      </Section>

      <Section title={t("questionnaires")}>
        <QuestionnaireList />
      </Section>
    </Box>
  );
};

export default ReportCard;

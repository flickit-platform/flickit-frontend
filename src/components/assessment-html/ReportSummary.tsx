import {
  Box,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { farsiFontFamily, primaryFontFamily, theme } from "@/config/theme";
import { getMaturityLevelColors, styles } from "@/config/styles";
import { ISubject } from "@/types";
import { t } from "i18next";
import languageDetector from "@/utils/languageDetector";

const sectionStyle = {
  marginTop: "16px",
  padding: "16px",
  textAlign: "justify",
};

const textStyle = {
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#424242",
  ...styles.customizeFarsiFont,
};

const sectionTitleStyle = {
  fontWeight: "bold",
  marginBottom: "12px",
  ...styles.customizeFarsiFont,
};

const StepsTable = ({ steps, columnsWidth }: any) => (
  <TableContainer component={Box}>
    <Table sx={{ width: "100%" }}>
      <TableBody>
        {steps?.map((item: any, index: any) => (
          <TableRow key={index}>
            <TableCell
              sx={{
                padding: "8px",
                width: columnsWidth[0],
                ...styles.customizeFarsiFont,
              }}
            >
              {item.index}
            </TableCell>
            <TableCell
              sx={{
                padding: "8px",
                width: columnsWidth[1],
                ...styles.customizeFarsiFont,
              }}
            >
              <Typography sx={textStyle} variant="extraLight" fontWeight={300}>
                {item.title}
              </Typography>
            </TableCell>
            <TableCell
              sx={{
                padding: "8px",
                width: columnsWidth[2],

                ...styles.customizeFarsiFont,
              }}
            >
              <Typography sx={textStyle} variant="extraLight" fontWeight={300}>
                {item.summary}
              </Typography>
            </TableCell>
            <TableCell
              sx={{
                padding: "8px",
                ...styles.customizeFarsiFont,
                textAlign: "justify",
                width: columnsWidth[3],
              }}
            >
              <Typography sx={textStyle} variant="extraLight" fontWeight={300}>
                {item.description}
              </Typography>
            </TableCell>
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
        ...styles.customizeFarsiFont,
      }}
    >
      {t("how_was_this_report_built", {
        lng: "fa",
      })}
    </Typography>
  </Box>
);

const Section = ({ title, children }: any) => (
  <Box sx={sectionStyle}>
    <Typography color="primary" variant="h6" sx={sectionTitleStyle}>
      {title}
    </Typography>
    <Typography
      sx={{ ...textStyle, textAlign: "justify" }}
      variant="extraLight"
      fontWeight={300}
    >
      {children}
    </Typography>
  </Box>
);

const TopicsList = ({ data }: any) => (
  <Box>
    {data?.subjects.map((subject: any, index: any) => (
      <Box key={index} sx={{ marginBottom: "16px" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#2466A8",
            marginBottom: "8px",
            ...styles.customizeFarsiFont,
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
              mt: 2,
            }}
          >
            <Typography
              variant="extraLight"
              sx={{
                fontWeight: "bold",
                width: "20%",
                marginRight: "8px",
                ...styles.customizeFarsiFont,
              }}
            >
              {attribute.title}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
            <Typography sx={{ ...textStyle, width: "80%" }}>
              {attribute.description}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);

const QuestionnaireList = ({ data }: any) => (
  <Box>
    {data?.assessment?.assessmentKit.questionnaires?.map(
      (item: any, index: any) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            mt: 3,
          }}
        >
          <Typography
            variant="extraLight"
            sx={{
              fontWeight: "bold",
              ...styles.customizeFarsiFont,
              width: "200px",
            }}
          >
            {item.title}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
          <Typography
            sx={{
              ...textStyle,
              width: "80px",
              direction: true ? "rtl" : "ltr",
              fontFamily: true ? farsiFontFamily : primaryFontFamily,
            }}
          >
            {item.questionCount} {t("question", { lng: "fa" })}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
          <Typography sx={{ ...textStyle, width: "80%" }}>
            {item.description}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: "8px" }} />
        </Box>
      ),
    )}
  </Box>
);

const ReportCard = ({ data }: any) => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#EAF3FC",
        borderRadius: "16px",
        width: "100%",
        marginTop: 8,
        border: "3px solid #2466A8",
        paddingX: { md: 2, xs: 1 },
        paddingY: 6,
      }}
    >
      <TitleBox />

      <Section title={t("disclaimer", { lng: "fa" })}>
        <Typography
          variant="extraLight"
          sx={{
            fontFamily: true ? farsiFontFamily : primaryFontFamily,
            textAlign: "justify",
          }}
        >
          {t("disclaimerDescription", { lng: "fa" })}
        </Typography>
        {/* <Typography
          component="div"
          sx={{
            fontFamily: languageDetector(data?.assessmentProcess.steps)
              ? farsiFontFamily
              : primaryFontFamily,
            ...textStyle,
            textAlign: "justify",
            wordBreak: "break-all",
          }}
          dangerouslySetInnerHTML={{ __html: data?.assessment.intro }}
          className={"tiptap"}
        ></Typography> */}
      </Section>

      <Section title={t("evaluationSteps", { lng: "fa" })}>
        {data?.assessmentProcess.steps ? (
          <>
            {t("stepsDescription", {
              lng: "fa",
            })}
            <Typography
              variant="extraLight"
              fontWeight={300}
              sx={{
                fontFamily: languageDetector(data?.assessmentProcess.steps)
                  ? farsiFontFamily
                  : primaryFontFamily,
                ...textStyle,
                textAlign: "justify",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  data?.assessmentProcess.steps ??
                  t("unavailable", { lng: "fa" }),
              }}
              className={"tiptap"}
            />
          </>
        ) : (
          <>{t("unavailable", { lng: "fa" })}</>
        )}

        {/* <StepsTable steps={data?.steps} columnsWidth={["5%", "20%", "20%"]} /> */}
      </Section>
      <Section title={t("participant", { lng: "fa" })}>
        {data?.assessmentProcess.participant ? (
          <>
            {t("participantDescription", {
              lng: "fa",
            })}
            <Typography
              variant="extraLight"
              fontWeight={300}
              sx={{
                fontFamily: languageDetector(
                  data?.assessmentProcess.participant,
                )
                  ? farsiFontFamily
                  : primaryFontFamily,
                ...textStyle,
                textAlign: "justify",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  data?.assessmentProcess.participant ??
                  t("unavailable", { lng: "fa" }),
              }}
              className={"tiptap"}
            />
          </>
        ) : (
          <>{t("unavailable", { lng: "fa" })}</>
        )}

        {/* <StepsTable
          steps={data?.participant}
          columnsWidth={["5%", "20%", "20%", "5%"]}
        /> */}
      </Section>

      <Section title={t("assessmentKit", { lng: "fa" })}>
        {t("assessmentKitDescription", {
          lng: "fa",
          title: data?.assessment.assessmentKit.title,
          attributesCount: data?.assessment.assessmentKit.attributesCount,
          subjectsLength: data?.subjects.length,
          subjects: data?.subjects
            ?.map((elem: ISubject, index: number) =>
              index === data?.subjects?.length - 1 &&
              data?.subjects?.length !== 1
                ? t("and", { lng: "fa" }) + elem?.title
                : index === 0
                  ? elem?.title
                  : ", " + elem?.title,
            )
            ?.join(""),
          maturityLevelCount: data?.assessment.assessmentKit.maturityLevelCount,
          questionnairesCount:
            data?.assessment.assessmentKit.questionnairesCount,
        })}
      </Section>

      <Section title={t("maturityLevels", { lng: "fa" })}>
        {t("maturityLevelsDescription", {
          lng: "fa",
          maturityLevelCount: data?.assessment.assessmentKit.maturityLevelCount,
        })}
        {data?.assessment.assessmentKit.maturityLevels.map(
          (level: any, index: number) => (
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
                    data?.assessment.assessmentKit.maturityLevelCount,
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
                    data?.assessment.assessmentKit.maturityLevelCount,
                  )[level.value - 1],
                  minWidth: "70px",
                  direction: true ? "rtl" : "ltr",
                  fontFamily: true ? farsiFontFamily : primaryFontFamily,
                }}
              >
                {level.title}
              </Typography>

              <Typography
                textAlign="justify"
                component="span"
                sx={{
                  ...theme.typography.extraLight,
                  fontWeight: 300,
                  direction: true ? "rtl" : "ltr",
                  fontFamily: true ? farsiFontFamily : primaryFontFamily,
                }}
              >
                {level.description}
              </Typography>
            </Box>
          ),
        )}
      </Section>

      <Section title={t("topicsAndIndicators", { lng: "fa" })}>
        {t("topicsTable", {
          lng: "fa",
        })}
        <TopicsList data={data} />
      </Section>

      <Section title={t("questionnaires", { lng: "fa" })}>
        <QuestionnaireList data={data} />
      </Section>
    </Box>
  );
};

export default ReportCard;

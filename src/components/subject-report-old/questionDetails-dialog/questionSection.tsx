import React from "react";
import { Chip, Divider, Typography } from "@mui/material";
import { generateColorFromString, styles } from "@styles";
import { CircleRating } from "@components/subject-report-old/MaturityLevelTable";
import Box from "@mui/material/Box";
import { theme } from "@config/theme";
import languageDetector from "@utils/languageDetector";
import { Trans } from "react-i18next";

const QuestionSection = (props: any) => {
  const { data } = props;

  return (
    <>
      <Box sx={{ ...styles.centerCV, gap: "32px" }}>
        <Chip
          label={data?.questionnaire}
          sx={{
            backgroundColor: generateColorFromString(data?.questionnaire)
              .backgroundColor,
            color: generateColorFromString(data?.questionnaire).color,
            marginRight: "auto",
          }}
        />
        <Typography
          sx={{
            ...theme.typography.semiBoldXLarge,
            textAlign: languageDetector(data?.question?.title)
              ? "right"
              : "left",
            color: "#2B333B",
          }}
        >
          {data?.question?.title}
        </Typography>
        {!data?.question?.hint && (
          <Box
            sx={{
              ...styles.centerVH,
              marginInlineEnd: "auto",
              color: "#6C8093",
            }}
          >
            <Typography
              sx={{
                ...theme.typography.bodyMedium,
                textTransform: "capitalize",
              }}
            >
              <Trans i18nKey={"hint"} />:
            </Typography>
            <Typography sx={{ ...theme.typography.bodyMedium }}>
              {data?.question?.hint}
            </Typography>
          </Box>
        )}
        <Typography>{data?.answer?.title}</Typography>
      </Box>
      <Divider sx={{ width: "100%", background: "#C7CCD1", my: "24px" }} />
      <Box sx={{ ...styles.centerCH, alignItems: "flex-start", gap: "23px" }}>
        <Typography
          sx={{ ...theme.typography.semiBoldMedium, color: "#6C8093" }}
        >
          <Trans i18nKey={"selectedOption"} />:
        </Typography>
        <Box sx={{ p: 2, border: "1px solid #C7CCD1", borderRadius: 2 }}>
          <Typography sx={{ ...theme.typography.bodyMedium, color: "#2B333B" }}>
            3.this is a long text assumed to be an example of a long text option
            in an imaginary question to show us how should be a long text option
            showed here. How about copying and pasting the text up here multiple
            times and see the result as an extreme instance?
          </Typography>
        </Box>
        <Box sx={{ ...styles.centerVH, alignSelf: "flex-end", gap: "13px" }}>
          <Typography>
            <Trans i18nKey={"yourConfidence"} />
          </Typography>
          <CircleRating value={data?.answer?.confidenceLevel} />
        </Box>
      </Box>
    </>
  );
};

export default QuestionSection;

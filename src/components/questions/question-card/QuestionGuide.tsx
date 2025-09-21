import languageDetector from "@/utils/language-detector";
import InfoRounded from "@mui/icons-material/InfoRounded";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import Title from "@common/Title";

export const QuestionGuide = (props: any) => {
  const [collapse, setCollapse] = useState<boolean>(false);
  const { hint } = props;
  const is_farsi = languageDetector(hint);

  return (
    <Box>
      <Box mt={1} width="100%">
        <Title
          sup={
            <Box color="background.containerLowest" sx={{ ...styles.centerVH }}>
              <InfoRounded
                sx={{
                  marginInlineStart: "unset",
                  marginInlineEnd: 0.5,
                }}
              />
              <Trans i18nKey="common.hint" />
            </Box>
          }
          size="small"
          sx={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => setCollapse(!collapse)}
          mb={1}
        ></Title>
        <Collapse in={collapse}>
          <Box
            flex={1}
            mr={{ xs: 0, md: 4 }}
            position="relative"
            display="flex"
            flexDirection="column"
            width="100%"
            border="1px dashed #ffffff99"
            borderRadius="8px"
            sx={{ direction: `${is_farsi ? "rtl" : "ltr"}` }}
          >
            <Box display="flex" alignItems={"baseline"} p={2} width="100%">
              <Typography variant="body2">
                {hint.startsWith("\n")
                  ? hint
                      .substring(1)
                      .split("\n")
                      .map((line: string) => (
                        <Fragment key={line}>
                          {line}
                          <br />
                        </Fragment>
                      ))
                  : hint.split("\n").map((line: string) => (
                      <Fragment key={line}>
                        {line}
                        <br />
                      </Fragment>
                    ))}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

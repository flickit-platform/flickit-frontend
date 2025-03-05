import languageDetector from "@/utils/languageDetector";
import { InfoRounded } from "@mui/icons-material";
import { Box, Collapse, Typography } from "@mui/material";
import React, { useState } from "react";
import Title from "@common/Title";
import { theme } from "@/config/theme";
import { Trans } from "react-i18next";

export const QuestionGuide = (props: any) => {
  const [collapse, setCollapse] = useState<boolean>(false);
  const { hint } = props;
  const is_farsi = languageDetector(hint);
  return (
    <Box>
      <Box mt={1} width="100%">
        <Title
          sup={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              <InfoRounded
                sx={{
                  marginRight: theme.direction === "ltr" ? 0.5 : "unset",
                  marginLeft: theme.direction === "rtl" ? 0.5 : "unset",
                }}
              />
              <Trans i18nKey="hint" />
            </Box>
          }
          size="small"
          sx={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => setCollapse(!collapse)}
          mb={1}
        ></Title>
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
                p: 2,
                width: "100%",
              }}
            >
              <Typography variant="body2">
                {hint.startsWith("\n")
                  ? hint
                      .substring(1)
                      .split("\n")
                      .map((line: string) => (
                        <React.Fragment key={line}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                  : hint.split("\n").map((line: string) => (
                      <React.Fragment key={line}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

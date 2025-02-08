import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { ISubjectReportModel } from "@types";
import { useServiceContext } from "@providers/ServiceProvider";
import { primaryFontFamily } from "@config/theme";
import languageDetector from "@/utils/languageDetector";
import { Stack, Typography } from "@mui/material";
import CustomTablePagination from "@components/common/CustomTablePagination";

const AdviceQuestionTable = ({
  adviceResult,
  setAdviceResult,
  handleClose,
  target,
  permissions,
}: any) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();

  const totalPages = useMemo(
    () => Math.ceil(adviceResult?.length / rowsPerPage),
    [adviceResult, rowsPerPage],
  );

  const paginatedAdvice = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return adviceResult?.slice(startIndex, endIndex);
  }, [adviceResult, currentPage, rowsPerPage]);

  const attributeColorPallet = ["#D81E5B", "#F9A03F", "#0A2342"];
  const attributeBGColorPallet = ["#FDF1F5", "#FEF5EB", "#EDF4FC"];
  useEffect(() => {
    setCurrentPage(0);
  }, [rowsPerPage]);

  return (
    <>
      <Box
        px={4}
        sx={{
          maxHeight: "56vh",
          overflowY: "auto",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            mb: 4,
            textAlign: "center",
            fontWeight: "700",
            color: "#6C8093",
          }}
        >
          <Grid item xs={0.5} md={0.5}>
            <Typography variant="semiBoldLarge"># </Typography>
          </Grid>
          <Grid item xs={5} md={3.5}>
            <Typography variant="semiBoldLarge">
              <Trans i18nKey="question" />
            </Typography>
          </Grid>
          <Grid item xs={2} md={2}>
            <Typography variant="semiBoldLarge">
              <Trans i18nKey="whatIsNow" />
            </Typography>
          </Grid>
          <Grid item xs={2} md={2}>
            <Typography variant="semiBoldLarge">
              <Trans i18nKey="whatShouldBe" />
            </Typography>
          </Grid>
          <Grid item xs={2} md={2}>
            <Typography variant="semiBoldLarge">
              <Trans i18nKey="affectedAttributes" />
            </Typography>
          </Grid>
          <Grid
            item
            xs={0}
            md={2}
            sx={{
              display: {
                md: "block",
                xs: "none",
              },
            }}
          >
            <Typography variant="semiBoldLarge">
              <Trans i18nKey="questionnaire" />
            </Typography>
          </Grid>
        </Grid>

        {paginatedAdvice?.map((item: any, index: number) => {
          const {
            question,
            answeredOption,
            recommendedOption,
            attributes,
            questionnaire,
          } = item;
          return (
            <Grid
              container
              spacing={2}
              sx={{ alignItems: "center", mb: 2 }}
              key={item?.id}
            >
              <Grid
                item
                xs={0.5}
                md={0.5}
                sx={{
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#004F83",
                }}
              >
                {index + 1 + currentPage * rowsPerPage}
              </Grid>
              <Grid
                item
                xs={5}
                md={3.5}
                sx={{
                  alignItems: "centler",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 3,
                  whiteSpace: "normal",
                }}
              >
                <Tooltip
                  title={question?.title.length > 100 ? question?.title : ""}
                >
                  <Typography variant="semiBoldMedium" textAlign="center">
                    {question?.title}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid
                item
                xs={2}
                md={2}
                sx={{
                  textAlign: "center",
                  fontWeight: "300",
                  color: "#0A2342",
                }}
              >
                {answeredOption &&
                  `${answeredOption.index}. ${answeredOption.title}`}
              </Grid>
              <Grid
                item
                xs={2}
                md={2}
                sx={{
                  textAlign: "center",
                  fontWeight: "300",
                  color: "#0A2342",
                  fontSize: "14px",
                }}
              >
                {recommendedOption &&
                  `${recommendedOption.index}. ${recommendedOption.title}`}
              </Grid>
              <Grid
                item
                xs={2}
                md={2}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {attributes.map((attribute: any, index: number) => (
                  <Box
                    key={attribute.id}
                    sx={{
                      px: "10px",
                      color: attributeColorPallet[Math.ceil(index % 3)],
                      background: attributeBGColorPallet[Math.ceil(index % 3)],
                      fontSize: "11px",
                      border: `1px solid ${attributeColorPallet[Math.ceil(index % 3)]}`,
                      borderRadius: "8px",
                      m: "4px",
                      textAlign: "center",
                      fontFamily: `${languageDetector(attribute.title) ? "Vazirmatn" : primaryFontFamily}`,
                    }}
                  >
                    {attribute.title}
                  </Box>
                ))}
              </Grid>
              <Grid item xs={0} md={2}>
                <Typography
                  variant="labelMedium"
                  component="div"
                  color="primary"
                >
                  {questionnaire.title}
                </Typography>
                <Typography variant="labelMedium" color="primary">
                  Q.{question?.index}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </Box>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          zIndex: 1000,
        }}
      >
        <CustomTablePagination
          data={adviceResult}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </Box>
    </>
  );
};

export default AdviceQuestionTable;

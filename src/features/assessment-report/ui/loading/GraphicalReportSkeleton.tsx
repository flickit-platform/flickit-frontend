import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styles } from "@styles";
import MaturityLevelSkeleton from "@/assets/svg/maturity-level-skeleton.svg";
import { t } from "i18next";
import { useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import uniqueId from "@/utils/unique-id";

const DotsLoading = () => {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        ml: 1,
        verticalAlign: "middle",
        height: "1em",
        lineHeight: 1,
        fontSize: "inherit",
      }}
    >
      <span
        className="dot"
        style={{ animation: "blink 1.4s infinite both", fontSize: "2.5rem" }}
      >
        .
      </span>
      <span
        className="dot"
        style={{
          animation: "blink 1.4s infinite both 0.2s",
          fontSize: "2.5rem",
        }}
      >
        .
      </span>
      <span
        className="dot"
        style={{
          animation: "blink 1.4s infinite both 0.4s",
          fontSize: "2.5rem",
        }}
      >
        .
      </span>
      <style>
        {`
      @keyframes blink {
        0% { opacity: .3; }
        20% { opacity: 1; }
        100% { opacity: .3; }
      }
      .dot {
        font-weight: bold;
        font-size: 2.5rem; 
        line-height: 1;
        color: ${theme.palette.primary.main};
        vertical-align: middle;
        position: relative;
        top:${theme.direction === "rtl" ? "-0.15em" : "-0.25em"} ;
      }
      `}
      </style>
    </Box>
  );
};

const GraphicalReportSkeleton = ({ isAuthenticatedUser, lang }: any) => (
  <Box
    dir={lang === "FA" ? "rtl" : "ltr"}
    bgcolor="background.container"
    minHeight="100vh"
  >
    <Box bgcolor="primary.bgVariant" height={48} sx={{ ...styles.centerVH }}>
      <Typography
        variant="semiBoldLarge"
        color="primary"
        sx={{ ...styles.centerV }}
      >
        {t("notification.generatingFinalReport")}
      </Typography>
      <DotsLoading />
    </Box>

    <Box
      m="auto"
      pb={3}
      p={{ xs: 1, sm: 1, md: 4 }}
      px={{ xxl: 30, xl: 20, lg: 12, md: 8, xs: 1, sm: 3 }}
    >
      <Box>
        <Skeleton variant="text" width={170} height={28} sx={{ mb: 2 }} />
        <Box justifyContent="space-between" my={2} sx={{ ...styles.centerV }}>
          <Skeleton variant="rectangular" width={100} height={36} />{" "}
          <Skeleton variant="rectangular" width={140} height={36} />{" "}
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item lg={9.5} md={9.5} sm={12} xs={12}>
          <Paper
            elevation={3}
            sx={{
              position: "relative",
              bgcolor: "background.containerLowest",
              borderStartEndRadius: 2,
              borderStartStartRadius: 2,
              boxShadow: "none",
              width: "100%",
              minHeight: 220,
              mb: 4,
              p: { md: 6, xs: 1 },
              ...styles.centerH,
            }}
          >
            <Box width="100%" px={2}>
              <Grid container spacing={4} mb="20px">
                <Grid item xs={12}>
                  <Skeleton
                    variant="rounded"
                    height={36}
                    width={220}
                    sx={{ mb: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} mt={{ xs: 2, md: 5 }}>
                  <img
                    src={MaturityLevelSkeleton}
                    alt="MatirytySkeleton"
                    width={200}
                    height={140}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <Skeleton variant="text" width="70%" height={38} />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={24}
                    sx={{ mt: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={70}
                    sx={{ mt: 2, borderRadius: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width="35%"
                    height={22}
                    sx={{ mt: 3 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
          {isAuthenticatedUser && (
            <Box mb={2} sx={{ ...styles.centerH }}>
              <Box
                width="100%"
                height={48}
                borderRadius="4px"
                position="relative"
                overflow="hidden"
                boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                sx={{
                  background: (theme) =>
                    `linear-gradient(to right, #2466A8, #2D80D2, #2466A8 )`,
                  backgroundSize: "600% 600%",
                  animation: "gradientShift 4s ease infinite",
                }}
              />
              <style>
                {`
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}
              </style>
            </Box>
          )}
          <Skeleton variant="rounded" height={270} sx={{ borderRadius: 2 }} />
          {isAuthenticatedUser && (
            <Box mt={2} sx={{ ...styles.centerH }}>
              <Box
                width="100%"
                height={48}
                borderRadius="4px"
                position="relative"
                overflow="hidden"
                boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                sx={{
                  background: (theme) =>
                    `linear-gradient(to right, #2466A8, #2D80D2, #2466A8 )`,
                  backgroundSize: "600% 600%",
                  animation: "gradientShift 4s ease infinite",
                }}
              />
              <style>
                {`
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}
              </style>
            </Box>
          )}
        </Grid>
        <Grid container xs={12}>
          <Paper
            elevation={3}
            sx={{
              bgcolor: "background.containerLowest",
              borderEndStartRadius: 2,
              borderEndEndRadius: 2,
              boxShadow: "none",
              width: "100%",
              minHeight: 280,
              p: { md: 6, xs: 1 },
              ...styles.centerCV,
            }}
          >
            <Skeleton
              variant="text"
              width="40%"
              height={28}
              sx={{ mt: 2, mb: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={110}
              sx={{ borderRadius: 2, mb: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={36}
              sx={{ borderRadius: 2, mb: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={80}
              sx={{ borderRadius: 2 }}
            />
          </Paper>
        </Grid>
        <Grid container xs={12} mt={4}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <Accordion expanded={true} key={uniqueId()}>
                <AccordionSummary
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Skeleton variant="text" width="60%" height={28} />
                </AccordionSummary>

                <AccordionDetails>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={50}
                    sx={{ borderRadius: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={30}
                    sx={{ borderRadius: 2, mb: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={40}
                    sx={{ borderRadius: 2 }}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Box>
);

export default GraphicalReportSkeleton;

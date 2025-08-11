import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styles } from "@styles";
import MatirytySkeleton from "@assets/svg/matirytySkeleton.svg";
import { t } from "i18next";
import { useTheme } from "@mui/material";

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
    sx={{ backgroundColor: (theme) => theme.palette.background.container, minHeight: "100vh" }}
  >
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.primary.bgVariant,
        height: 48,
        ...styles.centerVH,
      }}
    >
      <Typography
        variant="semiBoldLarge"
        color="primary"
        sx={{
          ...styles.centerV,
        }}
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          my={2}
        >
          <Skeleton variant="rectangular" width={100} height={36} />{" "}
          <Skeleton variant="rectangular" width={140} height={36} />{" "}
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
          <Skeleton variant="rounded" height={420} sx={{ borderRadius: 2 }} />
          {isAuthenticatedUser && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  height: 48,
                  borderRadius: "4px",
                  position: "relative",
                  overflow: "hidden",
                  background: (theme) =>
                    `linear-gradient(to right, ${theme.palette.primary.main}, #2D80D2, ${theme.palette.primary.main} )`,
                  backgroundSize: "600% 600%",
                  animation: "gradientShift 4s ease infinite",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
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
        <Grid item lg={9.5} md={9.5} sm={12} xs={12}>
          <Paper
            elevation={3}
            sx={{
              position: "relative",
              backgroundColor: (theme) => theme.palette.background.containerLowest,
              borderStartEndRadius: 2,
              borderStartStartRadius: 2,
              boxShadow: "none",
              width: "100%",
              minHeight: 420,
              mb: 4,
              p: { md: 6, xs: 1 },
              ...styles.centerH,
            }}
          >
            {/* کناره‌ها */}
            <Box
              sx={{
                position: "absolute",
                right: { md: "40px", xs: "12px" },
                top: { md: "60px", xs: "6px" },
                bottom: { md: "40px", xs: "4px" },
                width: { md: "8px", xs: "2px" },
                backgroundColor: (theme) => theme.palette.primary.bgVariant,
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: { md: "40px", xs: "12px" },
                top: { md: "60px", xs: "6px" },
                bottom: { md: "40px", xs: "4px" },
                width: { md: "8px", xs: "2px" },
                backgroundColor: (theme) => theme.palette.primary.bgVariant,
                borderRadius: 1,
              }}
            />
            <Box width="100%" px={2}>
              <Grid container spacing={4} sx={{ mb: "40px" }}>
                <Grid item xs={12}>
                  <Skeleton
                    variant="rounded"
                    height={36}
                    width={220}
                    sx={{ mb: 2 }}
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
                    height={110}
                    sx={{ mt: 2, borderRadius: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width="35%"
                    height={22}
                    sx={{ mt: 3 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={80}
                    sx={{ mt: 2, borderRadius: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{ mt: { xs: 2, md: 10 } }}>
                  <img
                    src={MatirytySkeleton}
                    alt="MatirytySkeleton"
                    width={200}
                    height={140}
                  />
                </Grid>
              </Grid>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={180}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton
                variant="text"
                width="30%"
                height={28}
                sx={{ mt: 3, mb: 2 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={140}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={70}
                sx={{ borderRadius: 2, mb: 2 }}
              />
            </Box>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              backgroundColor: (theme) => theme.palette.background.containerLowest,
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
      </Grid>
    </Box>
  </Box>
);

export default GraphicalReportSkeleton;

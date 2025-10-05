import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { alpha, useTheme } from "@mui/material/styles";
import uniqueId from "@/utils/unique-id";
import { styles } from "@styles";

type AdviceSliderSkeletonItemProps = {
  levels?: number;
  defaultValue?: number;
};

const AdviceSliderSkeletonItem = ({
  levels = 5,
  defaultValue = 2,
}: AdviceSliderSkeletonItemProps) => {
  const theme = useTheme();
  const total = Math.max(1, levels);
  const def = Math.min(Math.max(defaultValue, 1), total);
  const defaultPct = total > 1 ? ((def - 1) / (total - 1)) * 100 : 0;

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", direction: "ltr" }}
      padding={{ xs: 0.5, md: 2 }}
    >
      <Grid size={{xs: 4, sm: 4}}>
        <Box sx={{ ...styles.centerV }} gap={2}>
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" height={20} width="70%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" height={16} width="50%" />
          </Box>
        </Box>
      </Grid>

      <Grid size={{xs: 6, sm: 6}}>
        <Box dir="ltr" position="relative" sx={{ mt: 1 }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              top: "50%",
              height: 2,
              transform: "translateY(-50%)",
              borderRadius: "2px",
              backgroundRepeat: "no-repeat, no-repeat",
              backgroundImage: `
                linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.25)}, ${alpha(
                  theme.palette.primary.main,
                  0.25,
                )}),
                linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.main})
              `,
              backgroundSize: `
                100% 100%,
                ${defaultPct}% 100%
              `,
              backgroundPosition: `
                0% 0%,
                0% 0%
              `,
              zIndex: 1,
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              height: 24,
              display: "flex",
              alignItems: "center",
            }}
          >
            {Array.from({ length: total }).map((_, i) => {
              const pct = total > 1 ? (i / (total - 1)) * 100 : 0;
              return (
                <Box
                  key={uniqueId()}
                  sx={{
                    position: "absolute",
                    left: `${pct}%`,
                    transform: "translateX(-1px)",
                    width: 2,
                    height: 12,
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.4),
                  }}
                />
              );
            })}
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: `calc(${defaultPct}% )`,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.primary.main, 0.5),
              "&::before": {
                content: '""',
                position: "absolute",
                inset: -2,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          />

          <Skeleton
            variant="circular"
            width={12}
            height={12}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              zIndex: 3,
            }}
          />
        </Box>
      </Grid>

      <Grid size={{xs:2, sm: 2}}>
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          <Skeleton variant="text" height={16} width={48} />
        </Box>
      </Grid>
    </Grid>
  );
};

type LoadingAdviceTargetsSkeletonProps = {
  count?: number;
  levels?: number;
  defaultValue?: number;
};

export const LoadingAdviceTargetsSkeleton = ({
  count = 6,
  levels = 5,
  defaultValue = 2,
}: LoadingAdviceTargetsSkeletonProps) => {
  return (
    <Grid
      container
      rowSpacing={2}
      sx={{
        mt: 2,
        px: 2,
        borderRadius: { xs: 0, sm: "8px" },
        maxHeight: { xs: "60vh", md: "40vh" },
        overflow: "auto",
        overflowX: "hidden",
        bgcolor: "background.containerHighest",
        display: "flex",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={uniqueId()} size={{xs: 12, sm: 6}}>
          <Box
            sx={{
              borderRadius: "8px",
              p: 2,
            }}
          >
            <AdviceSliderSkeletonItem
              levels={levels}
              defaultValue={defaultValue}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const getNumberBaseOnScreen = (
  xs: number,
  sm: number,
  md: number,
  lg: number,
  xl: number,
): number => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  if (isXs) return xs;
  if (isSm) return sm;
  if (isMd) return md;
  if (isLg) return lg;
  if (isXl) return xl;
  return md;
};

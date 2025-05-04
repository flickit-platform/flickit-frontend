import useMediaQuery from "@mui/material/useMediaQuery";

export const MobileScreen = (breakPoint: string = "sm") => {
  return  useMediaQuery((theme: any) =>
    theme.breakpoints.down(breakPoint),
  );
};
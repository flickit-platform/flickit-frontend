import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { theme } from "@config/theme";
import ContactSupport from "@assets/svg/ContactSupport.svg";

const FloatButton = (props: any) => {
  const { dialogProps } = props;
  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: "2.5%", lg: "1.6%", xl: "2%" },
        bottom: { xs: 0, md: "55px" },
      }}
    >
      <IconButton
        edge="start"
        sx={{
          background: theme.palette.primary.main,
          "&:hover": {
            background: theme.palette.primary.dark,
          },
          borderRadius: "50%",
          width: "56px",
          height: "56px",
        }}
        onClick={() => dialogProps.openDialog({})}
      >
        <img src={ContactSupport} alt={"ContactSupport"} />
      </IconButton>
    </Box>
  );
};

export default FloatButton;

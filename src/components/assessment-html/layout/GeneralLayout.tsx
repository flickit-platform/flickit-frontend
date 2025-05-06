import { theme } from "@/config/theme";
import Box from "@mui/material/Box";

const GeneralLayout = ({ children }: any) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        borderRadius: "48px",
        background: theme.palette.surface.containerLowest,
        mt: 8,
      }}
    >
      {children}
    </Box>
  );
};

export default GeneralLayout;

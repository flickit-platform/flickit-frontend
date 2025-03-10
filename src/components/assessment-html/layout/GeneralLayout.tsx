import Box from "@mui/material/Box";

const GeneralLayout = ({ children }: any) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        borderRadius: "48px",
        background: "#fff",
        mt: 8,
      }}
    >
      {children}
    </Box>
  );
};

export default GeneralLayout;

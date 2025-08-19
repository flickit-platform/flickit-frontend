import Box from "@mui/material/Box";

const GeneralLayout = ({ children }: any) => {
  return (
    <Box
      width="100%"
      height="auto"
      borderRadius="48px"
      mt={8}
      bgcolor="background.containerLowest"
    >
      {children}
    </Box>
  );
};

export default GeneralLayout;

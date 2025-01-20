import Box from "@mui/material/Box";

const MainCard = ({ style, children }: { style: any; children: any }) => {
  return (
    <Box
      sx={{
        boxShadow: "0 0 8px 0 #0A234240",
        borderRadius: "12px",
        height: "auto",
        width: "100%",
        background: "#fff",
        p: { xs: "15px", sm: "32px" },
        gap: 2,
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export default MainCard;

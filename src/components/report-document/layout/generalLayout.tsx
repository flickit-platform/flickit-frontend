import Box from "@mui/material/Box";

const GeneralLayout = ({children}: any) => {
    return (
        <Box sx={{width:"100%",maxWidth: "1000px", height:"auto",borderRadius:"48px",background:"#fff",p:{xs:"20px",sm:"60px"}}}>
            {children}
        </Box>
    );
};

export default GeneralLayout;
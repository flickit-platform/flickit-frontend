import Box from "@mui/material/Box";
import { styles } from "@styles";

const MainCard = ({ style, children }: { style: any; children: any }) => {
  return (
    <Box
      sx={{
        ...styles.boxStyle,
        gap: 2,
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export default MainCard;

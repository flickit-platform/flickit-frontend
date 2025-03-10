import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Trans } from "react-i18next";
import { theme } from "@/config/theme";
import FaWandMagicSparkles from "@/assets/svg/FaWandMagicSparkles.svg";

const AIGenerated = ({ type, title, icon }: any) => {
  return (
    <Chip
      label={
        <Box
          sx={{
            display: "flex",
            gap: 1,
            paddingBlock: 1,
          }}
        >
          {icon ?? <FaWandMagicSparkles />}
          <Trans i18nKey={title ?? "AIGenerated"} />
        </Box>
      }
      size="small"
      sx={{
        borderRadius: "8px",
        background:
          type === "error"
            ? theme.palette.error.light
            : theme.palette.warning.light,
        color:
          type === "error"
            ? theme.palette.error.main
            : theme.palette.warning.main,
        "& .MuiChip-label": {
          ...theme.typography.labelMedium,
          fontWeight: "bold",
        },
      }}
    />
  );
};

export default AIGenerated;

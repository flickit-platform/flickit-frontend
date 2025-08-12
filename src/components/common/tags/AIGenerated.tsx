import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Trans } from "react-i18next";
import FaWandMagicSparkles from "../icons/FaWandMagicSparkles";
import { useTheme } from "@mui/material";

const AIGenerated = ({ type, title, icon }: any) => {
  const theme = useTheme();

  return (
    <Chip
      label={
        <Box display="flex" gap={1} paddingBlock={1}>
          {icon ?? (
            <FaWandMagicSparkles
              styles={{
                color: type === "error" ? theme.palette.error.main : theme.palette.warning.main,
              }}
            />
          )}
          <Trans i18nKey={title ?? "common.AIGenerated"} />
        </Box>
      }
      size="small"
      sx={{
        borderRadius: "8px",
        bgcolor:
          type === "error"
            ? "error.states.selected"
            : "warning.states.selected",
        color: type === "error" ? "error.main" : "warning.main",
        "& .MuiChip-label": {
          ...theme.typography.labelMedium,
          fontWeight: "bold",
        },
      }}
    />
  );
};

export default AIGenerated;

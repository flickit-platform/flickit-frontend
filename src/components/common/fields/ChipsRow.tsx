import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { styles } from "@styles";
import { JSXElementConstructor, ReactElement, ReactNode } from "react";

export type ChipItem = {
  key: string | number;
  label: ReactNode;
  color?: string;
};

export default function ChipsRow({
  items,
  lng,
}: {
  items: ChipItem[];
  lng: string;
}) {
  const rtl = lng === "fa";

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={1}
      sx={{ direction: rtl ? "rtl" : "ltr" }}
    >
      {items.map((it) => (
        <Chip
          key={it.key}
          size="small"
          label={it.label}
          sx={{
            ...styles.chip,
            bgcolor: it.color ?? "transparent",
            "& .MuiChip-label": {
              fontFamily: rtl ? farsiFontFamily : primaryFontFamily,
              display: "inline-flex",
              alignItems: "center",
            },
            "& .MuiChip-icon": {
              marginLeft: lng === "fa" ? "-10px" : "0",
              marginRight: lng === "fa" ? "0" : "-10px",
            },
          }}
        />
      ))}
    </Stack>
  );
}

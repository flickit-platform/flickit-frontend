import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import { styles } from "@styles";
import { ReactNode, MouseEvent } from "react";

export type ChipItem = {
  key: string | number;
  label: ReactNode;
  color?: string;
  anchorId?: string;
};

type ChipsRowProps = Readonly<{
  items: readonly ChipItem[];
  lng: string;
  hoverable?: boolean;
  onNavigate?: (anchorId: string, item: ChipItem, e: MouseEvent) => void;
}>;

export default function ChipsRow({
  items,
  lng,
  hoverable = false,
  onNavigate,
}: ChipsRowProps) {
  const rtl = lng === "fa";

  const handleAnchor = (e: MouseEvent, item: ChipItem, anchorId?: string) => {
    if (!anchorId) return;
    if (onNavigate) {
      e.preventDefault();
      onNavigate(anchorId, item, e);
      return;
    }
    const el = document.getElementById(anchorId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={1}
      sx={{ direction: rtl ? "rtl" : "ltr" }}
    >
      {items.map((it) => {
        const isClickable = hoverable && !!it.anchorId;

        return (
          <Chip
            key={it.key}
            size="small"
            clickable={isClickable}
            component={it.anchorId ? "a" : "div"}
            href={it.anchorId ? `#${it.anchorId}` : undefined}
            onClick={
              isClickable
                ? (e: any) => {
                    if (it.anchorId) handleAnchor(e as any, it, it.anchorId);
                  }
                : undefined
            }
            label={it.label}
            sx={{
              ...styles.chip,
              bgcolor: it.color ?? "transparent",
              cursor: isClickable ? "pointer" : "default",
              transition:
                "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
              ...(isClickable && {
                "&:hover": {
                  boxShadow: 1,
                  transform: "translateY(-1px)",
                  bgcolor: it.color ?? "background.paper",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }),
              "& .MuiChip-label": {
                fontFamily: rtl ? farsiFontFamily : primaryFontFamily,
                display: "inline-flex",
                alignItems: "center",
                fontSize: "10px",
                fontWeight: "normal",
              },
              "& .MuiChip-icon": {
                marginLeft: rtl ? "-10px" : 0,
                marginRight: rtl ? 0 : "-10px",
              },
            }}
          />
        );
      })}
    </Stack>
  );
}

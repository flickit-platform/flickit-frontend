import { memo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Text } from "@/components/common/Text";
import { styles } from "@styles";

interface SidebarHeaderProps {
  title: string;
  open: boolean;
  onToggleOpen: () => void;
  showChips: boolean;
  onToggleChips: () => void;
  progress: number;
  onOpenFilter: (e: React.MouseEvent<HTMLElement>) => void;
  hasActiveFilters: boolean;
  displayFilter: boolean;
}

export const SidebarHeader = memo(
  ({
    title,
    open,
    onToggleOpen,
    showChips,
    onToggleChips,
    progress,
    onOpenFilter,
    hasActiveFilters,
    displayFilter,
  }: SidebarHeaderProps) => {
    const { t } = useTranslation();
    const rtl = i18next.language === "fa";

    return (
      <Box
        sx={{
          ...styles.centerVH,
          gap: 1.5,
          px: 2,
          py: 1.5,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            [rtl ? "right" : "left"]: 0,
            width: progress + "%",
            height: "4px",
            backgroundColor: "primary.main",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            [rtl ? "right" : "left"]: progress + "%",
            width: 100 - progress + "%",
            height: "4px",
            backgroundColor: "divider",
          },
        }}
      >
        <IconButton onClick={onToggleOpen} size="small" color="primary">
          <MenuRoundedIcon />
        </IconButton>

        {open && (
          <Box
            justifyContent="space-between"
            width="100%"
            sx={{ ...styles.centerV }}
          >
            <Text variant="semiBoldMedium">{title}</Text>
            {displayFilter && (
              <Box display="flex" gap={0.75}>
                <Tooltip
                  title={
                    showChips
                      ? t("questions_temp.hideIssues")
                      : t("questions_temp.displayIssues")
                  }
                >
                  <IconButton
                    size="small"
                    color={showChips ? "primary" : "info"}
                    onClick={onToggleChips}
                    aria-label={showChips ? t("common.hide") : t("common.show")}
                  >
                    {showChips ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <IconButton
                  size="small"
                  color={hasActiveFilters ? "primary" : "info"}
                  onClick={onOpenFilter}
                  aria-label={t("questions_temp.filter")}
                >
                  <FilterAltOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  },
);

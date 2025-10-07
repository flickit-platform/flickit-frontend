import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import { useRef, useState, useEffect, useMemo } from "react";
import { ILanguage } from "@/types";
import { Text } from "@/components/common/Text";
import { t } from "i18next";

export type LanguageMenuProps = {
  availableLanguages: ILanguage[];
  onSelect: (lang: ILanguage) => void;
  selectedCodes?: string[];
  buttonLabel: React.ReactNode;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  followButtonWidth?: boolean;
  showCheckmark?: boolean;
  disabledCodes?: string[];
  mainLanguageCode?: string;
  mainBadgeLabel?: React.ReactNode;
  buttonVariant?: "text" | "outlined" | "contained";
  buttonColor?: "info" | "inherit" | "primary" | "secondary" | "error";
  labelColor?: string;
};

const LanguageMenu = ({
  availableLanguages,
  onSelect,
  selectedCodes = [],
  buttonLabel,
  size = "small",
  fullWidth = false,
  followButtonWidth = true,
  showCheckmark = true,
  disabledCodes = [],
  mainLanguageCode,
  mainBadgeLabel = t("common.mainLanguage"),
  buttonVariant,
  buttonColor = "primary",
  labelColor = "primary.contrastText",
}: LanguageMenuProps) => {
  const theme = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuWidth, setMenuWidth] = useState<number>();

  const sortedLanguages = useMemo(() => {
    if (!Array.isArray(availableLanguages)) return [];
    if (!mainLanguageCode) return [...availableLanguages];
  
    const mains = availableLanguages.filter(l => l.code === mainLanguageCode);
    const rest  = availableLanguages.filter(l => l.code !== mainLanguageCode);
  
    return [...mains, ...rest];
  }, [availableLanguages, mainLanguageCode]);
  
  useEffect(() => {
    if (followButtonWidth && btnRef.current) {
      setMenuWidth(btnRef.current.offsetWidth);
    }
  }, [followButtonWidth]);

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleSelect = (code: string) => {
    const found = availableLanguages.find((l) => l.code === code);
    if (found) onSelect(found);
    closeMenu();
  };

  return (
    <>
      <Button
        color={buttonColor ?? "inherit"}
        ref={btnRef}
        variant={buttonVariant ?? "contained"}
        endIcon={<ArrowDropDownIcon />}
        onClick={openMenu}
        size={size}
        fullWidth={fullWidth}
        sx={{ whiteSpace: "nowrap", justifyContent: "space-between" }}
      >
        <Text
          variant="semiBoldMedium"
          color={labelColor ?? "primary.contrastText"}
        >
          {buttonLabel}
        </Text>
      </Button>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            width: followButtonWidth ? menuWidth : "auto",
            minWidth: followButtonWidth ? "min-content !important" : undefined,
          },
        }}
      >
        {sortedLanguages.map((lang) => {
          const isSelected = selectedCodes.includes(lang.code);
          const isMain = mainLanguageCode === lang.code;

          return (
            <MenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              selected={isSelected}
              disabled={isSelected}
              sx={{
                ...theme.typography.bodyMedium,
                whiteSpace: "nowrap",
                "&.Mui-disabled": { opacity: 1 },
              }}
              aria-label={
                isMain
                  ? `${lang.title} - ${typeof mainBadgeLabel === "string" ? mainBadgeLabel : "Main language"}`
                  : lang.title
              }
            >
              {showCheckmark && (
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {isSelected ? (
                    <CheckIcon
                      sx={{
                        color: isMain ? "text.disabled" : "primary.main",
                      }}
                    />
                  ) : null}
                </ListItemIcon>
              )}

              <ListItemText
                primary={
                  isMain ? (
                    <>
                      {" "}
                      <Text sx={{ color: "text.disabled" }}>
                        {lang.title} {mainBadgeLabel}{" "}
                      </Text>
                    </>
                  ) : (
                    lang.title
                  )
                }
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default LanguageMenu;

import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { Text } from "@/components/common/Text";
import type { ILanguage } from "@/types";
import {
  LanguagePickerBehavior,
  useLanguagePicker,
} from "../model/useLanguagePicker";

type Props = {
  languages: ILanguage[];
  values: string[];
  onAdd: (lang: ILanguage) => void;
  label: React.ReactNode;
  primaryCode?: string;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  showCheckmark?: boolean;
  behavior?: LanguagePickerBehavior;

  buttonVariant?: "text" | "outlined" | "contained";
  buttonColor?: "inherit" | "primary" | "secondary" | "info" | "error";
  labelColor?: string;
};

export default function LanguagePickerMultiple({
  languages,
  values,
  onAdd,
  label,
  primaryCode,
  size = "small",
  fullWidth = false,
  disabled = false,
  showCheckmark = true,
  behavior,
  buttonVariant,
  buttonColor,
  labelColor,
}: Props) {
  const { t } = useTranslation();
  const primaryBadge = t("common.mainLanguage");

  const pseudoSelected = values[0] ?? "";
  const { aria, buttonRef, menu, menuWidth, items } = useLanguagePicker(
    languages,
    pseudoSelected,
    primaryCode,
    behavior,
  );

  const isSelected = (code: string) => values.includes(code);

  const handlePick = (lang: ILanguage) => {
    if (!isSelected(lang.code)) onAdd(lang);
    menu.closeMenu();
  };

  const resolvedVariant = buttonVariant ?? "outlined";
  const resolvedColor =
    buttonColor ?? (resolvedVariant === "contained" ? "primary" : "inherit");

  const resolvedLabelColor = disabled
    ? "text.disabled"
    : (labelColor ??
      (resolvedVariant === "contained"
        ? "primary.contrastText"
        : "text.primary"));

  return (
    <>
      <Button
        id={aria.buttonId}
        aria-controls={menu.open ? aria.menuId : undefined}
        aria-haspopup="menu"
        aria-expanded={menu.open ? "true" : undefined}
        ref={buttonRef}
        onClick={menu.openMenu}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        variant={resolvedVariant}
        color={resolvedColor as any}
        endIcon={<ArrowDropDownIcon />}
        sx={{ whiteSpace: "nowrap", justifyContent: "space-between" }}
      >
        <Text variant="semiBoldMedium" color={resolvedLabelColor}>
          {label}
        </Text>
      </Button>

      <Menu
        id={aria.menuId}
        anchorEl={menu.anchorEl}
        open={menu.open}
        onClose={menu.closeMenu}
        MenuListProps={{ "aria-labelledby": aria.buttonId }}
        PaperProps={{
          sx: {
            width: (behavior?.matchButtonWidth ?? true) ? menuWidth : "auto",
          },
        }}
      >
        {items.map((lang) => {
          const selected = isSelected(lang.code);
          const isPrimary = primaryCode === lang.code;

          return (
            <MenuItem
              key={lang.code}
              onClick={() => handlePick(lang)}
              selected={selected}
              disabled={selected}
              sx={{ whiteSpace: "nowrap", "&.Mui-disabled": { opacity: 1 } }}
              aria-label={
                isPrimary ? `${lang.title} - ${primaryBadge}` : lang.title
              }
            >
              {showCheckmark && (
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {selected ? (
                    <CheckIcon
                      fontSize="small"
                      sx={{
                        color: isPrimary ? "text.disabled" : "primary.main",
                      }}
                    />
                  ) : null}
                </ListItemIcon>
              )}
              <ListItemText
                primary={
                  isPrimary ? (
                    <Text sx={{ color: "text.disabled" }} variant="bodyMedium">
                      {lang.title} {primaryBadge}
                    </Text>
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
}

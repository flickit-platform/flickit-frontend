import { Stack, Chip, Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ILanguage } from "@/types";
import CheckIcon from "@mui/icons-material/Check";
import { theme } from "@/config/theme";

interface LanguageSelectorChipsProps {
  mainLanguage: ILanguage;
  translatedLanguage?: ILanguage;
  availableLanguages: ILanguage[];
  onAddLanguage: (lang: ILanguage) => void;
  hideButton?: boolean;
}

const LanguageSelectorChips = ({
  mainLanguage,
  translatedLanguage,
  availableLanguages,
  onAddLanguage,
  hideButton = false,
}: LanguageSelectorChipsProps) => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleSelectMainLanguage = (langCode: string) => {
    const selected = availableLanguages.find((l) => l.code === langCode);
    if (selected) {
      onAddLanguage(selected);
    }
    setMenuAnchor(null);
  };

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Chip
        sx={{ ...theme.typography.labelSmall }}
        label={t("kitDesignerTab.mainLanguage", { lang: mainLanguage.title })}
        color="primary"
        variant="outlined"
      />
      {translatedLanguage && (
        <Chip
          sx={{ ...theme.typography.labelSmall }}
          label={t("kitDesignerTab.translatedLanguage", {
            lang: translatedLanguage.title,
          })}
          variant="outlined"
          color="primary"
        />
      )}
      {!hideButton && (
        <>
          <Button
            ref={buttonRef}
            variant="contained"
            endIcon={<ArrowDropDownIcon />}
            onClick={handleMenuClick}
            size="small"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            {t("kitDesignerTab.addLanguage")}
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            PaperProps={{
              sx: {
                width: menuWidth,
                minWidth: "min-content !important",
              },
            }}
          >
            {availableLanguages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => handleSelectMainLanguage(lang.code)}
                sx={{
                  ...theme.typography.bodyMedium,
                  whiteSpace: "nowrap",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {lang.title}
                {(lang.code === mainLanguage.code ||
                  lang.code === translatedLanguage?.code) && (
                  <CheckIcon
                    sx={{ marginInlineStart: "auto", color: "primary.main" }}
                  />
                )}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
};

export default LanguageSelectorChips;

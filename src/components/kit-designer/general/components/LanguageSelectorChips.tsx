import { Stack, Chip, useTheme, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import { ILanguage } from "@/types";

export type LanguageSelectorChipsProps = {
  mainLanguage: ILanguage;
  translatedLanguage?: ILanguage;
  availableLanguages: ILanguage[];
  onAddLanguage: (lang: ILanguage) => void;
  hideButton?: boolean;
};

const LanguageSelectorChips = ({
  mainLanguage,
  translatedLanguage,
  availableLanguages,
  onAddLanguage,
  hideButton = false,
}: LanguageSelectorChipsProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const selectedCodes = [mainLanguage?.code, translatedLanguage?.code].filter(
    Boolean,
  ) as string[];

  return (
    <Stack direction="row" alignItems="center" gap={2} color="primary">
      <Chip
        sx={{ ...theme.typography.labelSmall }}
        label={t("kitDesigner.mainLanguage", { lang: mainLanguage.title })}
        color="primary"
        variant="outlined"
      />
      {translatedLanguage && (
        <Chip
          sx={{ ...theme.typography.labelSmall }}
          label={t("kitDesigner.translatedLanguage", {
            lang: translatedLanguage.title,
          })}
          variant="outlined"
          color="primary"
        />
      )}

      {!hideButton && (
        <Box color="primary">
          <LanguageMenu
            availableLanguages={availableLanguages}
            onSelect={onAddLanguage}
            selectedCodes={selectedCodes}
            buttonLabel={t("kitDesigner.addLanguage")}
            size="small"
            followButtonWidth
          />
        </Box>
      )}
    </Stack>
  );
};

export default LanguageSelectorChips;

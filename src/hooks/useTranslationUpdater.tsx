import { ChangeEvent } from "react";

export const useTranslationUpdater = (langCode?: string) => {
  const updateTranslation = (
    field: string,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!langCode) return;

    setState((prev: any) => {
      const updatedTranslation =
        value === ""
          ? undefined
          : {
              ...prev.translations?.[langCode],
              [field]: value,
            };

      return {
        ...prev,
        translations: updatedTranslation
          ? {
              ...prev.translations,
              [langCode]: updatedTranslation,
            }
          : undefined,
      };
    });
  };

  return { updateTranslation };
};

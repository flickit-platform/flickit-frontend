import { ChangeEvent } from "react";

export const useTranslationUpdater = (langCode?: string) => {
  const updateTranslation = (
    field: string,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!langCode) return;

    setState((prev: any) => {
      const updatedTranslation =
        value === "" ?
          {
            ...prev.translations?.[langCode],
            [field]: undefined,
          }
          :
          {
            ...prev.translations?.[langCode],
            [field]: value,
          };
      return {
        ...prev,
        translations: !Object.values(updatedTranslation).every(item => item === undefined)
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

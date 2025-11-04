import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useConfigContext } from "@/providers/config-provider";
import useGeneralInfoField from "@/hooks/useGeneralInfoField";
import { useTranslationUpdater } from "@/hooks/useTranslationUpdater";
import { ILanguage } from "@/types";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { KitInfoType } from "./types";

export type FieldName =
  | "title"
  | "summary"
  | "price"
  | "published"
  | "isPrivate"
  | "about"
  | "goal"
  | "context";

export function useKitInfo(
  info: KitInfoType,
  fetchAssessmentKitInfoQuery: any,
) {
  const { t, i18n } = useTranslation();
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();

  const {
    handleSaveEdit,
    editableFields,
    setEditableFields,
    langCode,
    toggleTranslation,
    showTranslations,
    updatedValues,
    setUpdatedValues,
  } = useGeneralInfoField({ assessmentKitId, fetchAssessmentKitInfoQuery });

  const handleFieldEdit = useCallback(
    (field: FieldName) => {
      setEditableFields((prev) => {
        const next = new Set(prev);
        next.add(field);
        return next;
      });
    },
    [setEditableFields],
  );

  const handleCancelTextBox = useCallback(
    (field: FieldName) => {
      setEditableFields((prev) => {
        const next = new Set(prev);
        next.delete(field);
        return next;
      });

      setUpdatedValues((prev: any) => {
        const nv = { ...prev };
        delete nv[field];
        if (nv.translations?.[langCode]) {
          const langObj = { ...nv.translations[langCode] };
          delete langObj[field];
          nv.translations = { ...nv.translations, [langCode]: langObj };
        }
        return nv;
      });
    },
    [langCode, setEditableFields, setUpdatedValues],
  );

  const { updateTranslation } = useTranslationUpdater(langCode);

  const addLanguageQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.addLanguage(args, config),
    runOnMount: false,
  });

  const handleAddLanguage = useCallback(
    (selectedLang: ILanguage) =>
      addLanguageQuery
        .query({ assessmentKitId, data: { lang: selectedLang.code } })
        .then(() => fetchAssessmentKitInfoQuery.query()),
    [addLanguageQuery, assessmentKitId, fetchAssessmentKitInfoQuery],
  );

  const selectedCodes = useMemo(
    () => (info.languages || []).map((l) => l.code).filter(Boolean) as string[],
    [],
  );

  const selectedTitles = useMemo(
    () =>
      (info.languages || [])
        .map((l) => l?.title)
        .filter(Boolean)
        .join(i18n.language === "fa" ? "، " : ", "),
    [],
  );

  const dataForField = {
    ...info,
    lang: {
      label: info?.mainLanguage?.title,
      value: info?.mainLanguage?.code,
    },
  };

  const priceOptions = useMemo(
    () => [
      { value: 0, label: t("common.free") },
      { value: 1, label: t("common.paid") },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: "true", label: t("common.published") },
      { value: "false", label: t("common.unpublished") },
    ],
    [],
  );

  const visibilityOptions = useMemo(
    () => [
      { value: "false", label: t("common.public") },
      { value: "true", label: t("common.private") },
    ],
    [],
  );

  const generalFields = useMemo(
    () => [
      {
        name: "title",
        label: "common.title",
        multiline: false,
        useRichEditor: false,
        type: "text" as const,
        options: [],
        md: 12,
        disabled: false,
        width: i18next.language === "fa" ? "35px" : "60px",
      },
      {
        name: "summary",
        label: "common.summary",
        multiline: true,
        useRichEditor: false,
        type: "text" as const,
        options: [],
        md: 12,
        disabled: false,
        width: i18next.language === "fa" ? "35px" : "60px",
      },
      {
        name: "price",
        label: "common.price",
        multiline: false,
        useRichEditor: false,
        type: "radio" as const,
        options: priceOptions,
        md: 6,
        disabled: true,
        width: "35px",
      },
      {
        name: "isPrivate",
        label: "common.visibility",
        multiline: false,
        useRichEditor: false,
        type: "radio" as const,
        options: visibilityOptions,
        md: 6,
        disabled: false,
        width: "35px",
      },
      {
        name: "published",
        label: "common.status",
        multiline: false,
        useRichEditor: false,
        type: "radio" as const,
        options: statusOptions,
        md: 6,
        disabled: false,
        width: "35px",
      },
      {
        name: "about",
        label: "kitDetail.whatIsThisKit",
        multiline: true,
        useRichEditor: true,
        type: "text" as const,
        options: [],
        md: 12,
        disabled: false,
      },
      {
        name: "context",
        label: "kitDetail.whoNeedsThisKit",
        multiline: true,
        useRichEditor: true,
        type: "text" as const,
        options: [],
        md: 12,
        disabled: false,
      },
      {
        name: "goal",
        label: "kitDetail.whenToUseThisKit",
        multiline: true,
        useRichEditor: true,
        type: "text" as const,
        options: [],
        md: 12,
        disabled: false,
      },
    ],
    [priceOptions, statusOptions, visibilityOptions],
  );

  const {
    config: { languages },
  } = useConfigContext();

  return {
    // data
    dataForField,
    generalFields,
    selectedCodes,
    selectedTitles,
    languages,

    // state
    editableFields,
    langCode,
    showTranslations,
    updatedValues,

    // actions
    toggleTranslation,
    setUpdatedValues,
    handleFieldEdit,
    handleSaveEdit,
    handleCancelTextBox,
    updateTranslation,
    handleAddLanguage,
  } as const;
}

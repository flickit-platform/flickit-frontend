type UseCreateEvidenceFormArgs = {
  showTabs?: boolean;
};

type UseCreateEvidenceFormResult = {
  showTabs?: boolean;
  tab: EVIDENCE_TYPE | null;
  onTabChange: (e: SyntheticEvent, value: EVIDENCE_TYPE) => void;
  formMethods: UseFormReturn<FormValues>;
  charCount: number;
  limit: number;
  disabled: boolean;
  loading: boolean;
  onSubmit: () => void;
};

type Polarity = "Positive" | "Negative" | "";

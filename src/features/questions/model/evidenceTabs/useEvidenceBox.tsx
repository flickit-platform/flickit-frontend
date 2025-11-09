type EvidenceType = "Positive" | "Negative" | "Comment" | "Edit";

interface StyleItem {
  color: string;
  label: string;
}

type EvidenceBoxMap = Record<EvidenceType, StyleItem>;

const EVIDENCE_BOX_STYLES: EvidenceBoxMap = {
  Positive: {
    color: "#17823B",
    label: "questions_temp.positiveEvidence",
  },
  Negative: {
    color: "#821717",
    label: "questions_temp.negativeEvidence",
  },
  Comment: {
    color: "#73808C",
    label: "questions_temp.comment",
  },
  Edit: {
    color: "#2466A8",
    label: "questions_temp.editing",
  },
};

const useEvidenceBox = (isEditing: boolean, type: string = "Comment") => {

  const getBoxType = (): StyleItem => {
    if (isEditing) {
      return {
        ...EVIDENCE_BOX_STYLES.Edit
      };
    }

    return EVIDENCE_BOX_STYLES[type as EvidenceType];
  };

  return {
    boxType: getBoxType(),
  };
};

export default useEvidenceBox;
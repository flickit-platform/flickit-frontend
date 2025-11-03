type EvidenceType = "Positive" | "Negative" | "Comment" | "Edit";

interface StyleItem {
  color: string;
  label: string;
  type: string;
}

type EvidenceBoxMap = Record<EvidenceType, StyleItem>;

const EVIDENCE_BOX_STYLES: EvidenceBoxMap = {
  Positive: {
    color: "#17823B",
    label: "questions.positiveEvidence",
    type: "evidence",
  },
  Negative: {
    color: "#821717",
    label: "questions.positiveEvidence",
    type: "evidence",
  },
  Comment: {
    color: "#73808C",
    label: "questions.comment",
    type: "comment",
  },
  Edit: {
    color: "#2466A8",
    label: "questions.editing",
    type: "",
  },
};

const useEvidenceBox = (type: string, isEditing: boolean) => {
  const getBoxType = (): StyleItem => {
    if (isEditing) {
      return {
        ...EVIDENCE_BOX_STYLES.Edit,
        type,
      };
    }

    return EVIDENCE_BOX_STYLES[type as EvidenceType] || EVIDENCE_BOX_STYLES.Comment;
  };

  return {
    boxType: getBoxType(),
  };
};

export default useEvidenceBox;
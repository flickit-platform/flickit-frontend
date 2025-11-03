
const useEvidenceBox = (type: any, isEditing: boolean) => {

  type EvidenceType = "Positive" | "Negative" | "Comment" | "Edit";

  interface StyleItem {
    color: string;
    label: string;
    type: string
  }


  const box: Record<EvidenceType, StyleItem> = {
    Positive: {
      color: "#17823B",
      label: "questions.positiveEvidence",
      type: "evidence"
    },
    Negative: {
      color: "#821717",
      label: "questions.positiveEvidence",
      type: "evidence"
    },
    Comment: {
      color: "#73808C",
      label: "questions.comment",
      type: "comment"
    },
    Edit: {
      color: "#2466A8",
      label: "questions.editing",
      type: type
    },
  };

  const boxType = isEditing ? box.Edit : box[type as EvidenceType]

  return {
    boxType
  }


};

export default useEvidenceBox;

const useEvidenceBox = (type: string = "comment") => {

  type EvidenceType = "Positive" | "Negative" | "comment" | "Edit";

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
    comment: {
      color: "#73808C",
      label: "questions.comment",
      type: "comment"
    },
    Edit: {
      color: "#6680991F",
      label: "questions.editing",
      type: ""
    },
  };

  const boxType = box[type as EvidenceType] ?? box.Edit

  return {
    boxType
  }


};

export default useEvidenceBox;
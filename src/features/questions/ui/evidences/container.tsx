import UseEvidence from "@/features/questions/model/useEvidence";
import EvidenceItem from "@/features/questions/ui/evidences/evidenceItem";

const EvidenceContainer = ({selectedQuestion}) =>{
  const { evidenceItems } =  UseEvidence(selectedQuestion?.id)

    return (
        <>
            {evidenceItems.map(evidence =>{
              return  <EvidenceItem
                    key={evidence.id}
                    {...evidence}
                />
            })}
        </>

    )
}

export default EvidenceContainer
import {useQuery} from "@/hooks/useQuery";
import {useServiceContext} from "@providers/service-provider";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

const UseEvidence = (idx: number): any => {

    const { service } = useServiceContext()
    const {assessmentId = ""} = useParams()
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [evidenceItems, setEvidenceItems] = useState([])
    const evidencesQueryData = useQuery({
        service: (args, config) =>
            service.questions.evidences.getAll(
                args ?? {
                    questionId: idx,
                    assessmentId,
                    page: currentPage,
                    size: 10,
                    } as any,
                config,
            ),
        toastError: true,
        runOnMount: false,
    });

    const commentesQueryData = useQuery({
        service: (args, config) =>
            service.questions.comments.getAll(
                args ?? {
                    questionId: idx,
                    assessmentId,
                    page: currentPage,
                    size: 10,
                } as any,
                config,
            ),
        toastError: true,
        runOnMount: false,
    });

    useEffect(()=>{
        const fetchData = async () =>{
          const  { items } = await evidencesQueryData.query()
            setEvidenceItems(items)
        }
       fetchData()
    },[idx])

    return {
        evidenceItems
    }

};

export default UseEvidence;
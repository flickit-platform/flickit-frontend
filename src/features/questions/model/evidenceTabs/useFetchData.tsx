import {useQuery} from "@/hooks/useQuery";
import {useServiceContext} from "@providers/service-provider";
import {useParams} from "react-router-dom";
import { useQuestionContext } from "@/features/questions/context";

const UseFetchData = () => {
    const { service } = useServiceContext();
    const { assessmentId = "" } = useParams();
  const {selectedQuestion} = useQuestionContext()
  const questionId = selectedQuestion?.id

    const deleteEvidence = useQuery({
        service: (args, config) => service.questions.evidences.remove(args, config),
        runOnMount: false,
    });

    const RemoveEvidenceAttachments = useQuery({
        service: (args, config) =>
            service.questions.evidences.removeAttachment(args, {}),
        runOnMount: false,
    });


    const answerHistoryQueryData = useQuery({
        service: (args, config) =>
            service.assessments.answer.getHistory(
                args ??
                ({
                    questionId,
                    assessmentId,
                    page: 1,
                    size: 10,
                } as any),
                config,
            ),
        toastError: true,
        runOnMount: false,
    });

    const evidencesQueryData = useQuery({
        service: (args, config) =>
            service.questions.evidences.getAll(
                args ??
                ({
                    questionId,
                    assessmentId,
                    page: 1,
                    size: 10,
                } as any),
                config,
            ),
        toastError: true,
        runOnMount: false,
    });

    const commentesQueryData = useQuery({
        service: (args, config) =>
            service.questions.comments.getAll(
                args ??
                ({
                    questionId,
                    assessmentId,
                    page: 1,
                    size: 10,
                } as any),
                config,
            ),
        toastError: true,
        runOnMount: false,
    });

    const fetchEvidenceAttachments = useQuery({
        service: (args, config) =>
            service.questions.evidences.getAttachments(args, config),
        runOnMount: false,
    });

    return {
        deleteEvidence,
        answerHistoryQueryData,
        evidencesQueryData,
        commentesQueryData,
        fetchEvidenceAttachments,
        RemoveEvidenceAttachments
    }
};

export default UseFetchData;
import React, {useState} from 'react';
import {useQuery} from "@/hooks/useQuery";
import {useServiceContext} from "@providers/service-provider";
import {useParams} from "react-router-dom";

const UseEvidenceApi = (questionId) => {
    const { service } = useServiceContext();
    const { assessmentId = "" } = useParams();
    const [currentPage, setCurrentPage] = useState<number>(1);

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
                    page: currentPage,
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
                    page: currentPage,
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
                    page: currentPage,
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

export default UseEvidenceApi;
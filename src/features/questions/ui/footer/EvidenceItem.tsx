import React, {useEffect, useState} from "react";
import {Box, IconButton, Avatar} from "@mui/material";
import {t} from "i18next";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {styles} from "@styles";
import {getReadableDate} from "@utils/readable-date";
import {Text} from "@/components/common/Text";
import {useQuery} from "@/hooks/useQuery";
import {useServiceContext} from "@providers/service-provider";
import useEvidenceBox from "@/features/questions/model/evidenceTabs/useEvidenceBox";
import EvidenceDetail from "@/features/questions/ui/footer/EvidenceDetail";
import uniqueId from "@utils/unique-id";

interface EvidenceItemProps {
    id: string;
    refreshTab: (type: string) => Promise<void>;
    createdBy: {
        displayName: string;
        pictureLink: string;
    };
    lastModificationTime: string;
    type: string;
    setConfirmDeleteDialog: (state: any) => void;
    editable: boolean;
    description: string;
    attachmentsCount?: number;
    fetchAttachment?: (id: string, type: string) => Promise<any>;
    removeAttachment: any
}

const ICON_SIZE = {width: 24, height: 24};

const EvidenceItem: React.FC<EvidenceItemProps> = (props) => {
    const {id, refreshTab, type, description} = props;
    const [editId, setEditId] = useState<string | null>(null);
    const [editTemp, setEditTemp] = useState({description: "", selectedType: ""});
    const {service} = useServiceContext();

    const isEditing = editId === id;

    const toggleEditMode = (evidenceId: string) => {
        setEditId((prev) => (prev == evidenceId ? null : evidenceId));
    };
    useEffect(() => {
        setEditTemp({
            description: description,
            selectedType: type
        })
    }, [id, isEditing]);

    const addEvidence = useQuery({
        service: (args, config) => service.questions.evidences.save(args, config),
        runOnMount: false,
    });

    const handleSubmit = async (evidenceId: string) => {
        await addEvidence.query({
            description: editTemp.description,
            id: evidenceId,
            type: editTemp.selectedType === "Comment" ? null : editTemp.selectedType.toUpperCase(),
        });

        const tabType = editTemp.selectedType === "Comment" ? "comment" : "evidence";
        await refreshTab(tabType);
    };

    return (
        <Box bgcolor={"background.background"} sx={{mb: 2, borderRadius: 1}}>
            <HeaderItem
                {...props}
                toggleEditMode={toggleEditMode}
                editId={editId}
                submit={handleSubmit}
                isEditing={isEditing}
            />
            <EvidenceDetail
                {...props}
                editId={editId}
                isEditing={isEditing}
                editTemp={editTemp}
                setEditTemp={setEditTemp}
            />
        </Box>
    );
};

const HeaderItem: React.FC<any> = ({
                                       createdBy,
                                       lastModificationTime,
                                       type,
                                       id,
                                       setConfirmDeleteDialog,
                                       editable,
                                       toggleEditMode,
                                       editId,
                                       submit,
                                       isEditing,
                                   }) => {
    const {displayName, pictureLink} = createdBy;
    const {boxType} = useEvidenceBox(type, isEditing);

    const headerStyle = {
        ...styles.centerV,
        justifyContent: "space-between",
        flex: 1,
        px: 2,
        py: 1,
        background: "#E8EBEE",
        borderInlineStart: `4px solid ${boxType.color}`,
    };

    const labelStyle = {
        color: boxType.color,
        p: "4px 8px",
        border: `0.5px solid ${boxType.color}`,
        borderRadius: 1,
    };

    const handleDelete = () => {
        const type = boxType?.type
        setConfirmDeleteDialog({open: true, evidenceId: id, type});
    };

    return (
        <Box sx={headerStyle}>
            <Box sx={{...styles.centerVH, gap: 1}}>
                <Avatar src={pictureLink} sx={{...ICON_SIZE, fontSize: 16}}/>
                <Text variant="bodyMedium" color="background.secondaryDark">
                    {displayName}
                </Text>
                <Text variant="bodySmall" color="info.main">
                    {getReadableDate(lastModificationTime, "absolute", false)}
                </Text>
            </Box>

            <Box sx={{...styles.centerVH, gap: 1}}>
                <Text variant="labelSmall" sx={labelStyle}>
                    {t(boxType.label)}
                </Text>
                <ActionButtons
                  actions={
                     isEditing ? [
                                {
                                    icon: <CheckIcon fontSize="small" sx={ICON_SIZE}/>,
                                    onClick: () => submit(id)
                                },
                                 {
                                     icon: <CloseIcon fontSize="small" sx={ICON_SIZE}/>,
                                     onClick: () => toggleEditMode(id)
                                 }
                         ] : [
                                boxType?.type === "comment" && {
                                    icon: <CheckIcon fontSize="small" sx={ICON_SIZE}/>,
                                    onClick: () => {
                                    }
                                },
                                editable && {
                                    icon: <EditOutlinedIcon fontSize="small" sx={ICON_SIZE}/>,
                                    onClick: () => toggleEditMode(id)
                                }, {
                                    icon: <DeleteOutlinedIcon fontSize="small" sx={ICON_SIZE}/>,
                                    onClick: () => handleDelete()
                              }
                        ]
                    }
                />
            </Box>
        </Box>
    );
};

const ActionButtons = ({actions}: {actions: any}) => {
    return (
        <Box sx={{...styles.centerV, gap: 1}} onClick={(e) => e.stopPropagation()}>
            {actions.map((button: any) => (
                <IconButton key={uniqueId()} onClick={button.onClick} sx={{p: 0.4}}>
                    {button.icon}
                </IconButton>
            ))}
        </Box>
    )
};

export default EvidenceItem;
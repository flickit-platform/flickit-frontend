import React, { useEffect } from "react";
import {Avatar, Box, IconButton} from "@mui/material";
import { t } from "i18next";
import { DeleteConfirmationDialog } from "@common/dialogs/DeleteConfirmationDialog";
import {setDelete, setEditingMode, setTab, useQuestionContext, useQuestionDispatch} from "@/features/questions/context";
import {styles} from "@styles";
import {Text} from "@common/Text";
import {getReadableDate} from "@utils/readable-date";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import uniqueId from "@utils/unique-id";
import useEvidenceBox from "@/features/questions/model/evidenceTabs/useEvidenceBox";
import FormProviderWithForm from "@common/FormProviderWithForm";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RichEditorField from "@common/fields/RichEditorField";
import {useForm} from "react-hook-form";
import UseFetchData from "@/features/questions/model/evidenceTabs/useFetchData";
import {AttachmentEvidence} from "@/features/questions/ui/footer/EvidenceDetail";

interface EvidenceListProps {
  data: any[];
  deleteItemAndRefresh: (evidenceId: string, type: string) => Promise<any>;
  refreshTab: () => Promise<void>;
}

const ICON_SIZE = {width: 24, height: 24};
const EvidenceContainer: React.FC<EvidenceListProps> = ({
                                                     data: evidenceItems,
                                                     deleteItemAndRefresh,
                                                     refreshTab,
                                                     ...restProps
                                                   }) => {

  const {tabData, deleteItem, editingItem} = useQuestionContext()
  const {data, activeTab} = tabData
  const dispatch = useQuestionDispatch()
  const {deleteEvidence, evidencesQueryData, commentesQueryData, } = UseFetchData()

  const handleConfirmDelete = async () => {
    const { id } = deleteItem;

    if (!id) return;

      const queryMap = {
              evidence: evidencesQueryData,
              comment: commentesQueryData,
          }
      const currentQuery = queryMap[activeTab];

    await deleteEvidence.query({id});

      const response = await currentQuery.query();
      const items = response.items ?? [];
      dispatch(setTab({ activeTab, data: {...tabData.data, [activeTab]: items } }))
      dispatch(setDelete({open: false, type: "", id: ""}))
  };

  return (
      <Box sx={{ py: 2, px: 4 }}>


          {data?.[activeTab]?.map(item =>{
              return <Container >
                  <Header {...item} />
                  <Detail {...item} />
              </Container>
          })}

        <DeleteConfirmationDialog
            open={deleteItem.open}
            onClose={()=>dispatch(setDelete({...deleteItem, open: false}))}
            onConfirm={handleConfirmDelete}
            content={{
              category: t("questions.evidence"),
              title: "",
            }}
        />
      </Box>
  );
};

const Header = (props) =>{

    const {createdBy, lastModificationTime, id, editable, type, description} = props
    const {displayName, pictureLink}  = createdBy
    const dispatch = useQuestionDispatch()
    const { editingItem, tabData } =useQuestionContext()
    const { addEvidence, evidencesQueryData,commentesQueryData } = UseFetchData()


    const isEditing = editingItem?.id === id;
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
    const handelSubmit = async () =>{
        const {activeTab}= tabData
        await addEvidence.query({
            description: editingItem.description,
            id: editingItem.id,
            type: editingItem.type ? editingItem.type .toUpperCase() : null
        });

        const queryMap = {
            evidence: evidencesQueryData,
            comment: commentesQueryData,
        }
        const currentQuery = queryMap[activeTab];
        dispatch(setEditingMode({}))
        const response = await currentQuery.query();
        const items = response.items ?? [];
        dispatch(setTab({ activeTab, data: {...tabData.data, [activeTab]: items } }))
    }


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
                                onClick: handelSubmit
                            },
                            {
                                icon: <CloseIcon fontSize="small" sx={ICON_SIZE}/>,
                                onClick: () => dispatch(setEditingMode({}))
                            }
                        ] : [
                            boxType?.type === "comment" && {
                                icon: <CheckIcon fontSize="small" sx={ICON_SIZE}/>,
                                onClick: () => {
                                }
                            },
                            editable && {
                                icon: <EditOutlinedIcon fontSize="small" sx={ICON_SIZE}/>,
                                onClick: () => dispatch(setEditingMode({id, description, type}))
                            }, {
                                icon: <DeleteOutlinedIcon fontSize="small" sx={ICON_SIZE}/>,
                                onClick: () => dispatch(setDelete({id, open: true, type}))
                            }
                        ]
                    }
                />
            </Box>
        </Box>
    )
}

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
const Detail = (props) =>{
    const {id, description, attachmentsCount} = props
    const dispatch = useQuestionDispatch()
    const { editingItem } =useQuestionContext()

    const formMethods = useForm({ shouldUnregister: true });
    const watchedDesc = formMethods.watch("evidence-description");
    useEffect(() => {
        const currentValue = formMethods.getValues()["evidence-description"] ?? description;
        dispatch(setEditingMode({...editingItem, description: currentValue}));
    }, [watchedDesc, description, formMethods]);

    const isEditing = editingItem?.id == id
    const hasAttachments = attachmentsCount > 0;

    return (  <Box sx={{px: 2, pb: 2}}>
        <Box width="100%" justifyContent="space-between" sx={{ ...styles.centerV, }}>
            {isEditing ? (
                <Box sx={{width: "100%", padding: "16px 0px"}}>
                    <FormProviderWithForm formMethods={formMethods}>
                        {editingItem.type &&  <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <Text variant="bodySmall" color="background.secondaryDark">{t("questions.typeOfEvidence")}</Text>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={editingItem.type}
                                onChange={(event)=>dispatch(setEditingMode({...editingItem, type: event.target.value}))}
                            >
                                <FormControlLabel
                                    value="Positive"
                                    control={<Radio sx={{padding: "4px"}} size="small"/>}
                                    label={<Text variant="bodySmall" color="background.secondaryDark">{t("questions.positiveEvidence")}</Text>}
                                    sx={{marginRight: 0}}
                                />
                                <FormControlLabel
                                    value="Negative"
                                    control={<Radio sx={{padding: "4px"}} size="small"/>}
                                    label={<Text variant="bodySmall" color="background.secondaryDark">{t("questions.negativeEvidence")}</Text>}
                                    sx={{marginRight: "16px"}}
                                />
                            </RadioGroup>
                        </Box>
                        }
                        <Box
                            sx={{
                                width: "100%",
                                mt: { xs: 26, sm: 17, md: 17, xl: 13 },
                            }}
                        >
                            <RichEditorField
                                name="evidence-description"
                                label={t("common.description")}
                                disable_label={false}
                                required
                                defaultValue={editingItem.description ?? ""}
                                showEditorMenu
                            />
                        </Box>
                    </FormProviderWithForm>
                </Box>
            ) : (
                <Box sx={{  width: "100%", pt: 1 }}>
                    <Text
                        variant="bodyMedium"
                        color="background.secondaryDark"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </Box>
            )}
        </Box>

        {hasAttachments && (
            <AttachmentEvidence
                evidenceId={id}
                attachmentsCount={attachmentsCount}
            />
        )}
    </Box>)
}


const Container = ({children}) =>{

    return (
        <Box bgcolor={"background.background"} sx={{mb: 2, borderRadius: 1}}>
            {children}
        </Box>
    )
}



export default EvidenceContainer;
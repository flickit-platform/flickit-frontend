import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styles } from "@/config/styles";
import { t } from "i18next";
import {farsiFontFamily, primaryFontFamily} from "@config/theme";
import languageDetector from "@utils/languageDetector";
import {MultiLangs} from "@/types";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import {useState} from "react";

interface QuestionnairesFormProps {
  newItem: {
    title: string;
    description: string;
    index: number;
    value: number;
    translations: MultiLangs | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewQuestionnaires: any;
}

const renderTextField = (
  label: string,
  name: string,
  value: string | number,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  multiline = false,
  inputProps?: any,
  newItem?: any,
  setNewQuestionnaires?: any,
  show?: boolean ,
  setShow?: any
) =>{
    return (
        <MultiLangTextField
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            multiline={multiline}
            minRows={2}
            maxRows={5}
            inputProps={inputProps}
            translationValue={newItem.translations?.FA?.[name]}
            onTranslationChange={(e) =>
                setNewQuestionnaires((prev: any) => ({
                    ...prev,
                    translations: {
                        ...prev.translations,
                        FA: {
                            ...prev.translations?.FA,
                           [name] : e.target.value,
                        },
                    },
                }))
            }
            showTranslation={show}
            setShowTranslation={setShow}
        />
    )
};

const QuestionnairesForm = ({
  newItem,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewQuestionnaires
}: QuestionnairesFormProps) =>{
    const [showTitleTranslation, setShowTitleTranslation] = useState(
        Boolean(newItem.translations?.FA?.title),
    );
    const [showDescriptionTranslation, setShowDescriptionTranslation] = useState(
        Boolean(newItem.translations?.FA?.description),
    );
    return (
        <Box
            mt={1.5}
            p={1.5}
            sx={{
                backgroundColor: "#F3F5F6",
                borderRadius: "8px",
                border: "0.3px solid #73808c30",
                display: "flex",
                alignItems: "flex-start",
                position: "relative",
            }}
        >
            <Box
                sx={{ ...styles.centerCVH, background: "#F3F5F6" }}
                borderRadius="0.5rem"
                mr={2}
                p={0.25}
            >
                <TextField
                    required
                    id="new-maturity"
                    type="number"
                    name="value"
                    value={newItem.value}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    inputProps={{
                        "data-testid": "questionnaires-value",
                        style: { textAlign: "center", width: "40px" },
                    }}
                    sx={{
                        fontSize: 14,
                        "& .MuiInputBase-root": {
                            fontSize: 14,
                        },
                        background: "#fff",
                    }}
                />
            </Box>

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                {renderTextField(
                    t("title"),
                    "title",
                    newItem.title,
                    handleInputChange,
                    false,
                    { "data-testid": "questionnaires-title",style: {fontFamily: languageDetector(newItem.title) ? farsiFontFamily : primaryFontFamily } },
                    newItem,
                    setNewQuestionnaires,
                    showTitleTranslation,
                    setShowTitleTranslation
                )}
                {renderTextField(
                    t("description"),
                    "description",
                    newItem.description,
                    handleInputChange,
                    true,
                    { "data-testid": "questionnaires-description", style: {fontFamily: languageDetector(newItem.title) ? farsiFontFamily : primaryFontFamily } },
                    newItem,
                    setNewQuestionnaires,
                    showDescriptionTranslation,
                    setShowDescriptionTranslation
                )}
            </Box>

            {/* Check and Close Buttons */}
            <Box
                display="flex"
                alignItems="center"
                flexDirection={"column"}
                gap={"20px"}
            >
                <Link
                    href="#subject-header"
                    sx={{
                        textDecoration: "none",
                        opacity: 0.9,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <IconButton
                        size="small"
                        color="primary"
                        data-testid="questionnaires-check-icon"
                        onClick={handleSave}
                    >
                        <CheckIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="secondary"
                        data-testid="questionnaires-close-icon"
                        onClick={handleCancel}
                    >
                        <CloseIcon />
                    </IconButton>
                </Link>
            </Box>
        </Box>
    )
};

export default QuestionnairesForm;

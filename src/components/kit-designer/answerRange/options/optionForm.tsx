import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {Trans} from "react-i18next";
import languageDetector from "@utils/languageDetector";
import {farsiFontFamily, primaryFontFamily} from "@config/theme";
import React from "react";
import MultiLangTextField from "@common/fields/MultiLangTextField";

interface OptionFormProps {
    newItem: {
        title: string;
        translations: any;
        index: number;
        value: number;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSave: () => void;
    handleCancel: () => void;
    setNewOptions: any;
}

const OptionForm = ({
                        newItem,
                        setNewOptions,
                        handleInputChange,
                        handleSave,
                        handleCancel,
                    }: OptionFormProps) => {
    return (
        <Box
            p={1.5}
            sx={{
                backgroundColor: "#F3F5F6",
                borderRadius: "0px 0px 8px 8px",
                border: "0.3px solid #73808c30",
                display: "flex",
                alignItems: "flex-start",
                position: "relative",
            }}
        >
            <Box sx={{width: {xs: "65%", md: "70%"}}} mx={1}>

                <MultiLangTextField
                    name="title"
                    value={newItem.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
                    inputProps={{
                        "data-testid": "answer-range-option-title",
                        style: {
                            fontFamily: languageDetector(newItem.title)
                                ? farsiFontFamily
                                : primaryFontFamily,
                        },
                    }}
                    translationValue={
                        newItem.translations?.FA?.title ?? ""
                    }
                    onTranslationChange={(e) =>
                        setNewOptions((prev: any) => ({
                            ...prev,
                            translations: {
                                ...prev.translations,
                                FA: {
                                    ...prev.translations?.FA,
                                    title: e.target.value,
                                },
                            },
                        }))
                    }
                    label={<Trans i18nKey="title"/>}
                />
            </Box>
            <Box sx={{width: {xs: "20%", md: "10%"}}}>
                <TextField
                    required
                    label={<Trans i18nKey="value"/>}
                    name="value"
                    value={newItem.value}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    inputProps={{
                        "data-testid": "answer-range-option-value",
                        style: {textAlign: "center", width: "100%"},
                    }}
                    sx={{
                        fontSize: 14,
                        "& .MuiInputBase-root": {
                            fontSize: 14,
                        },
                        background: "#fff",
                        width: "100%",
                    }}
                />
            </Box>
            {/* Check and Close Buttons */}
            <Box
                sx={{marginLeft: "auto"}}
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
                    {" "}
                    <IconButton
                        size="small"
                        color="primary"
                        data-testid="answer-range-check-icon"
                        onClick={handleSave}
                    >
                        <CheckIcon/>
                    </IconButton>
                    <IconButton
                        size="small"
                        color="secondary"
                        data-testid="answer-option-close-icon"
                        onClick={handleCancel}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Link>
            </Box>
        </Box>
    );
};

export default OptionForm;

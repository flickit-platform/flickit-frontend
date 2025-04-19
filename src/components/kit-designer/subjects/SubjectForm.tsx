import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import Typography from "@mui/material/Typography";
import {farsiFontFamily, primaryFontFamily, theme} from "@config/theme";
import languageDetector from "@utils/languageDetector";
import MultiLangTextField from "@common/fields/MultiLangTextField";
import {useState} from "react";

interface SubjectFormProps {
    newSubject: {
    title: string;
    description: string;
    weight: number;
    index: number;
    value: number;
    translations?: any;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setNewSubject: any;
}

const SubjectForm = ({
  newSubject,
  handleInputChange,
  handleSave,
  handleCancel,
  setNewSubject
}: SubjectFormProps) => {

    const [showTitleTranslation, setShowTitleTranslation] = useState(
        Boolean(newSubject.translations?.FA?.title),
    );
    const [showDescriptionTranslation, setShowDescriptionTranslation] = useState(
        Boolean(newSubject.translations?.FA?.description),
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
      gap: 2,
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
        value={newSubject.value}
        onChange={handleInputChange}
        variant="outlined"
        size="small"
        inputProps={{
          "data-testid": "subject-value",
          style: { textAlign: "center", width: "40px" },
        }}
        sx={{
          fontSize: 14,
          "& .MuiInputBase-root": {
            fontSize: 14,
          },
          background:"#fff",
        }}
      />
    </Box>

    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <MultiLangTextField
            label={<Trans i18nKey="title" />}
            name="title"
            value={newSubject.title}
            onChange={handleInputChange}
            inputProps={{
                "data-testid": "subject-title",
                style: {
                    fontFamily: languageDetector(newSubject.title)
                        ? farsiFontFamily
                        : primaryFontFamily,
                },
            }}
            translationValue={newSubject.translations?.FA?.title}
            onTranslationChange={(e) =>
                setNewSubject((prev: any) => ({
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
            showTranslation={showTitleTranslation}
            setShowTranslation={setShowTitleTranslation}
        />
        <MultiLangTextField
            label={<Trans i18nKey="description" />}
            name="description"
            value={newSubject.description}
            onChange={handleInputChange}
            multiline
            minRows={2}
            maxRows={5}
            inputProps={{
                "data-testid": "subject-description",
                style: {
                    fontFamily: languageDetector(newSubject.description)
                        ? farsiFontFamily
                        : primaryFontFamily,
                },
            }}
            translationValue={newSubject.translations?.FA?.description}
            onTranslationChange={(e) =>
                setNewSubject((prev: any) => ({
                    ...prev,
                    translations: {
                        ...prev.translations,
                        FA: {
                            ...prev.translations?.FA,
                            description: e.target.value,
                        },
                    },
                }))
            }
            showTranslation={showDescriptionTranslation}
            setShowTranslation={setShowDescriptionTranslation}
        />
    </Box>

    {/* Check and Close Buttons */}
    <Box display="flex" alignItems="center" flexDirection={"column"} gap={"20px"}>
      <Link
        href="#subject-header"
        sx={{
          textDecoration: "none",
          opacity: 0.9,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap:"20px"
        }}
      >
        {" "}
        <IconButton size="small" color="primary" data-testid="subject-check-icon" onClick={handleSave}>
          <CheckIcon />
        </IconButton>
        <IconButton size="small" color="secondary" data-testid="subject-close-icon" onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Link>
        <Box sx={{
            width:"fit-content",
            display:"flex",
            justifyContent:"center",
            alignItems:"flex-end",
            flexDirection:"column",
            gap:"0.5rem",
            textAlign:"center"
        }}>

        <Typography sx={{
            ...theme.typography.labelCondensed,
            color:"#6C8093",
            width:"100%"
        }}>
            <Trans i18nKey={"weight"} />
        </Typography>
        <TextField
            required
            value={newSubject.weight}
            onChange={handleInputChange}
            name="weight"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            type="number"
            inputProps={{
                style: { textAlign: "center", width: "40px" },
            }}
            sx={{
                mb: 1,
                mt: 1,
                fontSize: 14,
                "& .MuiInputBase-root": {
                    fontSize: 14,
                    overflow: "auto",
                },
                "& .MuiFormLabel-root": {
                    fontSize: 14,
                },
                background:"#fff",
                borderRadius:"8px",
            }}
        />
      </Box>
    </Box>
  </Box>
 )
};

export default SubjectForm;

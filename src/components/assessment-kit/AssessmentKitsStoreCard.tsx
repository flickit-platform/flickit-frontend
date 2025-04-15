import React from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Trans, useTranslation} from "react-i18next";
import {farsiFontFamily, secondaryFontFamily, theme} from "@config/theme";
import Chip from "@mui/material/Chip";
import {styles} from "@styles";
import {Link, useNavigate} from "react-router-dom";
import PriceIcon from "@utils/icons/priceIcon";
import LanguageIcon from '@mui/icons-material/Language';
import Button from "@mui/material/Button";
import languageDetector from "@utils/languageDetector";

const AssessmentKitsStoreCard = (props: any) => {
    const {id, title, isPrivate, expertGroup, summary, languages, openDialog} = props

    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const createAssessment = (id: any, title: any) => {
        openDialog.openDialog({
            type: "create",
            staticData: {assessment_kit: {id, title}},
        })
    }

    const goToKit = (e: any ,id: number) =>{
        e.preventDefault();
        e.stopPropagation();
        navigate(`${id}/`)
    }
    return (
        <Grid key={id} item xs={12} md={6} xl={4} justifyItems={"center"}>
            <Box sx={{
                minWidth: "320px",
                width: "100%",
                borderRadius: "8px",
                background: "#fff",
                height: "100%",
                p:{xs: 1, sm: 4},
                boxShadow: "0 0 8px 0 #0A234240",
                borderLeft: `4px solid ${isPrivate ? theme.palette.secondary.main : theme.palette.primary.main}`,
                direction: i18n.language === 'fa' ? "rtl" : "ltr",
                cursor: "pointer"
            }}
            onClick={(e)=>goToKit(e,id)}
            >
                <Box sx={{...styles.centerVH, justifyContent: "space-between",}}>
                    <Typography sx={{
                        ...theme.typography.headlineSmall,
                        color: isPrivate ? theme.palette.secondary.main : theme.palette.primary.main,
                        fontFamily: languageDetector(title)
                            ? farsiFontFamily
                            : secondaryFontFamily,
                        fontWeight: "bold"
                    }}>
                        {title}
                    </Typography>
                    {isPrivate && (
                        <Chip
                            label={<Trans  i18nKey="private"/>}
                            size="small"
                            sx={{
                                ...theme.typography.semiBoldLarge,
                                background: "#FCE8EF",
                                color: "#B8144B",
                                display: "block-inline",

                                "& .MuiChip-label": {
                                    p: "0px",
                                    fontFamily: i18n.language === 'fa'
                                        ? farsiFontFamily
                                        : secondaryFontFamily,
                                },
                                py: "8px",
                                px: "16px",
                            }}
                        />
                    )}
                </Box>

                <Typography to={`/user/expert-groups/${expertGroup.id}`}
                            component={Link}
                            sx={{
                                ...theme.typography.semiBoldLarge,
                                color: "#6C8093",
                                cursor: "pointer",
                                textDecoration: "none",
                                mt: 1,
                                display: "inline-block",
                                fontFamily: i18n.language === "fa"
                                    ? farsiFontFamily
                                    : secondaryFontFamily,
                            }}>
                    <Trans i18nKey={"designedBy"}/>{" "}
                    {expertGroup.title}
                </Typography>
                <Typography sx={{py: 4, height: "150px", ...theme.typography.bodyLarge, color: "#2B333B",
                    fontFamily: languageDetector(summary)
                        ? farsiFontFamily
                        : secondaryFontFamily,
                }}>
                    {summary}
                </Typography>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center",}}>
                    <Box sx={{
                        ...styles.centerVH,
                        background: "#EDF0F2",
                        borderRadius: "8px",
                        py: 1,
                        px: {xs:1, sm: 2},
                        gap: {xs:"10px", sm: "30px",  md: "50px"},
                        width: "fit-content"
                    }}>
                        <Box sx={{...styles.centerVH, gap: 1, direction: i18n.language === 'fa' ? "ltr" : "rtl" }}>
                            <Typography sx={{...theme.typography.titleSmall, color: "#2B333B",
                                fontFamily: i18n.language === 'fa'
                                    ? farsiFontFamily
                                    : secondaryFontFamily,
                            }}>
                                <Trans i18nKey={"free"}/>
                            </Typography>
                            <PriceIcon color={isPrivate ? theme.palette.secondary.main : theme.palette.primary.main}/>
                        </Box>
                        <Box sx={{...styles.centerVH, gap: 1, direction: i18n.language === 'fa' ? "ltr" : "rtl"}}>
                            <Typography sx={{...theme.typography.titleSmall, color: "#2B333B",
                                fontFamily: i18n.language === 'fa'
                                    ? farsiFontFamily
                                    : secondaryFontFamily,
                            }}>
                                {languages.join(",")}
                            </Typography>
                            <LanguageIcon sx={{color: isPrivate ? theme.palette.secondary.main : theme.palette.primary.main, fontSize: "32px"}}  />
                        </Box>
                    </Box>
                    <Button onClick={() => createAssessment(id, title)} variant="contained" sx={{
                        background: isPrivate ? theme.palette.secondary.main : theme.palette.primary.main,
                        whiteSpace: "nowrap",
                        fontFamily: i18n.language === 'fa'
                            ? farsiFontFamily
                            : secondaryFontFamily,
                        "&:hover": {
                            background: isPrivate ? theme.palette.secondary.dark : theme.palette.primary.dark
                        }
                    }}>
                        <Trans i18nKey={"createNewAssessment"}/>
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

export default AssessmentKitsStoreCard;
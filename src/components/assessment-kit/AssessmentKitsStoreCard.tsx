import React from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Trans, useTranslation} from "react-i18next";
import {theme} from "@config/theme";
import Chip from "@mui/material/Chip";
import {styles} from "@styles";
import {Link} from "react-router-dom";
import PriceIcon from "@utils/icons/priceIcon";
import LanguageIcon from '@mui/icons-material/Language';
import Button from "@mui/material/Button";

const AssessmentKitsStoreCard = (props: any) => {
    const {id, title, isPrivate, expertGroup, summary, languages, openDialog} = props

    const {i18n} = useTranslation();

    const createAssessment = (id: any, title: any) => {
        openDialog.openDialog({
            type: "create",
            staticData: {assessment_kit: {id, title}},
        })
    }
    return (
        <Grid key={id} item xs={12} md={6} lg={4} justifyItems={"center"}>
            <Box sx={{
                minWidth: "320px",
                width: "100%",
                borderRadius: "8px",
                height: "320px",
                background: "#fff",
                p: 4,
                boxShadow: "0 0 8px 0 #0A234240",
                borderLeft: `4px solid ${isPrivate ? theme.palette.secondary.main : theme.palette.primary.main}`,
                direction: i18n.language === 'fa' ? "rtl" : "ltr"
            }}>
                <Box sx={{...styles.centerVH, justifyContent: "space-between",}}>
                    <Typography sx={{
                        ...theme.typography.headlineSmall,
                        color: isPrivate ? theme.palette.secondary.main : theme.palette.primary.main
                    }}>
                        {title}
                    </Typography>
                    {isPrivate && (
                        <Chip
                            label={<Trans i18nKey="private"/>}
                            size="small"
                            sx={{
                                background: "#FCE8EF",
                                color: "#B8144B",
                                display: "block-inline"
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
                                display: "inline-block"
                            }}>
                    <Trans i18nKey={"designedBy"}/>{" "}
                    {expertGroup.title}
                </Typography>
                <Typography sx={{py: 4, height: "150px", ...theme.typography.bodyLarge, color: "#2B333B"}}>
                    {summary}
                </Typography>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center",}}>
                    <Box sx={{
                        ...styles.centerVH,
                        background: "#EDF0F2",
                        borderRadius: "8px",
                        py: 1,
                        px: 2,
                        gap: "50px",
                        width: "fit-content"
                    }}>
                        <Box sx={{...styles.centerVH, gap: 1}}>
                            <Typography sx={{...theme.typography.titleSmall, color: "#2B333B"}}>
                                <Trans i18nKey={"free"}/>
                            </Typography>
                            <PriceIcon color={isPrivate ? theme.palette.secondary.main : theme.palette.primary.main}/>
                        </Box>
                        <Box sx={{...styles.centerVH, gap: 1}}>
                            <Typography sx={{...theme.typography.titleSmall, color: "#2B333B"}}>
                                {languages.join(",")}
                            </Typography>
                            <LanguageIcon sx={{color: isPrivate ? theme.palette.secondary.main : theme.palette.primary.main, fontSize: "32px"}}  />
                        </Box>
                    </Box>
                    <Button onClick={() => createAssessment(id, title)} variant="contained" sx={{
                        background: isPrivate ? theme.palette.secondary.main : theme.palette.primary.main,
                        "&:hover": {
                            background: isPrivate ? theme.palette.secondary.dark : theme.palette.primary.dark
                        }
                    }}>
                        <Trans i18nKey={"createAssessment"}/>
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
};

export default AssessmentKitsStoreCard;
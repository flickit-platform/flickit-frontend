import React, { useState } from "react";
import Box from "@mui/material/Box";
import { styles } from "@styles";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import QuestionDialog from "./QuestionDialog";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import languageDetector from "@utils/languageDetector";
import {farsiFontFamily, primaryFontFamily} from "@config/theme";

const QuestionContain = (props: any) => {
  const { question, fetchQuery } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    fetchQuery.query();
  };

  return (
    <>
      <Box sx={{ display: "flex", py: ".5rem", px: "1rem" }}>
        <Box
          sx={{
            ...styles.centerVH,
            background: "#F3F5F6",
            width: { xs: "65px", md: "95px" },
            justifyContent: "space-around",
          }}
          borderRadius="0.5rem"
          mr={2}
          px={0.2}
        >
          <Typography data-testid="question-index" variant="semiBoldLarge">{`Q. ${question?.index}`}</Typography>
        </Box>
        <Box data-testid="question-title" sx={{ width: { xs: "80%", md: "90%", fontFamily: languageDetector(question?.title) ? farsiFontFamily :  primaryFontFamily } }}>{question?.title}</Box>
        <Box
          sx={{
            width: { xs: "20%", md: "10%" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton data-testid="question-handel-edit" onClick={handleEditClick}>
            <ModeEditOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {question.index !== question.total && (
        <Divider sx={{ width: "95%", mx: "auto" }} />
      )}
        {isDialogOpen && <QuestionDialog
            open={isDialogOpen}
            question={question}
            onClose={handleCloseDialog}
            fetchQuery={fetchQuery}
        /> }

    </>
  );
};

export default QuestionContain;

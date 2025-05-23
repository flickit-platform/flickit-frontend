import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Trans } from "react-i18next";
import { styles } from "@styles";

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  direction: "ltr" | "rtl";
  previousTextKey: string;
  nextTextKey: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  direction,
  previousTextKey,
  nextTextKey,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
      <Button
        data-testid="question-modal-previous-question"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        sx={{ ...styles.centerVH, gap: 1, cursor: "pointer" }}
      >
        <ArrowBackIos
          sx={{
            fontSize: ".7rem",
            transform: direction === "rtl" ? "scaleX(-1)" : "none",
          }}
        />
        <Typography
          textTransform="uppercase"
          variant={"semiBoldLarge"}
          sx={{ fontSize: "12px" }}
        >
          <Trans i18nKey={previousTextKey} />
        </Typography>
      </Button>
      <Button
        data-testid="question-modal-next-question"
        onClick={onNext}
        disabled={isNextDisabled}
        sx={{ ...styles.centerVH, gap: 1, cursor: "pointer" }}
      >
        <Typography variant={"semiBoldLarge"} sx={{ fontSize: "12px" }}>
          <Trans i18nKey={nextTextKey} />
        </Typography>
        <ArrowForwardIos
          sx={{
            fontSize: ".7rem",
            transform: direction === "rtl" ? "scaleX(-1)" : "none",
          }}
        />
      </Button>
    </Box>
  );
};

export default NavigationButtons;

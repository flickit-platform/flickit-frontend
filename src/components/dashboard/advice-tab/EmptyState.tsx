import React from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { styles } from "@styles";
import EmptyAdvice from "@assets/svg/lampComment.svg";
import StarsAdvice from "@assets/svg/Stars.svg";

interface EmptyStateProps {
  isWritingAdvice: boolean;
  permissions: { createAdvice: boolean } | null;
  setIsWritingAdvice: (value: boolean) => void;
  handleClickOpen: () => void;
  narrationComponent: { aiEnabled: boolean };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  isWritingAdvice,
  permissions,
  setIsWritingAdvice,
  handleClickOpen,
  narrationComponent,
}) => {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        border: `${isWritingAdvice ? "none" : "1px solid #9DA7B3"}`,
        p: 6,
        margin: "0 auto",
        display: `${isWritingAdvice ? "none" : ""}`,
        position: "relative",
        background: "radial-gradient(circle, #2466A8, #1B4D7E)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)", // Center the lamp
        }}
      >
        <img src={EmptyAdvice} alt="lamp" width="100%" />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "0",
          right: "0",
        }}
      >
        <img src={StarsAdvice} alt="stars" width="100%" />
      </Box>

      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 12,
        }}
      >
        {" "}
        <Typography variant="headlineMedium" color="primary.contrastText">
          <Trans i18nKey="noAdviceGeneratedYet" />
        </Typography>
      </Box>
      {permissions?.createAdvice && (
        <Box
          sx={{
            ...styles.centerCVH,
            mt: 4,
          }}
          textAlign="center"
        >
          <Typography
            variant="bodyLarge"
            color="primary.contrastText"
            maxWidth="50vw"
          >
            <Trans i18nKey="theAdvisorService" />
          </Typography>
        </Box>
      )}
      {/* Button */}
      {permissions?.createAdvice && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": {
                borderColor: "#d9dde3",
                color: "#d9dde3",
              },
            }}
            onClick={() => setIsWritingAdvice(true)}
          >
            <Trans i18nKey="writeYourOwnAdvices" />
          </Button>{" "}
          <Tooltip
            title={
              !narrationComponent.aiEnabled && <Trans i18nKey="AIDisabled" />
            }
          >
            <div>
              <Button
                variant="outlined"
                sx={{
                  background: "white",
                  "&:hover": {
                    background: "#d9dde3",
                  },
                  display: "flex",
                  gap: 1,
                }}
                onClick={handleClickOpen}
                disabled={!narrationComponent.aiEnabled}
              >
                <Trans i18nKey="generateAdvicesViaAI" />
                <FaWandMagicSparkles />
              </Button>
            </div>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;

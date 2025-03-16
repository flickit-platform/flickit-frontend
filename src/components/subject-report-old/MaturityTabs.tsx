import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DoneIcon from '@mui/icons-material/Done';
import { Theme } from '@mui/material/styles';
import languageDetector from '@/utils/languageDetector';
import { farsiFontFamily, primaryFontFamily } from '@/config/theme';

interface MaturityScoreModel {
  maturityLevel: { id: number; value: number; title: string };
  score: number;
}

interface MaturityTabsProps {
  maturityScoreModels: MaturityScoreModel[];
  maturityLevel: { value: number };
  TopNavValue: number;
  handleChangeTab: (event: React.SyntheticEvent, newValue: number) => void;
  maturityHandelClick: (id: number) => void;
  theme: Theme;
}

const MaturityTabs: React.FC<MaturityTabsProps> = ({
  maturityScoreModels,
  maturityLevel,
  TopNavValue,
  handleChangeTab,
  maturityHandelClick,
  theme,
}) => {
  return (
    <Box
      sx={{
        background: "#E2E5E9",
        width: "100%",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        my: 2,
        paddingBlock: 0.5,
        pt: 1,
      }}
    >
      <Tabs
        value={TopNavValue}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        sx={{
          border: "none",
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {maturityScoreModels.map((item) => {
          const { maturityLevel: maturityLevelOfScores, score } = item;
          return (
            <Tab
              onClick={() => maturityHandelClick(maturityLevelOfScores.id)}
              key={maturityLevelOfScores.id}
              sx={{
                ...theme.typography.semiBoldLarge,
                mr: 1,
                border: "none",
                textTransform: "none",
                color:
                  maturityLevelOfScores?.value > maturityLevel?.value
                    ? "#6C8093"
                    : "#2B333B",
                "&.Mui-selected": {
                  boxShadow: "0 1px 4px rgba(0,0,0,25%) !important",
                  borderRadius: "8px !important",
                  color: theme.palette.primary.main,
                  background: "#fff",
                  "&:hover": {
                    background: "#fff",
                    border: "none",
                  },
                },
              }}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    fontFamily: languageDetector(maturityLevelOfScores.title)
                      ? farsiFontFamily
                      : primaryFontFamily,
                  }}
                >
                  {maturityLevelOfScores?.value == maturityLevel?.value && (
                    <WorkspacePremiumIcon fontSize={"small"} />
                  )}
                  {maturityLevelOfScores?.value < maturityLevel?.value && (
                    <DoneIcon fontSize={"small"} />
                  )}
                  {maturityLevelOfScores.title} ({Math.ceil(score)}%)
                </Box>
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default MaturityTabs;
import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Theme } from '@mui/material/styles'; 
import FlatGauge from '../common/charts/flatGauge/FlatGauge';
import languageDetector from '@/utils/languageDetector';
import { Trans } from 'react-i18next';
import { getMaturityLevelColors } from '@/config/styles';
import { farsiFontFamily, primaryFontFamily } from '@/config/theme';

interface AttributeHeaderProps {
  title: string;
  description: string;
  maturityLevel: { value: number; title: string };
  maturity_levels_count: number;
  confidenceValue: number;
  expandedAttribute: string | false;
  id: string;
  permissions: { viewAttributeScoreDetail: boolean };
  theme: Theme;
}

const AttributeHeader: React.FC<AttributeHeaderProps> = ({
  title,
  description,
  maturityLevel,
  maturity_levels_count,
  confidenceValue,
  expandedAttribute,
  id,
  permissions,
  theme,
}) => {
  const colorPallet = getMaturityLevelColors(maturity_levels_count, true);
  const backgroundColor = colorPallet[maturityLevel.value - 1];

  return (
    <Grid container sx={{ width: "100%", direction: theme.direction, borderRadius: "16px" }}>
      <Grid item xs={12} sm={9} sx={{ p: 4 }}>
        <Box>
          <Typography
            sx={{
              ...theme.typography.headlineSmall,
              textTransform: "none",
              fontFamily: languageDetector(title) ? farsiFontFamily : primaryFontFamily,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              ...theme.typography.bodyMedium,
              textTransform: "none",
            }}
            marginX={2}
          >
            {"("}
            <Trans i18nKey="weight" />: {maturityLevel?.value}
            {")"}
          </Typography>
        </Box>
        <Typography
          sx={{
            ...theme.typography.bodyMedium,
            color: "#6C8093",
            mt: 1,
            fontFamily: languageDetector(description) ? farsiFontFamily : primaryFontFamily,
          }}
        >
          {description}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: backgroundColor,
            borderEndEndRadius: "16px",
            borderStartEndRadius: { sm: "16px", xs: 0 },
            mt: { sm: 0, xs: 2 },
            borderEndStartRadius: { sm: 0, xs: "16px" },
            boxShadow: "0 0 4px 0 #0A234240",
          }}
        >
          <FlatGauge
            maturityLevelNumber={maturity_levels_count}
            levelValue={maturityLevel.value}
            text={maturityLevel.title}
            confidenceLevelNum={Math.floor(confidenceValue)}
            textPosition="top"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              borderRadius: expandedAttribute == id ? "0 8px 0 0" : "0 8px 8px 0",
            }}
          />
          {permissions.viewAttributeScoreDetail && (
            <ExpandMoreIcon
              sx={{
                position: "absolute",
                bottom: "16px",
                right: theme.direction === "rtl" ? "unset" : "16px",
                left: theme.direction === "rtl" ? "16px" : "unset",
                transform: expandedAttribute === id ? "scaleY(-1)" : "none",
              }}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AttributeHeader;
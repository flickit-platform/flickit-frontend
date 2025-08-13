// @ts-nocheck
import Box from "@mui/material/Box";
import { styles } from "@styles";
import { ICompareResultBaseInfo } from "@/types/index";
import { Gauge } from "@common/charts/Gauge";
import Title from "@common/Title";
import { t } from "i18next";

const CompareResultAssessmentsSection = (props: {
  data: ICompareResultBaseInfo[];
}) => {
  const { data } = props;
  return (
    <Box
      sx={{
        py: 2,
        px: { xs: 1, sm: 2, md: 3 },
        bgcolor: "white",
        borderRadius: 2,
        mt: 1,
      }}
    >
      <Box width="100%" flexWrap="wrap" sx={{ ...styles.centerH }}>
        {data.map((item, index: number) => {
          return (
            <Box
              sx={{
                width: "300px",
              }}
              key={item?.id}
            >
              <Box
                height="100%"
                justifyContent="space-between"
                textAlign="center"
                p={{ xs: 0.5, sm: 1, md: 2 }}
                sx={{ ...styles.centerCH }}
              >
                <Title>{item.title}</Title>
                <Box
                  sx={{
                    ...styles.centerV,
                    mt: 2,
                    justifyContent: { xs: "center", lg: "flex-end" },
                  }}
                >
                  <Gauge
                    maturity_level_number={
                      item.maturityLevel.maturityLevelCount
                    }
                    isMobileScreen={true}
                    maturity_level_status={item.maturityLevel.title}
                    level_value={item.maturityLevel.index}
                    confidence_value={item.confidenceValue}
                    confidence_text={t("common.confidence")}
                    hideGuidance={true}
                    maxWidth="250px"
                    m="auto"
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CompareResultAssessmentsSection;

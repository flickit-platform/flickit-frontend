import { Box, Button, Divider } from "@mui/material";
import { Trans } from "react-i18next";
import { Text } from "@/components/common/Text";
import { useReviewStatus } from "../model/review/useReviewStatus";
import { Link, useNavigate } from "react-router-dom";
import { styles } from "@styles";
import ReviewScreenSkeleton from "../ui/review/ReviewScreenSkleton";
import QueryBatchData from "@/components/common/QueryBatchData";

const ReviewScreen = () => {
  const { image, texts, status, getNextQuestionnaire, fetchPathInfo } =
    useReviewStatus();
  const navigate = useNavigate();

  
  return (
    <QueryBatchData
      queryBatchData={[fetchPathInfo, getNextQuestionnaire]}
      loadingComponent={<ReviewScreenSkeleton />}
      render={([pathInfo, nextQuestionnaire]) => {
        const displayNextQuestionnaire = nextQuestionnaire.status === "FOUND";
        return (
          <Box
            width="100%"
            bgcolor="background.background"
            borderRadius="12px"
            boxShadow="0 0 0 1px rgba(0,0,0,0.04), 0 8px 8px -8px rgba(0,0,0,0.16)"
          >
            <Box
              width="100%"
              sx={{ ...styles.centerCVH }}
              gap={3}
              px={3}
              py={2}
            >
              <Box flexShrink={0}>
                <img
                  style={{ width: "220px", maxWidth: "100%" }}
                  src={image}
                  alt={status}
                />
              </Box>

              <Box flex={1} sx={{ ...styles.centerCVH }}>
                {texts.map((t, idx) => (
                  <Text
                  textAlign="justify"
                    key={idx}
                    variant={t.variant}
                    color={t.color}
                    sx={{ mb: idx === texts.length - 1 ? 0 : 1.5 }}
                  >
                    <Trans
                      i18nKey={
                        Array.isArray(t.i18nKey)
                          ? displayNextQuestionnaire
                            ? t.i18nKey[1]
                            : t.i18nKey[0]
                          : t.i18nKey
                      }
                      values={{
                        questionnaire: pathInfo?.questionnaire?.title,
                      }}
                      components={{
                        style: (
                          <Text
                            variant={t.variant}
                            component={Link}
                            to="../../questionnaires"
                            display="inline"
                            color="secondary.main"
                            sx={{
                              textDecoration: "none",
                            }}
                          />
                        ),
                      }}
                    />
                  </Text>
                ))}
              </Box>
            </Box>
            <Divider sx={{ width: "100%" }} />
            {/* Footer */}
            <Box display="flex" padding={2} justifyContent="flex-end" gap={1}>
              {displayNextQuestionnaire && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate(
                      "../../questionnaires/" +
                        nextQuestionnaire.data.id +
                        "/" +
                        nextQuestionnaire.data.questionIndex,
                    );
                  }}
                >
                  <Trans i18nKey="questions.nextQuestionnaire" />
                </Button>
              )}

              <Button
                variant="contained"
                onClick={() => {
                  navigate("../../questionnaires");
                }}
              >
                <Trans i18nKey="questions.allQuestionnaires" />
              </Button>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default ReviewScreen;

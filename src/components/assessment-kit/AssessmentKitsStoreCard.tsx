import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { farsiFontFamily, secondaryFontFamily, theme } from "@config/theme";
import Chip from "@mui/material/Chip";
import { styles } from "@styles";
import { Link, useNavigate } from "react-router-dom";
import PriceIcon from "@utils/icons/priceIcon";
import LanguageIcon from "@mui/icons-material/Language";
import Button from "@mui/material/Button";
import languageDetector from "@utils/languageDetector";
import i18next from "i18next";

const AssessmentKitsStoreCard = (props: any) => {
  const { id, title, isPrivate, expertGroup, summary, languages, openDialog } =
    props;

  const navigate = useNavigate();
  const createAssessment = (e: any, id: any, title: any) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog.openDialog({
      type: "create",
      staticData: { assessment_kit: { id, title } },
    });
  };

  const goToKit = (e: any, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`${id}/`);
  };
  return (
    <Grid key={id} item xs={12} md={6}>
      <Box
        sx={{
          ...styles.boxStyle,
          borderRadius: 1,
          height: "100%",
          borderLeft: `4px solid ${
            isPrivate
              ? theme.palette.secondary.main
              : theme.palette.primary.main
          }`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={(e) => goToKit(e, id)}
      >
        <Box>
          <Box>
            <Box
              mb={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  ...theme.typography.headlineSmall,
                  color: isPrivate
                    ? theme.palette.secondary.main
                    : theme.palette.primary.main,
                  fontFamily: languageDetector(title)
                    ? farsiFontFamily
                    : secondaryFontFamily,
                }}
              >
                {title}
              </Typography>

              {isPrivate && (
                <Chip
                  label={<Trans i18nKey="private" />}
                  size="medium"
                  sx={{
                    background: "#FCE8EF",
                    color: "#B8144B",
                    ...theme.typography.semiBoldLarge,
                  }}
                />
              )}
            </Box>

            <Typography
              to={`/user/expert-groups/${expertGroup.id}`}
              component={Link}
              sx={{
                ...theme.typography.semiBoldLarge,
                color: "#6C8093",
                textDecoration: "none",
                fontFamily: languageDetector(expertGroup.title)
                  ? farsiFontFamily
                  : secondaryFontFamily,
              }}
            >
              <span
                style={{
                  fontFamily:
                    i18next.language === "fa"
                      ? farsiFontFamily
                      : secondaryFontFamily,
                }}
              >
                <Trans i18nKey="designedBy" />
              </span>{" "}
              {expertGroup.title}
            </Typography>
          </Box>
          <Box
            mt={4}
            sx={{
              display: "flex",
              textAlign: "justify",
              fontFamily: languageDetector(summary)
                ? farsiFontFamily
                : secondaryFontFamily,
              overflow: "hidden",
              minHeight: {
                xs: `calc(1em * 4)`,
                sm: `calc(1em * 4)`,
              },
            }}
          >
            <Typography
              sx={{
                ...theme.typography.bodyLarge,
                fontFamily: languageDetector(summary)
                  ? farsiFontFamily
                  : secondaryFontFamily,
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              textAlign="justify"
            >
              {summary}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 4 },
              bgcolor: "#EDF0F2",
              borderRadius: 2,
              px: 2,
              py: 1,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                ...styles.centerV,
                gap: 1,
              }}
            >
              <PriceIcon
                color={
                  isPrivate
                    ? theme.palette.secondary.main
                    : theme.palette.primary.main
                }
              />
              <Typography variant="titleSmall">
                <Trans i18nKey="free" />
              </Typography>
            </Box>

            <Box
              sx={{
                ...styles.centerV,
                gap: 1,
              }}
            >
              <LanguageIcon
                sx={{
                  fontSize: { xs: "20px", sm: "26px" },
                  color: isPrivate
                    ? theme.palette.secondary.main
                    : theme.palette.primary.main,
                }}
              />
              <Typography variant="titleSmall">
                {languages.join(",")}
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={(e) => createAssessment(e, id, title)}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: isPrivate
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
              "&:hover": {
                backgroundColor: isPrivate
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.dark,
              },
            }}
          >
            <Trans i18nKey="createNewAssessment" />
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default AssessmentKitsStoreCard;

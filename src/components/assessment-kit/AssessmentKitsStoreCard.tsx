import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { farsiFontFamily, secondaryFontFamily, theme } from "@config/theme";
import Chip from "@mui/material/Chip";
import { styles } from "@styles";
import { Link } from "react-router-dom";
import PriceIcon from "@utils/icons/priceIcon";
import LanguageIcon from "@mui/icons-material/Language";
import Button from "@mui/material/Button";
import languageDetector from "@utils/languageDetector";
import i18next from "i18next";
import { Avatar } from "@mui/material";
import stringAvatar from "@/utils/stringAvatar";
import { formatLanguageCodes } from "@/utils/languageUtils";

const AssessmentKitsStoreCard = (props: any) => {
  const {
    id,
    title,
    isPrivate,
    expertGroup,
    summary,
    languages,
    openDialog,
    small,
  } = props;

  const createAssessment = (e: any, id: any, title: any) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog.openDialog({
      type: "create",
      staticData: { assessment_kit: { id, title } },
    });
  };

  const truncatedSummaryLength = small ? 150 : 297;
  const truncatedSummary = summary.substring(0, truncatedSummaryLength);
  const isSummaryTruncated =
    summary.length > truncatedSummaryLength ? "..." : "";

  return (
    <Box
      to={`${id}/`}
      component={Link}
      sx={{
        ...styles.boxStyle,
        borderRadius: 1,
        height: "100%",
        mb: small ? "8px !important" : "40px  !important",
        borderLeft: `4px solid ${
          isPrivate ? theme.palette.secondary.main : theme.palette.primary.main
        }`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        textDecoration: "unset",
        color: "inherit",
        p: small ? "24px !important" : "32px",
      }}
    >
      <Box>
        <Box>
          <Box
            mb={small ? 0.5 : 1}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                ...(small
                  ? theme.typography.titleMedium
                  : theme.typography.headlineSmall),
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
                size={small ? "small" : "medium"}
                sx={{
                  background: "#FCE8EF",
                  color: "#B8144B",
                  ...(small
                    ? theme.typography.semiBoldMedium
                    : theme.typography.semiBoldLarge),
                }}
              />
            )}
          </Box>
          <Box sx={{ ...styles.centerV }} gap={small ? 0.5 : 1}>
            <Avatar
              {...stringAvatar(expertGroup.title?.toUpperCase())}
              src={expertGroup.picture}
              sx={{
                width: small ? 24 : 32,
                height: small ? 24 : 32,
                fontSize: small ? 12 : 16,
              }}
            />
            <Typography
              to={`/user/expert-groups/${expertGroup.id}`}
              component={Link}
              sx={{
                ...(small
                  ? theme.typography.labelSmall
                  : theme.typography.semiBoldLarge),
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
        </Box>
        <Box mt={small ? 1.5 : 4}>
          <Typography
            component="div"
            textAlign="justify"
            sx={{
              ...(small
                ? theme.typography.bodyMedium
                : theme.typography.bodyLarge),
              fontFamily: languageDetector(summary)
                ? farsiFontFamily
                : secondaryFontFamily,
            }}
            dangerouslySetInnerHTML={{
              __html: `${truncatedSummary}${isSummaryTruncated}`,
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: small ? 1 : 2,
          mt: small ? 1 : undefined,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: small ? "4px" : { xs: 1, sm: 4 },
            bgcolor: "#EDF0F2",
            borderRadius: 2,
            px: small ? 1 : 2,
            py: small ? 0.5 : 1,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              ...styles.centerV,
              gap: small ? "4px" : 1,
            }}
          >
            <PriceIcon
              color={
                isPrivate
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main
              }
              width={small ? "1rem" : undefined}
              height={small ? "1rem" : undefined}
            />
            <Typography variant={small ? "bodySmall" : "titleSmall"}>
              <Trans i18nKey="free" />
            </Typography>
          </Box>

          <Box
            sx={{
              ...styles.centerV,
              gap: small ? "4px" : 1,
            }}
          >
            <LanguageIcon
              sx={{
                fontSize: small ? "1rem" : { xs: "20px", sm: "26px" },
                color: isPrivate
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
              }}
            />
            <Typography variant={small ? "bodySmall" : "titleSmall"}>
              {formatLanguageCodes(languages, i18next.language)}{" "}
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={(e) => createAssessment(e, id, title)}
          variant="contained"
          size={small ? "small" : "large"}
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
  );
};

export default AssessmentKitsStoreCard;

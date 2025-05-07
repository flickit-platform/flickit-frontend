import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@config/theme";
import LanguageIcon from "@mui/icons-material/Language";
import PriceIcon from "@utils/icons/priceIcon";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import AssessmentCEFromDialog from "@components/assessments/AssessmentCEFromDialog";
import useDialog from "@utils/useDialog";
import ContactUsDialog from "@components/assessment-kit/ContactUsDialog";
import { styles } from "@styles";
import i18next, { t } from "i18next";
import IconButton from "@mui/material/IconButton";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { formatLanguageCodes } from "@/utils/languageUtils";

interface IlistOfItems {
  icon: any;
  title: string;
  description: string;
}

const AssessmentKitAside = (props: any) => {
  const { id, title, like, languages } = props;
  const dialogProps = useDialog();
  const contactusDialogProps = useDialog();
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();

  const listOfItems: IlistOfItems[] = [
    {
      icon: (
        <PriceIcon
          color={theme.palette.primary.dark}
          width={"33px"}
          height={"33px"}
        />
      ),
      title: "price",
      description: "free",
    },

    {
      icon: (
        <LanguageIcon
          sx={{
            color: theme.palette.primary.dark,
            width: "33px",
            height: "33px",
          }}
        />
      ),
      title: "supportedLanguages",
      description: formatLanguageCodes(languages, i18next.language) ?? "-",
    },
  ];

  const likeQueryData = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.like(args ?? { id: assessmentKitId }, config),
    runOnMount: false,
  });

  const createAssessment = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dialogProps.openDialog({
      type: "create",
      staticData: { assessment_kit: { id, title } },
    });
  };

  const toggleLike = async () => {
    await likeQueryData.query();
  };
  let likeStatus: boolean = likeQueryData?.data?.liked ?? like?.liked;

  return (
    <>
      <Box position="sticky" top={60}>
        <Box
          sx={{
            ...styles.shadowStyle,
            pb: 2,
            px: 3,
            pt: 4,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
            {listOfItems.map((item) => {
              return <InfoBox {...item} key={item.title} />;
            })}
          </Box>
          <Box>
            <Button
              onClick={(e) => createAssessment(e)}
              variant="contained"
              size="large"
              sx={{
                width: "100%",
              }}
            >
              <Trans i18nKey="createNewAssessment" />
            </Button>
            <Box sx={{ ...styles.centerVH, mt: 1, gap: 1 }}>
              <Typography
                sx={{ ...theme.typography.bodySmall, color: "#2B333B" }}
              >
                <Trans i18nKey={"haveAnyQuestions"} />
              </Typography>
              <Typography
                sx={{
                  ...theme.typography.bodySmall,
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() =>
                  contactusDialogProps.openDialog({ context: undefined })
                }
              >
                <Trans i18nKey={"contactUs"} />
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              ...theme.typography.bodySmall,
              ...styles.centerVH,
              gap: 1,
              color: "#2B333B",
              mt: "8px",
              textAlign: "center",
            }}
          >
            <Trans
              i18nKey={likeStatus ? "youLikedThisKit" : "didYouLikeThisKit"}
            />
            <IconButton
              size="small"
              onClick={toggleLike}
              sx={{
                transform: theme.direction === "rtl" ? "scaleX(-1)" : "none",
                background: likeStatus
                  ? theme.palette.primary.light
                  : "inherit",
                "&:hover": {
                  background: likeStatus
                    ? theme.palette.primary.light
                    : "#EAF2FB",
                },
              }}
            >
              {likeStatus ? (
                <ThumbUpIcon color="primary" fontSize="small" />
              ) : (
                <ThumbUpOffAltOutlinedIcon color="primary" fontSize="small" />
              )}
            </IconButton>
          </Typography>
        </Box>
      </Box>
      <AssessmentCEFromDialog {...dialogProps} />
      <ContactUsDialog {...contactusDialogProps} />
    </>
  );
};

export default AssessmentKitAside;

const InfoBox = (props: any) => {
  const { icon, title, description } = props;
  return (
    <Box sx={{ ...styles.centerV, gap: "12px" }}>
      {icon}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          sx={{ ...theme.typography.semiBoldSmall, color: "#6C8093" }}
        >
          {t(`${title}`)}
        </Typography>
        <Typography
          sx={{
            ...theme.typography.bodyLarge,
            color: "#2B333B",
            textAlign: "justify",
          }}
        >
          {t(`${description}`)}
        </Typography>
      </Box>
    </Box>
  );
};

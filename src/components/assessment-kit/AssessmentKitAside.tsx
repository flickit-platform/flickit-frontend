import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import target from "@assets/svg/target.svg";
import Typography from "@mui/material/Typography";
import { theme } from "@config/theme";
import LanguageIcon from "@utils/icons/languageIcon";
import PeopleIcon from "@utils/icons/peopleIcon";
import PriceIcon from "@utils/icons/priceIcon";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import AssessmentCEFromDialog from "@components/assessments/AssessmentCEFromDialog";
import useDialog from "@utils/useDialog";
import ContactUsDialog from "@components/assessment-kit/ContactUsDialog";
import { styles } from "@styles";
import { t } from "i18next";
import IconButton from "@mui/material/IconButton";
import LikeIcon from "@utils/icons/likeIcon";

interface IlistOfItems {
  Icon: string | ((props: string) => JSX.Element);
  title: string;
  description: string;
}

const listOfItems: IlistOfItems[] = [
  {
    Icon: target,
    title: "kitGoal",
    description:
      "Enhance the ficency of development proccess with utilicing each step with propper tools",
  },
  {
    Icon: PeopleIcon,
    title: "whoCanUseThisBest",
    description: "Anyone/teams who wants to boost the software developmnt",
  },
  {
    Icon: LanguageIcon,
    title: "supportedLanguages",
    description: "Farsi & English",
  },
  { Icon: PriceIcon, title: "price", description: "free" },
];

const AssessmentKitAside = (props: any) => {
  const { id, title, likeQueryData, like } = props;
  const dialogProps = useDialog();
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
    <Grid item xs={12} md={3}>
      <Box
        sx={{
          background: "#E8EBEE",
          border: "1px solid #668099",
          borderRadius: "8px",
          pt: 4,
          pb: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
          {listOfItems.map((item) => {
            return <InfoBox {...item} />;
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
              <Trans i18nKey={"anyQuestions"} />
            </Typography>
            <Typography
              sx={{
                ...theme.typography.bodySmall,
                color: theme.palette.primary.main,
                cursor: "pointer",
              }}
              onClick={() => dialogProps.openDialog({})}
            >
              <Trans i18nKey={"contactUs"} />
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography
        sx={{
          ...theme.typography.bodySmall,
          ...styles.centerVH,
          gap: 1,
          color: "#2B333B",
          mt: "12px",
          textAlign: "center",
        }}
      >
        <Trans i18nKey={likeStatus ? "youLikedThisKit" : "doYouLikeThisKit"} />
        <IconButton
          onClick={toggleLike}
          sx={{
            p: 0,
            width: "24px",
            height: "24px",
            background: likeStatus ? theme.palette.primary.main : "inherit",
            "&:hover": {
              background: likeStatus ? theme.palette.primary.main : "#EAF2FB",
            },
          }}
        >
          {likeStatus ? (
            <LikeIcon sx={{ color: "#fff", width: "20px", height: "20px" }} />
          ) : (
            <LikeIcon
              sx={{
                color: theme.palette.primary.main,
                width: "20px",
                height: "20px",
              }}
            />
          )}
        </IconButton>
      </Typography>
      <AssessmentCEFromDialog {...dialogProps} />
      <ContactUsDialog {...dialogProps} />
    </Grid>
  );
};

export default AssessmentKitAside;

const InfoBox = (props: any) => {
  const { Icon, title, description } = props;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <Box sx={{ width: "40px", height: "40px" }}>
        {typeof Icon === "string" && Icon !== "" ? (
          <img
            style={{ width: "40px", height: "40px" }}
            src={Icon}
            alt={`${Icon}-icon`}
          />
        ) : (
          <Icon
            sx={{
              color: theme.palette.primary.dark,
              width: "40px",
              height: "40px",
            }}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          sx={{ ...theme.typography.semiBoldSmall, color: "#6C8093" }}
        >
          {t(`${title}`)}
        </Typography>
        <Typography sx={{ ...theme.typography.bodyLarge, color: "#2B333B" }}>
          {t(`${description}`)}
        </Typography>
      </Box>
    </Box>
  );
};

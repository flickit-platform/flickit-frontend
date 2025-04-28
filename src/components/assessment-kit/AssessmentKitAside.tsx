import React from "react";
import Box from "@mui/material/Box";
import target from "@assets/svg/target.svg";
import Typography from "@mui/material/Typography";
import { theme } from "@config/theme";
import LanguageIcon from "@mui/icons-material/Language";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PriceIcon from "@utils/icons/priceIcon";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import AssessmentCEFromDialog from "@components/assessments/AssessmentCEFromDialog";
import useDialog from "@utils/useDialog";
import ContactUsDialog from "@components/assessment-kit/ContactUsDialog";
import { styles } from "@styles";
import { t } from "i18next";
import IconButton from "@mui/material/IconButton";
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import { SvgIconProps } from '@mui/material';
import { useQuery } from "@utils/useQuery";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";

interface IlistOfItems {
  Icon: string | ((props: string) => JSX.Element) | React.ElementType<SvgIconProps>;
  title: string;
  description: string;
}

const AssessmentKitAside = (props: any) => {
  const { id, title, like, metadata } = props;
  const dialogProps = useDialog();
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();

  const listOfItems: IlistOfItems[] = [
    {
      Icon: target,
      title: "kitGoal",
      description: metadata.goal ?? "" ,
    },
    {
      Icon: PeopleAltOutlinedIcon,
      title: "whoCanUseThisBest",
      description: metadata?.context ?? "",
    },
    {
      Icon: LanguageIcon,
      title: "supportedLanguages",
      description: "Farsi & English",
    },
    { Icon: PriceIcon, title: "price", description: "free" },
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
              onClick={() => dialogProps.openDialog({context: undefined})}
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
            p: 1,
            width: "24px",
            height: "24px",
            background: likeStatus ? theme.palette.primary.main : "inherit",
            "&:hover": {
              background: likeStatus ? theme.palette.primary.main : "#EAF2FB",
            },
          }}
        >
          {likeStatus ? (
            <ThumbUpOffAltOutlinedIcon sx={{ color: "#fff", fontSize: "20px" }} />
          ) : (
            <ThumbUpOffAltOutlinedIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: "20px"
              }}
            />
          )}
        </IconButton>
      </Typography>
     { dialogProps.context && <AssessmentCEFromDialog {...dialogProps} /> }
     { dialogProps.context == undefined && <ContactUsDialog {...dialogProps} /> }
    </>
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
        <Typography sx={{ ...theme.typography.bodyLarge, color: "#2B333B", textAlign: "justify" }}>
          {t(`${description}`)}
        </Typography>
      </Box>
    </Box>
  );
};

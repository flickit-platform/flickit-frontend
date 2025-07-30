import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@config/theme";
import LanguageIcon from "@mui/icons-material/Language";
import PriceIcon from "@utils/icons/priceIcon";
import { Trans } from "react-i18next";
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
import { useConfigContext } from "@providers/ConfgProvider";
import keycloakService from "@/service/keycloakService";
import { useEffect, useState } from "react";
import NewAssessmentDialog from "@components/assessment-kit/NewAssessmentDialog";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAssessmentCreation } from "@/hooks/useAssessmentCreation";
import PurchasedIcon from "@utils/icons/purchasedIcon";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { usePurchaseDialog } from "@/hooks/usePurchaseDialog";

interface IlistOfItems {
  field: boolean;
  icon: any;
  title?: string;
  description: string;
}

const AssessmentKitAside = (props: any) => {
  const { id, title, like, languages, status } = props;
  const dialogProps = useDialog();
  const contactusDialogProps = useDialog();
  const dialogPurchaseProps = usePurchaseDialog(title);
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();

  const {
    config: { isAuthenticated },
  }: any = useConfigContext();

  const [loading, setLoading] = useState(false);

  const listOfItems: IlistOfItems[] = [
    {
      field: status === "free",
      icon: (
        <PriceIcon
          color={theme.palette.primary.dark}
          width={"33px"}
          height={"33px"}
        />
      ),
      description: "common.free",
    },
    {
      field: status === "purchased",
      icon: (
        <PurchasedIcon
          color={theme.palette.primary.dark}
          width={"33px"}
          height={"33px"}
        />
      ),
      description: "common.purchased",
    },
    {
      field: status === "paid",
      icon: (
        <PaidOutlinedIcon
          sx={{
            color: theme.palette.primary.dark,
            width: "33px",
            height: "33px",
          }}
        />
      ),
      description: "common.paid",
    },
    {
      field: true,
      icon: (
        <LanguageIcon
          sx={{
            color: theme.palette.primary.dark,
            width: "33px",
            height: "33px",
          }}
        />
      ),
      title: "common.supportedLanguages",
      description: formatLanguageCodes(languages, i18next.language) ?? "-",
    },
  ];

  const likeQueryData = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.like(args ?? { id: assessmentKitId }, config),
    runOnMount: false,
  });
  const { createOrOpenDialog } = useAssessmentCreation({
    openDialog: dialogProps.openDialog,
  });

  useEffect(() => {
    const openModalAuto = async () => {
      const params = new URLSearchParams(window.location.hash.split("?")[1]);
      const idParam = params?.get("id");
      if (window.location.hash.startsWith("#createAssessment")) {
        if (idParam && !dialogProps.open) {
          if (keycloakService.isLoggedIn()) {
            createOrOpenDialog({
              id,
              title,
              languages,
              setLoading,
            });
          } else {
            keycloakService.doLogin();
          }
        }
      } else if (window.location.hash.startsWith("#purchaseAssessment")) {
        if (idParam && !dialogPurchaseProps.open) {
          if (keycloakService.isLoggedIn()) {
            dialogPurchaseProps.openDialog({});
          } else {
            keycloakService.doLogin();
          }
        }
      }
    };
    openModalAuto();
  }, []);
  const createAssessment = async (e: any) => {
    setLoading(true);

    if (keycloakService.isLoggedIn()) {
      createOrOpenDialog({
        id,
        title,
        languages,
        setLoading,
      });
    } else {
      setLoading(false);
      window.location.hash = `#createAssessment?id=${id}`;
      keycloakService.doLogin();
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "paid") {
      dialogPurchaseProps.openDialog({});
    } else {
      createAssessment(e);
    }
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
            pb: isAuthenticated ? 2 : 4,
            px: 3,
            pt: 4,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
            {listOfItems
              .filter((filter) => filter.field)
              .map((item) => {
                return <InfoBox {...item} key={item.field} />;
              })}
          </Box>
          <Box>
            <LoadingButton
              onClick={(e) => handleClick(e)}
              loading={loading}
              variant="contained"
              size="large"
              sx={{
                width: "100%",
              }}
            >
              <Trans
                i18nKey={
                  status === "paid"
                    ? "common.purchase"
                    : "assessment.createNewAssessment"
                }
              />
            </LoadingButton>
            <Box sx={{ ...styles.centerVH, mt: 1, gap: 1 }}>
              <Typography
                sx={{ ...theme.typography.bodySmall, color: "#2B333B" }}
              >
                <Trans i18nKey="assessmentKit.haveAnyQuestions" />
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
                <Trans i18nKey="common.contactUs" />
              </Typography>
            </Box>
          </Box>
          {isAuthenticated && (
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
                i18nKey={
                  likeStatus
                    ? "assessmentKit.youLikedThisKit"
                    : "assessmentKit.didYouLikeThisKit"
                }
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
          )}
        </Box>
      </Box>
      {dialogProps.open && <NewAssessmentDialog {...dialogProps} />}
      <ContactUsDialog {...contactusDialogProps} />
      {dialogPurchaseProps.open && (
        <ContactUsDialog {...dialogPurchaseProps} title={title} />
      )}
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
        {title && (
          <Typography variant="semiBoldSmall" color="#6C8093">
            {t(`${title}`)}
          </Typography>
        )}
        <Typography
          variant="bodyLarge"
          color="#2B333B"
          sx={{
            textAlign: "justify",
          }}
        >
          {t(`${description}`)}
        </Typography>
      </Box>
    </Box>
  );
};

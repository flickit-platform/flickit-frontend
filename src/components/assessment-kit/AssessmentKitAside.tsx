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
import { useNavigate, useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { formatLanguageCodes } from "@/utils/languageUtils";
import { useConfigContext } from "@providers/ConfgProvider";
import keycloakService from "@/service/keycloakService";
import { useEffect, useState } from "react";
import AssessmentKitQModeDialog from "@components/assessment-kit/AssessmentKitQModeDialog";
import { useConnectAutocompleteField } from "@common/fields/AutocompleteAsyncField";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import LoadingButton from "@mui/lab/LoadingButton";

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
  const navigate = useNavigate();
  const {
    config: { isAuthenticated },
  }: any = useConfigContext();

  const [loading, setLoading] = useState(false)
  const queryDataLang = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getOptions(args, config),
    accessor: "items",
  });

  const queryDataSpaces = useConnectAutocompleteField({
    service: (args, config) => service.space.topSpaces(args, config),
  });

  const fetchData = async (id: any, title: any)=>{

    const kits = await queryDataLang.query();
    const { languages : kitLangs } = kits.find((kit: any) => kit.id == id);
    const spaces = await queryDataSpaces.query()
    if(spaces.length == 1 && kitLangs.length == 1){
      const abortController = new AbortController();
      try {
        const {id: spaceId} = spaces[0]
        const langCode = kitLangs[0].code
        await service.assessments.info
          .create(
            {
              data: {
                spaceId,
                assessmentKitId: id,
                lang: langCode,
                title: langCode == "EN" ? "Untitled" : "بدون عنوان",
              },
            },
            { signal: abortController.signal },
          )
          .then((res: any) => {
            if (window.location.hash) {
              history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search,
              );
            }
            setLoading(false)
            return navigate(
              `/${spaceId}/assessments/1/${res.data?.id}/questionnaires`,
            );
          });
      }catch (e){
        const err = e as ICustomError;
        setLoading(false)
        toastError(err);
        return () => {
          abortController.abort();
        };
      }
    }else {
      setLoading(false)
      dialogProps.openDialog({
        type: "create",
        staticData: { assessment_kit: { id, title }, langList: kitLangs, spaceList : spaces,  },
      });
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
    }
  }



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

  useEffect(() => {
    const openModalAuto = async () => {
      if (window.location.hash.startsWith("#createAssessment")) {
        const params = new URLSearchParams(window.location.hash.split("?")[1]);
        const idParam = params.get("id");
        const titleParam = params.get("title");

        if (idParam && titleParam && !dialogProps.open) {
          if (keycloakService.isLoggedIn()) {
            fetchData(idParam, titleParam)
          } else {
            keycloakService.doLogin();
          }
        }
      }
    }
    openModalAuto()
  }, []);
  const createAssessment = async (e: any) => {
    setLoading(true)
    e.preventDefault();
    e.stopPropagation();

    if (keycloakService.isLoggedIn()) {
      fetchData(id, title)
    } else {
      setLoading(false)
      window.location.hash = `#createAssessment?id=${id}&title=${encodeURIComponent(title)}`;
      keycloakService.doLogin();
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
            {listOfItems.map((item) => {
              return <InfoBox {...item} key={item.title} />;
            })}
          </Box>
          <Box>
            <LoadingButton
              onClick={(e) => createAssessment(e)}
              loading={loading}
              variant="contained"
              size="large"
              sx={{
                width: "100%",
              }}
            >
              <Trans i18nKey="createNewAssessment" />
            </LoadingButton>
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
          )}
        </Box>
      </Box>
      {dialogProps.open && <AssessmentKitQModeDialog {...dialogProps} />}
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

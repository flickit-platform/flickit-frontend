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
import { Avatar } from "@mui/material";
import stringAvatar from "@/utils/stringAvatar";
import { formatLanguageCodes } from "@/utils/languageUtils";
import keycloakService from "@/service/keycloakService";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@utils/useQuery";
import {useConnectAutocompleteField} from "@common/fields/AutocompleteAsyncField";
import {useServiceContext} from "@providers/ServiceProvider";
import {ICustomError} from "@utils/CustomError";
import setServerFieldErrors from "@utils/setServerFieldError";
import toastError from "@utils/toastError";
import LoadingButton from "@mui/lab/LoadingButton";

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

  const navigate = useNavigate();
  const { service } = useServiceContext();
    const [loading, setLoading] = useState(false)
    const queryDataLang = useQuery({
        service: (args, config) =>
            service.assessmentKit.info.getOptions(args, config),
        accessor: "items",
    });

    const queryDataSpaces = useConnectAutocompleteField({
        service: (args, config) => service.space.topSpaces(args, config),
    });


  const handleKitClick = (id: any, title: any) => {
    (window as any).dataLayer.push({
      event: "ppms.cm:trackEvent",
      parameters: {
        category: "Kit List",
        action: "Click",
        name: title,
        value: id,
      },
    });
  };

  const createAssessment = async (e: any, id: any, title: any) => {
    setLoading(true)
    e.preventDefault();
    e.stopPropagation();
    handleKitClick(id, title);
      const kits = await queryDataLang.query();
      const { languages } = kits.find((kit: any) => kit.id == id);
      const spaces = await queryDataSpaces.query()

    if (keycloakService.isLoggedIn()) {
        if(spaces.length == 1 && languages.length == 1){
            const abortController = new AbortController();
            try {
               let {id: spaceId} = spaces[0]
               let langCode = languages[0].code
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
            window.location.hash = `#createAssessment?id=${id}&title=${encodeURIComponent(title)}`;
            openDialog.openDialog({
                type: "create",
                staticData: { assessment_kit: { id, title }, langList: languages, spaceList : spaces,  },
            });
        }
    } else {
      setLoading(false)
      keycloakService.doLogin();
    }
  };

  useEffect(() => {
    if (window.location.hash.startsWith("#createAssessment")) {
      const params = new URLSearchParams(window.location.hash.split("?")[1]);
      const idParam = params.get("id");
      const titleParam = params.get("title");

      if (
        idParam === id?.toString() &&
        titleParam &&
        props.openDialog &&
        !props.openDialog.open
      ) {
        if (keycloakService.isLoggedIn()) {
          props.openDialog.openDialog({
            type: "create",
            staticData: {
              assessment_kit: {
                id: idParam,
                title: decodeURIComponent(titleParam),
              },
            },
          });
          window.location.hash = "";
        } else {
          keycloakService.doLogin();
        }
      }
    }
  }, []);

  const truncatedSummaryLength = small ? 150 : 297;
  const truncatedSummary = summary.substring(0, truncatedSummaryLength);
  const isSummaryTruncated =
    summary.length > truncatedSummaryLength ? "..." : "";

  return (
    <Box
      to={small ? `./../${id}/` : `${id}/`}
      component={Link}
      sx={{
        ...styles.shadowStyle,
        borderRadius: 2,
        height: "100%",
        mb: small ? "8px !important" : { xs: "12px", sm: "40px  !important" },
        borderLeft: `4px solid ${
          isPrivate ? theme.palette.secondary.main : theme.palette.primary.main
        }`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        textDecoration: "unset",
        color: "inherit",
        p: small ? "12px 24px" : { xs: "24px", sm: "32px" },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            mb={small ? 0.5 : ""}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 1,
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
            <Box
              sx={{
                ...styles.centerV,
              }}
              gap={small ? 0.5 : 1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (keycloakService.isLoggedIn()) {
                  navigate(`/user/expert-groups/${expertGroup.id}`);
                } else {
                  keycloakService.doLogin();
                }
              }}
            >
              <Avatar
                {...stringAvatar(expertGroup.title?.toUpperCase())}
                src={expertGroup.picture}
                sx={{
                  width: small ? 20 : 32,
                  height: small ? 20 : 32,
                  fontSize: small ? 12 : 16,
                }}
              />
              <Typography
                sx={{
                  ...(small
                    ? theme.typography.labelSmall
                    : theme.typography.semiBoldLarge),
                  color: "#6C8093",
                  textDecoration: "none",
                  fontFamily: languageDetector(expertGroup.title)
                    ? farsiFontFamily
                    : secondaryFontFamily,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
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
        <Box mt={1}>
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
              mt: { xs: "8px", sm: small ? "8px" : "32px" },
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
            width: { xs: "100%", sm: "unset" },
            justifyContent: "center",
            gap: small ? "4px" : { xs: "48px", md: "8px", lg: "48px" },
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
              width={small ? "16px" : "32px"}
              height={small ? "16px" : "32px"}
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

        <LoadingButton
          onClick={(e) => createAssessment(e, id, title)}
          loading={loading}
          variant="contained"
          size={small ? "small" : "large"}
          sx={{
            width: { xs: "100%", sm: "unset" },
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
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default AssessmentKitsStoreCard;

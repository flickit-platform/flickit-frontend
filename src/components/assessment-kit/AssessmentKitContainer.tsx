import Box from "@mui/material/Box";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { useConfigContext } from "@providers/ConfgProvider";
import QueryData from "@common/QueryData";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentKitIntro from "@components/assessment-kit/AssessmentKitIntro";
import Grid from "@mui/material/Grid";
import AssessmentKitAside from "@components/assessment-kit/AssessmentKitAside";
import { styles } from "@styles";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import PermissionControl from "../common/PermissionControl";
import SemiCircleChartap from "../common/charts/SemiCircleChart";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/languageDetector";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";
import { useEffect, useRef } from "react";
import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "../common/SupTitleBreadcrumb";
import AssessmentKitSubjects from "./AssessmentKitSubjects";
import LoadingAssessmentKit from "../common/loadings/LoadingSkeletonAssessmentKit";
import keycloakService from "@/service/keycloakService";
import useScreenResize from "@/utils/useScreenResize";

const AssessmentKitContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const isAuthenticated = keycloakService.isLoggedIn();
  const ref = useRef<any>(null);

  const assessmentKitQuery = useQuery({
    service: (args, config) =>
      isAuthenticated
        ? service.assessmentKit.info.getById(
            args ?? { id: assessmentKitId },
            config,
          )
        : service.assessmentKit.info.getPublicById(
            args ?? { id: assessmentKitId },
            config,
          ),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const { config } = useConfigContext();

  useEffect(() => {
    if(ref.current){
      assessmentKitQuery.query();
    }else{
      ref.current = assessmentKitId
    }
}, [assessmentKitId]);

  return (
    <PermissionControl error={[assessmentKitQuery.errorObject]}>
      <QueryData
        {...assessmentKitQuery}
        renderLoading={() => <LoadingAssessmentKit />}
        render={(assessmentKitQueryData) => {
          setDocumentTitle(
            `${t("assessmentKit.assessmentKit")}: ${assessmentKitQueryData.title ?? ""}`,
            config.appTitle,
          );
          return (
            <AssessmentKit assessmentKitQueryData={assessmentKitQueryData} />
          );
        }}
      />
    </PermissionControl>
  );
};

export default AssessmentKitContainer;

const AssessmentKit = (props: any) => {
  const { assessmentKitQueryData } = props;
  const {
    title: assessmentTitle,
    id,
    expertGroup,
    like,
    subjects,
    metadata,
    languages,
  } = assessmentKitQueryData ?? {};

  const isMobileScreen = useScreenResize("md");

  return (
    <>
      <AssessmentKitBanner assessmentTitle={assessmentTitle} {...expertGroup} />
      <Box
        sx={{
          py: 4,
          px: { xxl: 30, xl: 20, lg: 12, xs: 2, sm: 3 },
        }}
      >
        <Grid container>
          <Grid
            container
            item
            xs={12}
            md={12}
            lg={9}
            sx={{
              paddingInlineEnd: { xs: 0, md: 3 },
              paddingBlockEnd: { xs: 2, md: 0 },
            }}
          >
            <Grid item xs={12} md={12} lg={12}>
              <AssessmentKitIntro {...assessmentKitQueryData} />
            </Grid>
            <Typography
              sx={{ color: "#2B333B" }}
              variant="titleLarge"
              mt={5}
              mb={1}
            >
              <Trans i18nKey={"kitStructure"} />
            </Typography>
            <Typography sx={{ color: "#2B333B" }} variant="bodyMedium">
              <Trans
                i18nKey={
                  isMobileScreen
                    ? "kitStructureDescriptionWithoutChart"
                    : "kitStructureDescription"
                }
              />
            </Typography>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              display={{ xs: "none", sm: "block" }}
              height={{ md: "450px", lg: "460px", xl: "500px", xxl: "550px" }}
              mt={2}
            >
              <SemiCircleChartap items={subjects} childrenField="attributes" />
            </Grid>
            <Grid item xs={12} md={12} lg={12} mt={1}>
              <AssessmentKitSubjects {...assessmentKitQueryData} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={3}>
            <AssessmentKitAside
              like={like}
              id={id}
              title={assessmentTitle}
              metadata={metadata}
              languages={languages}
            />
          </Grid>
          <Typography sx={{ color: "#2B333B" }} variant="titleLarge" my={4}>
            <Trans i18nKey={"exploreOtherKits"} />
          </Typography>
          <Grid item xs={12} md={12} lg={12}>
            <AssessmentKitsStoreListCard small />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

const AssessmentKitBanner = (props: any) => {
  const {
    assessmentTitle,
    title: expertGroupTitle,
    id: expertGroupId,
    pictureLink,
  } = props;

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "#2466A814",
        width: "100%",
        pt: 4,
        pb: 2,
        gap: 2,
        px: { xxl: 30, xl: 20, lg: 12, xs: 2, sm: 3 },
      }}
    >
      <Title
        backLink={"/"}
        size="large"
        wrapperProps={{
          sx: {
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "flex-end" },
          },
        }}
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: t("kitLibrary") as string,
                to: `/assessment-kits`,
              },
              { title: assessmentTitle },
            ]}
            displayChip
          />
        }
      ></Title>
      <Box
        sx={{
          ...styles.centerCV,
        }}
        gap={2}
      >
        <Typography
          sx={{
            ...theme.typography.headlineLarge,
            color: theme.palette.primary.main,
            fontFamily: languageDetector(assessmentTitle)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {assessmentTitle}
        </Typography>
        <Box sx={{ ...styles.centerV, gap: 0.5 }}>
          <Avatar
            {...stringAvatar(expertGroupTitle?.toUpperCase())}
            src={pictureLink}
            sx={{ width: 24, height: 24, fontSize: 16 }}
          ></Avatar>
          <Typography
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (keycloakService.isLoggedIn()) {
                navigate(`/user/expert-groups/${expertGroupId}`);
              } else {
                keycloakService.doLogin();
              }
            }}
            sx={{
              ...theme.typography.semiBoldLarge,
              color: "#2B333B",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {t("createdBy")}{" "}
            <span
              style={{
                fontFamily: languageDetector(expertGroupTitle)
                  ? farsiFontFamily
                  : primaryFontFamily,
              }}
            >
              {expertGroupTitle}
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

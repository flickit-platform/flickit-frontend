import Box from "@mui/material/Box";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import { useConfigContext } from "@/providers/config-provider";
import QueryData from "@common/QueryData";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import AssessmentKitIntro from "@components/assessment-kit/AssessmentKitIntro";
import Grid from "@mui/material/Grid";
import AssessmentKitAside from "@components/assessment-kit/AssessmentKitAside";
import { styles } from "@styles";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@/utils/string-avatar";
import PermissionControl from "../common/PermissionControl";
import SemiCircleChartap from "../common/charts/SemiCircleChart";
import { Trans } from "react-i18next";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";
import { useEffect, useRef } from "react";
import SupTitleBreadcrumb from "../common/SupTitleBreadcrumb";
import AssessmentKitSubjects from "./AssessmentKitSubjects";
import LoadingAssessmentKit from "../common/loadings/LoadingSkeletonAssessmentKit";
import keycloakService from "@/service/keycloakService";
import useScreenResize from "@/hooks/useScreenResize";
import Title from "@common/Title";
import { Text } from "../common/Text";

type PurchaseStatus = "free" | "paid" | "purchased";

const getPurchaseStatus = (
  isFree: boolean,
  hasAccess: boolean,
): PurchaseStatus => {
  if (isFree && hasAccess) return "free";
  return hasAccess ? "purchased" : "paid";
};

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
    if (ref.current) {
      assessmentKitQuery.query();
    } else {
      ref.current = assessmentKitId;
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
    isFree,
    hasAccess,
  } = assessmentKitQueryData ?? {};

  const isMobileScreen = useScreenResize("md");

  return (
    <>
      <AssessmentKitBanner assessmentTitle={assessmentTitle} {...expertGroup} />
      <Box py={4} px={{ xxl: 30, xl: 20, lg: 12, xs: 2, sm: 3 }}>
        <Grid container>
          <Grid
            size={{ xs: 12, md: 12, lg: 9 }}
            sx={{
              paddingInlineEnd: { xs: 0, md: 3 },
              paddingBlockEnd: {xs: 2, md: 0 }
            }}
          >
            <Grid size={{xs: 12, md: 12, lg: 12}}>
              <AssessmentKitIntro {...assessmentKitQueryData} />
            </Grid>
            <Text color="text.primary" variant="titleLarge" mt={5} mb={1}>
              <Trans i18nKey="assessmentKit.kitStructure" />
            </Text>
            <Text color="text.primary" variant="bodyMedium">
              <Trans
                i18nKey={
                  isMobileScreen
                    ? "assessmentKit.kitStructureDescriptionWithoutChart"
                    : "assessmentKit.kitStructureDescription"
                }
              />
            </Text>
            <Grid
              size={{xs: 12, md: 12, lg: 12}}
              sx={{display: { xs: "none", sm: "block" }, height: { md: "450px", lg: "460px", xl: "500px", xxl: "550px" }, mt: 2}}
            >
              <SemiCircleChartap items={subjects} childrenField="attributes" />
            </Grid>
            <Grid size={{xs: 12, md: 12, lg: 12}} mt={1}>
              <AssessmentKitSubjects {...assessmentKitQueryData} />
            </Grid>
          </Grid>
          <Grid size={{xs: 12, md: 12, lg: 3}}>
            <AssessmentKitAside
              like={like}
              id={id}
              title={assessmentTitle}
              metadata={metadata}
              languages={languages}
              status={getPurchaseStatus(isFree, hasAccess)}
            />
          </Grid>
          <Text color="text.primary" variant="titleLarge" my={4}>
            <Trans i18nKey="assessmentKit.exploreOtherKits" />
          </Text>
          <Grid size={{xs: 12, md: 12, lg: 12}}>
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
      display="flex"
      flexDirection="column"
      bgcolor="#2466A814"
      width="100%"
      pt={4}
      pb={2}
      gap={2}
      px={{ xxl: 30, xl: 20, lg: 12, xs: 2, sm: 3 }}
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
                title: t("common.kitLibrary") as string,
                to: `/assessment-kits`,
              },
              { title: assessmentTitle },
            ]}
            displayChip
          />
        }
      ></Title>
      <Box sx={{ ...styles.centerCV }} gap={2}>
        <Text variant="headlineLarge" color="primary.main">
          {assessmentTitle}
        </Text>

        <Box sx={{ ...styles.centerV, gap: 0.5 }}>
          <Avatar
            {...stringAvatar(expertGroupTitle?.toUpperCase())}
            src={pictureLink}
            sx={{ width: 24, height: 24, fontSize: 16 }}
          ></Avatar>
          <Text
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (keycloakService.isLoggedIn()) {
                navigate(`/user/expert-groups/${expertGroupId}`);
              } else {
                keycloakService.doLogin();
              }
            }}
            variant="semiBoldLarge"
            color="text.primary"
            sx={{
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {t("common.createdBy")}{" "}
            <Text variant="semiBoldLarge" color="text.primary">
              {expertGroupTitle}{" "}
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

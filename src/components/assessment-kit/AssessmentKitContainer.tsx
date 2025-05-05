import Box from "@mui/material/Box";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { useConfigContext } from "@providers/ConfgProvider";
import QueryData from "@common/QueryData";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import AssessmentKitIntro from "@components/assessment-kit/AssessmentKitIntro";
import Grid from "@mui/material/Grid";
import AssessmentKitAside from "@components/assessment-kit/AssessmentKitAside";
import { styles } from "@styles";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import PermissionControl from "../common/PermissionControl";
import MindMap from "../common/charts/MindMap";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/languageDetector";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";
import { useEffect } from "react";
import Title from "@common/TitleComponent";
import SupTitleBreadcrumb from "../common/SupTitleBreadcrumb";
import AssessmentKitSubjects from "./AssessmentKitSubjects";
import LoadingAssessmentKit from "../common/loadings/LoadingSkeletonAssessmentKit";

const AssessmentKitContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const assessmentKitQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getById(
        args ?? { id: assessmentKitId },
        config,
      ),
    toastError: false,
    toastErrorOptions: { filterByStatus: [404] },
  });
  const { config } = useConfigContext();

  useEffect(() => {
    assessmentKitQuery.query();
  }, [assessmentKitId]);
  return (
    <PermissionControl error={[assessmentKitQuery.errorObject]}>
      <QueryData
        {...assessmentKitQuery}
        renderLoading={() => <LoadingAssessmentKit />}
        render={(assessmentKitQueryData) => {
          setDocumentTitle(
            `${t("assessmentKit")}: ${assessmentKitQueryData.title ?? ""}`,
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
    expertGroupId,
    about = "",
    like,
    subjects,
    metadata,
    languages,
  } = assessmentKitQueryData ?? {};
  const { service } = useServiceContext();
  const expertGroupQueryData = useQuery({
    service: (args, config) =>
      service.expertGroups.info.getById(args ?? { id: expertGroupId }, config),
  });

  return (
    <QueryData
      {...expertGroupQueryData}
      loading={false}
      render={(data) => {
        return (
          <>
            <AssessmentKitBanner assessmentTitle={assessmentTitle} {...data} />
            <Box
              sx={{
                py: 4,
                px: { xl: 30, lg: 12, xs: 2, sm: 3 },
              }}
            >
              <Grid container>
                <Grid
                  container
                  item
                  xs={12}
                  md={9.3}
                  lg={9.3}
                  sx={{
                    paddingInlineEnd: { xs: 0, md: 3 },
                    paddingBlockEnd: { xs: 2, md: 0 },
                  }}
                >
                  <Grid item xs={12} md={12} lg={12}>
                    <AssessmentKitIntro {...assessmentKitQueryData} />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    display={{ xs: "none", sm: "block" }}
                  >
                    <MindMap
                      items={subjects}
                      childrenField="attributes"
                      title={t("kitStructure")}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} mt={2}>
                    <AssessmentKitSubjects {...assessmentKitQueryData} />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={2.7} lg={2.7}>
                  <AssessmentKitAside
                    like={like}
                    id={id}
                    title={assessmentTitle}
                    metadata={metadata}
                    languages={languages}
                  />
                </Grid>

                <Typography
                  sx={{ color: "#2B333B" }}
                  variant="titleLarge"
                  my={4}
                >
                  <Trans i18nKey={"exploreOtherKits"} />
                </Typography>
                <Grid item xs={12} md={12} lg={12}>
                  <AssessmentKitsStoreListCard small />
                </Grid>
              </Grid>
            </Box>
          </>
        );
      }}
    />
  );
};

const AssessmentKitBanner = (props: any) => {
  const {
    assessmentTitle,
    title: expertGroupTitle,
    id: expertGroupId,
    pictureLink,
  } = props;

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
        px: { xl: 30, lg: 12, xs: 2, sm: 3 },
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
        gap={1}
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
            sx={{ width: 32, height: 32, fontSize: 16 }}
          ></Avatar>
          <Typography
            component={Link}
            to={`/user/expert-groups/${expertGroupId}`}
            sx={{
              ...theme.typography.semiBoldLarge,
              color: "#2B333B",
              textDecoration: "none",
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

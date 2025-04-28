import Box from "@mui/material/Box";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { farsiFontFamily, primaryFontFamily, theme } from "@config/theme";
import Typography from "@mui/material/Typography";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { useConfigContext } from "@providers/ConfgProvider";
import QueryData from "@common/QueryData";
import setDocumentTitle from "@utils/setDocumentTitle";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import AssessmentKitAbout from "@components/assessment-kit/AssessmentKitAbout";
import Grid from "@mui/material/Grid";
import AssessmentKitAside from "@components/assessment-kit/AssessmentKitAside";
import { styles } from "@styles";
import Avatar from "@mui/material/Avatar";
import stringAvatar from "@utils/stringAvatar";
import IconButton from "@mui/material/IconButton";
import PermissionControl from "../common/PermissionControl";
import MindMap from "../common/charts/MindMap";
import { Trans } from "react-i18next";
import languageDetector from "@/utils/languageDetector";
import AssessmentKitsStoreListCard from "./AssessmentKitsStoreListCard";
import { useEffect } from "react";

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
                py: 6,
                px: { xs: 1, md: 8 },
              }}
            >
              <Typography sx={{ color: "#2B333B" }} variant="titleLarge">
                <Trans i18nKey={"aboutThisKit"} />
              </Typography>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  md={8}
                  lg={9}
                  sx={{ paddingInlineEnd: { xs: 4, md: 9 } }}
                >
                  <AssessmentKitAbout about={about} />
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
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
                  display={{ xs: "none", sm: "block" }}
                >
                  <Trans i18nKey={"kitStructure"} />
                </Typography>
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
                <Typography
                  sx={{ color: "#2B333B" }}
                  variant="titleLarge"
                  mb={4}
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
        py: 6,
        paddingInlineStart: { xs: 1, md: 8 },
        gap: 5,
      }}
    >
      <Box sx={{ ...styles.centerV, gap: "8px" }}>
        <IconButton sx={{ ...styles.centerV }} component={Link} to={"./../"}>
          <ArrowBackRoundedIcon
            fontSize={"large"}
            sx={{
              color: theme.palette.primary.dark,
              transform: theme.direction == "rtl" ? "rotate(180deg)" : "",
            }}
          />
        </IconButton>
        <Typography
          sx={{
            ...theme.typography.headlineLarge,
            color: theme.palette.primary.dark,
            fontFamily: languageDetector(assessmentTitle)
              ? farsiFontFamily
              : primaryFontFamily,
          }}
        >
          {assessmentTitle}
        </Typography>
      </Box>
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
          {t("createdBy")} {expertGroupTitle}
        </Typography>
      </Box>
    </Box>
  );
};

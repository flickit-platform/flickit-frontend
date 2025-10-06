import { Text } from "@/components/common/Text";
import { AssessmentKitStatsType } from "@/types";
import { getReadableDate } from "@/utils/readable-date";
import {
  AssignmentOutlined,
  Edit,
  FavoriteBorderOutlined,
  FileDownloadOutlined,
  FileUploadOutlined,
  Language,
} from "@mui/icons-material";
import { Box, Button, Divider, Grid, useTheme } from "@mui/material";
import { styles } from "@styles";
import { t } from "i18next";
import PriceIcon from "@common/icons/Price";
import uniqueId from "@/utils/unique-id";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";
import { useParams } from "react-router-dom";
import showToast from "@/utils/toast-error";
import { ICustomError } from "@/utils/custom-error";
import UpdateAssessmentKitDialog from "./UpdateAssessmentKitDialog";
import useDialog from "@/hooks/useDialog";

const KitDetailsAside = ({
  stats,
  languages,
  assessmentKitTitle,
}: {
  stats: AssessmentKitStatsType;
  languages: string;
  assessmentKitTitle: string;
}) => {
  const infoBoxData = {
    "common.maturityLevel": stats.maturityLevelsCount,
    "common.subjects": stats.subjects?.map((sub: any) => sub?.title)?.length,
    "common.attributes": stats.attributesCount,
    "common.questionnaires": stats.questionnairesCount,
    "common.questions": stats.questionsCount,
    "assessmentKit.numberMeasures": stats.measuresCount,
  };
  const theme = useTheme();
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const dialogProps = useDialog();

  const fetchAssessmentKitDownloadUrlQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.dsl.getDownloadUrl(
        args ?? { assessmentKitId },
        config,
      ),
    runOnMount: false,
  });

  const handleDownloadDSL = async () => {
    try {
      const response = await fetchAssessmentKitDownloadUrlQuery.query();
      const fileUrl = response.url;
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = `${assessmentKitTitle ?? "download"}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  return (
    <Grid container rowSpacing={2} columnSpacing={3} position="sticky" top={60}>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            ...styles.centerCH,
            background: "#fff",
            borderRadius: "12px",
            py: 2,
            flex: 1,
          }}
        >
          <Text variant="bodyMedium" color="background.onVariant">
            {t("common.creationDate")}
          </Text>
          <Text variant="semiBoldLarge" color="background.on">
            {getReadableDate(stats.creationTime)}
          </Text>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            ...styles.centerCH,
            background: "#fff",
            borderRadius: "12px",
            py: 2,
            flex: 1,
          }}
        >
          <Text variant="bodyMedium" color="background.onVariant">
            {t("common.lastUpdated")}
          </Text>
          <Text variant="semiBoldLarge" color="background.on">
            {getReadableDate(stats.lastModificationTime)}
          </Text>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            ...styles.centerCVH,
            background: "#fff",
            borderRadius: "12px",
            flex: 1,
            paddingInlineStart: 4,
            paddingInlineEnd: 3,
          }}
        >
          <Grid container rowGap={3} paddingBlock={2}>
            {[...Object.entries(infoBoxData)].map(
              ([title, value], index, arr) => {
                const isLastInRow = (index + 1) % 3 === 0;
                const isLastItem = index === arr.length - 1;
                const shouldShowDivider = !isLastInRow && !isLastItem;

                return (
                  <>
                    <Grid
                      key={title}
                      item
                      xs={6}
                      md={3.95}
                      sx={{ position: "relative" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Text variant="bodyMedium" color="background.onVariant">
                          {t(title)}
                        </Text>
                        <Text variant="semiBoldLarge" color="background.on">
                          {value}
                        </Text>
                      </Box>
                    </Grid>
                    {shouldShowDivider && (
                      <Divider orientation="vertical" flexItem />
                    )}
                  </>
                );
              },
            )}
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <FullRow
          firstTitle={t("common.supportedLanguages")}
          secondTitle={t("common.price")}
          firstValue={languages}
          secondValue={t("common.free")}
          xs={12}
          firstIcon={
            <Language
              sx={{
                color: "primary.main",
                width: "32px",
                height: "32px",
              }}
            />
          }
          secondIcon={
            <PriceIcon
              color={theme.palette.primary.dark}
              width="32px"
              height="32px"
            />
          }
        />{" "}
      </Grid>
      <Grid item xs={12}>
        <FullRow
          firstTitle={t("assessmentKit.createdAssessments")}
          secondTitle={t("common.liked")}
          firstValue={stats.assessmentCounts}
          secondValue={
            <>
              {stats.likes} {t("common.times")}
            </>
          }
          xs={12}
          firstIcon={
            <AssignmentOutlined
              sx={{
                color: "primary.main",
                width: "32px",
                height: "32px",
              }}
            />
          }
          secondIcon={
            <FavoriteBorderOutlined
              sx={{ color: theme.palette.primary.dark }}
              width="32px"
              height="32px"
            />
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Button disabled fullWidth variant="contained" startIcon={<Edit />}>
          <Text variant="semiBoldLarge">{t("assessment.editKit")}</Text>
        </Button>
      </Grid>
      <Grid item xs={12} md={5.7}>
        <Button
          onClick={handleDownloadDSL}
          variant="outlined"
          fullWidth
          startIcon={<FileDownloadOutlined />}
        >
          <Text variant="semiBoldLarge">
            {t("assessmentKit.downloadDSLKit")}
          </Text>
        </Button>
      </Grid>
      <Grid item xs={12} md={6.3}>
        <Button
          onClick={() => dialogProps.openDialog({})}
          variant="outlined"
          fullWidth
          startIcon={<FileUploadOutlined />}
        >
          <Text variant="semiBoldLarge">{t("assessmentKit.updateDSLKit")}</Text>
        </Button>
      </Grid>
      <UpdateAssessmentKitDialog {...dialogProps} />
    </Grid>
  );
};

const FullRow = (props: any) => {
  const {
    firstTitle,
    secondTitle,
    firstValue,
    secondValue,
    firstIcon,
    secondIcon,
  } = props;

  return (
    <Box
      sx={{
        ...styles.centerV,
        alignItems: "center",
        background: "#fff",
        borderRadius: "12px",
        p: 2,
        flex: 1,
      }}
    >
      <Grid container>
        {[
          { title: firstTitle, value: firstValue, Icon: firstIcon },
          { title: secondTitle, value: secondValue, Icon: secondIcon },
        ].map(({ title, value, Icon }, index) => (
          <Grid item xs={index % 2 === 0 ? 7 : 5} key={uniqueId()}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {Icon}
              <Box sx={{ ...styles.centerCV }}>
                <Text variant="bodyMedium" color="background.onVariant">
                  {title}
                </Text>
                <Text variant="semiBoldLarge" color="background.on">
                  {value}
                </Text>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default KitDetailsAside;

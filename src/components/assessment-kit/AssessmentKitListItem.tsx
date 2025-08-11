import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { FLAGS, TId, TQueryFunction } from "@/types/index";
import { ICustomError } from "@utils/CustomError";
import useMenu from "@utils/useMenu";
import { useQuery } from "@utils/useQuery";
import MoreActions from "@common/MoreActions";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link, useNavigate, useParams } from "react-router-dom";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import languageDetector from "@/utils/languageDetector";
import { getReadableDate } from "@utils/readableDate";
import flagsmith from "flagsmith";
import showToast from "@utils/toastError";
import { useTheme } from "@mui/material";
interface IAssessmentKitListItemProps {
  data: {
    id: TId;
    title: string;
    lastModificationTime: string;
    is_active: boolean;
    isPrivate?: boolean;
    draftVersionId?: TId;
  };
  fetchAssessmentKits?: TQueryFunction;
  link?: string;
  hasAccess?: boolean;
  is_member?: boolean;
  is_active?: boolean;
}

const AssessmentKitListItem = (props: IAssessmentKitListItemProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const showGroups =
    flagsmith.hasFeature(FLAGS.display_expert_groups) || !flagsmith.initialised;
  const { service } = useServiceContext();
  const cloneAssessmentKit = useQuery({
    service: (args, config) => service.assessmentKit.info.clone(args, config),
    runOnMount: false,
  });
  const { data, fetchAssessmentKits, hasAccess, link, is_member, is_active } =
    props;
  const { id, title, lastModificationTime, isPrivate, draftVersionId } =
    data ?? {};
  const draftClicked = () => {
    !draftVersionId &&
      cloneAssessmentKit.query({ assessmentKitId: id }).then((res: any) => {
        navigate(`kit-designer/${res?.kitVersionId}`);
      });
    draftVersionId && navigate(`kit-designer/${draftVersionId}`);
  };
  return (
    <Box
      sx={{
        ...styles.centerV,
        boxShadow: (t) => `0 5px 8px -8px ${t.palette.grey[400]}`,
        borderRadius: 2,
        p: 2,
        backgroundColor: "#fbf8fb",
        mb: 1,
      }}
    >
      <Box sx={{ ...styles.centerV, flex: 1 }} alignSelf="stretch">
        <Box
          sx={{
            ...styles.centerCV,

            textDecoration: "none",
            color: (t) => t.palette.primary.dark,
          }}
          alignSelf="stretch"
          component={Link}
          to={link ?? `${id}`}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textDecoration: "none",
              height: "100%",
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
              fontFamily: languageDetector(title)
                ? farsiFontFamily
                : primaryFontFamily,
            }}
          >
            {title}
          </Typography>
          <Typography color="GrayText" variant="body2">
            <Trans i18nKey="common.lastUpdated" />{" "}
            {getReadableDate(lastModificationTime)}
          </Typography>
        </Box>

        <Box
          sx={{
            ...styles.centerV,
            color: "#525252",
            ml: theme.direction === "rtl" ? "unset" : "auto",
            mr: theme.direction !== "rtl" ? "unset" : "auto",
            gap: 1,
          }}
          alignSelf="stretch"
        >
          {isPrivate && (
            <Chip
              label={<Trans i18nKey="common.private" />}
              size="small"
              sx={{
                background: "#7954B3",
                color:theme.palette.background.containerLowest,
              }}
            />
          )}
          {is_active ? (
            <Chip
              label={<Trans i18nKey="common.published" />}
              color="success"
              size="small"
            />
          ) : (
            <Chip label={<Trans i18nKey="common.unpublished" />} size="small" />
          )}
          <Tooltip
            title={
              !draftVersionId && (
                <Trans i18nKey="assessmentKit.noDraftVersion" />
              )
            }
          >
            <div>
              {hasAccess && showGroups && (
                <LoadingButton
                  variant="outlined"
                  size="small"
                  color={!draftVersionId ? "primary" : "inherit"}
                  onClick={draftClicked}
                  loading={cloneAssessmentKit.loading}
                >
                  <Trans
                    i18nKey={
                      !draftVersionId
                        ? "assessmentKit.newDraft"
                        : "assessmentKit.draft"
                    }
                  />
                </LoadingButton>
              )}
            </div>
          </Tooltip>
          {showGroups && (
            <Actions
              assessment_kit={data}
              fetchAssessmentKits={fetchAssessmentKits}
              hasAccess={hasAccess}
              is_member={is_member}
              is_active={is_active}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Actions = (props: any) => {
  const { expertGroupId = "" } = useParams();
  const { assessment_kit, fetchAssessmentKits, hasAccess } = props;
  const { id } = assessment_kit;
  const { service } = useServiceContext();
  const deleteAssessmentKitQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.remove({ id }, config),
    runOnMount: false,
  });

  if (!fetchAssessmentKits) {
    console.warn(
      "fetchAssessmentKits not provided. assessment kit list won't be updated on any action",
    );
  }

  const deleteItem = async (e: any) => {
    try {
      await deleteAssessmentKitQuery.query();
      await fetchAssessmentKits?.query({
        id: expertGroupId,
        size: 10,
        page: 1,
      });
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  };

  return hasAccess ? (
    <MoreActions
      {...useMenu()}
      loading={deleteAssessmentKitQuery.loading}
      items={[
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: deleteItem,
        },
      ]}
    />
  ) : null;
};

export default AssessmentKitListItem;

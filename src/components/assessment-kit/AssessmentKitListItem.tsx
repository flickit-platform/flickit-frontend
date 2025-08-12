import React from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { FLAGS, TId } from "@/types/index";
import useMenu from "@utils/useMenu";
import { useQuery } from "@utils/useQuery";
import MoreActions from "@common/MoreActions";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link, useNavigate } from "react-router-dom";
import { farsiFontFamily, primaryFontFamily } from "@/config/theme";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import languageDetector from "@/utils/languageDetector";
import { getReadableDate } from "@utils/readableDate";
import flagsmith from "flagsmith";
interface IAssessmentKitListItemProps {
  data: {
    id: TId;
    title: string;
    lastModificationTime: string;
    is_active: boolean;
    isPrivate?: boolean;
    draftVersionId?: TId;
  };
  link?: string;
  hasAccess?: boolean;
  is_member?: boolean;
  is_active?: boolean;
  setOpenDeleteDialog: React.Dispatch<React.SetStateAction<{status: boolean, id: TId}>>;
}

const AssessmentKitListItem = (props: IAssessmentKitListItemProps) => {
  const navigate = useNavigate();

  const showGroups =
    flagsmith.hasFeature(FLAGS.display_expert_groups) || !flagsmith.initialised;
  const { service } = useServiceContext();
  const cloneAssessmentKit = useQuery({
    service: (args, config) => service.assessmentKit.info.clone(args, config),
    runOnMount: false,
  });
  const { data, hasAccess, link, is_member, is_active, setOpenDeleteDialog } =
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
      borderRadius={2}
      p={2}
      bgcolor="#fbf8fb"
      mb={1}
      sx={{
        ...styles.centerV,
        boxShadow: (t) => `0 5px 8px -8px ${t.palette.grey[400]}`,
      }}
    >
      <Box flex={1} alignSelf="stretch" sx={{ ...styles.centerV }}>
        <Box
          color="primary.dark"
          alignSelf="stretch"
          component={Link}
          to={link ?? `${id}`}
          sx={{
            ...styles.centerCV,
            textDecoration: "none",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            height="100%"
            alignSelf="stretch"
            sx={{
              textDecoration: "none",
              fontFamily: languageDetector(title)
                ? farsiFontFamily
                : primaryFontFamily,
              ...styles.centerV,
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
          gap={1}
          color="#525252"
          marginInlineStart="auto"
          alignSelf="stretch"
          sx={{ ...styles.centerV }}
        >
          {isPrivate && (
            <Chip
              label={<Trans i18nKey="common.private" />}
              size="small"
              sx={{
                bgcolor: "#7954B3",
                color: "background.containerLowest",
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
              hasAccess={hasAccess}
              is_member={is_member}
              is_active={is_active}
              setOpenDeleteDialog={setOpenDeleteDialog}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Actions = (props: any) => {
  const { assessment_kit, hasAccess, setOpenDeleteDialog } = props;
  const { id } = assessment_kit;
  const menuProps = useMenu();

  return hasAccess ? (
    <MoreActions
      {...menuProps}
      items={[
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="common.delete" />,
          onClick: ()=> setOpenDeleteDialog({status: true, id}),
        },
      ]}
    />
  ) : null;
};

export default AssessmentKitListItem;

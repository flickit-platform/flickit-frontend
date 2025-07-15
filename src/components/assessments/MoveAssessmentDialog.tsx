import { useMemo, useState } from "react";
import { DialogProps } from "@mui/material/Dialog";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useNavigate } from "react-router-dom";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useQuery } from "@utils/useQuery";
import AutocompleteAsyncField from "@common/fields/AutocompleteAsyncField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import { Grid } from "@mui/material";

interface IAssessmentCEFromDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm?: () => void;
  openDialog?: any;
  context?: any;
}

const MoveAssessmentDialog = (props: IAssessmentCEFromDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [createdKitSpaceId, setCreatedKitSpaceId] = useState(undefined);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    ...rest
  } = props;
  const { type, staticData = {} } = context;
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();

  const close = () => {
    abortController.abort();
    closeDialog();
    !!staticData.assessment_kit &&
      createdKitSpaceId &&
      navigate(`/${createdKitSpaceId}/assessments/1`);
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  const onSubmit = async () => {};

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <Box sx={{ ...styles.centerVH, gap: "6px" }}>
          <DriveFileMoveOutlinedIcon />
          <Trans i18nKey={"assessment.moveAssessment"} />
        </Box>
      }
      titleStyle={{ marginBottom: 0 }}
      style={{ padding: "16px 32px", background: "#F3F5F6" }}
      sx={{
        "& .MuiPaper-root": {
          width: {
            xs: "100%",
            sm: "100%",
            md: "50%",
            lg: "50%",
          },
        },
      }}
    >
      <FormProviderWithForm formMethods={formMethods}>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant="bodyMedium">
              <Trans i18nKey="assessment.createAssessmentConfirmSettings" />
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SpaceField />
          </Grid>
        </Grid>
      </FormProviderWithForm>

      <CEDialogActions
        closeDialog={close}
        submitButtonLabel="common.move"
        loading={loading}
        type={type}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      />
    </CEDialog>
  );
};

export default MoveAssessmentDialog;

const SpaceField = () => {
  const { service } = useServiceContext();
  const spaces = [
    {
      id: 6,
      title: "Flickit Admin Space",
      owner: {
        id: "edc2e295-2964-4cfb-a06a-5eb221586d29",
        displayName: "Flickit Admin",
        isCurrentUserOwner: true,
      },
      type: {
        code: "BASIC",
        title: "Basic",
      },
      isActive: true,
      lastModificationTime: "2023-05-29T11:15:41.61295",
      membersCount: 12,
      assessmentsCount: 9,
    },
    {
      id: 1261,
      title: "Graphical Report",
      owner: {
        id: "edc2e295-2964-4cfb-a06a-5eb221586d29",
        displayName: "Flickit Admin",
        isCurrentUserOwner: true,
      },
      type: {
        code: "BASIC",
        title: "Basic",
      },
      isActive: true,
      lastModificationTime: "2025-03-03T23:12:15.868119",
      membersCount: 4,
      assessmentsCount: 4,
    },
    {
      id: 1523,
      title: "new space",
      owner: {
        id: "edc2e295-2964-4cfb-a06a-5eb221586d29",
        displayName: "Flickit Admin",
        isCurrentUserOwner: true,
      },
      type: {
        code: "BASIC",
        title: "Basic",
      },
      isActive: true,
      lastModificationTime: "2025-06-10T07:08:07.94223",
      membersCount: 1,
      assessmentsCount: 1,
    },
    {
      id: 1214,
      title: "Mazi",
      owner: {
        id: "69f63c1b-6e4c-4cf6-83c6-d8a25fa602ab",
        displayName: "Maziyar Gerami",
        isCurrentUserOwner: false,
      },
      type: {
        code: "BASIC",
        title: "Basic",
      },
      isActive: true,
      lastModificationTime: "2024-04-12T16:21:13.256975",
      membersCount: 3,
      assessmentsCount: 2,
    },
  ];
  const createSpaceQueryData = useQuery({
    service: (args, config) => service.space.create(args, config),
    runOnMount: false,
  });

  const createItemQuery = async (inputValue: any) => {
    const response = await createSpaceQueryData.query({
      title: inputValue,
      type: "BASIC",
    });
    const newOption = { title: inputValue, id: response.id };
    return newOption;
  };

  console.log(spaces);

  return (
    <AutocompleteAsyncField
      {...{ options: spaces }}
      name="space"
      required={true}
      label={<Trans i18nKey="spaces.space" />}
      data-cy="space"
      hasAddBtn={true}
      createItemQuery={createItemQuery}
      searchable={false}
    />
  );
};

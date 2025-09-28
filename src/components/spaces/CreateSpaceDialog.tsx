import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useServiceContext } from "@/providers/service-provider";
import { ICustomError } from "@/utils/custom-error";
import setServerFieldErrors from "@/utils/set-server-field-error";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { t } from "i18next";
import Check from "@/components/common/icons/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SpaceSmallIcon } from "@/components/common/icons/Space";
import UniqueId from "@/utils/unique-id";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/assessment-provider";
import showToast from "@/utils/toast-error";
import { v3Tokens } from "@/config/tokens";
import { styles } from "@styles";

const PremiumBox = [
  {
    type: "PREMIUM",
    title: "spaces.premiumSpace",
    subTitle: "spaces.limitlessSpace",
    bullets: [
      "spaces.paidVariesByPlan",
      "spaces.unlimitedPremiumSpace",
      "spaces.unlimitedAssessmentPerSpace",
      "spaces.fullAccessToCommercialAssessmentKits",
    ],
  },
];
const BasicBox = [
  {
    type: "BASIC",
    title: "spaces.basicSpace",
    subTitle: "spaces.simpleStart",
    bullets: [
      "spaces.freeToUse",
      "spaces.veryLimitedNumberOfSpaces",
      "spaces.createLimitedAssessments",
      "spaces.noCommercialAssessmentKits",
    ],
  },
];

const CreateSpaceDialog = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [step, setStep] = useState(1);
  const { service } = useServiceContext();
  const {
    onClose: closeDialog,
    onSubmitForm,
    context = {},
    openDialog,
    allowCreateBasic,
    ...rest
  } = props;
  const { type, data = {} } = context;
  const { id: spaceId } = data;
  const { type: spaceDefaultType } = data;
  const defaultValues =
    type === "update" ? data : { title: "", code: nanoid(5) };
  const formMethods = useForm({
    shouldUnregister: true,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const { dispatch, pendingKitData, pendingReportData } = useAssessmentContext();

  useEffect(() => {
    if (!spaceDefaultType?.code) {
      setSelectedType("PREMIUM");
    } else {
      setSelectedType(spaceDefaultType?.code);
    }
  }, [spaceDefaultType?.code]);

  const close = () => {
    if (step === 2) {
      if (pendingKitData?.id) {
        dispatch(
          assessmentActions.setPendingKit({
            ...pendingKitData,
            display: true,
          }),
        );
      }
      if (pendingReportData?.spaceId) {
        dispatch(
            assessmentActions.setPendingShareReport({
              ...pendingReportData,
              display: true,
            }),
        );
      }
    }
    abortController.abort();
    closeDialog();
    setSelectedType("");
    setStep(1);
  };

  const onSubmit = async (data: any, event: any) => {
    data = { ...data, type: selectedType };
    setLoading(true);
    try {
      if (type === "update") {
        await service.space.update(
          { spaceId, data },
          { signal: abortController.signal },
        );
        await service.space.markAsSeen({ spaceId }, {});
        close();
      } else {
        await service.space.create(data);
        showToast(t("spaces.spaceCreatedSuccessfully"), { variant: "success" });
        close();
      }
      onSubmitForm();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
      setServerFieldErrors(err, formMethods);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openDialog) {
      if (type === "update") {
        setStep(2);
      } else if (type === "create" && step === 2) {
        setStep(1);
      } else if (type === "create" && step !== 3) {
        setSelectedType("PREMIUM");
      }
    }
  }, [openDialog]);

  const renderStepOne = () => (
    <Box sx={{ pt: 4, px: 4, pb: 0, height: "100%" }}>
      <Typography variant="semiBoldLarge" color="text.primary">
        <Trans i18nKey="spaces.selectYourSpaceType" />
      </Typography>
      <Box sx={{ py: 2, height: "82%" }}>
        <Grid container spacing={{ xs: 5, sm: 10, md: 3 }}>
          {[PremiumBox, BasicBox].map((list, idx) => (
            <Grid
              item
              xs={12}
              md={6}
              key={UniqueId()}
              mt={{ xs: list === BasicBox ? 5 : 0, sm: 0 }}
            >
              {list.map((item) => (
                <BoxType
                  key={item.type}
                  {...item}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  allowCreateBasic={allowCreateBasic}
                />
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            data-testid="next-step-modal"
            onClick={() => setStep(2)}
          >
            <Typography>
              <Trans i18nKey="common.next" />
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const renderStepTwo = () => (
    <Box sx={{ pt: 4, px: 4, pb: 0, height: "100%" }}>
      <Typography variant="semiBoldLarge" color="text.primary">
        <Trans i18nKey="spaces.setAName" />
      </Typography>
      <FormProviderWithForm formMethods={formMethods} style={{ height: "96%" }}>
        <Box
          sx={{
            minHeight: "290px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Grid sx={{ m: "32px" }} item>
            <InputFieldUC
              name="title"
              defaultValue={defaultValues.title ?? ""}
              placeholder={t("spaces.spaceName") ?? ""}
              required
              label={<Trans i18nKey="user.name" />}
              isFocused={isFocused}
            />
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <CEDialogActions
              closeDialog={close}
              hideCancelButton
              loading={loading}
              hasBackBtn={type !== "update"}
              onBack={() => setStep(1)}
              backType="text"
              type={type}
              onSubmit={() => formMethods.handleSubmit(onSubmit)()}
            />
          </Box>
        </Box>
      </FormProviderWithForm>
    </Box>
  );

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        step === 3 ? null : (
          <>
            <CreateNewFolderRoundedIcon sx={{ marginInlineEnd: 1 }} />
            <Trans
              i18nKey={
                type === "update" ? "spaces.updateSpace" : "spaces.createSpace"
              }
            />
          </>
        )
      }
    >
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
    </CEDialog>
  );
};

const getBorderStyle = (
  isSelected: boolean,
  isPremium: boolean,
  isBasic: boolean,
) => {
  if (isSelected) {
    return isPremium
      ? `1px solid ${v3Tokens.primary.main}`
      : "1px solid #668099";
  }
  return `1px solid ${v3Tokens.outline?.variant}`;
};

const getBackgroundStyle = (
  isSelected: boolean,
  isPremium: boolean,
  isBasic: boolean,
) => {
  if (isSelected) {
    return isPremium ? "#2466A814" : "#6680991f";
  }
  return "unset";
};

const getHoverBorderColor = (isPremium: boolean, allowCreateBasic: boolean) => {
  if (isPremium) {
    return "#2D80D2";
  } else if (!allowCreateBasic) {
    return v3Tokens.outline.variant;
  }
  return v3Tokens.outline.outline;
};

const getTextColor = (isBasic: boolean, allowCreateBasic: boolean) => {
  if (isBasic) {
    return !allowCreateBasic ? "#3D4D5C80" : v3Tokens.surface.on;
  }
  return "unset";
};

const BoxType = ({
  setSelectedType,
  selectedType,
  allowCreateBasic,
  title,
  subTitle,
  bullets,
  type,
}: any) => {
  useEffect(() => {
    if (!allowCreateBasic) {
      setSelectedType("PREMIUM");
    }
  }, []);
  const isSelected = selectedType === type;
  const isPremium = type === "PREMIUM";
  const isBasic = type === "BASIC";

  const border = getBorderStyle(isSelected, isPremium, isBasic);
  const background = getBackgroundStyle(isSelected, isPremium, isBasic);
  const hoverBorderColor = getHoverBorderColor(isPremium, allowCreateBasic);
  const textColor = getTextColor(isBasic, allowCreateBasic);

  const handleSelect = () => {
    if (!allowCreateBasic && isBasic) return;
    setSelectedType(type);
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border,
        height: "100%",
        p: 2,
        cursor: allowCreateBasic || isPremium ? "pointer" : "unset",
        background,
        "&:hover": {
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: hoverBorderColor,
        },
        position: "relative",
      }}
      onClick={handleSelect}
    >
      <Box sx={{ mb: { xs: 0.1, sm: 1 } }}>
        <Box gap={0.5} sx={{ ...styles.centerV }}>
          <SpaceSmallIcon type={type} allowCreateBasic={allowCreateBasic} />
          <Typography
            variant="semiBoldMedium"
            color={textColor}
            sx={{
              WebkitBackgroundClip: isPremium ? "text" : undefined,
              WebkitTextFillColor: isPremium ? "transparent" : undefined,
              backgroundImage: isPremium
                ? `linear-gradient(to right, #2466A8, #2D80D2, #2466A8 )`
                : undefined,
            }}
          >
            <Trans i18nKey={title} />
          </Typography>
        </Box>
        <Typography
          variant="labelSmall"
          color="background.onVariant"
          sx={{
            mt: { xs: 0.1, sm: 1 },
            paddingInlineStart: 3,
          }}
        >
          <Trans i18nKey={subTitle} />
        </Typography>
      </Box>

      <Box>
        {bullets.map((text: string, index: number) => (
          <Box
            key={UniqueId()}
            gap={{ xs: 0.1, sm: 1 }}
            mb={{ xs: 0.1, sm: 1 }}
            sx={{ ...styles.centerV }}
          >
            <Check type={type} allowCreateBasic={allowCreateBasic} />
            <Typography
              variant="labelSmall"
              color={textColor}
              sx={{
                WebkitBackgroundClip: isPremium ? "text" : undefined,
                WebkitTextFillColor: isPremium ? "transparent" : undefined,
                backgroundImage: isPremium
                  ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
                  : undefined,
              }}
            >
              <Trans i18nKey={text} />
              {!allowCreateBasic && isBasic && index === 1 && (
                <Typography
                  variant="labelSmall"
                  color="error.main"
                  sx={{ display: "inline-block" }}
                >
                  (<Trans i18nKey="spaces.reachedLimit" />)
                </Typography>
              )}
            </Typography>
          </Box>
        ))}
      </Box>

      {isSelected && isPremium && (
        <Box
          color="primary.main"
          position="absolute"
          gap="8px"
          bottom={{ xs: "-45px", md: "-54px" }}
          sx={{
            ...styles.centerVH,
            cursor: "text",
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
          <Typography variant="labelSmall">
            <Trans i18nKey="spaces.spacePremiumInfo" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CreateSpaceDialog;

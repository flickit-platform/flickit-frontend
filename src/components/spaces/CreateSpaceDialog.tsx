import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { Trans } from "react-i18next";
import { InputFieldUC } from "@common/fields/InputField";
import { CEDialog, CEDialogActions } from "@common/dialogs/CEDialog";
import FormProviderWithForm from "@common/FormProviderWithForm";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import setServerFieldErrors from "@utils/setServerFieldError";
import toastError from "@utils/toastError";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import { useNavigate } from "react-router-dom";
import { theme } from "@/config/theme";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import greenCheckmark from "@/assets/svg/greenCheckmark.svg";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";
import Check from "@components/spaces/Icons/check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SpaceSmallIcon } from "@common/icons/spaceSmallIcon";
import UniqueId from "@utils/uniqueId";
import {
  assessmentActions,
  useAssessmentContext,
} from "@/providers/AssessmentProvider";

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
  const [spaceIdNum, setSpaceIdNum] = useState<number>();
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
  const formMethods = useForm({ shouldUnregister: true });
  const abortController = useMemo(() => new AbortController(), [rest.open]);
  const navigate = useNavigate();
  const { dispatch, pendingKitData } = useAssessmentContext();

  useEffect(() => {
    if (!spaceDefaultType?.code) {
      setSelectedType("PREMIUM");
    } else {
      setSelectedType(spaceDefaultType?.code);
    }
  }, [spaceDefaultType?.code]);

  const close = () => {
    if (step === 3) {
      if (pendingKitData?.id) {
        dispatch(
          assessmentActions.setPendingKit({
            ...pendingKitData,
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
        const res = await service.space.create(data);
        setSpaceIdNum(res.data.id);
        setStep(3);
      }
      onSubmitForm();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
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
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          setIsFocused(false);
          setTimeout(() => {
            setIsFocused(true);
          }, 500);
          formMethods.handleSubmit((data) => onSubmit(data, e))();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        abortController.abort();
      };
    }
  }, [openDialog]);

  const goToSpace = () => {
    type !== "update" && navigate(`/${spaceIdNum}/assessments/1`);
    close();
  };

  const renderStepOne = () => (
    <Box sx={{ pt: 4, px: 4, pb: 0, height: "100%" }}>
      <Typography sx={{ ...theme.typography.semiBoldLarge, color: "#2B333B" }}>
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
      <Typography sx={{ ...theme.typography.semiBoldLarge, color: "#2B333B" }}>
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
              onSubmit={(event) =>
                formMethods.handleSubmit((data) => onSubmit(data, event))
              }
            />
          </Box>
        </Box>
      </FormProviderWithForm>
    </Box>
  );

  const renderStepThree = () => (
    <CEDialog {...rest} closeDialog={close} title={null}>
      <Box
        sx={{
          display: "flex",
          pt: 4,
          px: 4,
          height: "100%",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: { xs: 4, sm: 0 },
        }}
      >
        <img
          style={{ padding: "0px 15px" }}
          src={greenCheckmark}
          alt="greenCheckmark"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            px: 4,
            pb: 4,
          }}
        >
          <Typography
            sx={{
              ...theme.typography.headlineMedium,
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundImage:
                "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )",
            }}
          >
            <Trans i18nKey="spaces.congratulation" />
          </Typography>
          <Typography sx={{ ...theme.typography.bodyLarge }}>
            <Trans
              i18nKey={
                selectedType === "PREMIUM"
                  ? "spaces.createPremiumSpaceCongratulation"
                  : "spaces.createBasicSpaceCongratulation"
              }
            />
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginInlineStart: "auto",
          p: 2,
          gap: 2,
        }}
      >
        <Button onClick={close}>
          <Trans i18nKey="common.close" />
        </Button>
        <Button onClick={goToSpace} variant="contained">
          <Typography>
            <Trans i18nKey="spaces.goToSpace" />
          </Typography>
        </Button>
      </Box>
    </CEDialog>
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
              i18nKey={type === "update" ? "spaces.updateSpace" : "spaces.createSpace"}
            />
            <IconButton
              sx={{ color: "#fff", marginInlineStart: "auto" }}
              onClick={close}
              data-testid={"close-btn"}
            >
              <CloseIcon style={{ width: 24, height: 24 }} />
            </IconButton>
          </>
        )
      }
    >
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderStepThree()}
    </CEDialog>
  );
};

const getBorderStyle = (
  isSelected: boolean,
  isPremium: boolean,
  isBasic: boolean,
) => {
  if (isSelected) {
    return isPremium ? "1px solid #2466A8" : "1px solid #668099";
  }
  return "1px solid #C7CCD1";
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
    return "#C7CCD1";
  }
  return "#73808C";
};

const getTextColor = (isBasic: boolean, allowCreateBasic: boolean) => {
  if (isBasic) {
    return !allowCreateBasic ? "#3D4D5C80" : "#2B333B";
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SpaceSmallIcon type={type} allowCreateBasic={allowCreateBasic} />
          <Typography
            sx={{
              ...theme.typography.semiBoldMedium,
              WebkitBackgroundClip: isPremium ? "text" : undefined,
              WebkitTextFillColor: isPremium ? "transparent" : undefined,
              backgroundImage: isPremium
                ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
                : undefined,
              color: textColor,
            }}
          >
            <Trans i18nKey={title} />
          </Typography>
        </Box>
        <Typography
          sx={{
            ...theme.typography.labelSmall,
            color: "#6C8093",
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
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.1, sm: 1 },
              mb: { xs: 0.1, sm: 1 },
            }}
          >
            <Check type={type} allowCreateBasic={allowCreateBasic} />
            <Typography
              sx={{
                ...theme.typography.labelSmall,
                WebkitBackgroundClip: isPremium ? "text" : undefined,
                WebkitTextFillColor: isPremium ? "transparent" : undefined,
                backgroundImage: isPremium
                  ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
                  : undefined,
                color: textColor,
              }}
            >
              <Trans i18nKey={text} />
              {!allowCreateBasic && isBasic && index === 1 && (
                <Typography
                  sx={{
                    ...theme.typography.labelSmall,
                    color: theme.palette.error.main,
                    display: "inline-block",
                  }}
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
          sx={{
            color: theme.palette.primary.main,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            bottom: { xs: "-45px", md: "-54px" },
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
          <Typography sx={{ ...theme.typography.labelSmall }}>
            <Trans i18nKey="spaces.spacePremiumInfo" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CreateSpaceDialog;

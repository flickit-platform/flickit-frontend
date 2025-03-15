import React, { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { DialogProps } from "@mui/material/Dialog";
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
import { Button, Typography } from "@mui/material";
import greenCheckmark from "@/assets/svg/greenCheckmark.svg";
import Box from "@mui/material/Box";
import Check from "@components/spaces/Icons/check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { t } from "i18next";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { SpaceSmallIcon } from "@common/icons/spaceSmallIcon";
import UniqueId from "@utils/uniqueId";

interface ICreateSpaceDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
  titleStyle?: any;
  contentStyle?: any;
  allowCreateBasic?: boolean;
}

const PremiumBox = [
  {
    type: "PREMIUM",
    title: "premiumSpace",
    subTitle: "limitlessSpace",
    bullets: [
      "paidVariesByPlan",
      "unlimitedPremiumSpace",
      "unlimitedAssessmentPerSpace",
      "fullAccessToCommercialAssessmentKits",
    ],
  },
];
const BasicBox = [
  {
    type: "BASIC",
    title: "basicSpace",
    subTitle: "simpleStart",
    bullets: [
      "freeToUse",
      "veryLimitedNumberOfSpaces",
      "createLimitedAssessments",
      "noCommercialAssessmentKits",
    ],
  },
];

const CreateSpaceDialog = (props: ICreateSpaceDialogProps) => {
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

  useEffect(() => {
    if (!spaceDefaultType?.code) {
      setSelectedType("BASIC");
    } else {
      setSelectedType(spaceDefaultType?.code);
    }
  }, [spaceDefaultType?.code]);

  const close = () => {
    abortController.abort();
    closeDialog();
    setSelectedType("");
    setStep(1);
  };

  const onSubmit = async (data: any, event: any, shouldView?: boolean) => {
    data = { ...data, type: selectedType };
    setLoading(true);
    try {
      let createdSpaceId = 1;
      type === "update"
        ? (await service.updateSpace(
            { spaceId, data },
            { signal: abortController.signal },
          )) && (await service.seenSpaceList({ spaceId }, {}))
        : await service
            .createSpace(data, { signal: abortController.signal })
            .then((res) => {
              createdSpaceId = res.data.id;
              setSpaceIdNum(createdSpaceId);
              setStep(3);
            });
      setLoading(false);
      onSubmitForm();
      type == "update" && close();
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      toastError(err);
      setServerFieldErrors(err, formMethods);
    }
  };

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (openDialog) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          setIsFocused(false);
          setTimeout(() => {
            setIsFocused(true);
          }, 500);
          formMethods.handleSubmit((data) =>
            onSubmit(formMethods.getValues(), e),
          )();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        abortController.abort();
      };
    }
  }, [openDialog, formMethods, abortController]);

  const goToSpace = () => {
    type !== "update" && navigate(`/${spaceIdNum}/assessments/1`);
    close();
  };

  if (step == 3) {
    return (
      <CEDialog {...rest} closeDialog={close} title={null}>
        <Box sx={{ display: "flex", pt: 4, px: 4 }}>
          <img
            style={{ padding: "0px 15px" }}
            src={greenCheckmark}
            alt={"greenCheckmark"}
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
              <Trans i18nKey={"congratulation"} />
            </Typography>
            <Typography sx={{ ...theme.typography.bodyLarge }}>
              <Trans
                i18nKey={
                  selectedType == "PREMIUM"
                    ? "createPremiumSpaceCongratulation"
                    : "createBasicSpaceCongratulation"
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
            <Trans i18nKey={"close"} />
          </Button>
          <Button onClick={goToSpace} variant={"contained"}>
            <Typography>
              <Trans i18nKey={"goToSpace"} />{" "}
            </Typography>
          </Button>
        </Box>
      </CEDialog>
    );
  }

  return (
    <CEDialog
      {...rest}
      closeDialog={close}
      title={
        <>
          <CreateNewFolderRoundedIcon
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          {type === "update" ? (
            <Trans i18nKey="updateSpace" />
          ) : (
            <Trans i18nKey="createSpace" />
          )}
          <IconButton
            sx={{ color: "#fff", marginInlineStart: "auto" }}
            onClick={close}
            data-testid={"close-btn"}
          >
            <CloseIcon style={{ width: "24px", height: "24px" }} />
          </IconButton>
        </>
      }
    >
      {step == 1 && (
        <Box sx={{ pt: 4, px: 4, pb: 0 }}>
          <Typography
            sx={{ ...theme.typography.semiBoldLarge, color: "#2B333B" }}
          >
            <Trans i18nKey={"selectYourSpaceType"} />
          </Typography>
          <Box sx={{ py: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {PremiumBox.map((item) => {
                  return (
                    <BoxTypes
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                      {...item}
                    />
                  );
                })}
              </Grid>
              <Grid item xs={12} md={6}>
                {BasicBox.map((item) => {
                  return (
                    <BoxTypes
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                      allowCreateBasic={allowCreateBasic}
                      {...item}
                    />
                  );
                })}{" "}
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                data-testid={"next-step-modal"}
                variant={"contained"}
                onClick={() => setStep(2)}
              >
                <Typography>
                  <Trans i18nKey={"next"} />
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      {step == 2 && (
        <Box sx={{ pt: 4, px: 4, pb: 0, minHeight: "339px", height: "339px" }}>
          <Typography
            sx={{ ...theme.typography.semiBoldLarge, color: "#2B333B" }}
          >
            <Trans i18nKey={"nameYourSpace"} />
          </Typography>
          <FormProviderWithForm
            style={{ height: "calc(100% - 24px)" }}
            formMethods={formMethods}
          >
            <Box
              sx={{
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
                  defaultValue={defaultValues.title || ""}
                  placeholder={`${t("spaceName")}`}
                  required={true}
                  label={<Trans i18nKey="name" />}
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
                  hideCancelButton={true}
                  loading={loading}
                  hasBackBtn={true}
                  onBack={() => setStep(1)}
                  backType={"text"}
                  type={type}
                  onSubmit={(...args) =>
                    formMethods.handleSubmit((data) => onSubmit(data, ...args))
                  }
                />
              </Box>
            </Box>
          </FormProviderWithForm>
        </Box>
      )}
    </CEDialog>
  );
};

const BoxTypes = (props: any) => {
  const {
    setSelectedType,
    selectedType,
    allowCreateBasic,
    title,
    subTitle,
    bullets,
    type,
  } = props;
  useEffect(() => {
    if (!allowCreateBasic) {
      setSelectedType("PREMIUM");
    }
  }, []);

  const select = (type: string) => {
    if (!allowCreateBasic) {
      setSelectedType("PREMIUM");
    } else {
      setSelectedType(type);
    }
  };

  const borderStyle = () => {
    if (selectedType == type && type == "PREMIUM") {
      return "1px solid #2466A8";
    } else if (selectedType == type && type == "BASIC") {
      return "1px solid #668099";
    } else {
      return "1px solid #C7CCD1";
    }
  };

  const bgStyle = () => {
    if (selectedType == type && type == "PREMIUM") {
      return "#2466A814";
    } else if (selectedType == type && type == "BASIC") {
      return "#6680991f";
    } else {
      return "unset";
    }
  };

  const hoverBorderColor = () => {
    if (type == "PREMIUM") {
      return "#2D80D2";
    } else if (type == "BASIC" && !allowCreateBasic) {
      return "#C7CCD1";
    } else {
      return "#73808C";
    }
  };

  const TypographyColor = () => {
      if(type == "BASIC" && allowCreateBasic){
          return "#2B333B"
      }else if(type == "BASIC" && !allowCreateBasic){
          return "#3D4D5C80"
      }else {
          return "unset"
      }
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: borderStyle(),
        height: "100%",
        p: 2,
        cursor: allowCreateBasic ? "pointer" : "unset",
        background: bgStyle(),
        "&:hover": {
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: hoverBorderColor(),
        },
        position: "relative",
      }}
      onClick={() => select(type)}
    >
      <Box sx={{ mb: "13px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <SpaceSmallIcon type={type} allowCreateBasic={allowCreateBasic} />
          <Typography
            sx={{
              ...theme.typography.semiBoldMedium,
              WebkitBackgroundClip: type == "PREMIUM" ? "text" : "unset",
              WebkitTextFillColor: type == "PREMIUM" ? "transparent" : "unset",
              backgroundImage:
                type == "PREMIUM"
                  ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
                  : "unset",
              color: TypographyColor()
            }}
          >
            <Trans i18nKey={title} />
          </Typography>
        </Box>
        <Typography
          sx={{
            ...theme.typography.labelSmall,
            color: "#6C8093",
            mt: 1,
            paddingInlineStart: "24px",
          }}
        >
          <Trans i18nKey={subTitle} />
        </Typography>
      </Box>
      <Box
        sx={{
          WebkitBackgroundClip: type == "PREMIUM" ? "text" : "unset",
          WebkitTextFillColor: type == "PREMIUM" ? "transparent" : "unset",
          backgroundImage:
            type == "PREMIUM"
              ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
              : "unset",
        }}
      >
        {bullets.map((text: string, index: number) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
              key={UniqueId()}
            >
              <Check type={type} allowCreateBasic={allowCreateBasic} />
              <Typography
                sx={{
                  ...theme.typography.labelSmall,
                  color: TypographyColor()
                }}
              >
                <Trans i18nKey={text} />
                {!allowCreateBasic && type == "BASIC" && index == 1 && (
                  <Typography
                    sx={{
                      ...theme.typography.labelSmall,
                      color: theme.palette.error.main,
                      display: "inline-block",
                    }}
                  >
                    (<Trans i18nKey={"reachedLimit"} />).
                  </Typography>
                )}
              </Typography>
            </Box>
          );
        })}
      </Box>
      {selectedType == "PREMIUM" && type == "PREMIUM" && (
        <Box
          sx={{
            color: theme.palette.primary.main,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            bottom: "-40px",
          }}
        >
          <InfoOutlinedIcon fontSize={"small"} />
          <Typography sx={{ ...theme.typography.labelSmall }}>
            <Trans i18nKey={"spacePremiumInfo"} />
          </Typography>
        </Box>
      )}
    </Box>
  );
};
export default CreateSpaceDialog;

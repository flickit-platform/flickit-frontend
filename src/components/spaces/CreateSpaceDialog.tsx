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
import { useQuery } from "@utils/useQuery";
import { ISpaceType } from "@types";
import basicSmallIcon from "@/assets/svg/basicSmallIcon.svg";
import premiumSmallIcon from "@/assets/svg/premiumSmallIcon.svg";
import disableSpaceTypeIcon from "@/assets/svg/disableSpaceTypeIcon.svg";
import greenCheckmark from "@/assets/svg/greenCheckmark.svg";
import Box from "@mui/material/Box";
import Check from "@components/spaces/Icons/check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { t } from "i18next";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ICreateSpaceDialogProps extends DialogProps {
  onClose: () => void;
  onSubmitForm: () => void;
  openDialog?: any;
  context?: any;
  titleStyle?: any;
  contentStyle?: any;
  allowCreateBasic: boolean;
}

const CreateSpaceDialog = (props: ICreateSpaceDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [spaceType, setSpaceType] = useState<ISpaceType[]>([]);
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

  const fetchSpaceType = useQuery({
    service: (args, config) => service.fetchSpaceType(args, config),
    runOnMount: false,
  });

  const allSpacesType = async () => {
    let data = await fetchSpaceType.query();
    if (data) {
      const { spaceTypes: getSpaceType } = data;
      setSpaceType(getSpaceType);
    }
  };

  useEffect(() => {
    allSpacesType().then();
  }, []);

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

  const handleChange = (e: any) => {
    const { value } = e.target;
    setSelectedType(value);
  };
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

  const goToSpace = () => {
    return type !== "update" && navigate(`/${spaceIdNum}/assessments/1`);
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
              {selectedType == "PREMIUM" ? (
                <Trans i18nKey={"createPremiumSpaceCongratulation"} />
              ) : (
                <Trans i18nKey={"createBasicSpaceCongratulation"} />
              )}
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

            {/*<FormProviderWithForm formMethods={formMethods}>*/}
            {/*  <Grid container spacing={2} sx={styles.formGrid}>*/}
            {/*    <Grid item xs={9}>*/}
            {/*      <InputFieldUC*/}
            {/*        name="title"*/}
            {/*        defaultValue={defaultValues.title || ""}*/}
            {/*        required={true}*/}
            {/*        label={<Trans i18nKey="title" />}*/}
            {/*        isFocused={isFocused}*/}
            {/*      />*/}
            {/*    </Grid>*/}
            {/*      <Grid item xs={3}>*/}
            {/*        <FormControl sx={{ width: "100%" }}>*/}
            {/*          <SelectField*/}
            {/*            // disabled={editable != undefined ? !editable : false}*/}
            {/*            id="spaceType-name-label"*/}
            {/*            size="small"*/}
            {/*            label={<Trans i18nKey={"spaceType"} />}*/}
            {/*            value={selectedType || "BASIC"}*/}
            {/*            IconComponent={KeyboardArrowDownIcon}*/}
            {/*            displayEmpty*/}
            {/*            name={"spaceType-select"}*/}
            {/*            defaultValue={spaceType[0]?.title}*/}
            {/*            required={true}*/}
            {/*            nullable={false}*/}
            {/*            input={<OutlinedInput label="spaceType" />}*/}
            {/*            onChange={(e) => handleChange(e)}*/}
            {/*            sx={{*/}
            {/*              fontSize: "14px",*/}
            {/*              background: "#fff",*/}
            {/*              px: "0px",*/}
            {/*              height: "40px",*/}
            {/*              "& .MuiSelect-select": {*/}
            {/*                display: "flex",*/}
            {/*                alignItems: "center",*/}
            {/*                padding: "12px !important",*/}
            {/*                gap: 1,*/}
            {/*              },*/}
            {/*            }}*/}
            {/*          >*/}
            {/*            {spaceType?.map((type: any) => (*/}
            {/*              <MenuItem*/}
            {/*                sx={{*/}
            {/*                  color: "#2B333B",*/}
            {/*                  WebkitBackgroundClip: "text",*/}
            {/*                  WebkitTextFillColor:*/}
            {/*                    type.code == "PREMIUM" ? "transparent" : "unset",*/}
            {/*                  backgroundImage:*/}
            {/*                    type.code == "PREMIUM"*/}
            {/*                      ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"*/}
            {/*                      : "unset",*/}
            {/*                  marginInlineStart: type.code != "PREMIUM" ? "24px" : "unset",*/}
            {/*                }}*/}
            {/*                disabled={type.code == "PREMIUM"}*/}
            {/*                key={type}*/}
            {/*                value={type.code}*/}
            {/*              >*/}
            {/*                {type.code == "PREMIUM" && (*/}
            {/*                  <img*/}
            {/*                    src={premiumIcon}*/}
            {/*                    alt={"premium"}*/}
            {/*                    style={{ width: "16px", height: "21px", marginInlineEnd: "8px" }}*/}
            {/*                  />*/}
            {/*                )}*/}
            {/*                <Trans i18nKey={type.title} />*/}
            {/*              </MenuItem>*/}
            {/*            ))}*/}
            {/*          </SelectField>*/}
            {/*        </FormControl>*/}
            {/*      </Grid>*/}
            {/*  </Grid>*/}
            {/*  <CEDialogActions*/}
            {/*    closeDialog={close}*/}
            {/*    loading={loading}*/}
            {/*    type={type}*/}
            {/*    onSubmit={(...args) =>*/}
            {/*      formMethods.handleSubmit((data) => onSubmit(data, ...args))*/}
            {/*    }*/}
            {/*  />*/}
            {/*</FormProviderWithForm>*/}


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
              <Button variant={"contained"} onClick={() => setStep(2)}>
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
            <Trans i18nKey={"selectYourSpaceType"} />
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

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border:
          selectedType == type && type == "PREMIUM"
            ? "1px solid #2466A8"
            : selectedType == type && type == "BASIC"
              ? "1px solid #668099"
              : "1px solid #C7CCD1",
        height: "100%",
        p: 2,
        cursor: allowCreateBasic ? "pointer" : "unset",
        background:
          selectedType == type && type == "PREMIUM"
            ? "#2466A814"
            : selectedType == type && type == "BASIC"
              ? "#6680991f"
              : "unset",
        "&:hover": {
          // border : type == "b" ? "1px solid #73808C" : "1px solid linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor:
            type == "PREMIUM"
              ? "#2D80D2"
              : type == "BASIC" && !allowCreateBasic
                ? "#C7CCD1"
                : "#73808C",
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
          <img
            style={{ width: "20px", height: "20px" }}
            src={
              type == "PREMIUM"
                ? premiumSmallIcon
                : type == "BASIC" && !allowCreateBasic
                  ? disableSpaceTypeIcon
                  : basicSmallIcon
            }
            alt={"SpaceTypeIcon"}
          />
          <Typography
            sx={{
              ...theme.typography.semiBoldMedium,
              WebkitBackgroundClip: type == "PREMIUM" ? "text" : "unset",
              WebkitTextFillColor: type == "PREMIUM" ? "transparent" : "unset",
              backgroundImage:
                type == "PREMIUM"
                  ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
                  : "unset",
              color:
                type == "BASIC" && allowCreateBasic
                  ? "#2B333B"
                  : type == "BASIC" && !allowCreateBasic
                    ? "#3D4D5C80"
                    : "unset",
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
          // ...styles.centerVH,
          // justifyContent: "flex-start",
          // gap: "8px",
          WebkitBackgroundClip: type == "PREMIUM" ? "text" : "unset",
          WebkitTextFillColor: type == "PREMIUM" ? "transparent" : "unset",
          backgroundImage:
            type == "PREMIUM"
              ? "linear-gradient(to right, #1B4D7E, #2D80D2, #1B4D7E )"
              : "unset",
        }}
      >
        {bullets.map((i: string, index: number) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Check type={type} allowCreateBasic={allowCreateBasic} />
              <Typography
                sx={{
                  ...theme.typography.labelSmall,
                  color:
                    type == "BASIC" && allowCreateBasic
                      ? "#2B333B"
                      : type == "BASIC" && !allowCreateBasic
                        ? "#3D4D5C80"
                        : "unset",
                }}
              >
                <Trans i18nKey={i} />
                {!allowCreateBasic && type == "BASIC" && index == 1 && (
                  <Typography
                    sx={{
                      ...theme.typography.labelSmall,
                      color: theme.palette.error.main,
                      display: "inline-block",
                    }}
                  >
                    (<Trans i18nKey={"reachedLimit"} />)
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

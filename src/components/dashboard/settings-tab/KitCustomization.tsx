import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import firstCharDetector from "@utils/firstCharDetector";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useForm } from "react-hook-form";
import { theme } from "@config/theme";
import KitCustomizationTable from "./kitCustomizationTable";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { toast } from "react-toastify";
import { styles } from "@styles";
import InputCustomEditor from "@common/fields/InputCustomEditor";

const KitCustomization = (props: any) => {
  const { kitInfo } = props;
  const [kitData, setKitData] = useState<any>([]);
  const [edit, setEdit] = useState<any>({ allow: false, idC: {} });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [requiredTitle, setRequiredTitle] = useState<boolean>(false);

  const formMethods = useForm({ shouldUnregister: true });
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const fetchKitCustomization = useQuery({
    service: (args, config) =>
      service.assessmentKit.info.getCustomization(args, config),
    runOnMount: false,
  });
  const fetchKitCustomTitle = useQuery({
    service: (args, config) =>
      service.common.getKitCustomTitle(args ?? { kitInfo }, config),
    runOnMount: false,
  });
  const sendKitCustomization = useQuery({
    service: (args, config) =>
      service.assessments.info.assignKitCustomization(args, config),
    runOnMount: false,
  });
  const updateKitCustomization = useQuery({
    service: (args, config) => service.common.updateKitCustom(args, config),
    runOnMount: false,
  });

  const [initialData, setInitialData] = useState<any>({
    title: "",
    customData: {
      subjects: [],
      attributes: [],
    },
  });

  const [inputData, setInputData] = useState<any>({
    title: "",
    customData: {
      subjects: [],
      attributes: [],
    },
  });

  const [tooltipTitle, setTooltipTitle] = useState<string | JSX.Element>("");

  useEffect(() => {
    if (!hasChanges) {
      setTooltipTitle(<Trans i18nKey={"kitCustomDefaultDataChanged"} />);
    } else {
      setTooltipTitle("");
    }
  }, [inputData.title, hasChanges]);

  useEffect(() => {
    const hasChanges =
      JSON.stringify(inputData) !== JSON.stringify(initialData);
    setHasChanges(hasChanges);
  }, [inputData]);

  useEffect(() => {
    (async () => {
      const { items } = await fetchKitCustomization.query({ kitInfo });
      setKitData(items);

      if (kitInfo?.kitCustomId) {
        let { title, customData } = await fetchKitCustomTitle.query();

        setInputData({
          title,
          customData,
        });

        setInitialData({
          title,
          customData,
        });
      }
    })();
  }, [kitInfo?.kit?.id]);

  const onClose = () => {
    (async () => {
      const { items } = await fetchKitCustomization.query({ kitInfo });
      setKitData(items);
      if (kitInfo?.kitCustomId) {
        let { title, customData } = await fetchKitCustomTitle.query();
        setInputData((prev: any) => ({
          ...prev,
          title,
          customData,
        }));
        setInitialData((prev: any) => ({
          ...prev,
          title,
          customData,
        }));
      }
    })();
  };

  const onSave = () => {
    (async () => {
      if (!inputData.title) {
        setRequiredTitle(true);
      }
      try {
        if (kitInfo.kitCustomId || edit.allow) {
          const {
            kit: { id },
            kitCustomId,
          } = kitInfo;
          const customData = {
            kitId: id,
            ...inputData,
          };

          let UpdateId = kitCustomId ? { kitCustomId: kitCustomId } : edit.idC;
          await updateKitCustomization.query({ UpdateId, customData });
          const { items } = await fetchKitCustomization.query({
            kitInfo,
            customId: UpdateId,
          });
          setKitData(items);
          setHasChanges(false);
          toast.success(
            <Trans
              i18nKey="spaceUpdatedSuccessMessage"
              values={{ title: inputData.title }}
            />,
          );
        } else {
          const customData = inputData;
          const kitCustomId = await sendKitCustomization.query({
            assessmentId,
            customData,
          });
          const { items } = await fetchKitCustomization.query({
            kitInfo,
            customId: kitCustomId,
          });
          setKitData(items);
          setEdit({ allow: true, idC: kitCustomId });
          setHasChanges(false);
          toast.success(
            <Trans
              i18nKey="spaceCreatedSuccessMessage"
              values={{ title: inputData.title }}
            />,
          );
        }
      } catch (e) {
        const err = e as ICustomError;
        toastError(err);
      }
    })();
  };

  return (
    <>
      {!fetchKitCustomization.errorObject?.response && (
        <Box
          sx={{
            ...styles.boxStyle,
            minHeight: "350px",
          }}
          gap={2}
        >
          <Box height={"100%"} width={"100%"}>
            <Typography
              sx={{
                width: "100%",
                display: "inline-block",
              }}
              color="#2B333B"
              variant="headlineSmall"
            >
              <Trans i18nKey={`${"kitCustomization"}`} />
            </Typography>
            <Divider
              sx={{
                width: "100%",
                marginTop: "24px",
                marginBottom: "10px !important",
              }}
            />
            <Grid sx={{ display: "flex", justifyContent: "center" }}>
              <Grid
                item
                xs={12}
                sx={{
                  ...styles.centerVH,
                }}
              >
                <Typography color="#2B333B" variant="semiBoldLarge">
                  <Trans i18nKey="kitCustomTitle" />
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: { md: "350px" },
                  }}
                >
                  <OnHoverInputCustomTitle
                    formMethods={formMethods}
                    inputData={inputData}
                    setInputData={setInputData}
                    editable={true}
                    requiredTitle={requiredTitle}
                    type={"customTitle"}
                  />
                </Box>
              </Grid>
            </Grid>
            <Divider
              sx={{
                width: "100%",
                marginTop: "24px",
                marginBottom: "10px !important",
              }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  ...theme.typography.titleMedium,
                  color: "#2B333B",
                  mb: 1,
                }}
              >
                <Trans i18nKey={"customizingSubjectAndAttributes"} />
              </Typography>
              <Typography
                sx={{
                  ...theme.typography.bodyMedium,
                  color: "#2B333B",
                }}
              >
                <Trans i18nKey={"viewTheWeightAndSubject"} />
              </Typography>
            </Box>
            <Box>
              <KitCustomizationTable
                subjects={kitData}
                inputData={inputData}
                setInputData={setInputData}
              />
            </Box>
            <Grid mt={2} container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button onClick={onClose} data-cy="cancel">
                  <Trans i18nKey="common.cancel" />
                </Button>
              </Grid>
              <Grid item>
                <Tooltip title={tooltipTitle}>
                  <Box>
                    <LoadingButton
                      data-cy="back"
                      variant="contained"
                      disabled={!hasChanges}
                      onClick={onSave}
                      loading={
                        updateKitCustomization.loading ||
                        sendKitCustomization.loading
                      }
                    >
                      <Trans i18nKey="saveChanges" />
                    </LoadingButton>
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};

const OnHoverInputCustomTitle = (props: any) => {
  const [show, setShow] = useState<boolean>(true);
  const [localInputData, setLocalInputData] = useState(() =>
    JSON.parse(JSON.stringify(props.inputData)),
  );
  const {
    inputData,
    setInputData,
    type,
    editable,
    displayEdit,
    requiredTitle,
  } = props;
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setLocalInputData(JSON.parse(JSON.stringify(inputData)));
    if (!inputData.title) {
      setShow(true);
      if (requiredTitle) {
        setHasError(true);
      }
    } else {
      setShow(false);
      setHasError(false);
    }
  }, [inputData, requiredTitle]);

  const handleCancel = () => {
    setShow(false);
    setLocalInputData(JSON.parse(JSON.stringify(inputData)));
    setHasError(false);
  };

  const handleSave = () => {
    if (!localInputData.title.trim()) {
      setHasError(true);
      return;
    }
    setInputData((prev: any) => ({
      ...prev,
      title: localInputData.title,
    }));
    setShow(false);
    setHasError(false);
  };

  let textAlign: "left" | "right" = "left";

  if (type === "title") {
    textAlign = firstCharDetector(localInputData.title) ? "right" : "left";
  }

  const inputProps: React.HTMLProps<HTMLInputElement> = {
    style: {
      textAlign,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalInputData((prev: any) => ({
      ...prev,
      title: value,
    }));
    setHasError(false);
  };

  return (
    <Box>
      <Box
        my={1.5}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          cursor: "pointer",
        }}
        width="100%"
      >
        {editable && show ? (
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "100% " }}
          >
            <InputCustomEditor
              inputProps={inputProps}
              hasError={hasError}
              name={type}
              inputHandler={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              value={localInputData.title}
              handleDone={handleSave}
              handleCancel={handleCancel}
            />
            {hasError && (
              <Typography
                color="error"
                sx={{ fontSize: "0.75rem", marginTop: "4px" }}
              >
                <Trans i18nKey="requiredFieldError" />
              </Typography>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "38px",
              borderRadius: "4px",
              paddingLeft: "8px;",
              paddingRight: "12px;",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              wordBreak: "break-word",
            }}
            onClick={() => setShow(!show)}
          >
            <Typography
              color="#004F83"
              fontWeight={500}
              sx={{ fontSize: { xs: "1rem", sm: "1.375rem" }, mr: 1 }}
              lineHeight={"normal"}
            >
              {inputData.title}
            </Typography>
            {!displayEdit && (
              <EditRoundedIcon
                sx={{ color: "#9DA7B3", position: "absolute", right: -10 }}
                fontSize="small"
                width={"32px"}
                height={"32px"}
                onClick={() => setShow(!show)}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default KitCustomization;

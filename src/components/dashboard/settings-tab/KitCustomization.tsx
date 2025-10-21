import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router";
import { useServiceContext } from "@/providers/service-provider";
import { useQuery } from "@/hooks/useQuery";
import firstCharDetector from "@/utils/first-char-detector";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useForm } from "react-hook-form";
import KitCustomizationTable from "./kitCustomizationTable";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LoadingButton from "@mui/lab/LoadingButton";
import { ICustomError } from "@/utils/custom-error";
import { styles } from "@styles";
import InputCustomEditor from "@common/fields/InputCustomEditor";
import showToast from "@/utils/toast-error";
import { Text } from "@/components/common/Text";

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
      setTooltipTitle(<Trans i18nKey="settings.kitCustomDefaultDataChanged" />);
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
          showToast(
            <Trans
              i18nKey="spaces.spaceUpdatedSuccessMessage"
              values={{ title: inputData.title }}
            />,
            { variant: "success" },
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
          showToast(
            <Trans
              i18nKey="spaces.spaceCreatedSuccessMessage"
              values={{ title: inputData.title }}
            />,
            { variant: "success" },
          );
        }
      } catch (e) {
        const err = e as ICustomError;
        showToast(err);
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
            <Text
              sx={{
                width: "100%",
                display: "inline-block",
              }}
              color="text.primary"
              variant="headlineSmall"
            >
              <Trans i18nKey="settings.kitCustomization" />
            </Text>
            <Divider
              sx={{
                width: "100%",
                marginTop: "24px",
                marginBottom: "10px !important",
              }}
            />
            <Grid sx={{ ...styles.centerH }}>
              <Grid
                item
                xs={12}
                sx={{
                  ...styles.centerVH,
                }}
              >
                <Text color="text.primary" variant="semiBoldLarge">
                  <Trans i18nKey="settings.kitCustomTitle" />
                </Text>

                <Box width={{ md: "350px" }} sx={{ ...styles.centerVH }}>
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
              <Text
                component="div"
                variant="titleMedium"
                color="text.primary"
                sx={{
                  mb: 1,
                }}
              >
                <Trans i18nKey="dashboard.customizingSubjectAndAttributes" />
              </Text>
              <Text variant="bodyMedium" color="text.primary">
                <Trans i18nKey="settings.viewTheWeightAndSubject" />
              </Text>
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
                      <Trans i18nKey="common.saveChanges" />
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
    const { value } = e.target;
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
        justifyContent="space-between"
        position="relative"
        sx={{
          ...styles.centerV,
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
              <Text
                color="error"
                sx={{ fontSize: "0.75rem", marginTop: "4px" }}
              >
                <Trans i18nKey="errors.requiredFieldError" />
              </Text>
            )}
          </Box>
        ) : (
          <Box
            minHeight="38px"
            borderRadius="4px"
            paddingLeft="8px"
            paddingRight="12px"
            width="100%"
            justifyContent="space-between"
            sx={{
              ...styles.centerV,
              wordBreak: "break-word",
            }}
            onClick={() => setShow(!show)}
          >
            <Text
              color="#004F83"
              fontWeight={500}
              sx={{ fontSize: { xs: "1rem", sm: "1.375rem" }, mr: 1 }}
              lineHeight={"normal"}
            >
              {inputData.title}
            </Text>
            {!displayEdit && (
              <EditOutlinedIcon
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

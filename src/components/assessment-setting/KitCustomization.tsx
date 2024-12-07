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
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useForm } from "react-hook-form";
import { theme } from "@config/theme";
import KitCustomizationTable from "@components/assessment-setting/kitCustomizationTable";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { LoadingButton } from "@mui/lab";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { toast } from "react-toastify";

const KitCustomization = (props: any) => {
  const { kitInfo } = props;
  const [kitData, setKitData] = useState<any>([]);
  const [edit, setEdit] = useState<any>({ allow: false, idC: {} });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [requiredTitle, setRequiredTitle] = useState<boolean>(false);

  const formMethods = useForm({ shouldUnregister: true });
  // const { id } = kitInfo
  const { service } = useServiceContext();
  const { assessmentId = "" } = useParams();

  const fetchKitCustomization = useQuery({
    service: (args, config) => service.fetchKitCustomization(args, config),
    runOnMount: false,
  });
  const fetchKitCustomTitle = useQuery({
    service: (args = { kitInfo }, config) =>
      service.fetchKitCustomTitle(args, config),
    runOnMount: false,
  });
  const sendKitCustomization = useQuery({
    service: (args, config) => service.sendKitCustomization(args, config),
    runOnMount: false,
  });
  const updateKitCustomization = useQuery({
    service: (args, config) => service.updateKitCustomization(args, config),
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

  console.log(fetchKitCustomization.errorObject?.response);
  return (
    <>
      {!fetchKitCustomization.errorObject?.response && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            px: { xs: "15px", sm: "51px" },
            textAlign: "left",
          }}
          gap={2}
          textAlign="center"
          height={"auto"}
          minHeight={"350px"}
          width={"100%"}
          bgcolor={"#FFF"}
          borderRadius={"8px"}
          py={"32px"}
        >
          <Box height={"100%"} width={"100%"}>
            <Typography sx={{textAlign:theme.direction == "rtl"? "right": "left",width:"100%",display:"inline-block"}} color="#000" variant="headlineMedium">
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
                // sm={12}
                // md={8}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  color="#9DA7B3"
                  fontWeight={500}
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.375rem" },
                    whiteSpace: { xs: "wrap", sm: "nowrap" },
                  }}
                  lineHeight={"normal"}
                >
                  <Trans i18nKey="kitCustomTitle" />:
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
                sx={{ ...theme.typography.headlineSmall, color: "#000", mb: 1 }}
              >
                <Trans i18nKey={"customizingSubjectAndAttributes"} />
              </Typography>
              <Typography
                sx={{ ...theme.typography.bodyMedium, color: "#2B333B" }}
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
                <Button onClick={onClose} data-cy="cancel" data-testid="cancel">
                  <Trans i18nKey={"cancel"} />
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
            <OutlinedInput
              inputProps={inputProps}
              error={hasError}
              fullWidth
              value={localInputData.title}
              onChange={(e) => {
                setLocalInputData((prev: any) => ({
                  ...prev,
                  title: e.target.value,
                }));
                setHasError(false);
              }}
              required={true}
              multiline={true}
              sx={{
                minHeight: "38px",
                borderRadius: "4px",
                paddingRight: "12px;",
                fontWeight: "700",
                fontSize: "0.875rem",
                "&.MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover": {
                  border: 0,
                  outline: "none",
                },
                "& .MuiOutlinedInput-input:focused": {
                  border: 0,
                  outline: "none",
                },
                "&:hover": { border: "1px solid #79747E" },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    title="Submit Edit"
                    edge="end"
                    sx={{
                      background: "#49CED0",
                      borderRadius: "2px",
                      height: { xs: "26px", sm: "36px" },
                      width: { xs: "26px", sm: "36px" },
                      margin: "3px",
                    }}
                    onClick={handleSave}
                  >
                    <DoneIcon sx={{ color: "#fff" }} />
                  </IconButton>
                  <IconButton
                    title="Cancel Edit"
                    edge="end"
                    sx={{
                      background: "#E04B7C",
                      borderRadius: "2px",
                      height: { xs: "26px", sm: "36px" },
                      width: { xs: "26px", sm: "36px" },
                    }}
                    onClick={handleCancel}
                  >
                    <CloseIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </InputAdornment>
              }
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

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import Setting from "@assets/svg/setting.svg";
import AdviceSlider from "@/components/common/AdviceSlider";
import { theme } from "@/config/theme";
import { useEffect, useState } from "react";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { useQuery } from "@/utils/useQuery";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useParams } from "react-router-dom";
import AdviceQuestionTable from "./AdviceQuestionTable";
import { LoadingSkeletonKitCard } from "@/components/common/loadings/LoadingSkeletonKitCard";

const AdviceDialog = ({
  open,
  handleClose,
  fetchPreAdviceInfo,
  permissions,
  fetchAdviceNarration,
  loading,
}: any) => {
  const [adviceResult, setAdviceResult] = useState<any>([]);
  const [step, setStep] = useState<number>(1); // Step state
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const [target, setTarget] = useState<any>([]);

  const createAdviceQueryData = useQuery<any>({
    service: (args, config) => service.assessments.advice.create(args, config),
    runOnMount: false,
  });

  const createAINarrationQueryData = useQuery<any>({
    service: (args, config) => service.assessments.advice.createAI(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    setAdviceResult([]);
    setStep(1);
  }, [open]);

  const createAdvice = async () => {
    try {
      if (target) {
        const data = await createAdviceQueryData.query({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
        });
        setAdviceResult(data?.items);
        setStep(2);
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const generateAdviceViaAI = async () => {
    try {
      if (target) {
        await createAINarrationQueryData.query({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
          adviceListItems: adviceResult,
        });
        setAdviceResult(null);
        fetchAdviceNarration.query();
        handleClose();
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      fullScreen={false}
      sx={{ overflowY: "auto" }}
    >
      <DialogTitle sx={{ ...styles.centerV }}>
        <>
          <img
            src={Setting}
            alt="settings"
            width="24px"
            style={{
              marginRight: theme.direction === "ltr" ? "6px" : "unset",
              marginLeft: theme.direction === "rtl" ? "6px" : "unset",
            }}
          />
          <Trans i18nKey="advice.adviceAssistant" />
        </>
      </DialogTitle>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: "rgba(36, 102, 168, 0.08)",
          color: "#6C7B8E",
          paddingY: 1,
          paddingX: 4,
          maxWidth: "100%",
          marginTop: "-8px",
        }}
      >
        <Typography variant="titleMedium" fontWeight={400}>
          <Trans i18nKey={step === 1 ? "advice.whichAttYouWant" : "advice.reviewAdvice"} />
        </Typography>
      </Box>

      <DialogContent
        sx={{
          padding: "unset",
          background: "#fff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {(fetchPreAdviceInfo.loading || loading) && (
            <LoadingSkeletonKitCard />
          )}
          <Box
            mt={2}
            px={2}
            sx={{
              borderRadius: { xs: 0, sm: "0 0 12px 12px" },
              background: "#fff",
              height: "300px",
              overflow: "auto",
              overflowX: "hidden",
              display: step === 1 ? "block" : "none",
            }}
          >
            {fetchPreAdviceInfo.data?.attributes?.map((attribute: any) => (
              <AdviceSlider
                key={attribute.id}
                defaultValue={
                  fetchPreAdviceInfo.data?.maturityLevels.find(
                    (maturityLevel: any) =>
                      maturityLevel.id == attribute?.maturityLevel.id,
                  )?.value ?? 0
                }
                currentState={fetchPreAdviceInfo.data?.maturityLevels.find(
                  (maturityLevel: any) =>
                    maturityLevel.id == attribute?.maturityLevel.id,
                )}
                attribute={attribute}
                subject={attribute.subject}
                maturityLevels={fetchPreAdviceInfo.data?.maturityLevels}
                target={target}
                setTarget={setTarget}
              />
            ))}
          </Box>
          <Box
            mt={2}
            sx={{
              borderRadius: { xs: 0, sm: "0 0 12px 12px" },
              background: "#fff",
              maxHeight: "70vh",
              overflow: "hidden",
              overflowX: "auto",
              display: step === 2 ? "block" : "none",
            }}
          >
            <AdviceQuestionTable
              adviceResult={adviceResult}
              setAdviceResult={setAdviceResult}
              handleClose={handleClose}
              target={target}
              permissions={permissions}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 2,
              padding: "16px",
              justifyContent: "flex-end",
            }}
          >
            {step === 2 && (
              <Button
                onClick={handleBack}
                sx={{ mr: "auto" }}
                variant="outlined"
              >
                <Trans i18nKey="common.back" />
              </Button>
            )}
            <Button onClick={handleClose}>
              <Trans i18nKey="common.cancel" />
            </Button>

            <LoadingButton
              variant="contained"
              color="primary"
              onClick={step === 1 ? createAdvice : generateAdviceViaAI}
              loading={
                step === 1
                  ? createAdviceQueryData.loading
                  : createAINarrationQueryData.loading
              }
            >
              <Trans i18nKey={step === 1 ? "common.continue" : "common.finish"} />
            </LoadingButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AdviceDialog;

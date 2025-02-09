import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { Trans } from "react-i18next";
import { styles } from "@/config/styles";
import Setting from "@assets/svg/setting.svg";
import AdviceSlider from "@/components/common/AdviceSlider";
import { theme } from "@/config/theme";
import { useEffect, useState } from "react";
import toastError from "@/utils/toastError";
import { ICustomError } from "@/utils/CustomError";
import { useQuery } from "@/utils/useQuery";
import { ISubjectReportModel } from "@/types";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useParams } from "react-router-dom";
import AdviceQuestionTable from "./AdviceQuestionTable";

const AdviceDialog = ({
  open,
  handleClose,
  subjects,
  filteredMaturityLevels,
  permissions,
  fetchAdviceNarration,
  setAIGenerated,
}: any) => {
  const [adviceResult, setAdviceResult] = useState<any>([]);
  const [step, setStep] = useState<number>(1); // Step state
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const [target, setTarget] = useState<any>([]);

  const createAdviceQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.createAdvice(args, config),
    runOnMount: false,
  });

  const createAINarrationQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.createAINarration(args, config),
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
            alt="setting"
            width="24px"
            style={{
              marginRight: theme.direction === "ltr" ? "6px" : "unset",
              marginLeft: theme.direction === "rtl" ? "6px" : "unset",
            }}
          />
          <Trans i18nKey="adviceAssistant" />
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
          <Trans i18nKey={step === 1 ? "whichAttYouWant" : "reviewAdvice"} />
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
          <Box
            mt={2}
            px={2}
            sx={{
              borderRadius: { xs: 0, sm: "0 0 12px 12px" },
              background: "#fff",
              maxHeight: "60vh",
              overflow: "auto",
              overflowX: "hidden",
              display: step === 1 ? "block" : "none",
            }}
          >
            {subjects?.map((subject: any) =>
              subject?.attributes.map((attribute: any) => (
                <AdviceSlider
                  key={attribute.id}
                  defaultValue={attribute?.maturityLevel?.value || 0}
                  currentState={attribute?.maturityLevel}
                  attribute={attribute}
                  subject={subject}
                  maturityLevels={filteredMaturityLevels}
                  target={target}
                  setTarget={setTarget}
                />
              )),
            )}
          </Box>
          <Box
            mt={2}
            sx={{
              borderRadius: { xs: 0, sm: "0 0 12px 12px" },
              background: "#fff",
              maxHeight: "70vh",
              overflow: "hidden",
              overflowX: "hidden",
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
                <Trans i18nKey="back" />
              </Button>
            )}
            <Button onClick={handleClose}>
              <Trans i18nKey="cancel" />
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
              <Trans i18nKey={step === 1 ? "continue" : "finish"} />
            </LoadingButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AdviceDialog;

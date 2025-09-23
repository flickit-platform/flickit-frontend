import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { Trans } from "react-i18next";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { styles } from "@/config/styles";
import AdviceSlider from "@/components/dashboard/advice-tab/AdviceSlider";
import AdviceQuestionTable from "./AdviceQuestionTable";
import AIGenerated from "@/components/common/icons/AIGenerated";

import { ICustomError } from "@/utils/custom-error";
import showToast from "@/utils/toast-error";
import { useQuery } from "@/hooks/useQuery";
import { useServiceContext } from "@/providers/service-provider";

import {
  CEDialog,
  CEDialogActions,
} from "@/components/common/dialogs/CEDialog";
import { LoadingAdviceTargetsSkeleton } from "@/components/common/loadings/LoadingAdviceTargetsSkeleton";

type AdviceDialogProps = {
  open: boolean;
  handleClose: () => void;
  fetchPreAdviceInfo: any;
  permissions: any;
  fetchAdviceNarration: any;
  loading?: boolean;
};

const AdviceDialog = ({
  open,
  handleClose,
  fetchPreAdviceInfo,
  permissions,
  fetchAdviceNarration,
  loading,
}: AdviceDialogProps) => {
  const [adviceResult, setAdviceResult] = useState<any>([]);
  const [step, setStep] = useState<number>(1);
  const { assessmentId = "" } = useParams();
  const { service } = useServiceContext();
  const [target, setTarget] = useState<any>([]);

  const createAdviceQueryData = useQuery<any>({
    service: (args, config) => service.assessments.advice.create(args, config),
    runOnMount: false,
  });

  const createAINarrationQueryData = useQuery<any>({
    service: (args, config) =>
      service.assessments.advice.createAI(args, config),
    runOnMount: false,
  });

  useEffect(() => {
    if (open) {
      setAdviceResult([]);
      setStep(1);
      setTarget([]);
    }
  }, [open]);

  const createAdvice = async () => {
    try {
      if (target) {
        const data = await createAdviceQueryData.query({
          assessmentId,
          attributeLevelTargets: target,
        });
        setAdviceResult(data?.items);
        setStep(2);
      }
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const generateAdviceViaAI = async () => {
    try {
      if (target) {
        await createAINarrationQueryData.query({
          assessmentId,
          attributeLevelTargets: target,
          adviceListItems: adviceResult,
        });
        setAdviceResult(null);
        fetchAdviceNarration.query();
        handleClose();
      }
    } catch (e) {
      showToast(e as ICustomError);
    }
  };

  const onSubmit = async () => {
    if (step === 1) return createAdvice();
    return generateAdviceViaAI();
  };

  const onBack = () => setStep(1);

  const isLoading =
    step === 1
      ? createAdviceQueryData.loading
      : createAINarrationQueryData.loading;

  useEffect(() => {
    if (!open) return;
    const ac = new AbortController();

    const isRangeOrSlider = (el: HTMLElement | null) => {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      const isRangeInput =
        tag === "input" && (el as HTMLInputElement).type === "range";
      const isAriaSlider =
        el.getAttribute?.("role") === "slider" ||
        el.closest?.('[role="slider"]');
      return Boolean(isRangeInput || isAriaSlider);
    };

    const onUp = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat) return;

      const el = e.target as HTMLElement | null;
      const disabled =
        (step === 1 && (!target || target.length === 0)) || isLoading;

      if (isRangeOrSlider(el)) {
        e.preventDefault();
        (el as HTMLElement)?.blur();
        if (!disabled) onSubmit();
        return;
      }

      if (
        el &&
        (el.isContentEditable ||
          /^(input|textarea|select|button)$/i.test(el.tagName))
      )
        return;

      if (!disabled) onSubmit();
    };

    window.addEventListener("keyup", onUp, {
      signal: ac.signal,
      capture: true,
    });
    return () => ac.abort();
  }, [open, step, target, isLoading, onSubmit]);

  return (
    <CEDialog
      open={open}
      closeDialog={handleClose}
      maxWidth="md"
      fullWidth
      title={
        <Box sx={{ ...styles.centerV, gap: "6px" }}>
          <AIGenerated styles={{ width: "24px", color: "white" }} />
          <Trans i18nKey="advice.adviceAssistant" />
        </Box>
      }
      contentStyle={{
        padding: "unset",
        overflow: "hidden",
        textAlign: "center",
        marginInline: { xs: 1, md: 4 },
        alignItems: { xs: "stretch", md: "center" },
      }}
    >
      <Box
        width="100%"
        sx={{ ...styles.centerCV }}
        pt={{ xs: 0, md: 3 }}
        pb={2}
      >
        <Typography
          variant="bodyMedium"
          color="background.onVariant"
          textAlign="justify"
        >
          <Trans
            i18nKey={
              step === 1 ? "advice.adviceAssistantDesc" : "advice.reviewAdvice"
            }
          />
        </Typography>

        {(fetchPreAdviceInfo.loading || loading) && (
          <LoadingAdviceTargetsSkeleton />
        )}

        {/* Step 1: Targets */}
        <Grid
          container
          rowSpacing={2}
          sx={{
            mt: 2,
            paddingInlineStart: 2,
            borderRadius: { xs: 0, sm: "8px" },
            maxHeight: { xs: "60vh", md: "40vh" },
            overflow: "auto",
            overflowX: "hidden",
            display: step === 1 ? "flex" : "none",
            bgcolor: "background.containerHighest",
          }}
        >
          {fetchPreAdviceInfo.data?.attributes?.map((attribute: any) => {
            const current = fetchPreAdviceInfo.data?.maturityLevels.find(
              (m: any) => m.id == attribute?.maturityLevel.id,
            );
            return (
              <Grid item xs={12} sm={6} key={attribute.id}>
                <AdviceSlider
                  defaultValue={current?.value ?? 0}
                  currentState={current}
                  attribute={attribute}
                  maturityLevels={fetchPreAdviceInfo.data?.maturityLevels}
                  setTarget={setTarget}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Step 2: Review Table */}
        <Box
          mt={2}
          sx={{
            borderRadius: { xs: 0, sm: "8px" },
            bgcolor: "background.containerHighest",
            maxHeight: { xs: "70vh", md: "40vh" },
            overflow: "hidden",
            overflowX: "auto",
            display: step === 2 ? "block" : "none",
          }}
        >
          <AdviceQuestionTable adviceResult={adviceResult} />
        </Box>

        {/* Actions */}
        <CEDialogActions
          loading={isLoading}
          onClose={handleClose}
          onSubmit={onSubmit}
          hasBackBtn={step === 2}
          onBack={onBack}
          submitButtonLabel={step === 1 ? "common.continue" : "common.generate"}
          submitButtonColor={step === 1 ? "primary" : "success"}
          disablePrimaryButton={step === 1 && (!target || target.length === 0)}
        />
      </Box>
    </CEDialog>
  );
};

export default AdviceDialog;

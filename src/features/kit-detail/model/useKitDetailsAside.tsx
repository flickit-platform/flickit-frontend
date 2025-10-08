import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getReadableDate } from "@/utils/readable-date";
import { useQuery } from "@/hooks/useQuery";
import useMenu from "@/hooks/useMenu";
import useDialog from "@/hooks/useDialog";
import { useServiceContext } from "@/providers/service-provider";
import showToast from "@/utils/toast-error";
import type { ICustomError } from "@/utils/custom-error";
import type { AssessmentKitStatsType } from "@/types";
import LanguageIcon from "@mui/icons-material/Language";
import PriceIcon from "@common/icons/Price";
import {
  AssignmentOutlined,
  FavoriteBorderOutlined,
} from "@mui/icons-material";

type UseKitDetailsAsideArgs = {
  stats: AssessmentKitStatsType;
  languages: string | string[];
  assessmentKitTitle: string;
  draftVersionId: number | null;
};

export function useKitDetailsAside({
  stats,
  languages,
  assessmentKitTitle,
  draftVersionId,
}: UseKitDetailsAsideArgs) {
  const theme = useTheme();
  const { t } = useTranslation();
  const menu = useMenu();
  const dslDialog = useDialog();
  const draftDialog = useDialog();
  const navigate = useNavigate();
  const { assessmentKitId } = useParams();
  const { service } = useServiceContext();

  const cloneAssessmentKit = useQuery({
    service: (args, config) => service.assessmentKit.info.clone(args, config),
    runOnMount: false,
  });

  const fetchAssessmentKitDownloadUrlQuery = useQuery({
    service: (args, config) =>
      service.assessmentKit.dsl.getDownloadUrl(
        args ?? { assessmentKitId },
        config,
      ),
    runOnMount: false,
  });

  const handleCreateViaKitDesigner = useCallback(async () => {
    if (!draftVersionId) {
      const res: any = await cloneAssessmentKit.query({ assessmentKitId });
      navigate(`./../../kit-designer/${res?.kitVersionId}`);
      return;
    }
    navigate(`./../../kit-designer/${draftVersionId}`);
  }, [assessmentKitId, cloneAssessmentKit, draftVersionId, navigate]);

  const handleDownloadDSL = useCallback(async () => {
    try {
      const response: any = await fetchAssessmentKitDownloadUrlQuery.query();
      const fileUrl = response.url;
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = `${assessmentKitTitle ?? "download"}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      const err = e as ICustomError;
      showToast(err);
    }
  }, [assessmentKitTitle, fetchAssessmentKitDownloadUrlQuery]);

  const creationDate = useMemo(
    () => getReadableDate(stats.creationTime),
    [stats.creationTime],
  );
  const lastUpdated = useMemo(
    () => getReadableDate(stats.lastModificationTime),
    [stats.lastModificationTime],
  );

  const gridItems = useMemo(
    () => [
      {
        title: t("common.maturityLevel"),
        value: stats.maturityLevelsCount ?? "-",
      },
      { title: t("common.subjects"), value: stats.subjects?.length ?? "-" },
      { title: t("common.attributes"), value: stats.attributesCount ?? "-" },
      {
        title: t("common.questionnaires"),
        value: stats.questionnairesCount ?? "-",
      },
      { title: t("common.questions"), value: stats.questionsCount ?? "-" },
      { title: t("kitDesigner.measures"), value: stats.measuresCount ?? "-" },
    ],
    [
      t,
      stats.maturityLevelsCount,
      stats.subjects,
      stats.attributesCount,
      stats.questionnairesCount,
      stats.questionsCount,
      stats.measuresCount,
    ],
  );

  const languagePriceRow = useMemo(
    () => ({
      left: {
        title: t("common.supportedLanguages"),
        value: languages,
        icon: (
          <LanguageIcon sx={{ color: "primary.main", width: 32, height: 32 }} />
        ),
      },
      right: {
        title: t("common.price"),
        value: t("common.free"),
        icon: (
          <PriceIcon
            color={theme.palette.primary.dark}
            width="32px"
            height="32px"
          />
        ),
      },
    }),
    [languages, theme.palette.primary.dark],
  );

  const row2 = useMemo(
    () => ({
      left: {
        title: t("kitDetail.createdAssessments"),
        value: stats.assessmentCounts,
        icon: (
          <AssignmentOutlined
            sx={{ color: "primary.main", width: 32, height: 32 }}
          />
        ),
      },
      right: {
        title: t("common.liked"),
        value: (
          <>
            {stats.likes ?? "0"} {t("common.times")}
          </>
        ),
        icon: (
          <FavoriteBorderOutlined
            sx={{ color: theme.palette.primary.dark, width: 32, height: 32 }}
          />
        ),
      },
    }),
    [stats.assessmentCounts, stats.likes, t, theme.palette.primary.dark],
  );

  return {
    // formatted values
    creationDate,
    lastUpdated,
    gridItems,
    languagePriceRow,
    row2,

    // actions
    handleDownloadDSL,
    handleCreateViaKitDesigner,

    // dialogs & menu states (container state)
    dslDialog,
    draftDialog,
    menu,
    t,
  };
}

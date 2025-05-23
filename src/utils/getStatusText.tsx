import { t } from "i18next";
import { Trans } from "react-i18next";
import { TStatus } from "@/types/index";
import hasStatus from "./hasStatus";

const getStatusText = (status: TStatus, onlyText: boolean = false) => {
  if (hasStatus(status)) {
    return status;
  }
  return onlyText ? (
    (t("notEvaluated") as string)
  ) : (
    <Trans i18nKey="notEvaluated" />
  );
};

export default getStatusText;

import React, { lazy, useMemo, useState } from "react";
import type { KitDetailsType } from "../../model/types";

const Empty: React.FC = () => null;

const LazyMaturity = lazy(async () => {
  const mod: any = await import("../../ui/footer/MaturityLevels");
  const Comp = mod.MaturityLevels ?? mod.default;
  return { default: Comp ?? Empty };
});

function keyFromNodeId(
  id: string
): "maturity" | "subjects" | "subject" | "attribute" | "questionnaires" | "questionnaire" | "answerRanges" {
  if (id === "maturity-levels-root") return "maturity";
  if (id === "subjects-root") return "subjects";
  if (id.startsWith("subject-")) return "subject";
  if (id.startsWith("attribute-")) return "attribute";
  if (id === "questionnaires-root") return "questionnaires";
  if (id.startsWith("questionnaire-")) return "questionnaire";
  if (id === "answer-ranges-root") return "answerRanges";
  return "maturity";
}

export function useFooterContainer(details: KitDetailsType) {
  const [nodeId, setNodeId] = useState("maturity-levels-root");

  const activeKey = useMemo(() => keyFromNodeId(nodeId), [nodeId]);

  const Active = useMemo(() => {
    return activeKey === "maturity" ? LazyMaturity : Empty;
  }, [activeKey]);

  const activeProps = useMemo(() => {
    switch (activeKey) {
      case "maturity":
        return { maturityLevels: details.maturityLevels };
      case "subjects":
        return { subjects: details.subjects };
      case "subject": {
        const sid = nodeId.replace("subject-", "");
        const subject = details.subjects.find((s) => String(s.id) === sid);
        return { subject };
      }
      case "attribute": {
        const [, sid, aid] = nodeId.split("-");
        const subject = details.subjects.find((s) => String(s.id) === sid);
        const attribute = subject?.attributes?.find((a) => String(a.id) === aid);
        return { subject, attribute };
      }
      case "questionnaires":
        return { items: details.questionnaires };
      case "questionnaire": {
        const qid = nodeId.replace("questionnaire-", "");
        const questionnaire = details.questionnaires.find((q) => String(q.id) === qid);
        return { questionnaire };
      }
      case "answerRanges":
        return { ranges: details.answerRanges };
      default:
        return {};
    }
  }, [activeKey, nodeId, details]);

  return { nodeId, setNodeId, Active, activeProps };
}

import React, { lazy, LazyExoticComponent } from "react";
import type { KitDetailsType } from "../model/types";

const Empty: React.FC = () => null;

function lazyDefault<T = any>(
  factory: () => Promise<any>,
  exportName?: string,
): LazyExoticComponent<React.FC<T>> {
  return lazy(async () => {
    const mod: any = await factory();
    const Comp =
      (exportName ? mod?.[exportName] : mod?.default) ?? mod?.default;
    return { default: (Comp as React.FC<T>) ?? Empty };
  });
}

const LazyMaturity = lazyDefault(
  () => import("../ui/footer/MaturityLevelsPanel"),
);
const LazyMeasures = lazyDefault(() => import("../ui/footer/MeasurePanel"));
const LazySubject = lazyDefault(() => import("../ui/footer/SubjectPanel"));
const LazyAttribute = lazyDefault(() => import("../ui/footer/AttributePanel"));

const LazyQuestionnaire = lazyDefault(
  () => import("../ui/footer/QuestionnairePanel"),
);
const LazyAnswerRanges = lazyDefault(
  () => import("../ui/footer/AnswerRangesPanel"),
);

export type TreeNode = {
  nodeId: string;
  title: string;
  children?: TreeNode[];
};

export type ConfigItem = {
  id: string;
  title: (t: (k: string) => string) => string;
  rootNodeId: string;
  component?:
    | React.ComponentType<any>
    | LazyExoticComponent<React.ComponentType<any>>;
  buildChildren?: (
    details: KitDetailsType,
    t: (k: string) => string,
  ) => TreeNode[];
  match: (nodeId: string) => boolean;
  propsFrom: (nodeId: string, details: KitDetailsType) => Record<string, any>;
};

export const treeConfig: ConfigItem[] = [
  {
    id: "maturity",
    title: (t) => t("common.maturityLevels"),
    rootNodeId: "maturity-root",
    component: LazyMaturity,
    buildChildren: undefined,
    match: (nodeId) => nodeId === "maturity-root",
    propsFrom: (_nodeId, details) => ({
      maturityLevels: details.maturityLevels,
    }),
  },
  {
    id: "subjects",
    title: (t) => t("common.subjects"),
    rootNodeId: "subjects-root",
    buildChildren: (details) => {
      return [
        {
          nodeId: "subjects-root",
          title: "",
          children:
            details.subjects?.map((s) => ({
              nodeId: `subject-${s.id}`,
              title: s.title,
              children:
                s.attributes?.map((a) => ({
                  nodeId: `attribute-${s.id}-${a.id}`,
                  title: a.title,
                })) ?? [],
            })) ?? [],
        },
      ];
    },
    match: (nodeId) => nodeId === "subjects-root",
    propsFrom: (_nodeId, details) => ({ subjects: details.subjects }),
  },
  {
    id: "subject",
    title: () => "",
    rootNodeId: "",
    component: LazySubject,
    buildChildren: undefined,
    match: (nodeId) => nodeId.startsWith("subject-"),
    propsFrom: (nodeId, details) => {
      const sid = nodeId.replace("subject-", "");
      const subject = details.subjects.find((s) => String(s.id) === sid);
      return { subject };
    },
  },
  {
    id: "attribute",
    title: () => "",
    rootNodeId: "",
    component: LazyAttribute,
    buildChildren: undefined,
    match: (nodeId) => nodeId.startsWith("attribute-"),
    propsFrom: (nodeId, details) => {
      const [, sid, aid] = nodeId.split("-");
      const subject = details.subjects.find((s) => String(s.id) === sid);
      const attribute = subject?.attributes?.find((a) => String(a.id) === aid);
      return { subject, attribute };
    },
  },
  {
    id: "questionnaires",
    title: (t) => t("common.questionnaires"),
    rootNodeId: "questionnaires-root",
    buildChildren: (details) => [
      {
        nodeId: "questionnaires-root",
        title: "",
        children:
          details.questionnaires?.map((q) => ({
            nodeId: `questionnaire-${q.id}`,
            title: q.title,
          })) ?? [],
      },
    ],
    match: (nodeId) => nodeId === "questionnaires-root",
    propsFrom: (_nodeId, details) => ({ items: details.questionnaires }),
  },
  {
    id: "questionnaire",
    title: () => "",
    rootNodeId: "",
    component: LazyQuestionnaire,
    buildChildren: undefined,
    match: (nodeId) => nodeId.startsWith("questionnaire-"),
    propsFrom: (nodeId, details) => {
      const qid = nodeId.replace("questionnaire-", "");
      const questionnaire = details.questionnaires.find(
        (q) => String(q.id) === qid,
      );
      return { questionnaire };
    },
  },
  {
    id: "measures",
    title: (t) => t("common.measures"),
    rootNodeId: "measures-root",
    buildChildren: (details) => [
      {
        nodeId: "measures-root",
        title: "",
        children:
          details.measures?.map((m) => ({
            nodeId: `measure-${m.id}`,
            title: m.title,
          })) ?? [],
      },
    ],
    match: (nodeId) => nodeId === "measures-root",
    propsFrom: (_nodeId, details) => ({ ranges: details.measures }),
  },
  {
    id: "measure",
    title: () => "",
    rootNodeId: "",
    component: LazyMeasures,
    buildChildren: undefined,
    match: (nodeId) => nodeId.startsWith("measure-"),
    propsFrom: (nodeId, details) => {
      const measureId = nodeId.replace("measure-", "");
      const measure = details.measures.find((m) => String(m.id) === measureId);
      return { measure };
    },
  },
  {
    id: "answerRanges",
    title: (t) => t("kitDesigner.answerRanges"),
    rootNodeId: "answer-ranges-root",
    component: LazyAnswerRanges,
    buildChildren: undefined,
    match: (nodeId) => nodeId === "answer-ranges-root",
    propsFrom: (_nodeId, details) => ({ ranges: details.answerRanges }),
  },
];

export function buildTree(
  details: KitDetailsType,
  t: (k: string) => string,
): TreeNode[] {
  const base: TreeNode[] = [
    { nodeId: "maturity-root", title: t("common.maturityLevels") },
    {
      nodeId: "subjects-root",
      title: t("common.subjects"),
      children:
        details.subjects?.map((s) => ({
          nodeId: `subject-${s.id}`,
          title: s.title,
          children:
            s.attributes?.map((a) => ({
              nodeId: `attribute-${s.id}-${a.id}`,
              title: a.title,
            })) ?? [],
        })) ?? [],
    },
    {
      nodeId: "questionnaires-root",
      title: t("common.questionnaires"),
      children:
        details.questionnaires?.map((q) => ({
          nodeId: `questionnaire-${q.id}`,
          title: q.title,
        })) ?? [],
    },
    {
      nodeId: "measures-root",
      title: t("kitDesigner.measures"),
      children:
        details.measures?.map((m) => ({
          nodeId: `measure-${m.id}`,
          title: m.title,
        })) ?? [],
    },
    { nodeId: "answer-ranges-root", title: t("kitDesigner.answerRanges") },
  ];
  return base;
}

export function resolveActive(nodeId: string) {
  return treeConfig.find((c) => c.match(nodeId));
}

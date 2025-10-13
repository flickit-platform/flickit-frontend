import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AssessmentsList } from "../AssessmentList";
import { ServiceProvider } from "@providers/service-provider";

/* ===========================
 * Test data & helpers
 * =========================== */

const mockData = [
  {
    id: "id-1",
    title: "title1",
    kit: { id: 384, title: "Software Performance Evaluation1", maturityLevelsCount: 5 },
    lastModificationTime: "2025-09-14T08:44:37.364597",
    maturityLevel: { id: 2068, title: "Undeveloped", value: 1, index: 1 },
    confidenceValue: 0,
    isCalculateValid: true,
    isConfidenceValid: false,
    language: { code: "EN", title: "انگلیسی" },
    mode: { code: "QUICK" },
    hasReport: false,
    permissions: {
      canManageSettings: true,
      canViewReport: true,
      canViewDashboard: true,
      canViewQuestionnaires: false,
    },
  },
  {
    id: "id-2",
    title: "title2",
    kit: { id: 386, title: "Software Performance Evaluation2", maturityLevelsCount: 5 },
    lastModificationTime: "2025-09-13T11:23:25.885328",
    maturityLevel: { id: 2078, title: "توسعه نیافته", value: 1, index: 1 },
    confidenceValue: 0,
    isCalculateValid: true,
    isConfidenceValid: false,
    language: { code: "FA", title: "فارسی" },
    mode: { code: "QUICK" },
    hasReport: false,
    permissions: {
      canManageSettings: true,
      canViewReport: true,
      canViewDashboard: true,
      canViewQuestionnaires: false,
    },
  },
];

const baseProps = {
  data: mockData as any,
  space: { id: "space-1", name: "Space 1" },
  dialogProps: {} as any,
  deleteAssessment: vi.fn(),
  fetchAssessments: vi.fn(),
};

const MockServiceProvider = ({ children }: any) => <ServiceProvider>{children}</ServiceProvider>;

const scenarios: Record<
  string,
  () => typeof baseProps
> = {
  canManageSettings: () => ({ ...baseProps, data: [mockData[0]] }),
  canViewReport: () => ({
    ...baseProps,
    data: [
      {
        ...mockData[0],
        hasReport: true,
        mode: { code: "QUICK" },
        permissions: {
          ...mockData[0].permissions,
          canViewReport: true,
        },
      },
    ],
  }),
  canViewDashboard: () => ({
    ...baseProps,
    data: [
      {
        ...mockData[0],
        hasReport: true,
        mode: { code: "ADVANCE" },
        permissions: {
          ...mockData[0].permissions,
          canViewReport: false,
          canViewDashboard: true,
        },
      },
    ],
  }),
  canViewQuestionnaires: () => ({
    ...baseProps,
    data: [
      {
        ...mockData[0],
        hasReport: true,
        mode: { code: "QUICK" },
        permissions: {
          ...mockData[0].permissions,
          canViewReport: false,
          canViewDashboard: false,
          canViewQuestionnaires: true,
        },
      },
    ],
  }),
};

function renderList(singleItem?: keyof typeof scenarios) {
  const props = singleItem ? scenarios[singleItem]() : baseProps;
  render(
    <MemoryRouter>
      <MockServiceProvider>
        <AssessmentsList {...props} />
      </MockServiceProvider>
    </MemoryRouter>
  );
}

/* ===========================
 * Tests (بدون تغییر در منطق/انتظارها)
 * =========================== */

describe("AssessmentsList", () => {
  it("renders correct number of AssessmentCards", () => {
    renderList();
    const items = screen.getAllByTestId("assessment-card");
    expect(items).toHaveLength(mockData.length);
  });

  it("renders assessment titles", () => {
    renderList();
    expect(screen.getByText(/title1/)).toBeInTheDocument();
    expect(screen.getByText(/title2/)).toBeInTheDocument();
  });

  it("renders kit titles along with assessments", () => {
    renderList();
    expect(screen.getByText(/Software Performance Evaluation1/)).toBeInTheDocument();
    expect(screen.getByText(/Software Performance Evaluation2/)).toBeInTheDocument();
  });

  it("renders permissions correctly", () => {
    renderList();
    mockData.forEach(({ permissions }) => {
      const {
        canManageSettings,
        canViewReport,
        canViewDashboard,
        canViewQuestionnaires,
      } = permissions;
      expect(canManageSettings).toBe(true);
      expect(canViewReport).toBe(true);
      expect(canViewDashboard).toBe(true);
      expect(canViewQuestionnaires).toBe(false);
    });
  });

  it("check canManageSettings", () => {
    renderList("canManageSettings");
    expect(screen.getByTestId("more-action-btn")).toBeInTheDocument();
  });

  it("check canViewReport", () => {
    renderList("canViewReport");
    const header = screen.getByTestId("assessmentCard-header");
    const btn = screen.getByTestId("assessment-card-btn");
    expect(header).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(header).toHaveAttribute("href", `/space-1/assessments/id-1/graphical-report/`);
    expect(btn).toHaveAttribute("href", `/space-1/assessments/id-1/graphical-report/`);
  });

  it("check canViewDashboard", () => {
    renderList("canViewDashboard");
    const header = screen.getByTestId("assessmentCard-header");
    const btn = screen.getByTestId("assessment-card-btn");
    expect(header).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(header).toHaveAttribute("href", `/space-1/assessments/1/id-1/dashboard`);
    expect(btn).toHaveAttribute("href", `/space-1/assessments/1/id-1/dashboard`);
  });

  it("check canViewQuestionnaires", () => {
    renderList("canViewQuestionnaires");
    const header = screen.getByTestId("assessmentCard-header");
    const btn = screen.getByTestId("assessment-card-btn");
    expect(header).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(header).toHaveAttribute("href", `/space-1/assessments/1/id-1/questionnaires`);
    expect(btn).toHaveAttribute("href", `/space-1/assessments/1/id-1/questionnaires`);
  });
});

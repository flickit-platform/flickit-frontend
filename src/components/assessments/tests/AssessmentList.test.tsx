import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AssessmentsList } from "../AssessmentList";
import { MemoryRouter } from "react-router-dom";
import { ServiceProvider } from "@providers/ServiceProvider";

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
    permissions: { canManageSettings: true, canViewReport: true, canViewDashboard: true, canViewQuestionnaires: false }
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
    permissions: { canManageSettings: true, canViewReport: true, canViewDashboard: true, canViewQuestionnaires: false }
  }
];

const MockServiceProvider = ({ children }: any) => {
  return <ServiceProvider>{children}</ServiceProvider>;
};

describe("AssessmentsList", () => {
  const defaultProps = {
    data: mockData as any,
    space: { id: "space-1", name: "Space 1" },
    dialogProps: {} as any,
    deleteAssessment: vi.fn(),
    fetchAssessments: vi.fn(),
  };

  beforeEach(()=>{
    render(
      <MemoryRouter>
        <MockServiceProvider>
         <AssessmentsList {...defaultProps} />
        </MockServiceProvider>
      </MemoryRouter>
    )
  })


  it("renders correct number of AssessmentCards", () => {
  const items = screen.getAllByTestId("assessment-card")
    expect(items).toHaveLength(mockData.length);
  });

  it("renders assessment titles", () => {
    expect(screen.getByText(/title1/)).toBeInTheDocument();
    expect(screen.getByText(/title2/)).toBeInTheDocument();
  });

  it("renders kit titles along with assessments", () => {
    expect(screen.getByText(/Software Performance Evaluation1/)).toBeInTheDocument();
    expect(screen.getByText(/Software Performance Evaluation2/)).toBeInTheDocument();
  });

  it("renders permissions correctly", () => {
    mockData.forEach((assessment) => {
      const { canManageSettings, canViewReport, canViewDashboard, canViewQuestionnaires } = assessment.permissions;
      expect(canManageSettings).toBe(true);
      expect(canViewReport).toBe(true);
      expect(canViewDashboard).toBe(true);
      expect(canViewQuestionnaires).toBe(false);
    });
  });
});
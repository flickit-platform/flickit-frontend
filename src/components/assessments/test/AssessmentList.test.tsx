import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AssessmentsList } from "../AssessmentList";
import { MemoryRouter } from "react-router-dom";
import { ServiceProvider } from "@providers/service-provider"

const mockData = [
  {
    id: "id-1",
    title: "title1",
    kit: {
      id: 384,
      title: "Software Performance Evaluation1",
      maturityLevelsCount: 5,
    },
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
    kit: {
      id: 386,
      title: "Software Performance Evaluation2",
      maturityLevelsCount: 5,
    },
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

  const AssessmentListRender = (singleItem?: string) => {

    let props = defaultProps;

    if (singleItem === "canManageSettings") {
      props = { ...defaultProps, data: [mockData[0]] };
    }

    if (singleItem === "canViewReport") {
      props = {
        ...defaultProps,
        data: [
          {
            ...mockData[0],
            hasReport: true,
            mode: { code: "QUICK" },
            permissions : {
              ...mockData[0].permissions,
              canViewReport: true
            }
          },
        ],
      };
    }

    if (singleItem === "canViewDashboard") {
      props = {
        ...defaultProps,
        data: [
          {
            ...mockData[0],
            hasReport: true,
            mode: { code: "ADVANCE" },
            permissions : {
              ...mockData[0].permissions,
              canViewReport: false,
              canViewDashboard: true
            }
          },
        ],
      };
    }
    if (singleItem === "canViewQuestionnaires") {
      props = {
        ...defaultProps,
        data: [
          {
            ...mockData[0],
            hasReport: true,
            mode: { code: "QUICK" },
            permissions : {
              ...mockData[0].permissions,
              canViewReport: false,
              canViewDashboard: false,
              canViewQuestionnaires: true
            }
          },
        ],
      };
    }



    render(
      <MemoryRouter>
        <MockServiceProvider>
          <AssessmentsList {...props} />
        </MockServiceProvider>
      </MemoryRouter>,
    );
  };

  it("renders correct number of AssessmentCards", () => {
    AssessmentListRender()
    const items = screen.getAllByTestId("assessment-card");
    expect(items).toHaveLength(mockData.length);
  });

  it("renders assessment titles", () => {
    AssessmentListRender()
    expect(screen.getByText(/title1/)).toBeInTheDocument();
    expect(screen.getByText(/title2/)).toBeInTheDocument();
  });


  it("renders kit titles along with assessments", () => {
    AssessmentListRender()
    expect(
      screen.getByText(/Software Performance Evaluation1/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Software Performance Evaluation2/),
    ).toBeInTheDocument();
  });

  it("renders permissions correctly", () => {
    AssessmentListRender()
    mockData.forEach((assessment) => {
      const {
        canManageSettings,
        canViewReport,
        canViewDashboard,
        canViewQuestionnaires,
      } = assessment.permissions;
      expect(canManageSettings).toBe(true);
      expect(canViewReport).toBe(true);
      expect(canViewDashboard).toBe(true);
      expect(canViewQuestionnaires).toBe(false);
    });
  });

  it("check canManageSettings",()=>{
    AssessmentListRender("canManageSettings")
    expect(screen.getByTestId("more-action-btn")).toBeInTheDocument()
  })
  it("check canViewReport",()=>{
    AssessmentListRender("canViewReport")
    const assessmentCardHeader = screen.getByTestId("assessmentCard-header")
    const assessmentCardBtn = screen.getByTestId("assessment-card-btn")
    expect(assessmentCardHeader).toBeInTheDocument()
    expect(assessmentCardBtn).toBeInTheDocument()
    expect(assessmentCardHeader).toHaveAttribute("href", `/space-1/assessments/id-1/graphical-report/`)
    expect(assessmentCardBtn).toHaveAttribute("href", `/space-1/assessments/id-1/graphical-report/`)
  })
  it("check canViewDashboard",()=>{
    AssessmentListRender("canViewDashboard")
    const assessmentCardHeader = screen.getByTestId("assessmentCard-header")
    const assessmentCardBtn = screen.getByTestId("assessment-card-btn")
    expect(assessmentCardHeader).toBeInTheDocument()
    expect(assessmentCardBtn).toBeInTheDocument()
    expect(assessmentCardHeader).toHaveAttribute("href", `/space-1/assessments/1/id-1/dashboard`)
    expect(assessmentCardBtn).toHaveAttribute("href", `/space-1/assessments/1/id-1/dashboard`)
  })
  it("check canViewQuestionnaires",()=>{
    AssessmentListRender("canViewQuestionnaires")
    const assessmentCardHeader = screen.getByTestId("assessmentCard-header")
    const assessmentCardBtn = screen.getByTestId("assessment-card-btn")
    expect(assessmentCardHeader).toBeInTheDocument()
    expect(assessmentCardBtn).toBeInTheDocument()
    expect(assessmentCardHeader).toHaveAttribute("href", `/space-1/assessments/1/id-1/questionnaires`)
    expect(assessmentCardBtn).toHaveAttribute("href", `/space-1/assessments/1/id-1/questionnaires`)
  })
});

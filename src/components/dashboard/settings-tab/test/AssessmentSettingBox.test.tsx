import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ServiceProvider } from "@providers/service-provider";
import { AppProvider } from "@providers/app-provider";
import { AssessmentSettingGeneralBox } from "@components/dashboard/settings-tab/AssessmentSettingBox";

const fetchPathInfo = vi.fn();

vi.mock("@/providers/assessment-provider", () => {
  return {
    useAssessmentContext: () => ({
      assessmentInfo: {
        shortTitle: "assessment short title",
        title: "assessment title",
      },
      dispatch: vi.fn(),
    }),
    assessmentActions: {
      setAssessmentInfo: vi.fn(),
    },
  };
});
const MockProviders = ({ children }: any) => (
  <MemoryRouter>
    <AppProvider>
      <ServiceProvider>{children}</ServiceProvider>
    </AppProvider>
  </MemoryRouter>
);

const renderInfoBox = () => {
  render(
    <MockProviders>
      <AssessmentSettingGeneralBox
        AssessmentTitle={"assessment title"}
        fetchPathInfo={fetchPathInfo}
        color={"#073B4C"}
      />
    </MockProviders>,
  );
};

describe("display Assessment info", () => {
  it("check title and shortTitle text", () => {
    renderInfoBox();

    const titleInfo = screen.getByTestId("title-assessmentInfo");
    const shortTitle = screen.getByTestId("shortTitle-assessmentInfo");
    expect(titleInfo).toBeInTheDocument();
    expect(shortTitle).toBeInTheDocument();
    expect(titleInfo).toHaveTextContent("assessment title");
  });
  it("check assessment mode dialog confirm", async () => {
    renderInfoBox();

    const switchBtn = screen.getByTestId("assessment-switch-mode-btn");
    fireEvent.click(switchBtn);
    const switchModeDialog = screen.getByTestId(
      "assessment-switch-mode-dialog",
    );
    expect(switchModeDialog).toBeInTheDocument();
    const confirmButton = screen.getByTestId("submit");
    fireEvent.click(confirmButton);
  });
});

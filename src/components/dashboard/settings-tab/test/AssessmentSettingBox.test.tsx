import { describe, it, vi, expect } from "vitest";
import {render, screen, within} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {ServiceProvider} from "@providers/service-provider";
import { AppProvider } from "@providers/app-provider";
import {AssessmentSettingGeneralBox} from "@components/dashboard/settings-tab/AssessmentSettingBox";

const fetchPathInfo = vi.fn()

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
            <ServiceProvider>
                {children}
            </ServiceProvider>
        </AppProvider>
    </MemoryRouter>
);

const renderInfoBox = () => {
    render(
        <MockProviders>
            <AssessmentSettingGeneralBox
                AssessmentTitle={"assessment title"}
                fetchPathInfo={fetchPathInfo}
                color={'#073B4C'}
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

});
import { render, fireEvent, screen } from "@testing-library/react";
import ListOfItems from "../AnswerRangeList";
import { vi } from "vitest";
import OptionContain from "@components/kit-designer/answerRange/options/optionsContain";
import { ServiceProvider } from "@providers/ServiceProvider";

// Mock Data
const mockAnswerRange = [
  {
    key: 1,
    id: 1,
    answerOptions: [{ id: 11, title: "option1", index: 1, value: 1 }],
    title: "title 1",
  },
  {
    key: 2,
    id: 2,
    answerOptions: [{ id: 22, title: "option2", index: 1, value: 1 }],
    title: "title 2",
  },
];
const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnReorder = vi.fn();
const setChangeData = vi.fn();
const fetchQuery = vi.fn();

// Mock Provider
const MockServiceProvider = ({ children }: any) => {
  return <ServiceProvider>{children}</ServiceProvider>;
};

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simple mock to return key as translation
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

// Mock axios
vi.mock("axios");

// Tests
describe("AnswerRangeList Component", () => {
  beforeEach(() => {
    render(
      <ListOfItems
        items={mockAnswerRange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        deleteBtn={false}
        onReorder={mockOnReorder}
        setChangeData={setChangeData}
        name="answerRange"
      />
    );
  });

  it("Accordion opens when clicked", () => {

    const accordionSummary = screen.getAllByTestId("accordion-summary-answer-range")[0];
    const accordionDetails = screen.getAllByTestId("accordion-details-answer-range")[0];

    // Initially, details should not be visible
    expect(accordionDetails).not.toBeVisible();

    // Click to open
    fireEvent.click(accordionSummary);

    // Now, details should be visible
    expect(accordionDetails).toBeVisible();
  });



  it("renders Answer Range correctly", () => {
    expect(screen.getByText("title 1")).toBeInTheDocument();
    expect(screen.getByText("title 2")).toBeInTheDocument();
  });

  it("allows editing an answer range", () => {
    // Click edit button for the first item
    fireEvent.click(screen.getAllByTestId("items-edit-icon")[0]);

    // Change title
    fireEvent.change(screen.getByTestId("items-title"), {
      target: { value: "Updated title 1" },
    });

    // Save the changes
    fireEvent.click(screen.getByTestId("items-check-icon"));

    // Check if onEdit was called with the updated values
    expect(mockOnEdit).toHaveBeenCalledWith({
      id: 1,
      key: 1,
      title: "Updated title 1",
      answerOptions: [{ id: 11, title: "option1", index: 1, value: 1 }],
    });
  });

  it("allows editing options in answer ranges", async () => {
    render(
      <MockServiceProvider>
        {mockAnswerRange.map((answer) => (
          <OptionContain
            key={answer.id}
            answerOption={answer.answerOptions}
            fetchQuery={fetchQuery}
            setChangeData={setChangeData}
          />
        ))}
      </MockServiceProvider>
    );

    // Click edit button for the first option
    fireEvent.click(screen.getAllByTestId("item-edit-option-icon")[0]);

    // Change option title and value
    fireEvent.change(screen.getByTestId("items-option-title"), {
      target: { value: "Updated option 1" },
    });
    fireEvent.change(screen.getByTestId("items-option-value"), {
      target: { value: 2 },
    });

    // Assert changes
    expect(screen.getByTestId("items-option-title")).toHaveValue(
      "Updated option 1"
    );
    expect(screen.getByTestId("items-option-value")).toHaveValue("2");

    // Optionally trigger save
    // fireEvent.click(screen.getByTestId("item-save-option-icon"));
    // Add further assertions if onSave logic exists
  });
});

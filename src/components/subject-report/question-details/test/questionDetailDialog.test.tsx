import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import QuestionDetailsContainer from "@/components/subject-report/question-details/QuestionDetailsContainer";
import { BrowserRouter } from "react-router-dom";
import { ServiceProvider } from "@/providers/service-provider";

describe("open detail dialog test", () => {
  const data = {
    items: [
      {
        questionnaire: {
          id: 2659,
          title: "Development",
        },
        question: {
          id: 17310,
          index: 2,
          title: "test1",
          weight: 1,
          evidenceCount: 0,
        },
        answer: {
          index: 4,
          title: "Always-Fully and perfectly employed",
          isNotApplicable: false,
          score: 1,
          weightedScore: 1,
          confidenceLevel: 3,
        },
      },
      {
        questionnaire: {
          id: 2659,
          title: "Development",
        },
        question: {
          id: 17310,
          index: 2,
          title:"test2",
          weight: 1,
          evidenceCount: 0,
        },
        answer: {
          index: 4,
          title: "Always-Fully and perfectly employed",
          isNotApplicable: false,
          score: 1,
          weightedScore: 1,
          confidenceLevel: 3,
        },
      },
      {
        questionnaire: {
          id: 2659,
          title: "Development",
        },
        question: {
          id: 17310,
          index: 2,
          title: "test3",
          weight: 1,
          evidenceCount: 0,
        },
        answer: {
          index: 4,
          title: "Always-Fully and perfectly employed",
          isNotApplicable: false,
          score: 1,
          weightedScore: 1,
          confidenceLevel: 3,
        },
      },
    ],
  };

  const MockServiceProvider = ({ children }: any) => {
    return <ServiceProvider>{children}</ServiceProvider>;
  };

  const navigateToPreviousQuestion = vi.fn();
  const navigateToNextQuestion = vi.fn();
  const onClose = vi.fn();

  const questionDetail = (index: number) => {
    render(
      <BrowserRouter>
        <MockServiceProvider>
          <QuestionDetailsContainer
            open={true}
            context={{
              type: "details",
              questionInfo: data.items[index],
              questionsInfo: data.items,
              index: index,
            }}
            onClose={onClose}
            onPreviousQuestion={navigateToPreviousQuestion}
            onNextQuestion={navigateToNextQuestion}
          />
        </MockServiceProvider>
      </BrowserRouter>,
    );
  };

  it("rating level", () => {
    questionDetail(1)
    const confidenceLevel = screen.getByTestId("rating-level-num");
    expect(confidenceLevel).toBeInTheDocument();
  });

  it("check title of question in question modal", () => {
    questionDetail(1)
    const title = screen.getByTestId("question-detail-title");
    expect(title).toHaveTextContent(
    "test2"
    );
  });

  it("check questionnaire title of question in question modal", () => {
    questionDetail(1)
    const questionnaireTitle = screen.getByTestId(
      "question-detail-questionnaire-title",
    );
    expect(questionnaireTitle).toHaveTextContent("Development");
  });
  it("check next question", () => {
    questionDetail(2)
    const nextQuestion = screen.getByTestId("question-modal-next-question");
    fireEvent.click(nextQuestion);
    const title = screen.getByTestId("question-detail-title");
    expect(title).toHaveTextContent(
        "test3"
    );
  });
  it("check previous question", () => {
    questionDetail(0)
    const nextQuestion = screen.getByTestId("question-modal-previous-question");
    fireEvent.click(nextQuestion);
    const title = screen.getByTestId("question-detail-title");
    expect(title).toHaveTextContent(
        "test1"
    );
  });
});

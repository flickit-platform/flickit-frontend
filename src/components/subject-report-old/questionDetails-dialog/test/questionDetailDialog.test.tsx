import { describe, it, vi, expect } from "vitest";
import {fireEvent, render, screen, within} from "@testing-library/react";
import QuestionDetailsContainer from "@components/subject-report-old/questionDetails-dialog/QuestionDetailsContainer";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import {ServiceProvider} from "@providers/ServiceProvider";

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
          title:
            "How efficiently are 'Build Management Tools' like Maven, Gradle, MSBuild, Ant and Bazel being employed?",
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

  beforeEach(() => {
    render(
      <BrowserRouter>
        <MockServiceProvider>
          <QuestionDetailsContainer
              open={true}
              context={{
                type: "details",
                questionInfo: data.items[0],
                questionsInfo: data.items,
                index: 0,
              }}
              onClose={onClose}
              onPreviousQuestion={navigateToPreviousQuestion}
              onNextQuestion={navigateToNextQuestion}
          />
        </MockServiceProvider>
      </BrowserRouter>,
    );
  });

  it("rating level", () => {
    const confidenceLevel = screen.getByTestId("rating-level-num");
    expect(confidenceLevel).toBeInTheDocument();
  });

  it("check title of question in question modal", () => {
    const title = screen.getByTestId("question-detail-title");
    expect(title).toHaveTextContent("How efficiently are 'Build Management Tools' like Maven, Gradle, MSBuild, Ant and Bazel being employed?");
  });

  it("check questionnaire title of question in question modal", () => {
    const questionnaireTitle = screen.getByTestId("question-detail-questionnaire-title");
    expect(questionnaireTitle).toHaveTextContent("Development");
  });
  it("check next question", () => {
    const nextQuestion = screen.getByTestId("question-modal-next-question");
    fireEvent.click(nextQuestion)
    // expect()

  });

});

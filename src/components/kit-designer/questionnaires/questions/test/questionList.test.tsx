import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import QuestionContainer from "@components/kit-designer/questionnaires/questions/QuestionContainer";
import {ServiceProvider} from "@providers/ServiceProvider";

const mockQuestionListData = [
    {title: "question Title 1",mayNotBeApplicable:false,id:1,hint:"hint 1",answerRangeId:1,advisable:true, index: 1},
    {title: "question Title 2",mayNotBeApplicable:false,id:2,hint:"hint 2",answerRangeId:2,advisable:true, index: 2},
    {title: "question Title 3",mayNotBeApplicable:false,id:3,hint:"hint 3",answerRangeId:3,advisable:true, index: 3},
    {title: "question Title 4",mayNotBeApplicable:false,id:4,hint:"hint 4",answerRangeId:4,advisable:true, index: 4},
]

const mockFetchQuery = {
    query: vi.fn(),
};

const MockServiceProvider = ({ children }: any) => {
    return <ServiceProvider>{children}</ServiceProvider>;
};

describe("test for questions",()=>{

    beforeEach(()=>{
        render(
            <MockServiceProvider>{
                mockQuestionListData.map(question =>(
                        <QuestionContainer
                            fetchQuery={mockFetchQuery}
                            key={question.index}
                            question={question}
                        />
                    )
                )
            }
            </MockServiceProvider>
        )
    })

    it('check for display question list', ()=> {
        expect(screen.getAllByTestId("question-index")[0]).toBeInTheDocument()
        expect(screen.getAllByTestId("question-title")[0]).toBeInTheDocument()
    });

    it('check for open question modal', ()=> {
        const handelEditBtn = screen.getAllByTestId("question-handel-edit")[0]
        fireEvent.click(handelEditBtn)
        expect(screen.getByTestId("question-dialog")).toBeInTheDocument()
    });

})
import {describe} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import MaturityLevelTable from "@components/subject-report-old/MaturityLevelTable";
import userEvent from "@testing-library/user-event";


const data = {
items:    [{
        "questionnaire": {
            "id": 2659,
            "title": "Development"
        },
        "question": {
            "id": 17310,
            "index": 2,
            "title": "How efficiently are 'Build Management Tools' like Maven, Gradle, MSBuild, Ant and Bazel being employed?",
            "weight": 1,
            "evidenceCount": 0
        },
        "answer": {
            "index": 4,
            "title": "Always-Fully and perfectly employed",
            "isNotApplicable": false,
            "score": 1,
            "weightedScore": 1,
            "confidenceLevel": 3
        }
    }]
}

describe("",()=>{
    beforeEach(()=>{
        render(<MaturityLevelTable
            tempData={data}
  updateSortOrder={() => {
  }}
        scoreState={{maxPossibleScore: 0, gainedScore: 0, gainedScorePercentage: 0, questionsCount: 0}}
        setPage={() => {
        }}
            page={1}
            rowsPerPage={10}
            setRowsPerPage= {()=> {}}
        />)
    })


    it("open-dialog",async ()=>{
        const btn = screen.getByTestId("open-question-details-dialog");
        console.log(btn,"test btn")
        // await fireEvent.click(btn);
        fireEvent.click(btn)
        // expect("Question Details").toBeInTheDocument()
    })
})
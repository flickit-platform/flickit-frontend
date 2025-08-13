import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SpaceCard } from "../SpaceList";


const data = {
    code: "space-card-test-code1",
    editable: false,
    id: 1,
    title: "space-card-test1",
    owner: {
      id: "ed1",
      displayName: "test1",
      isCurrentUserOwner: false
    },
    type: {
      code: "PREMIUM",
      title: "حرفه‌ای"
    },
    isActive: true,
    lastModificationTime: "2025-03-15T12:27:08.473287",
    membersCount: 1,
    assessmentsCount: 14
  }


const spaceCardRender = (modalStatus: {modal: boolean}) =>{
  render(
      <>
          return (
             <MemoryRouter>
               <SpaceCard
                   key={data?.id}
                   item={data}
                   isActiveSpace={true}
                   owner={data?.owner}
                   dialogProps={{
                     open: modalStatus.modal,
                     onClose: () => {},
                     openDialog: () => {},
                     context: undefined
                   }}
                   fetchSpaces={vi.fn()}
                   deleteSpace={vi.fn()}
               />
             </MemoryRouter>
          )
      </>
  );
}

describe("SpaceCard", () => {

  it("load space item card", async () => {
    spaceCardRender({modal:false})
    const spaceTitle = screen.getByTestId("space-card-title-test");
    const spacePremium = screen.getByTestId("space-card-premium-test");
    const spaceDisplayName = screen.getByTestId("space-card-show-displayName");

    expect(spaceTitle).toHaveTextContent("space-card-test1")
    expect(spacePremium).toBeInTheDocument()
    expect(spacePremium).toContainHTML("img")
    expect(spaceDisplayName).toBeInTheDocument()
  });
});
import { describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SpaceCard } from "../SpaceList";
import { ServiceProvider } from "@providers/ServiceProvider";


const MockServiceProvider = ({ children }: any) => {
  return <ServiceProvider>{children}</ServiceProvider>;
};


const data = [
  {
    code: "test code1",
    editable: false,
    id: 1,
    title: "تست پریمیوم",
    owner: {
      "id": "ed1",
      "displayName": "test1",
      "isCurrentUserOwner": true
    },
    type: {
      "code": "PREMIUM",
      "title": "حرفه‌ای"
    },
    isActive: true,
    lastModificationTime: "2025-03-15T12:27:08.473287",
    membersCount: 1,
    assessmentsCount: 14
  },
  {
    code: "test code2",
    editable: false,
    id: 2,
    title: "Flickit Admin Space",
    owner: {
      id: "ed2",
      displayName: "test2",
      isCurrentUserOwner: true
    },
    type: {
      code: "BASIC",
      title: "پایه"
    },
    isActive: true,
    lastModificationTime: "2023-05-29T11:15:41.61295",
    membersCount: 8,
    assessmentsCount: 12
  }
]

const spaceCardRender = () =>{
  render(
    <MockServiceProvider>
      <MemoryRouter>
        {data.map(item =>{
          return (
            <SpaceCard
              key={item?.id}
              item={item}
              isActiveSpace={false}
              owner={item?.owner}
              dialogProps={{
                open: false,
                onClose: () => {},
                openDialog: () => {},
                context:  undefined
              }}
              fetchSpaces={vi.fn()}
            />
          )
        })}
      </MemoryRouter>
    </MockServiceProvider>,
  );
}

describe("SpaceCard", () => {
  spaceCardRender()
  const spaceTitle = screen.getByTestId("space-title-displayName");
  expect(spaceTitle.innerHTML).toHaveValue("Flickit Admin Space")

});
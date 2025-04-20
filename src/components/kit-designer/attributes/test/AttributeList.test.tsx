import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import SubjectTable from "@components/kit-designer/attributes/SubjectTable";

const mockAttributeList = [
  {
    id: 1,
    title: "attribute 1",
    description: "description 1",
    subject: {
      id: 1,
      title: "title-id",
    },
    weight: 1,
    index: 1,
    isEditing: true,
  },
];

const SubjectMock = [
  {
    id: 1,
    title: "title",
    description: "description",
    weight: 1,
  },
];

const handleAddNewRow = vi.fn();
const handleReorder = vi.fn();
const handleCancel = vi.fn();
const handleSave = vi.fn();
const setNewAttribute = vi.fn();
const handleEdit = vi.fn();
const setOpenDeleteDialog = vi.fn();

describe("MaturityLevelList", () => {
  beforeEach(() => {
    render(
      <SubjectTable
        subjects={SubjectMock}
        initialAttributes={mockAttributeList}
        onAddAttribute={handleAddNewRow}
        onReorder={handleReorder}
        showNewAttributeForm={true}
        handleCancel={handleCancel}
        handleSave={handleSave}
        newAttribute={true}
        setNewAttribute={setNewAttribute}
        handleEdit={handleEdit}
        setOpenDeleteDialog={setOpenDeleteDialog}
      />,
    );
  });

  it("renders attribute correctly", () => {
    let title: any = screen.getByTestId("display-attribute-title");
    let description: any = screen.getByTestId("display-attribute-description");
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(screen.getByTestId("display-attribute-title")).toHaveTextContent(
      "attribute 1",
    );
    expect(
      screen.getByTestId("display-attribute-description"),
    ).toHaveTextContent("description 1");
    expect(screen.getByTestId("display-attribute-weight")).toHaveTextContent(
      "1",
    );
  });
});

import { IDefaultModel, TId } from "./common";

export interface ISpaceInfo {
  id: TId;
  code: string;
  title: string;
  owner: {
    first_name: string;
    id: TId;
    last_name: string;
    username: string;
  };
}

export interface ISpaceModel {
  code: string;
  id: TId;
  editable: boolean;
  title: string;
  lastModificationTime?: string;
  membersCount?: number;
  assessmentsCount?: number;
  is_default_space_for_current_user?: boolean;
  type?: { code: string; title: string };
}

export interface ISpacesModel extends IDefaultModel<ISpaceModel> {
  size?: number;
  total?: number;
}

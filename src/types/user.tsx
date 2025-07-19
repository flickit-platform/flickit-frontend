import { Dispatch } from "react";
import { IDefaultModel, TId } from "./common";

export interface IUserInfo {
  id: TId;
  displayName: string;
  email: string;
  bio?: string;
  pictureLink?: null | string;
  linkedin?: string | null;
  is_active?: boolean;
  default_space?: any;
  subscriberHash?: string;
}

export interface IMemberModel extends IDefaultModel<IMember> {}

export interface IMember {
  id: TId;
  space: TId;
  user: Omit<IUserInfo, "current_space" | "email">;
}

export interface IUserPermissions {
  canManageSettings: boolean;
  canViewReport: boolean;
  canShareReport: boolean;
  canViewDashboard: boolean;
  canViewQuestionnaires: boolean;
  canManageVisibility: boolean;
}

export enum FLAGS {
  display_expert_groups = "display_expert_groups",
}

export interface IAuthContext {
  isAuthenticatedUser: boolean | null;
  userInfo: IUserInfo;
  accessToken: string;
  loadingUserInfo: boolean;
  redirectRoute: string;
  currentSpace: any;
  dispatch: Dispatch<any>;
}

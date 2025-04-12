import { TId } from "./common";

export interface IMessage {
  id: TId;
  content: string;
  seen: boolean;
  createdAt: string;
  payload: any;
}
import { CreatePostInput } from "src/API";
import { Action } from "redux";

export const CREATE_POST = 'CREATE_POST';

interface CreatePostAction extends Action<string> {
  type: typeof CREATE_POST,
  payload: CreatePostInput
}

export type PostAction = CreatePostAction;
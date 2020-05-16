import { CreatePostInput } from "src/API";
import { Action } from "redux";

export const CREATE_POST = 'CREATE_POST';

interface CreatePostAction extends Action<string> {
  type: typeof CREATE_POST,
  payload: CreatePostInput
}

export type PostAction = CreatePostAction;

export const CREATE_POST_SUCCEEDED = 'CREATE_POST_SUCCEEDED';
export const CREATE_POST_FAILED = 'CREATE_POST_FAILED';

interface CreatePostSucceeded extends Action<string> {
  type: typeof CREATE_POST_SUCCEEDED
}

interface CreatePostFailed extends Action<string> {
  type: typeof CREATE_POST_FAILED
}

export type CreatePostResultAction = CreatePostSucceeded | CreatePostFailed;

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
export const CREATE_POST_RESET_RESULT = 'CREATE_POST_RESET_RESULT';

interface CreatePostSucceeded extends Action<string> {
  type: typeof CREATE_POST_SUCCEEDED
}

interface CreatePostFailed extends Action<string> {
  type: typeof CREATE_POST_FAILED
}

interface CreatePostResetResult extends Action<string> {
  type: typeof CREATE_POST_RESET_RESULT
}

export type CreatePostResultAction =
  CreatePostSucceeded |
  CreatePostFailed |
  CreatePostResetResult;

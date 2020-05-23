import { CreatePostInput, ListPostsQueryVariables, ListPostsQuery } from "src/API";
import { Action } from "redux";
import { Post } from "../reducers";

export const CREATE_POST = 'CREATE_POST';
export const LIST_POSTS = 'LIST_POSTS';

interface CreatePostAction extends Action<string> {
  type: typeof CREATE_POST,
  payload: CreatePostInput
}

interface ListPostsAction extends Action<string> {
  type: typeof LIST_POSTS,
  payload: ListPostsQueryVariables
}

export type PostAction = CreatePostAction | ListPostsAction;


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


export const LIST_POSTS_SUCCEEDED = 'LIST_POSTS_SUCCEEDED';
export const LIST_POSTS_FAILED = 'LIST_POSTS_FAILED';
export const LIST_POSTS_RESET_RESULT = 'LIST_POSTS_RESET_RESULT';

interface ListPostsSucceeded extends Action<string> {
  type: typeof LIST_POSTS_SUCCEEDED,
  payload: ListPostsQuery
}

interface ListPostsFailed extends Action<string> {
  type: typeof LIST_POSTS_FAILED
}

export type ListPostsResultAction =
  ListPostsSucceeded |
  ListPostsFailed;

export const CLEAR_POSTS = 'CLEAR_POSTS';

interface ClearPostsAction extends Action<string> {
  type: typeof CLEAR_POSTS,
}

export type SetListPostsStateAction = ClearPostsAction | ListPostsResultAction;


export const FETCH_POST = 'FETCH_POST';

export interface FetchPostAction extends Action<string> {
  type: typeof FETCH_POST,
  id: string
}


export const FETCH_POST_SUCCEEDED = 'FETCH_POST_SUCCEEDED';
export const FETCH_POST_FAILED = 'FETCH_POST_FAILED';

interface FetchPostSucceeded extends Action<string> {
  type: typeof FETCH_POST_SUCCEEDED,
  payload: Post
}

interface FetchPostFailed extends Action<string> {
  type: typeof FETCH_POST_FAILED
}

export type FetchPostResultAction =
  FetchPostSucceeded |
  FetchPostFailed;

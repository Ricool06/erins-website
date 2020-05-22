import { CreatePostInput, ListPostsQueryVariables } from "src/API";
import { PostAction, CREATE_POST, LIST_POSTS, CLEAR_POSTS, SetListPostsStateAction } from "./types";

export const createPost = (payload: CreatePostInput): PostAction => {
  return {
    type: CREATE_POST,
    payload
  };
};

export const listPosts = (payload: Omit<ListPostsQueryVariables, 'nextToken'>): PostAction => {
  return {
    type: LIST_POSTS,
    payload
  };
}

export const clearPosts = (): SetListPostsStateAction => {
  return {
    type: CLEAR_POSTS,
  };
};

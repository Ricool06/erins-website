import { CreatePostInput, ListPostsQueryVariables } from "src/API";
import { PostAction, CREATE_POST, LIST_POSTS } from "./types";

export const createPost = (payload: CreatePostInput): PostAction => {
  return {
    type: CREATE_POST,
    payload
  };
};

export const listPosts = (payload: ListPostsQueryVariables): PostAction => {
  return {
    type: LIST_POSTS,
    payload
  };
}

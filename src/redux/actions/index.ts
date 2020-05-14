import { CreatePostInput } from "src/API";
import { PostAction, CREATE_POST } from "./types";

export const createPost = (payload: CreatePostInput): PostAction => ({
  type: CREATE_POST,
  payload
});

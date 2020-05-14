import { CreatePostInput } from "src/API";
import { CREATE_POST, PostAction } from "./types";
import { createPost } from ".";

describe('actions', () => {
  it('should create an action to create a post', () => {
    const post: CreatePostInput = {
      title: 'A blog post',
      content: 'Whoa, so cool!'
    };

    const expectedAction: PostAction = {
      type: CREATE_POST,
      payload: post
    };

    expect(createPost(post)).toEqual(expectedAction);
  });
});

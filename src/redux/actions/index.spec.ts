import { CreatePostInput, ListPostsQueryVariables } from "src/API";
import { CREATE_POST, PostAction, LIST_POSTS } from "./types";
import { createPost, listPosts } from ".";

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

  it('should create an action to list posts', () => {
    const queryVars: ListPostsQueryVariables = {
      filter: { title: { contains: 'good title' } },
      limit: 8
    };

    const expectedAction: PostAction = {
      type: LIST_POSTS,
      payload: queryVars
    };

    expect(listPosts(queryVars)).toEqual(expectedAction);
  });
});

import { CreatePostInput, ListPostsQueryVariables } from "src/API";
import { CREATE_POST, PostAction, LIST_POSTS, CLEAR_POSTS, SetListPostsStateAction, FetchPostAction, FETCH_POST } from "./types";
import { createPost, listPosts, clearPosts, fetchPost } from ".";

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

  it('should create an action to clear posts', () => {
    const expectedAction: SetListPostsStateAction = {
      type: CLEAR_POSTS
    };

    expect(clearPosts()).toEqual(expectedAction);
  });

  it('should create an action to fetch a single post by ID', () => {
    const id = 'some.id';

    const expectedAction: FetchPostAction = {
      type: FETCH_POST,
      id
    };

    expect(fetchPost(id)).toEqual(expectedAction);
  });
});

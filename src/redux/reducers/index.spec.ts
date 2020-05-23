import rootReducer, { CreatePostFeedback, ListPosts, listPostsReducer, Post, RootState } from ".";
import { CreatePostResultAction, ListPostsResultAction, LIST_POSTS_SUCCEEDED, CREATE_POST_RESET_RESULT, CREATE_POST_FAILED, CREATE_POST_SUCCEEDED, FetchPostResultAction, FETCH_POST_SUCCEEDED, FETCH_POST_FAILED } from "../actions/types";
import { clearPosts } from "../actions";

describe('reducers', () => {
  describe('Create post', () => {
    it('it should set the create post result on success', () => {
      const action: CreatePostResultAction = {
        type: CREATE_POST_SUCCEEDED
      };

      const expectedState: CreatePostFeedback = {
        status: 'success',
        show: true
      };

      expect(rootReducer(undefined, action).createPostFeedback).toEqual(expectedState);
    });

    it('it should set the create post result on failure', () => {
      const action: CreatePostResultAction = {
        type: CREATE_POST_FAILED
      };

      const expectedState: CreatePostFeedback = {
        status: 'error',
        show: true
      };

      expect(rootReducer(undefined, action).createPostFeedback)
        .toEqual(expectedState);
    });

    it('should reset the create post result too!', () => {
      const action: CreatePostResultAction = {
        type: CREATE_POST_RESET_RESULT
      };

      const expectedState: CreatePostFeedback = {
        status: 'success',
        show: false
      };

      expect(rootReducer(undefined, action).createPostFeedback).toEqual(expectedState);
    });
  });

  describe('Fetch post', () => {
    it('should set the selected post on success', () => {
      const action: FetchPostResultAction = {
        type: FETCH_POST_SUCCEEDED,
        payload: {
          __typename: 'Post',
          _deleted: false,
          _lastChangedAt: 1234,
          _version: 1,
          content: 'content',
          id: 'id',
          owner: 'author',
          title: 'title',
        }
      };

      expect(rootReducer(undefined, action).currentPost)
        .toEqual(action.payload);
    });

    it('should set the selected post to null on failure', () => {
      const action: FetchPostResultAction = {
        type: FETCH_POST_FAILED,
      };
      const currentPost: Post = {
        __typename: 'Post',
        _deleted: false,
        _lastChangedAt: 1234,
        _version: 1,
        content: 'content',
        id: 'id',
        owner: 'author',
        title: 'title',
      };

      expect(rootReducer({ currentPost } as RootState, action).currentPost)
        .toEqual(null);
    });
  });

  describe('List posts', () => {
    it('should set the listed posts on success', () => {
      const action: ListPostsResultAction = {
        type: LIST_POSTS_SUCCEEDED,
        payload: {
          listPosts: {
            __typename: 'ModelPostConnection',
            nextToken: null,
            startedAt: null,
            items: [{
              content: 'content',
              id: 'id',
              owner: 'owner',
              title: 'title',
              __typename: 'Post',
              _lastChangedAt: 1234,
              _version: 1,
              _deleted: false
            }]
          }
        }
      };

      expect(rootReducer(undefined, action).listPosts)
        .toEqual(action.payload.listPosts);
    });

    it('should append to the listed post items on subsequent successes', () => {
      const action: ListPostsResultAction = {
        type: LIST_POSTS_SUCCEEDED,
        payload: {
          listPosts: {
            __typename: 'ModelPostConnection',
            nextToken: null,
            startedAt: null,
            items: [{
              content: 'content',
              id: 'id',
              owner: 'owner',
              title: 'title',
              __typename: 'Post',
              _lastChangedAt: 1234,
              _version: 1,
              _deleted: false
            }]
          }
        }
      };

      const initialState: ListPosts = action.payload.listPosts;
      const expectedItems = [
        ...initialState?.items!,
        ...action.payload.listPosts?.items!
      ];

      expect(listPostsReducer(initialState, action)?.items)
        .toEqual(expectedItems);
    });

    it('should remove all posts from the state when receiving a clear posts action', () => {
      const initialState: ListPosts = {
        __typename: 'ModelPostConnection',
        nextToken: 'some.token',
        startedAt: null,
        items: [{
          content: 'content',
          id: 'id',
          owner: 'owner',
          title: 'title',
          __typename: 'Post',
          _lastChangedAt: 1234,
          _version: 1,
          _deleted: false
        }]
      };

      const newState = listPostsReducer(initialState, clearPosts());

      expect(newState?.items).toEqual([]);
      expect(newState?.nextToken).toEqual(null);
      expect(newState?.startedAt).toEqual(null);
    });
  });

});

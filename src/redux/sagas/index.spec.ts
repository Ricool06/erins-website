import { CreatePostInput, ListPostsQueryVariables } from 'src/API';
import * as mutations from 'src/graphql/mutations';
import * as queries from 'src/graphql/queries';
import { createPost, watchCreatePost, rootSaga, listPosts, watchListPosts } from '.';
import { call, takeLatest, put, all, takeLeading } from 'redux-saga/effects';
import { CREATE_POST, CreatePostResultAction, LIST_POSTS, ListPostsResultAction, LIST_POSTS_SUCCEEDED, LIST_POSTS_FAILED } from '../actions/types';
import { API, graphqlOperation } from 'aws-amplify';


jest.mock('aws-amplify');

describe('sagas', () => {
  it('should combine all sagas into a root saga', () => {
    expect(rootSaga().next().value)
      .toEqual(all([watchCreatePost(), watchListPosts()]));
  });

  describe('Create post', () => {
    it('should create a post with the AppSync client', () => {
      const input: CreatePostInput = {
        title: 'Title!',
        content: 'Content!'
      };

      const generator = createPost({ type: CREATE_POST, payload: input });

      expect(generator.next().value)
        .toEqual(call([API, 'graphql'], graphqlOperation(mutations.createPost, { input })));
      expect(generator.next().value)
        .toEqual(put<CreatePostResultAction>({ type: 'CREATE_POST_SUCCEEDED' }));
    });

    it('should put a failed action if the AppSync client fails', () => {
      const input: CreatePostInput = {
        title: 'Title!',
        content: 'Content!'
      };

      const generator = createPost({ type: CREATE_POST, payload: input });

      expect(generator.next().value)
        .toEqual(call([API, 'graphql'], graphqlOperation(mutations.createPost, { input })));
      expect(generator.throw({}).value)
        .toEqual(put<CreatePostResultAction>({ type: 'CREATE_POST_FAILED' }));
    });

    it('should take the latest create post action only', () => {
      const generator = watchCreatePost();

      expect(generator.next().value).toEqual(takeLatest(CREATE_POST, createPost));
    });
  });

  describe('List posts', () => {
    it('should fetch posts from the API', () => {
      const queryVars: ListPostsQueryVariables = {
        limit: 6
      }
      const generator = listPosts({ type: LIST_POSTS, payload: queryVars });

      expect(generator.next().value)
        .toEqual(call([API, 'graphql'], graphqlOperation(queries.listPosts, queryVars)));
    });

    it('should dispatch a success action after successfully fetching posts', () => {
      const queryVars: ListPostsQueryVariables = {
        limit: 6
      }
      const successAction: ListPostsResultAction = {
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

      const generator = listPosts({ type: LIST_POSTS, payload: queryVars });

      expect(generator.next().value)
        .toEqual(call([API, 'graphql'], graphqlOperation(queries.listPosts, queryVars)));

      expect(generator.next({ data: successAction.payload }).value)
        .toEqual(put(successAction));
    });

    it('should dispatch a failure action after failing to fetch posts', () => {
      const queryVars: ListPostsQueryVariables = {
        limit: 6
      };
      const failureAction: ListPostsResultAction = {
        type: LIST_POSTS_FAILED
      };
      const generator = listPosts({ type: LIST_POSTS, payload: queryVars });

      expect(generator.next().value)
        .toEqual(call([API, 'graphql'], graphqlOperation(queries.listPosts, queryVars)));
      expect(generator.throw({}).value)
        .toEqual(put(failureAction));
    });

    it('should act on each list posts action ignoring others until completion', () => {
      const generator = watchListPosts();

      expect(generator.next().value).toEqual(takeLeading(LIST_POSTS, listPosts));
    });
  });
});

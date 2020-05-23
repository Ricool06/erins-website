import { takeLatest, call, all, put, takeLeading, select } from 'redux-saga/effects';
import { CREATE_POST, PostAction, CreatePostResultAction, LIST_POSTS, ListPostsResultAction, LIST_POSTS_FAILED, FetchPostAction, FetchPostResultAction, FETCH_POST_SUCCEEDED, FETCH_POST_FAILED, FETCH_POST } from '../actions/types';
import * as mutations from 'src/graphql/mutations';
import * as queries from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import awsconfig from '../../aws-exports';
import { selectNextToken, selectPost } from '../selectors';
import { Post } from '../reducers';

API.configure(awsconfig);

export function* createPost(postAction: PostAction) {
  try {
    yield call(
      [API, 'graphql'],
      graphqlOperation(mutations.createPost, { input: postAction.payload }));
    yield put<CreatePostResultAction>({ type: 'CREATE_POST_SUCCEEDED' });
  }
  catch {
    yield put<CreatePostResultAction>({ type: 'CREATE_POST_FAILED' });
  }
}

export function* watchCreatePost() {
  yield takeLatest(CREATE_POST, createPost);
}

export function* listPosts(postAction: PostAction) {
  try {
    const nextToken: string = yield select(selectNextToken);

    const { data: listPostsQueryResult } = yield call(
      [API, 'graphql'],
      {
        query: queries.listPosts,
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
        variables: { ...postAction.payload, nextToken },
      });


    yield put<ListPostsResultAction>(
      { type: 'LIST_POSTS_SUCCEEDED', payload: listPostsQueryResult });
  }
  catch {
    yield put<ListPostsResultAction>({ type: LIST_POSTS_FAILED });
  }
}

export function* watchListPosts() {
  yield takeLeading(LIST_POSTS, listPosts);
}

export function* watchFetchPost() {
  yield takeLatest(FETCH_POST, fetchPost);
}

export function* fetchPost(action: FetchPostAction) {
  try {
    let post: Post = yield select(selectPost, action.id);

    if (!post) {
      post = yield call(
        [API, 'graphql'],
        {
          query: queries.getPost,
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
          variables: { id: action.id },
        });
    }

    yield put<FetchPostResultAction>({ type: FETCH_POST_SUCCEEDED, payload: post });
  }
  catch {
    yield put<FetchPostResultAction>({ type: FETCH_POST_FAILED });
  }
}

export function* rootSaga() {
  yield all([watchCreatePost(), watchListPosts(), watchFetchPost()]);
}

import { takeLatest, call, all, put, takeLeading, select } from 'redux-saga/effects';
import { CREATE_POST, PostAction, CreatePostResultAction, LIST_POSTS, ListPostsResultAction, LIST_POSTS_FAILED } from '../actions/types';
import * as mutations from 'src/graphql/mutations';
import * as queries from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import awsconfig from '../../aws-exports';
import { selectNextToken } from '../selectors';

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

export function* rootSaga() {
  yield all([watchCreatePost(), watchListPosts()]);
}

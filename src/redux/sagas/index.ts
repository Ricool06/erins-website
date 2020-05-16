import { takeLatest, call, all, put } from 'redux-saga/effects';
import { CREATE_POST, PostAction, CreatePostResultAction } from '../actions/types';
import * as mutations from 'src/graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';


export function* createPost(postAction: PostAction) {
  try {
    yield call(
      API.graphql,
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

export function* rootSaga() {
  yield all([watchCreatePost()]);
}

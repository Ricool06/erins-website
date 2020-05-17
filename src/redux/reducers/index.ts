import { Reducer, combineReducers } from 'redux';
import { ResultStatusType } from 'antd/lib/result';
import { CREATE_POST_SUCCEEDED, CREATE_POST_FAILED, LIST_POSTS_SUCCEEDED, CreatePostResultAction, ListPostsResultAction } from '../actions/types';
import { ListPostsQuery } from 'src/API';

const copy = Object.assign;

export interface CreatePostFeedback {
  status: ResultStatusType,
  show: boolean
}

export type ListPosts = ListPostsQuery['listPosts'];
export type ListPostsItems = NonNullable<ListPosts>['items'];

export const initialCreatePostFeedbackState: CreatePostFeedback = {
  status: 'success',
  show: false
};

export const initialListPostsState: ListPosts = {
  __typename: 'ModelPostConnection',
  items: [],
  nextToken: null,
  startedAt: null
}

const createPostFeedbackReducer: Reducer<CreatePostFeedback, CreatePostResultAction> = (
  state = initialCreatePostFeedbackState,
  action
) => {
  switch (action.type) {
    case CREATE_POST_SUCCEEDED:
      return {
        status: 'success',
        show: true
      };
    case CREATE_POST_FAILED:
      return {
        status: 'error',
        show: true
      };
    default:
      return state;
  }
};

export const listPostsReducer: Reducer<ListPosts, ListPostsResultAction> = (
  state = initialListPostsState,
  action
) => {
  switch (action.type) {
    case LIST_POSTS_SUCCEEDED:
      return copy({
        ...action.payload.listPosts,
        items: [
          ...state?.items ?? [],
          ...action.payload.listPosts?.items ?? []
        ],
      })
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  createPostFeedback: createPostFeedbackReducer,
  listPosts: listPostsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
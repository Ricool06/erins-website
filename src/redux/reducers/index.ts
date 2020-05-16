import { Reducer } from 'redux';
import { ResultStatusType } from 'antd/lib/result';
import { CREATE_POST_SUCCEEDED, CREATE_POST_FAILED } from '../actions/types';

const copy = Object.assign;

export interface CreatePostFeedback {
  status: ResultStatusType,
  show: boolean
}

export interface State {
  createPostFeedback: CreatePostFeedback
};

export const initialState: State = {
   createPostFeedback: {
     status: 'success',
     show: false
   }
};

const rootReducer: Reducer<State> = (state = initialState, action) => {
  switch(action.type) {
    case CREATE_POST_SUCCEEDED:
      return copy({
        ...initialState,
        createPostFeedback: {
          status: 'success',
          show: true
        }
      });
    case CREATE_POST_FAILED:
      return copy({
        ...initialState,
        createPostFeedback: {
          status: 'error',
          show: true
        }
      });
    default:
      return state;
  }
};

export default rootReducer;
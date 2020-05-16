import rootReducer, { State, initialState } from ".";
import { CreatePostResultAction } from "../actions/types";

describe('reducers', () => {
  it('should ignore unknown actions', () => {
    expect(rootReducer(undefined, {type: 'UNKNOWN'})).toEqual(initialState);
  });

  it('it should set the create post result on success', () => {
    const action: CreatePostResultAction = {
      type: 'CREATE_POST_SUCCEEDED'
    };

    const expectedState: State = {
      ...initialState,
      createPostFeedback: {
        status: 'success',
        show: true
      }
    }

    expect(rootReducer(undefined, action)).toEqual(expectedState);
  });

  it('it should set the create post result on failure', () => {
    const action: CreatePostResultAction = {
      type: 'CREATE_POST_FAILED'
    };

    const expectedState: State = {
      ...initialState,
      createPostFeedback: {
        status: 'error',
        show: true
      }
    }

    expect(rootReducer(undefined, action)).toEqual(expectedState);
  });
});

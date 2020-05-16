import { CreatePostInput } from 'src/API';
import * as mutations from 'src/graphql/mutations';
import { createPost, watchCreatePost } from '.';
import { call, takeLatest, put } from 'redux-saga/effects';
import { CREATE_POST, CreatePostResultAction } from '../actions/types';
import { API, graphqlOperation } from 'aws-amplify';


jest.mock('aws-amplify');

describe('sagas', () => {
  it('should create a post with the AppSync client', () => {
    const input: CreatePostInput = {
      title: 'Title!',
      content: 'Content!'
    };

    const generator = createPost({type: CREATE_POST, payload: input});

    expect(generator.next().value)
      .toEqual(call(API.graphql, graphqlOperation(mutations.createPost, {input})));
    expect(generator.next().value)
      .toEqual(put<CreatePostResultAction>({type: 'CREATE_POST_SUCCEEDED'}));
  });

  it('should put a failed action if the AppSync client fails', () => {
    const input: CreatePostInput = {
      title: 'Title!',
      content: 'Content!'
    };

    const generator = createPost({type: CREATE_POST, payload: input});

    expect(generator.next().value)
      .toEqual(call(API.graphql, graphqlOperation(mutations.createPost, {input})));
    expect(generator.throw({}).value)
      .toEqual(put<CreatePostResultAction>({type: 'CREATE_POST_FAILED'}));
  });

  it('should take the latest create post action only', () => {
    const generator = watchCreatePost();

    expect(generator.next().value).toEqual(takeLatest(CREATE_POST, createPost));
  });
});

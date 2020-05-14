import React from 'react';
import WritePost from "./WritePost";
import { shallow, mount } from "enzyme";
import ConnectedWritePostContainer, { WritePostContainer } from './WritePostContainer';
import { Provider } from 'react-redux';
import { store } from 'src/redux/store';
import { createPost } from 'src/redux/actions';
import { CreatePostInput } from 'src/API';

describe('WritePostContainer', () => {
  it('should contain a WritePost component', () => {
    const wrapper = mount(<Provider store={store}><ConnectedWritePostContainer /></Provider>);

    const postWriter = wrapper.find(WritePost);

    expect(postWriter.exists()).toBe(true);
  });

  it('should dispatch an action when a post is submitted', () => {
    const dispatch = jest.fn();
    const wrapper = shallow(<WritePostContainer dispatch={dispatch} />);
    const postWriter = wrapper.find(WritePost);

    const expected: CreatePostInput = {
      title: 'Wow, a blog.',
      content: 'Hello! I am a blog post.'
    };

    postWriter.props().onSubmit(expected);

    expect(dispatch).toHaveBeenCalledWith(createPost(expected));
  });
});
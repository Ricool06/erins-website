import React from 'react';
import WritePost from "./WritePost";
import { shallow, mount } from "enzyme";
import WritePostContainer from './WritePostContainer';
import { createPost } from 'src/redux/actions';
import { CreatePostInput } from 'src/API';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Result } from "antd";
import { CreatePostFeedback } from 'src/redux/reducers';

jest.mock('react-redux');

const mockUseDispatch = (useDispatch as jest.MockedFunction<typeof useDispatch>);
const mockUseSelector = (useSelector as jest.MockedFunction<typeof useSelector>);
describe('WritePostContainer', () => {
  const modalInfoSpy = jest.spyOn(Modal, 'info');

  afterEach(() => modalInfoSpy.mockClear());

  it('should contain a WritePost component', () => {
    mockUseSelector
      .mockReturnValue({ show: false, status: 'success' });

    const wrapper = mount(<WritePostContainer />);

    const postWriter = wrapper.find(WritePost);

    expect(postWriter.exists()).toBe(true);
  });

  it('should dispatch an action when a post is submitted', () => {
    const dispatch = jest.fn();
    mockUseDispatch
      .mockReturnValue(dispatch);
    mockUseSelector
      .mockReturnValue({ show: false, status: 'success' });

    const wrapper = shallow(<WritePostContainer />);
    const postWriter = wrapper.find(WritePost);

    const expected: CreatePostInput = {
      title: 'Wow, a blog.',
      content: 'Hello! I am a blog post.'
    };

    postWriter.props().onSubmit(expected);

    expect(dispatch).toHaveBeenCalledWith(createPost(expected));
  });

  it('should show a modal with a success result when the state says to', () => {
    const dispatch = jest.fn();
    const createPostFeedback: CreatePostFeedback = { show: true, status: 'success' };

    mockUseDispatch
      .mockReturnValue(dispatch);
    mockUseSelector
      .mockImplementation((func) => func({createPostFeedback}));

    mount(<WritePostContainer />);

    expect(modalInfoSpy).toHaveBeenCalledWith({
      content: (<Result
        status={createPostFeedback.status}
        title='Blog posted! 😘' />),
      icon: null
    });
  });

  it('should show a modal with a failure result when the state says to', () => {
    const dispatch = jest.fn();
    const createPostFeedback: CreatePostFeedback = { show: true, status: 'error' };

    mockUseDispatch
      .mockReturnValue(dispatch);
    mockUseSelector
      .mockImplementation((func) => func({createPostFeedback}));

    mount(<WritePostContainer />);

    expect(modalInfoSpy).toHaveBeenCalledWith({
      content: (<Result
        status={createPostFeedback.status}
        title='Blog failed to post. 🙁' />),
      icon: null
    });
  });

  it('should not show a modal with a the state says not to', () => {
    const dispatch = jest.fn();
    const createPostFeedback: CreatePostFeedback = { show: false, status: 'error' };

    mockUseDispatch
      .mockReturnValue(dispatch);
    mockUseSelector
      .mockImplementation((func) => func({createPostFeedback}));

    mount(<WritePostContainer />);

    expect(modalInfoSpy).not.toHaveBeenCalled();
  });
});
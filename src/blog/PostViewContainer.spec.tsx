import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux/reducers";
import { shallow, mount } from "enzyme";
import PostViewContainer from "./PostViewContainer";
import PostView from "./PostView";
import { useParams } from "react-router-dom";
import { fetchPost } from "src/redux/actions";
import '../../__mocks__/match-media.spec';

jest.mock('react-redux');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

const mockUseSelector = (useSelector as jest.MockedFunction<typeof useSelector>);
const mockUseDispatch = (useDispatch as jest.MockedFunction<typeof useDispatch>);
const mockUseParams = (useParams as jest.MockedFunction<typeof useParams>);

describe('PostViewContainer', () => {
  it('should pass the currently selected post from the state to the view', () => {
    const dispatch = jest.fn();
    const postId = 'some.post.id';
    mockUseParams.mockReturnValue({ postId });
    mockUseDispatch.mockReturnValue(dispatch);

    const mockState: Partial<RootState> = {
      currentPost: {
        content: '# This is some __markdown__',
        id: 'id',
        owner: 'owner',
        title: 'title',
        __typename: 'Post',
        _lastChangedAt: 1234,
        _version: 1,
        _deleted: false
      }
    };

    mockUseSelector.mockImplementation(selector => selector(mockState));

    const wrapper = shallow(<PostViewContainer />);
    const view = wrapper.find(PostView);

    expect(view.props().post).toEqual(mockState.currentPost);
  });

  it('should dispatch an action on mount to fetch the post in the url', () => {
    const dispatch = jest.fn();
    const postId = 'some.post.id';
    mockUseParams.mockReturnValue({ postId });
    mockUseDispatch.mockReturnValue(dispatch);

    mount(<PostViewContainer />);

    expect(dispatch).toHaveBeenCalledWith(fetchPost(postId));
  });
});
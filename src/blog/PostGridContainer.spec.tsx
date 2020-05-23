import React from "react";
import { shallow, mount } from "enzyme";
import PostGridContainer from "./PostGridContainer";
import { useSelector, useDispatch } from "react-redux";
import { ListPostsItems, RootState } from "src/redux/reducers";
import PostGrid from "./PostGrid";
import { listPosts } from "src/redux/actions";
import '../../__mocks__/match-media.spec'

const postItems: ListPostsItems = [
  {
    __typename: 'Post',
    content: 'Content',
    id: '0',
    owner: 'owner',
    title: 'Title',
    _deleted: null,
    _lastChangedAt: 1234,
    _version: 1
  }
];

jest.mock('react-redux');

const mockUseSelector = (useSelector as jest.MockedFunction<typeof useSelector>);
const mockUseDispatch = (useDispatch as jest.MockedFunction<typeof useDispatch>);

describe('PostGridContainer', () => {
  it('should select posts from the state and feed them to the grid', () => {
    mockUseSelector.mockReturnValue(postItems);
    
    const wrapper = shallow(<PostGridContainer />);
    const grid = wrapper.find(PostGrid);

    expect(grid.props().posts).toEqual(postItems);
  });

  it('should fetch the next six posts when the grid calls fetchMore', () => {
    const mockState: Partial<RootState> = {
      listPosts: {
        items: postItems,
        nextToken: null,
        startedAt: null,
        __typename: 'ModelPostConnection',
      }
    };

    const dispatch = jest.fn();
    mockUseDispatch.mockReturnValue(dispatch);
    mockUseSelector.mockImplementation(selector => selector(mockState));

    const action = listPosts({ limit: 6 });
    const wrapper = mount(<PostGridContainer />);
    const grid = wrapper.find(PostGrid);
    
    grid.props().fetchMore();
    
    expect(dispatch).toHaveBeenCalledWith(action);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it('should only fetch posts without user interaction if there are no posts', () => {
    const firstMockState: Partial<RootState> = {
      listPosts: {
        items: [],
        nextToken: null,
        startedAt: null,
        __typename: 'ModelPostConnection',
      }
    };

    const secondMockState: Partial<RootState> = {
      listPosts: {
        items: postItems,
        nextToken: null,
        startedAt: null,
        __typename: 'ModelPostConnection',
      }
    };

    const dispatch = jest.fn();
    mockUseDispatch.mockReturnValue(dispatch);
    mockUseSelector
      .mockImplementationOnce(selector => selector(firstMockState))
      .mockImplementation(selector => selector(secondMockState));

    const wrapper = mount(<PostGridContainer />);
    wrapper.unmount();
    wrapper.mount();

    expect(dispatch).toHaveBeenCalledWith(listPosts({limit: 6}));
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});

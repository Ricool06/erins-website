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

  it('should fetch the next six posts after scrolling to the bottom', () => {
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
    
    expect(dispatch).toHaveBeenNthCalledWith(1, action);
    expect(dispatch).toHaveBeenNthCalledWith(2, action);
  });
});

import React from "react";
import { shallow, mount } from "enzyme";
import PostGrid from './PostGrid';
import { Card, List, Button } from "antd";
import { ListPostsItems } from "src/redux/reducers";
import '../../__mocks__/match-media.spec';

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

const post = postItems[0]!;
type Post = typeof postItems[0];

const copy = Object.assign;

describe('PostGrid', () => {
  it('should display cards representing their containing posts', () => {
    const wrapper = shallow(<PostGrid posts={[]} fetchMore={jest.fn()} />);

    const list = wrapper.find(List);

    expect(list.props().renderItem!(copy(post), 0))
      .toEqual(
        <List.Item key={post.id}>
          <Card loading={false} title={post.title} />
        </List.Item>);
  });

  it('should fire an event a load event when the load more button is pressed', () => {
    const fetchMore = jest.fn();

    const wrapper = mount(<PostGrid posts={[]} fetchMore={fetchMore} />);
    const loadMoreButton = wrapper.find(Button);

    loadMoreButton.simulate('click');

    expect(fetchMore).toHaveBeenCalled();
  });
});

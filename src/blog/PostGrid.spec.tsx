import React, { ReactNode } from "react";
import { shallow, mount } from "enzyme";
import PostGrid from './PostGrid';
import { Card, Button, Col } from "antd";
import { ListPostsItems } from "src/redux/reducers";
import '../../__mocks__/match-media.spec';
import { Link } from "react-router-dom";

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

jest.mock('react-router-dom', () => ({
  Link: ({ children }: { children: ReactNode }) => (<div>{children}</div>)
}));

describe('PostGrid', () => {
  it('should display cards representing their containing posts', () => {
    const wrapper = shallow(<PostGrid posts={[post]} fetchMore={jest.fn()} />);

    const card = wrapper.find(Card);
    const col = wrapper.find(Col);

    expect(card.props().hoverable).toBeTruthy();
    expect(col.key()).toEqual(post.id);
  });

  it('should not display cards when given no posts', () => {
    const wrapper = shallow(<PostGrid posts={[]} fetchMore={jest.fn()} />);

    const card = wrapper.find(Card);
    const col = wrapper.find(Col);

    expect(card.exists()).toBeFalsy();
    expect(col.exists()).toBeFalsy();
  });

  it('should fire an event a load event when the load more button is pressed', () => {
    const fetchMore = jest.fn();

    const wrapper = mount(<PostGrid posts={[]} fetchMore={fetchMore} />);
    const loadMoreButton = wrapper.find(Button);

    loadMoreButton.simulate('click');

    expect(fetchMore).toHaveBeenCalled();
  });

  it('should make each card link to its post view', () => {
    const wrapper = shallow(<PostGrid posts={[post]} fetchMore={jest.fn()} />);

    const link = wrapper.find(Link);

    expect(link.props().to).toEqual(`/post/${post.id}`);
  });
});

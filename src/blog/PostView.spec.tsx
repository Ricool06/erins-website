import React from "react";
import { mount } from "enzyme";
import PostView from "./PostView";
import { Post } from "src/redux/reducers";
import ReactMarkdown from 'react-markdown';
import { Typography } from "antd";
import '../../__mocks__/match-media.spec';

describe('PostView', () => {
  it('should render the post\'s markdown into html', () => {
    const post: Post = {
      content: '# This is some __markdown__',
      id: 'id',
      owner: 'owner',
      title: 'title',
      __typename: 'Post',
      _lastChangedAt: 1234,
      _version: 1,
      _deleted: false
    };

    const wrapper = mount(<PostView post={post} />);

    expect(wrapper.find(ReactMarkdown).props().source)
      .toContain(post.content!);
    expect(wrapper.find(Typography.Title).text())
      .toContain(post.title);
  });
});

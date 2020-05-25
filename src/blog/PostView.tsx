import React from "react";
import { FC } from "react";
import { Post } from "src/redux/reducers";
import { Row, Col, Typography } from "antd";
import ReactMarkdown from 'react-markdown';

export interface IPostViewProps {
  post: Post
};

const PostView: FC<IPostViewProps> = ({ post }) => {
  return (
    <>
      <Row justify='center'>
        <Typography.Title>{post?.title}</Typography.Title>
      </Row>
      <Row>
        <Col sm={4} span={0}></Col>
        <Col sm={16} span={24}>
          <ReactMarkdown source={post?.content ?? ''} />
        </Col>
        <Col sm={4} span={0}></Col>
      </Row>
    </>
  );
};

export default PostView;

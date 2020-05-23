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
      <Row>
        <Typography.Title>{post?.title}</Typography.Title>
      </Row>
      <Row>
        <Col md={4} span={0}></Col>
        <Col md={16} span={24}>
          <ReactMarkdown source={post?.content ?? ''} />
        </Col>
        <Col md={4} span={0}></Col>
      </Row>
    </>
  );
};

export default PostView;

import React, { FC } from 'react';
import { ListPostsItems } from 'src/redux/reducers';
import { Card, Button, Row, Col, Empty } from 'antd';

export interface IPostGridProps {
  posts: ListPostsItems,
  fetchMore: () => any
}

const PostGrid: FC<IPostGridProps> = ({ posts, fetchMore }) => {
  const determineSpan = (index: number) => {
    return [23, 11, 11][index] ?? 7;
  }

  const cards = (posts ?? [])
    .map((post, index) => (
      <Col
        key={post?.id}
        md={determineSpan(index)}
        style={{ paddingTop: '1rem' }}
        span={24}
      >
        <Card
          hoverable
          cover={<Empty description={false} />}
          loading={false}
          title={post?.title}
        ></Card>
      </Col>
    ));

  return (
    <>
      <Row justify='space-around'>
        {cards}
      </Row>
      <Row justify='space-around'>
        <Button onClick={fetchMore} >Load More</Button>
      </Row>
    </>
  );
}

export default PostGrid;
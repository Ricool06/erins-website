import React, { FC } from 'react';
import { ListPostsItems } from 'src/redux/reducers';
import { Card, List, Button, Row, Col, Space, Empty } from 'antd';

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
      <Col md={determineSpan(index)} style={{ paddingTop: '1rem' }} span={24}>
        <Card
          hoverable
          key={post?.id}
          cover={<Empty description={false} />}
          loading={false}
        ><Card.Meta title={post?.title} /></Card>
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
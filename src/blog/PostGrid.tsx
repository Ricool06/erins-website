import React, { FC } from 'react';
import { ListPostsItems } from 'src/redux/reducers';

export interface IPostGridProps {
  posts: ListPostsItems
}

const PostGrid: FC<IPostGridProps> = ({ posts }) => {
  return null;
}

export default PostGrid;
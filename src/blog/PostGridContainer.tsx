import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState, ListPostsItems } from "src/redux/reducers";
import PostGrid from "./PostGrid";
import { listPosts, clearPosts } from 'src/redux/actions';

const PostGridContainer: FC = () => {
  const dispatch = useDispatch();

  const postItems = useSelector<RootState, ListPostsItems>(
    state => state.listPosts?.items ?? []);

  const fetchMore = () => {
    dispatch(listPosts({ limit: 6 }));
  }

  const initEffect = () => {
    fetchMore();
    return () => { dispatch(clearPosts()) };
  }

  useEffect(initEffect, []);

  return ( <PostGrid posts={postItems} fetchMore={fetchMore} /> );
}

export default PostGridContainer;

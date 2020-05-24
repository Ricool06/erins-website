import React, { useEffect } from "react";
import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Post } from "src/redux/reducers";
import PostView from "./PostView";
import { useParams } from "react-router-dom";
import { fetchPost } from "src/redux/actions";

const PostViewContainer: FC = () => {
  const dispatch = useDispatch();
  const { postId } = useParams<{ postId: string }>();
  const post = useSelector<RootState, Post>(state => state.currentPost);

  useEffect(() => {
    dispatch(fetchPost(postId));
  }, [postId, dispatch]);

  return (
    <PostView post={post} />
  );
}

export default PostViewContainer;

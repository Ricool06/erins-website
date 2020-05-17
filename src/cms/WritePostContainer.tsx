import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import WritePost from "./WritePost";
import { CreatePostInput } from "src/API";
import { createPost } from "src/redux/actions";
import { CreatePostFeedback, RootState } from "src/redux/reducers";
import { Modal, Result } from "antd";
import { CreatePostResultAction } from "src/redux/actions/types";

const resetFeedback: CreatePostResultAction = {
  type: 'CREATE_POST_RESET_RESULT'
};

const WritePostContainer: FC = () => {
  const dispatch = useDispatch();
  const onSubmit = (post: CreatePostInput) => {
    setCanPost(false);
    dispatch(createPost(post));
  }

  const createPostFeedback = useSelector<RootState, CreatePostFeedback>(
    (state) => state.createPostFeedback);

  const [canPost, setCanPost] = useState(true);

  useEffect(() => {
    const { show, status } = createPostFeedback;
    if (show) {
      const title = status === 'success'
        ? 'Blog posted! 😘'
        : 'Blog failed to post. 🙁';

      Modal.info({
        icon: null,
        content: (<Result status={status} title={title} />)
      });

      setCanPost(true);
      dispatch(resetFeedback);
    }
  }, [createPostFeedback, dispatch]);

  return (
    <WritePost canPost={canPost} onSubmit={onSubmit} />
  );
}

export default WritePostContainer;

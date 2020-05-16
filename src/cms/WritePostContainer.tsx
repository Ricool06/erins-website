import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import WritePost from "./WritePost";
import { CreatePostInput } from "src/API";
import { createPost } from "src/redux/actions";
import { State } from "src/redux/reducers";
import { Modal, Result } from "antd";

const WritePostContainer: FC = () => {
  const dispatch = useDispatch();
  const onSubmit = (post: CreatePostInput) => {
    dispatch(createPost(post));
  }

  const createPostFeedback = useSelector(
    (state: State) => state.createPostFeedback);

  useEffect(() => {
    const {show, status} = createPostFeedback;
    if (show) {
      const title = status === 'success'
        ? 'Blog posted! 😘'
        : 'Blog failed to post. 🙁';

      Modal.info({
        icon: null,
        content: (<Result status={status} title={title} />)
      });
    }
  }, [createPostFeedback]);

  return (
    <WritePost onSubmit={onSubmit} />
  );
}

export default WritePostContainer;

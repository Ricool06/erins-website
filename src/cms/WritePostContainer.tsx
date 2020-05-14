import React, { FC, Dispatch } from "react";
import { connect, ConnectedProps } from 'react-redux';
import WritePost from "./WritePost";
import { PostAction } from "src/redux/actions/types";
import { createPost } from "src/redux/actions";
import { CreatePostInput } from "src/API";

export const connector = connect();

export type ReduxProps = ConnectedProps<typeof connector>;

export const WritePostContainer: FC<ReduxProps> = ({ dispatch }: { dispatch: Dispatch<PostAction> }) => {

  const onSubmit = (post: CreatePostInput) => dispatch(createPost(post));

  return (
    <WritePost onSubmit={onSubmit} />
  );
}

export default connector(WritePostContainer);

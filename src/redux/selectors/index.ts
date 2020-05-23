import { RootState, Post } from "../reducers";
import { Selector } from "react-redux";

export const selectNextToken: Selector<RootState, string | null | undefined>
  = (state) => state.listPosts?.nextToken;

export const selectPost: Selector<RootState, Post | undefined, string>
  = (state, postId) => state.listPosts?.items?.find(post => post?.id === postId);

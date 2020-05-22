import { RootState } from "../reducers";

export const selectNextToken = (state: RootState) => state.listPosts?.nextToken;
import { selectNextToken } from ".";
import { RootState } from "../reducers";

const mockState: Partial<RootState> = {
  listPosts: {
    items: [],
    nextToken: 'next.token',
    startedAt: null,
    __typename: 'ModelPostConnection',
  }
};

describe('selectors', () => {
  it('should select the next list posts token from state', () => {
    expect(selectNextToken(mockState as RootState)).toEqual(mockState.listPosts?.nextToken);
  });
});